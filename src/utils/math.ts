import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  equalNodeTokens,
  equalTokens,
  getStaticValue,
  isGlobalObjectMethodCall,
  isGlobalObjectProperty,
  isStaticValue,
} from "./ast";
import {
  getInfoForIsNegative,
  getInfoForIsPositive,
  getInfoForToNegative,
  isHalf,
  isMinusOne,
  isOne,
  isOneThird,
  isTen,
  isTwo,
  isZero,
} from "./number";
import type { ExtractFunctionKeys } from "./type";
import { processLR } from "./process";
import type { ExponentiationOrLike } from "./operator";
import { getInfoForExponentiationOrLike } from "./operator";

type MathConstructor = typeof Math;
export type MathMethod = ExtractFunctionKeys<MathConstructor>;
export type MathMethodInfo<M extends MathMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression;
};
export type MathMethodWithArgsInfo<M extends "hypot"> = {
  method: M;
  node: TSESTree.Expression;
  arguments: TSESTree.Expression[];
};
export type MathPropertyInfo<M extends keyof MathConstructor> = {
  property: M;
  node: TSESTree.Expression;
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
    for (const [left, right] of processLR(node)) {
      if (
        node.operator === "|" ||
        node.operator === "^" ||
        node.operator === ">>" ||
        node.operator === "<<"
      ) {
        if (isZero(right, sourceCode)) {
          // n | 0, n ^ 0, n >> 0, n << 0
          return { from: "bitwise", method: "trunc", node, argument: left };
        }
        continue;
      }
      if (node.operator === "&") {
        if (isMinusOne(right, sourceCode)) {
          // n & -1
          return { from: "bitwise", method: "trunc", node, argument: left };
        }
        continue;
      }
    }
    return null;
  }
  if (node.type === "ConditionalExpression") {
    const conditional = parseBranchNode(node, sourceCode);
    if (!conditional) return null;
    const floor = getInfoForMathFloor(conditional.whenPositive, sourceCode);
    if (floor === null) return null;
    const ceil = getInfoForMathCeil(conditional.whenNegative, sourceCode);
    if (ceil === null) return null;
    if (
      !equalNodeTokens(
        conditional.argument,
        floor.argument,
        ceil.argument,
        sourceCode,
      )
    )
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
      const parsed = parseBranchNode(node, sourceCode);
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

export type TransformingToMathSqrt =
  | (MathMethodInfo<"sqrt"> & {
      from: "**";
      node: TSESTree.BinaryExpression;
      exponentMeta: TSESTree.Expression;
    })
  | (MathMethodInfo<"sqrt"> & {
      from: "pow";
      node: TSESTree.CallExpression;
      exponentMeta: TSESTree.Expression;
    });
/**
 * Returns information if the given expression can be transformed to Math.sqrt().
 */
export function getInfoForTransformingToMathSqrt(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathSqrt {
  if (node.type === "BinaryExpression") {
    if (node.operator === "**") {
      for (const [left, right] of processLR(node)) {
        if (!isHalf(right, sourceCode)) continue;
        // n ** (1/2)
        return {
          from: "**",
          method: "sqrt",
          node,
          argument: left,
          exponentMeta: right,
        };
      }
    }
    return null;
  }
  if (isGlobalObjectMethodCall(node, "Math", "pow", sourceCode)) {
    if (node.arguments.length < 2) return null;
    const [argument, exponent] = node.arguments;
    if (argument.type === "SpreadElement" || !isHalf(exponent, sourceCode))
      return null;
    // Math.pow(n, 1/2)
    return {
      from: "pow",
      method: "sqrt",
      node,
      argument,
      exponentMeta: exponent,
    };
  }
  return null;
}

export type TransformingToMathAbs = MathMethodInfo<"abs"> & {
  from: "*-1" | "-";
  node: TSESTree.ConditionalExpression;
};
/**
 * Returns information if the given expression can be transformed to Math.abs().
 * However, note that the conversion may fail in the case of BigInt.
 */
export function getInfoForTransformingToMathAbs(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathAbs {
  if (node.type === "ConditionalExpression") {
    const parsed = parseConditionalExpression(node);
    if (parsed) {
      const { argument, whenPositive, whenNegative } = parsed;
      const neg = getInfoForToNegative(whenNegative, sourceCode);
      if (
        neg &&
        equalNodeTokens(argument, neg.argument, whenPositive, sourceCode)
      ) {
        // n >= 0 ? n : -n, n >= 0 ? n : -1 * n
        return {
          from: neg.from,
          method: "abs",
          node,
          argument,
        };
      }
      return null;
    }
  }
  return null;

  /**
   * Parses the given conditional expression.
   */
  function parseConditionalExpression(c: TSESTree.ConditionalExpression) {
    const { test, consequent, alternate } = c;
    const positive = getInfoForIsPositive(test, sourceCode);
    if (positive) {
      return {
        argument: positive.argument,
        whenPositive: consequent,
        whenNegative: alternate,
      };
    }
    const negative = getInfoForIsNegative(test, sourceCode);
    if (negative) {
      return {
        argument: negative.argument,
        whenPositive: alternate,
        whenNegative: consequent,
      };
    }
    return null;
  }
}

export type TransformingToMathCbrt =
  | (MathMethodInfo<"cbrt"> & {
      from: "**";
      node: TSESTree.BinaryExpression;
    })
  | (MathMethodInfo<"cbrt"> & {
      from: "pow";
      node: TSESTree.CallExpression;
    });
/**
 * Returns information if the given expression can be transformed to Math.cbrt().
 */
export function getInfoForTransformingToMathCbrt(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathCbrt {
  if (node.type === "BinaryExpression") {
    if (node.operator === "**") {
      for (const [left, right] of processLR(node)) {
        if (!isOneThird(right, sourceCode)) continue;
        // n ** (1/3)
        return { from: "**", method: "cbrt", node, argument: left };
      }
    }
    return null;
  }
  if (isGlobalObjectMethodCall(node, "Math", "pow", sourceCode)) {
    if (node.arguments.length < 2) return null;
    const [argument, exponent] = node.arguments;
    if (argument.type === "SpreadElement" || !isOneThird(exponent, sourceCode))
      return null;
    // Math.pow(n, 1/3)
    return {
      from: "pow",
      method: "cbrt",
      node,
      argument,
    };
  }
  return null;
}

export type TransformingToMathLog2 =
  | (MathMethodInfo<"log2"> & {
      from: "logWithLOG2E";
      node: TSESTree.BinaryExpression;
    })
  | (MathMethodInfo<"log2"> & {
      from: "logWithLN2";
      node: TSESTree.BinaryExpression;
    });
/**
 * Returns information if the given expression can be transformed to Math.log2().
 */
export function getInfoForTransformingToMathLog2(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLog2 {
  if (node.type === "BinaryExpression") {
    const { operator } = node;
    for (const [left, right] of processLR(node)) {
      if (!isGlobalObjectMethodCall(left, "Math", "log", sourceCode)) continue;
      if (left.arguments.length < 1) continue;
      const [argument] = left.arguments;
      if (argument.type === "SpreadElement") continue;

      if (operator === "*") {
        // Check for Math.log(n) * Math.LOG2E;
        if (!isGlobalObjectProperty(right, "Math", "LOG2E", sourceCode)) {
          const mathLOG2E = getInfoForTransformingToMathLOG2E(
            right,
            sourceCode,
          );
          if (!mathLOG2E || mathLOG2E.inverse) continue;
        }
        return {
          from: "logWithLOG2E",
          method: "log2",
          node,
          argument,
        };
      }
      if (operator === "/") {
        // Check for Math.log(n) / Math.LN2;
        if (!isGlobalObjectProperty(right, "Math", "LN2", sourceCode)) {
          const mathLN2 = getInfoForTransformingToMathLN2(right, sourceCode);
          if (!mathLN2 || mathLN2.inverse) continue;
        }
        return {
          from: "logWithLN2",
          method: "log2",
          node,
          argument,
        };
      }
    }
    return null;
  }
  return null;
}

export type TransformingToMathSQRT2 =
  // 2 ** (1 / 2);
  | (MathPropertyInfo<"SQRT2"> & {
      from: "2**1/2";
      node: TSESTree.Expression;
    })
  // Math.pow(2, 1 / 2);
  | (MathPropertyInfo<"SQRT2"> & {
      from: "pow(2,1/2)";
      node: TSESTree.Expression;
    })
  // Math.sqrt(2);
  | (MathPropertyInfo<"SQRT2"> & {
      from: "sqrt(2)";
      node: TSESTree.Expression;
    })
  // Literal
  | (MathPropertyInfo<"SQRT2"> & {
      from: "literal";
      node: TSESTree.Expression;
    });
/**
 * Returns information if the given expression can be transformed to Math.SQRT2.
 */
export function getInfoForTransformingToMathSQRT2(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathSQRT2 {
  const transform = getInfoForTransformingToMathSqrt(node, sourceCode);
  if (transform) {
    if (!isTwo(transform.argument, sourceCode)) return null;
    if (transform.from === "**") {
      return {
        property: "SQRT2",
        node,
        from: "2**1/2",
      };
    } else if (transform.from === "pow") {
      return {
        property: "SQRT2",
        node,
        from: "pow(2,1/2)",
      };
    }
  } else if (isGlobalObjectMethodCall(node, "Math", "sqrt", sourceCode)) {
    if (node.arguments.length < 1 || !isTwo(node.arguments[0], sourceCode))
      return null;
    return {
      property: "SQRT2",
      node,
      from: "sqrt(2)",
    };
  } else if (
    isStaticValue(node, Math.SQRT2, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "SQRT2", sourceCode)
  ) {
    return {
      property: "SQRT2",
      node,
      from: "literal",
    };
  }
  return null;
}

export type TransformingToMathLN2 =
  // Math.log(2);
  | (MathPropertyInfo<"LN2"> & {
      from: "log";
      node: TSESTree.CallExpression;
      inverse: false;
    })
  // 1 / Math.LOG2E;
  | (MathPropertyInfo<"LN2"> & {
      from: "LOG2E";
      node: TSESTree.BinaryExpression;
      inverse: false;
    })
  // x / Math.LOG2E;
  | (MathPropertyInfo<"LN2"> & {
      from: "LOG2E";
      node: TSESTree.Expression;
      inverse: true;
      parent: TSESTree.BinaryExpression;
    })
  // Literal
  | (MathPropertyInfo<"LN2"> & {
      from: "literal";
      node: TSESTree.Expression;
      inverse: false;
    });
/**
 * Returns information if the given expression can be transformed to Math.LN2.
 */
export function getInfoForTransformingToMathLN2(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLN2 {
  if (isGlobalObjectMethodCall(node, "Math", "log", sourceCode)) {
    if (node.arguments.length < 1) return null;
    const [argument] = node.arguments;
    if (!isTwo(argument, sourceCode)) return null;
    return {
      property: "LN2",
      node,
      from: "log",
      inverse: false,
    };
  }
  if (node.type === "BinaryExpression") {
    if (node.operator !== "/") return null;

    if (!isGlobalObjectProperty(node.right, "Math", "LOG2E", sourceCode)) {
      const mathLOG2E = getInfoForTransformingToMathLOG2E(
        node.right,
        sourceCode,
      );
      if (!mathLOG2E || mathLOG2E.inverse) return null;
    }
    if (isOne(node.left as TSESTree.Expression, sourceCode)) {
      return {
        property: "LN2",
        node,
        from: "LOG2E",
        inverse: false,
      };
    }
    return {
      property: "LN2",
      node: node.right,
      from: "LOG2E",
      inverse: true,
      parent: node,
    };
  }
  if (
    isStaticValue(node, Math.LN2, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "LN2", sourceCode)
  ) {
    return {
      from: "literal",
      node,
      property: "LN2",
      inverse: false,
    };
  }
  return null;
}

export type TransformingToMathLOG2E =
  // Math.log2(Math.E);;
  | (MathPropertyInfo<"LOG2E"> & {
      from: "log2";
      node: TSESTree.CallExpression | TSESTree.BinaryExpression;
      inverse: false;
    })
  // 1 / Math.LN2;
  | (MathPropertyInfo<"LOG2E"> & {
      from: "LN2";
      node: TSESTree.BinaryExpression;
      inverse: false;
    })
  // x / Math.LN2;
  | (MathPropertyInfo<"LOG2E"> & {
      from: "LN2";
      node: TSESTree.Expression;
      inverse: true;
      parent: TSESTree.BinaryExpression;
    })
  // Literal
  | (MathPropertyInfo<"LOG2E"> & {
      from: "literal";
      node: TSESTree.Expression;
      inverse: false;
    });

/**
 * Returns information if the given expression can be transformed to Math.LOG2E.
 */
export function getInfoForTransformingToMathLOG2E(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLOG2E {
  const log2 = getInfoForMathLog2(node);

  if (log2) {
    if (!isMathEOrLike(log2.argument, sourceCode)) return null;
    return {
      property: "LOG2E",
      node: log2.node,
      from: "log2",
      inverse: false,
    };
  }
  if (node.type === "BinaryExpression") {
    if (node.operator !== "/") return null;
    if (!isGlobalObjectProperty(node.right, "Math", "LN2", sourceCode)) {
      const mathLN2 = getInfoForTransformingToMathLN2(node.right, sourceCode);
      if (!mathLN2 || mathLN2.inverse) return null;
    }

    if (isOne(node.left as TSESTree.Expression, sourceCode)) {
      return {
        property: "LOG2E",
        node,
        from: "LN2",
        inverse: false,
      };
    }
    return {
      property: "LOG2E",
      node: node.right,
      from: "LN2",
      inverse: true,
      parent: node,
    };
  }
  if (
    isStaticValue(node, Math.LOG2E, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "LOG2E", sourceCode)
  ) {
    return {
      property: "LOG2E",
      from: "literal",
      node,
      inverse: false,
    };
  }
  return null;

  /**
   * Returns information if the given expression is Math.log2().
   */
  function getInfoForMathLog2(
    expr: TSESTree.Expression,
  ):
    | null
    | (MathMethodInfo<"log2"> & { node: TSESTree.CallExpression })
    | TransformingToMathLog2 {
    if (
      isGlobalObjectMethodCall(expr, "Math", "log2", sourceCode) &&
      expr.arguments.length > 0 &&
      isMathEOrLike(expr.arguments[0], sourceCode)
    ) {
      return {
        argument: expr.arguments[0],
        method: "log2",
        node: expr,
      };
    }

    return getInfoForTransformingToMathLog2(expr, sourceCode);
  }
}

export type TransformingToMathLog10 =
  | (MathMethodInfo<"log10"> & {
      from: "logWithLOG10E";
      node: TSESTree.BinaryExpression;
    })
  | (MathMethodInfo<"log10"> & {
      from: "logWithLN10";
      node: TSESTree.BinaryExpression;
    });
/**
 * Returns information if the given expression can be transformed to Math.log10().
 */
export function getInfoForTransformingToMathLog10(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLog10 {
  if (node.type === "BinaryExpression") {
    const { operator } = node;
    for (const [left, right] of processLR(node)) {
      if (!isGlobalObjectMethodCall(left, "Math", "log", sourceCode)) continue;
      if (left.arguments.length < 1) continue;
      const [argument] = left.arguments;
      if (argument.type === "SpreadElement") continue;

      if (operator === "*") {
        // Check for Math.log(n) * Math.LOG10E;
        if (!isGlobalObjectProperty(right, "Math", "LOG10E", sourceCode)) {
          const mathLOG10E = getInfoForTransformingToMathLOG10E(
            right,
            sourceCode,
          );
          if (!mathLOG10E || mathLOG10E.inverse) continue;
        }
        return {
          from: "logWithLOG10E",
          method: "log10",
          node,
          argument,
        };
      }
      if (operator === "/") {
        // Check for Math.log(n) / Math.LN10;
        if (!isGlobalObjectProperty(right, "Math", "LN10", sourceCode)) {
          const mathLN10 = getInfoForTransformingToMathLN10(right, sourceCode);
          if (!mathLN10 || mathLN10.inverse) continue;
        }
        return {
          from: "logWithLN10",
          method: "log10",
          node,
          argument,
        };
      }
    }
    return null;
  }
  return null;
}

export type TransformingToMathLN10 =
  // Math.log(10);
  | (MathPropertyInfo<"LN10"> & {
      from: "log";
      node: TSESTree.CallExpression;
      inverse: false;
    })
  // 1 / Math.LOG10E;
  | (MathPropertyInfo<"LN10"> & {
      from: "LOG10E";
      node: TSESTree.BinaryExpression;
      inverse: false;
    })
  // x / Math.LOG10E;
  | (MathPropertyInfo<"LN10"> & {
      from: "LOG10E";
      node: TSESTree.Expression;
      inverse: true;
      parent: TSESTree.BinaryExpression;
    })
  // Literal
  | (MathPropertyInfo<"LN10"> & {
      from: "literal";
      node: TSESTree.Expression;
      inverse: false;
    });
/**
 * Returns information if the given expression can be transformed to Math.LN10.
 */
export function getInfoForTransformingToMathLN10(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLN10 {
  if (isGlobalObjectMethodCall(node, "Math", "log", sourceCode)) {
    if (node.arguments.length < 1) return null;
    const [argument] = node.arguments;
    if (!isTen(argument, sourceCode)) return null;
    return {
      property: "LN10",
      node,
      from: "log",
      inverse: false,
    };
  }
  if (node.type === "BinaryExpression") {
    if (node.operator !== "/") return null;

    if (!isGlobalObjectProperty(node.right, "Math", "LOG10E", sourceCode)) {
      const mathLOG10E = getInfoForTransformingToMathLOG10E(
        node.right,
        sourceCode,
      );
      if (!mathLOG10E || mathLOG10E.inverse) return null;
    }
    if (isOne(node.left as TSESTree.Expression, sourceCode)) {
      return {
        property: "LN10",
        node,
        from: "LOG10E",
        inverse: false,
      };
    }
    return {
      property: "LN10",
      node: node.right,
      from: "LOG10E",
      inverse: true,
      parent: node,
    };
  }
  if (
    isStaticValue(node, Math.LN10, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "LN10", sourceCode)
  ) {
    return {
      from: "literal",
      node,
      property: "LN10",
      inverse: false,
    };
  }
  return null;
}

export type TransformingToMathLOG10E =
  // Math.log10(Math.E);;
  | (MathPropertyInfo<"LOG10E"> & {
      from: "log10";
      node: TSESTree.CallExpression | TSESTree.BinaryExpression;
      inverse: false;
    })
  // 1 / Math.LN10;
  | (MathPropertyInfo<"LOG10E"> & {
      from: "LN10";
      node: TSESTree.BinaryExpression;
      inverse: false;
    })
  // x / Math.LN10;
  | (MathPropertyInfo<"LOG10E"> & {
      from: "LN10";
      node: TSESTree.Expression;
      inverse: true;
      parent: TSESTree.BinaryExpression;
    })
  // Literal
  | (MathPropertyInfo<"LOG10E"> & {
      from: "literal";
      node: TSESTree.Expression;
      inverse: false;
    });

/**
 * Returns information if the given expression can be transformed to Math.LOG10E.
 */
export function getInfoForTransformingToMathLOG10E(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathLOG10E {
  const log10 = getInfoForMathLog10(node);

  if (log10) {
    if (!isMathEOrLike(log10.argument, sourceCode)) return null;
    return {
      property: "LOG10E",
      node: log10.node,
      from: "log10",
      inverse: false,
    };
  }
  if (node.type === "BinaryExpression") {
    if (node.operator !== "/") return null;
    if (!isGlobalObjectProperty(node.right, "Math", "LN10", sourceCode)) {
      const mathLN10 = getInfoForTransformingToMathLN10(node.right, sourceCode);
      if (!mathLN10 || mathLN10.inverse) return null;
    }

    if (isOne(node.left as TSESTree.Expression, sourceCode)) {
      return {
        property: "LOG10E",
        node,
        from: "LN10",
        inverse: false,
      };
    }
    return {
      property: "LOG10E",
      node: node.right,
      from: "LN10",
      inverse: true,
      parent: node,
    };
  }
  if (
    isStaticValue(node, Math.LOG10E, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "LOG10E", sourceCode)
  ) {
    return {
      property: "LOG10E",
      from: "literal",
      node,
      inverse: false,
    };
  }
  return null;

  /**
   * Returns information if the given expression is Math.log10().
   */
  function getInfoForMathLog10(
    expr: TSESTree.Expression,
  ):
    | null
    | (MathMethodInfo<"log10"> & { node: TSESTree.CallExpression })
    | TransformingToMathLog10 {
    if (
      isGlobalObjectMethodCall(expr, "Math", "log10", sourceCode) &&
      expr.arguments.length > 0 &&
      isMathEOrLike(expr.arguments[0], sourceCode)
    ) {
      return {
        argument: expr.arguments[0],
        method: "log10",
        node: expr,
      };
    }

    return getInfoForTransformingToMathLog10(expr, sourceCode);
  }
}

export type TransformingToMathE =
  // Math.exp(1);
  | (MathPropertyInfo<"E"> & {
      from: "exp";
      node: TSESTree.CallExpression;
    })
  // 2.718281828459045;
  | (MathPropertyInfo<"E"> & {
      from: "literal";
      node: TSESTree.Expression;
    });

/**
 * Returns information if the given expression can be transformed to Math.E.
 */
export function getInfoForTransformingToMathE(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): null | TransformingToMathE {
  if (
    isGlobalObjectMethodCall(node, "Math", "exp", sourceCode) &&
    node.arguments.length > 0 &&
    isOne(node.arguments[0], sourceCode)
  ) {
    return {
      property: "E",
      node,
      from: "exp",
    };
  }
  if (
    isStaticValue(node, Math.E, sourceCode) &&
    !isGlobalObjectProperty(node, "Math", "E", sourceCode)
  ) {
    return {
      property: "E",
      node,
      from: "literal",
    };
  }
  return null;
}

export type TransformingToMathHypot =
  | (MathMethodWithArgsInfo<"hypot"> & {
      from: "sqrt";
      node: TSESTree.CallExpression;
      argumentsMeta: ExponentiationOrLike[];
      exponentMeta?: undefined;
    })
  | (MathMethodWithArgsInfo<"hypot"> & {
      from: "**";
      node: TSESTree.BinaryExpression;
      argumentsMeta: ExponentiationOrLike[];
      exponentMeta: TSESTree.Expression;
    })
  | (MathMethodWithArgsInfo<"hypot"> & {
      from: "pow";
      node: TSESTree.CallExpression;
      argumentsMeta: ExponentiationOrLike[];
      exponentMeta: TSESTree.Expression;
    });
/**
 * Returns information if the given expression can be transformed to Math.Hypot().
 */
export function getInfoForTransformingToMathHypot(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToMathHypot {
  const sqrt = getInfoForMathSqrtOrLike(node, sourceCode);
  if (
    !sqrt ||
    sqrt.argument.type !== "BinaryExpression" ||
    sqrt.argument.operator !== "+"
  )
    return null;

  const plusOperands: TSESTree.Expression[] = [sqrt.argument];
  let plusOperandIndex: number;
  while (
    (plusOperandIndex = plusOperands.findIndex(
      (operand) =>
        operand.type === "BinaryExpression" && operand.operator === "+",
    )) >= 0
  ) {
    const operand = plusOperands[plusOperandIndex] as TSESTree.BinaryExpression;
    plusOperands.splice(
      plusOperandIndex,
      1,
      operand.left as TSESTree.Expression,
      operand.right,
    );
  }
  if (plusOperands.length < 2) return null;

  const argumentsMeta: ExponentiationOrLike[] = [];

  for (const operand of plusOperands) {
    const exponentiation = getInfoForExponentiationOrLike(operand, sourceCode);
    if (!exponentiation) return null;
    if (exponentiation.from === "*" || exponentiation.from === "nesting**") {
      if (exponentiation.right !== 2) return null;
    } else if (getStaticValue(exponentiation.right, sourceCode)?.value !== 2) {
      return null;
    }
    argumentsMeta.push(exponentiation);
  }

  return {
    method: "hypot",
    node: sqrt.node as never,
    from: sqrt.from,
    arguments: argumentsMeta.map((meta) => meta.left),
    argumentsMeta,
    exponentMeta: sqrt.exponentMeta as never,
  };
}
/**
 * Returns information if the given expression is Math.trunc().
 */
export function getInfoForMathTrunc(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"trunc"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "trunc", sourceCode);
}
/**
 * Returns information if the given expression is Math.floor().
 */
export function getInfoForMathFloor(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"floor"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "floor", sourceCode);
}
/**
 * Returns information if the given expression is Math.ceil().
 */
export function getInfoForMathCeil(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"ceil"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "ceil", sourceCode);
}
/**
 * Returns information if the given expression is Math.round().
 */
export function getInfoForMathRound(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"round"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "round", sourceCode);
}
/**
 * Returns information if the given expression is Math.abs().
 */
export function getInfoForMathAbs(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"abs"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "abs", sourceCode);
}

export type MathAbsOrLike =
  | (MathMethodInfo<"abs"> & {
      node: TSESTree.CallExpression;
      from: "abs";
    })
  | TransformingToMathAbs;
/**
 * Returns information if the given expression is a Math.abs() expression or such an expression.
 */
export function getInfoForMathAbsOrLike(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): MathAbsOrLike | null {
  const abs = getInfoForMathAbs(node, sourceCode);
  return abs
    ? { ...abs, from: "abs" }
    : getInfoForTransformingToMathAbs(node, sourceCode);
}

/**
 * Checks whether the given node is a Math.E or like.
 */
function isMathEOrLike(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return (
    isMathE(node, sourceCode) ||
    getInfoForTransformingToMathE(node, sourceCode) !== null
  );
}

/**
 * Checks whether the given node is a Math.E.
 */
function isMathE(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isGlobalObjectProperty(node, "Math", "E", sourceCode);
}

/**
 * Returns information if the given expression is a Math.sqrt() expression or such an expression.
 */
function getInfoForMathSqrtOrLike(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
):
  | (MathMethodInfo<"sqrt"> & {
      from: "sqrt";
      node: TSESTree.CallExpression;
      exponentMeta?: undefined;
    })
  | TransformingToMathSqrt
  | null {
  const sqrt = getInfoForMathSqrt(node, sourceCode);
  return sqrt
    ? { ...sqrt, from: "sqrt" }
    : getInfoForTransformingToMathSqrt(node, sourceCode);
}

/**
 * Returns information if the given expression is Math.sqrt().
 */
function getInfoForMathSqrt(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | (MathMethodInfo<"sqrt"> & { node: TSESTree.CallExpression }) {
  return getInfoForMathX(node, "sqrt", sourceCode);
}

/**
 * Returns information if the given expression is Math[method]().
 */
function getInfoForMathX<M extends MathMethod>(
  node: TSESTree.Expression,
  method: M,
  sourceCode: SourceCode,
): null | (MathMethodInfo<M> & { node: TSESTree.CallExpression }) {
  if (!isGlobalObjectMethodCall(node, "Math", method, sourceCode)) return null;
  const { arguments: args } = node;
  if (args.length < 1) return null;
  const [argument] = args;
  if (argument.type === "SpreadElement") return null;
  return { node, method, argument };
}

/** Parses the given conditional expression or if statement. */
function parseBranchNode<
  N extends TSESTree.ConditionalExpression | TSESTree.IfStatement,
>(
  node: N,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
  whenPositive: NonNullable<N["consequent"] | N["alternate"]>;
  whenNegative: NonNullable<N["consequent"] | N["alternate"]>;
} {
  const { test, consequent, alternate } = node;
  if (!alternate) return null;
  const isPositive = getInfoForIsPositive(test, sourceCode);
  if (isPositive) {
    return {
      // n > 0
      argument: isPositive.argument,
      whenPositive: consequent,
      whenNegative: alternate,
    };
  }
  const isNegative = getInfoForIsNegative(test, sourceCode);
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
