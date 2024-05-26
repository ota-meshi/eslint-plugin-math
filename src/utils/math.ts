import type { TSESTree } from "@typescript-eslint/types";
import { findVariable, getPropertyName } from "@eslint-community/eslint-utils";
import type { SourceCode } from "eslint";
import { equalNodeTokens, equalTokens } from "./ast";
import {
  getInfoForIsNegative,
  getInfoForIsPositive,
  isMinusOne,
  isZero,
} from "./number";

export type MathMethod = "floor" | "ceil" | "trunc";
export type MathMethodInfo<M extends MathMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression;
};

export type TransformingToMathTrunc =
  | (MathMethodInfo<"trunc"> & {
      from: "bitwise";
      node: TSESTree.UnaryExpression | TSESTree.BinaryExpression;
    })
  | (MathMethodInfo<"trunc"> & {
      from: "conditional";
    });
/**
 * Returns information if the given expression can be transformed to Math.trunc().
 */
export function getInfoForTransformingToMathTrunc(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathTrunc {
  if (node.type === "UnaryExpression") {
    if (node.operator !== "~") return null;
    const argument = node.argument;
    if (argument.type !== "UnaryExpression" || argument.operator !== "~")
      return null;
    // ~~n
    return {
      from: "bitwise",
      method: "trunc",
      node,
      argument: argument.argument,
    };
  }
  if (node.type === "BinaryExpression") {
    const { left, right } = node;
    if (left.type === "PrivateIdentifier") return null;
    if (
      node.operator === "|" ||
      node.operator === "^" ||
      node.operator === ">>"
    ) {
      if (!isZero(right)) return null;
      // n | 0, n ^ 0, n >> 0
      return { from: "bitwise", method: "trunc", node, argument: left };
    }
    if (node.operator === "&") {
      if (!isMinusOne(right)) return null;
      // n & -1
      return { from: "bitwise", method: "trunc", node, argument: left };
    }
    return null;
  }
  if (node.type === "ConditionalExpression") {
    const conditional = parseBranchNode(node);
    if (!conditional) return null;
    const floor = getInfoForMathFloor(conditional.whenPositive, sourceCode);
    if (floor === null) return null;
    const ceil = getInfoForMathCeil(conditional.whenNegative, sourceCode);
    if (ceil === null) return null;
    if (!equalNodeTokens(conditional.argument, floor.argument, sourceCode))
      return null;
    if (!equalNodeTokens(conditional.argument, ceil.argument, sourceCode))
      return null;
    return {
      from: "conditional",
      method: "trunc",
      node,
      argument: conditional.argument,
    };
  }
  return null;
}

export type TransformingToMathTruncStatement =
  | {
      node: TSESTree.ConditionalExpression;
      argument: TSESTree.Expression;
      floor: {
        block: TSESTree.Expression;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      };
      ceil: {
        block: TSESTree.Expression;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      };
    }
  | {
      node: TSESTree.IfStatement;
      argument: TSESTree.Expression;
      floor: {
        block: TSESTree.Statement;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      };
      ceil: {
        block: TSESTree.Statement;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      };
    };
/**
 * Extracts and returns statements convertible to Math.trunc() from the list of Math.floor() and Math.ceil().
 */
export function* extractTransformingToMathTruncStatements(
  floorList: MathMethodInfo<"floor">[],
  ceilList: MathMethodInfo<"ceil">[],
  sourceCode: SourceCode,
): Iterable<TransformingToMathTruncStatement> {
  const branchNodes = new Map<
    TSESTree.IfStatement | TSESTree.ConditionalExpression,
    {
      floors: {
        block: TSESTree.Statement | TSESTree.Expression;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      }[];
      ceils: {
        block: TSESTree.Statement | TSESTree.Expression;
        node: TSESTree.Expression;
        argument: TSESTree.Expression;
      }[];
      argument: TSESTree.Expression;
    }
  >();
  for (const item of [...floorList, ...ceilList]) {
    for (const branch of getBranches(item.node, item.argument, item.method)) {
      let info = branchNodes.get(branch.node);
      if (!info) {
        info = { floors: [], ceils: [], argument: branch.argument };
        branchNodes.set(branch.node, info);
      }
      const list = item.method === "floor" ? info.floors : info.ceils;
      list.push({
        block: branch.block,
        node: item.node,
        argument: item.argument,
      });
    }
  }

  for (const [node, { floors, ceils, argument }] of branchNodes) {
    if (floors.length === 0 || ceils.length === 0) continue;
    for (const floor of floors) {
      const prefix = getPrefixTokens(floor.block, floor.node);
      const suffix = getSuffixTokens(floor.block, floor.node);
      for (const ceil of ceils) {
        if (
          equalTokens(prefix, getPrefixTokens(ceil.block, ceil.node)) &&
          equalTokens(suffix, getSuffixTokens(ceil.block, ceil.node))
        ) {
          yield {
            node,
            argument,
            floor,
            ceil,
          } as TransformingToMathTruncStatement;
        }
      }
    }
  }

  /**
   * Get the prefix tokens from the given node.
   */
  function getPrefixTokens(
    block: TSESTree.Statement | TSESTree.Expression,
    node: TSESTree.Expression,
  ) {
    const first = sourceCode.getFirstToken(block)!;
    return [first, ...sourceCode.getTokensBetween(first, node)];
  }

  /**
   * Get the suffix tokens from the given node.
   */
  function getSuffixTokens(
    block: TSESTree.Statement | TSESTree.Expression,
    node: TSESTree.Expression,
  ) {
    const last = sourceCode.getLastToken(block)!;
    return [...sourceCode.getTokensBetween(node, last), last];
  }

  /**
   * Get the parent IfStatement or ConditionalExpression node if the given node is a part of it.
   */
  function* getBranches(
    node: TSESTree.Node,
    argument: TSESTree.Expression,
    targetMethod: "floor" | "ceil",
  ): Iterable<{
    node: TSESTree.IfStatement | TSESTree.ConditionalExpression;
    argument: TSESTree.Expression;
    block: TSESTree.Statement | TSESTree.Expression;
  }> {
    if (node.type === "IfStatement" || node.type === "ConditionalExpression") {
      const parsed = parseBranchNode(node);
      if (parsed && equalNodeTokens(parsed.argument, argument, sourceCode)) {
        const block =
          targetMethod === "floor" ? parsed.whenPositive : parsed.whenNegative;
        if (
          block.range[0] <= argument.range[0] &&
          argument.range[1] <= block.range[1]
        )
          yield { node, argument: parsed.argument, block };
      }
    }
    if (
      node.type === "ArrowFunctionExpression" ||
      node.type === "FunctionExpression" ||
      node.type === "FunctionDeclaration" ||
      node.type === "Program" ||
      node.type === "ClassDeclaration" ||
      node.type === "ClassExpression"
    )
      // Out of scope
      return;
    if (node.parent) {
      yield* getBranches(node.parent, argument, targetMethod);
    }
  }
}
/**
 * Returns information if the given expression is Math.trunc().
 */
export function getInfoForMathTrunc(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | MathMethodInfo<"trunc"> {
  return getInfoForMathX(node, "trunc", sourceCode);
}
/**
 * Returns information if the given expression is Math.floor().
 */
export function getInfoForMathFloor(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | MathMethodInfo<"floor"> {
  return getInfoForMathX(node, "floor", sourceCode);
}
/**
 * Returns information if the given expression is Math.ceil().
 */
export function getInfoForMathCeil(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | MathMethodInfo<"ceil"> {
  return getInfoForMathX(node, "ceil", sourceCode);
}

/**
 * Returns information if the given expression is Math[name]().
 */
function getInfoForMathX<M extends MathMethod>(
  node: TSESTree.Expression,
  method: M,
  sourceCode: SourceCode,
): null | MathMethodInfo<M> {
  if (node.type !== "CallExpression") return null;
  const { callee, arguments: args } = node;
  if (callee.type !== "MemberExpression") return null;
  const { object } = callee;
  if (object.type !== "Identifier" || object.name !== "Math") return null;
  const variable = findVariable(sourceCode.getScope(node), object);
  if (variable && variable.defs.length > 0) return null; // Not a global Math object
  if (getPropertyName(callee) !== method) return null;
  if (args.length < 1) return null;
  const argument = args[0];
  if (argument.type === "SpreadElement") return null;
  return { node, method, argument };
}

/** Parses the given conditional expression or if statement. */
function parseBranchNode<
  N extends TSESTree.ConditionalExpression | TSESTree.IfStatement,
>(
  node: N,
): null | {
  argument: TSESTree.Expression;
  whenPositive: NonNullable<N["consequent"] | N["alternate"]>;
  whenNegative: NonNullable<N["consequent"] | N["alternate"]>;
} {
  const { test, consequent, alternate } = node;
  if (!alternate) return null;
  const isPositive = getInfoForIsPositive(test);
  if (isPositive) {
    return {
      // n > 0
      argument: isPositive.argument,
      whenPositive: consequent,
      whenNegative: alternate,
    };
  }
  const isNegative = getInfoForIsNegative(test);
  if (isNegative) {
    return {
      // n < 0
      argument: isNegative.argument,
      whenPositive: alternate,
      whenNegative: consequent,
    };
  }
  return null;
}
