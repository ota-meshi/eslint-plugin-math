import type { TSESTree } from "@typescript-eslint/types";
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
