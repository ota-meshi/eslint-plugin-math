import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  getInfoForMathCeil,
  getInfoForMathFloor,
  getInfoForMathTrunc,
  getInfoForTransformingToMathTrunc,
} from "./math";
import { equalNodeTokens } from "./ast";

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
    return right.type === "Literal" && right.value === 0
      ? {
          // n > 0, n >= 0
          argument: left,
        }
      : null;
  }
  if (operator === "<" || operator === "<=") {
    return left.type === "Literal" && left.value === 0
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
    return right.type === "Literal" && right.value === 0
      ? {
          // n < 0, n <= 0
          argument: left,
        }
      : null;
  }
  if (operator === ">" || operator === ">=") {
    return left.type === "Literal" && left.value === 0
      ? {
          // 0 > n, 0 >= n
          argument: right,
        }
      : null;
  }
  return null;
}

/**
 * Returns information if the given expression can be transformed to Number.isInteger().
 */
export function getInfoForTransformingToNumberIsInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsInteger {
  if (node.type === "BinaryExpression") {
    const { left, right } = node;
    if (left.type === "PrivateIdentifier") return null;
    const method =
      node.operator === "==="
        ? "isInteger"
        : node.operator === "!=="
          ? "!isInteger"
          : null;
    if (method == null) return null;

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
    }
    return null;
  }
  return null;

  /**
   * Get way to convert to an integer.
   */
  function getToIntegerWay(expr: TSESTree.Expression) {
    const trunc = getInfoForMathTrunc(expr, sourceCode);
    if (trunc) return { ...trunc, type: "trunc" as const };
    const floor = getInfoForMathFloor(expr, sourceCode);
    if (floor) return { ...floor, type: "floor" as const };
    const ceil = getInfoForMathCeil(expr, sourceCode);
    if (ceil) return { ...ceil, type: "ceil" as const };
    const truncLike = getInfoForTransformingToMathTrunc(expr, sourceCode);
    if (truncLike) return { ...truncLike, type: "truncLike" as const };
    return null;
  }
}
