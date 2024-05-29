import type { TSESTree } from "@typescript-eslint/types";

/**
 * Processes left node and right node.
 */
export function* processLR(
  node: TSESTree.BinaryExpression | TSESTree.LogicalExpression,
): Iterable<
  [
    TSESTree.Expression | TSESTree.PrivateIdentifier,
    TSESTree.Expression | TSESTree.PrivateIdentifier,
  ]
> {
  const { left, right, operator } = node;
  yield [left, right];
  if (
    operator === "*" ||
    operator === "+" ||
    operator === "&&" ||
    operator === "||" ||
    operator === "!=" ||
    operator === "!==" ||
    operator === "==" ||
    operator === "===" ||
    operator === "&" ||
    operator === "|" ||
    operator === "^"
  ) {
    yield [right, left];
  }
}
