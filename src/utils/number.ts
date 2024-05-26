import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  getInfoForMathCeil,
  getInfoForMathFloor,
  getInfoForMathTrunc,
  getInfoForTransformingToMathTrunc,
} from "./math";
import { equalNodeTokens, isGlobalObject, isLiteral } from "./ast";

export type NumberMethod = "isInteger" | "!isInteger";
export type NumberMethodInfo<M extends NumberMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression;
};

export type TransformingToNumberIsInteger =
  | (NumberMethodInfo<"isInteger" | "!isInteger"> & {
      from: "trunc";
      node: TSESTree.BinaryExpression;
    })
  | (NumberMethodInfo<"isInteger" | "!isInteger"> & {
      from: "truncLike";
      node: TSESTree.BinaryExpression;
    })
  | (NumberMethodInfo<"isInteger" | "!isInteger"> & {
      from: "ceil";
      node: TSESTree.BinaryExpression;
    })
  | (NumberMethodInfo<"isInteger" | "!isInteger"> & {
      from: "floor";
      node: TSESTree.BinaryExpression;
    })
  | (NumberMethodInfo<"isInteger" | "!isInteger"> & {
      from: "modulo";
      node:
        | TSESTree.BinaryExpression
        | TSESTree.UnaryExpression
        | TSESTree.CallExpression;
    });
/**
 * Returns information if the condition checks whether the given expression is a positive number (or zero).
 */
export function getInfoForIsPositive(node: TSESTree.Expression): null | {
  argument: TSESTree.Expression;
} {
  if (node.type !== "BinaryExpression") return null;
  const { left, right, operator } = node;
  if (left.type === "PrivateIdentifier") return null;
  if (operator === ">" || operator === ">=") {
    return isZero(right)
      ? {
          // n > 0, n >= 0
          argument: left,
        }
      : null;
  }
  if (operator === "<" || operator === "<=") {
    return isZero(left)
      ? {
          // 0 < n, 0 <= n
          argument: right,
        }
      : null;
  }
  return null;
}
/**
 * Returns information if the condition checks whether the given expression is a negative number (or zero).
 */
export function getInfoForIsNegative(node: TSESTree.Expression): null | {
  argument: TSESTree.Expression;
} {
  if (node.type !== "BinaryExpression") return null;
  const { left, right, operator } = node;
  if (left.type === "PrivateIdentifier") return null;
  if (operator === "<" || operator === "<=") {
    return isZero(right)
      ? {
          // n < 0, n <= 0
          argument: left,
        }
      : null;
  }
  if (operator === ">" || operator === ">=") {
    return isZero(left)
      ? {
          // 0 > n, 0 >= n
          argument: right,
        }
      : null;
  }
  return null;
}
/**
 * Checks whether the given node is a `0`.
 */
export function isZero(node: TSESTree.Expression): boolean {
  return (
    isLiteral(node, 0) ||
    (node.type === "UnaryExpression" &&
      node.operator === "-" &&
      isLiteral(node.argument, 0))
  );
}
/**
 * Checks whether the given node is a `1`.
 */
export function isOne(node: TSESTree.Expression): boolean {
  return isLiteral(node, 1);
}
/**
 * Checks whether the given node is a `-1`.
 */
export function isMinusOne(node: TSESTree.Expression): boolean {
  return (
    isLiteral(node, -1) ||
    (node.type === "UnaryExpression" &&
      node.operator === "-" &&
      isLiteral(node.argument, 1))
  );
}

/**
 * Returns information if the given expression can be transformed to Number.isInteger().
 */
export function getInfoForTransformingToNumberIsInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsInteger {
  if (node.type === "BinaryExpression") {
    const { left, right, operator } = node;
    if (left.type === "PrivateIdentifier") return null;
    if (operator === "===" || operator === "!==") {
      const method = operator === "!==" ? "!isInteger" : "isInteger";
      for (const [a, b] of [
        [left, right],
        [right, left],
      ]) {
        const toInt = getToIntegerWay(a);
        if (toInt) {
          if (!equalNodeTokens(toInt.argument, b, sourceCode)) continue;
          return {
            from: toInt.type,
            method,
            node,
            argument: toInt.argument,
          };
        }
        if (isZero(b) && isModuloOne(a)) {
          // n % 1 === 0
          return {
            from: "modulo",
            method,
            node,
            argument: a.left,
          };
        }
      }
    }
    if (isModuloOne(node)) {
      const parent = node.parent;
      if (
        (parent.type === "ConditionalExpression" ||
          parent.type === "IfStatement" ||
          parent.type === "ForStatement" ||
          parent.type === "WhileStatement" ||
          parent.type === "DoWhileStatement") &&
        parent.test === node
      ) {
        // if (n % 1) { ... }
        return {
          from: "modulo",
          method: "!isInteger",
          node,
          argument: left,
        };
      }
    }
    return null;
  }
  if (node.type === "UnaryExpression") {
    if (node.operator !== "!") return null;
    const argument = node.argument as TSESTree.Expression; /* Maybe type bug */
    if (!isModuloOne(argument)) return null;
    // !(n % 1)
    return {
      from: "modulo",
      method: "isInteger",
      node,
      argument: argument.left,
    };
  }
  if (node.type === "CallExpression") {
    if (!isGlobalObject(node.callee, "Boolean", sourceCode)) return null;
    const argument = node.arguments.length > 0 ? node.arguments[0] : null;
    if (!argument || !isModuloOne(argument)) return null;
    // Boolean(n % 1)
    return {
      from: "modulo",
      method: "!isInteger",
      node,
      argument: argument.left,
    };
  }
  return null;

  /**
   * Get way to convert to an integer.
   */
  function getToIntegerWay(a: TSESTree.Expression) {
    const trunc = getInfoForMathTrunc(a, sourceCode);
    if (trunc) return { ...trunc, type: "trunc" as const };
    const floor = getInfoForMathFloor(a, sourceCode);
    if (floor) return { ...floor, type: "floor" as const };
    const ceil = getInfoForMathCeil(a, sourceCode);
    if (ceil) return { ...ceil, type: "ceil" as const };
    const truncLike = getInfoForTransformingToMathTrunc(a, sourceCode);
    if (truncLike) return { ...truncLike, type: "truncLike" as const };
    return null;
  }
}

/**
 * Checks whether the given node is a `n % 1`.
 */
function isModuloOne(
  node: TSESTree.Expression | TSESTree.SpreadElement,
): node is TSESTree.BinaryExpression & { left: TSESTree.Expression } {
  return (
    node.type === "BinaryExpression" &&
    node.operator === "%" &&
    isOne(node.right) &&
    node.left.type !== "PrivateIdentifier"
  );
}
