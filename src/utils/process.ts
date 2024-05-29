import type { TSESTree } from "@typescript-eslint/types";

/**
 * Processes left node and right node.
 */
export function* processLR(
  node: TSESTree.BinaryExpression,
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

/**
 * Processes two operand nodes.
 */
export function processTwoOperands<A, B, R>(
  node: TSESTree.LogicalExpression,
  a: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => A | null,
  b: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => B | null,
  postprocess: (a: A, b: B) => R | null,
): R | null {
  const { left, right } = node;
  return processTwoNodes([left, right], a, b, postprocess);
}

/**
 * Processes three operand nodes.
 */
export function processThreeOperands<A, B, C, R>(
  node: TSESTree.LogicalExpression,
  a: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => A | null,
  b: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => B | null,
  c: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => C | null,
  postprocess: (a: A, b: B, c: C) => R | null,
): R | null {
  const { operator } = node;
  return processTwoOperands(
    node,
    (operand) =>
      operand.type === "LogicalExpression" && operand.operator === operator
        ? operand
        : null,
    (operand) => operand,
    (x, y) => {
      const result: {
        a: A | null;
        b: B | null;
        c: C | null;
      } = {
        a: null,
        b: null,
        c: null,
      };
      for (const operand of [x.left, x.right, y]) {
        if (!result.a) if ((result.a = a(operand))) continue;
        if (!result.b) if ((result.b = b(operand))) continue;
        if (!result.c) result.c = c(operand);
      }
      if (result.a && result.b && result.c) {
        return postprocess(result.a, result.b, result.c);
      }
      return null;
    },
  );
}

/**
 * Processes two parameter nodes.
 */
export function processTwoParams<A, B, R>(
  node: TSESTree.CallExpression,
  a: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => A | null,
  b: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => B | null,
  postprocess: (a: A, b: B) => R | null,
): R | null {
  if (node.arguments.length < 2) return null;
  const [x, y] = node.arguments;
  if (x.type === "SpreadElement" || y.type === "SpreadElement") return null;
  return processTwoNodes([x, y], a, b, postprocess);
}

/**
 * Processes two nodes.
 */
function processTwoNodes<A, B, R>(
  nodes: TSESTree.Expression[],
  a: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => A | null,
  b: (operand: TSESTree.Expression | TSESTree.PrivateIdentifier) => B | null,
  postprocess: (a: A, b: B) => R | null,
): R | null {
  const result: {
    a: A | null;
    b: B | null;
  } = {
    a: null,
    b: null,
  };
  for (const operand of nodes) {
    if (!result.a) if ((result.a = a(operand))) continue;
    if (!result.b) result.b = b(operand);
  }
  return (result.a && result.b && postprocess(result.a, result.b)) || null;
}
