import type { TSESTree } from "@typescript-eslint/types";

/**
 * Processes left node and right node.
 */
export function* processLR(
  node: TSESTree.BinaryExpression,
): Iterable<[TSESTree.Expression, TSESTree.Expression]> {
  const { left, right, operator } = node;
  yield [left as TSESTree.Expression, right];
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
    yield [right, left as TSESTree.Expression];
  }
}

/**
 * Processes two operand nodes.
 */
export function processTwoOperands<A, B, R>(
  node: TSESTree.LogicalExpression,
  a: (operand: TSESTree.Expression) => A | null,
  b: (operand: TSESTree.Expression) => B | null,
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
  a: (operand: TSESTree.Expression) => A | null,
  b: (operand: TSESTree.Expression) => B | null,
  c: (operand: TSESTree.Expression) => C | null,
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
 * Processes four operand nodes.
 */
export function processFourOperands<A, B, C, D, R>(
  node: TSESTree.LogicalExpression,
  a: (operand: TSESTree.Expression) => A | null,
  b: (operand: TSESTree.Expression) => B | null,
  c: (operand: TSESTree.Expression) => C | null,
  d: (operand: TSESTree.Expression) => D | null,
  postprocess: (a: A, b: B, c: C, d: D) => R | null,
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
      const operands = [x.left, x.right, y];
      const logicalExprIndex = operands.findIndex(
        (operand) =>
          operand.type === "LogicalExpression" && operand.operator === operator,
      );
      if (logicalExprIndex < 0) return null;
      const logicalExpr = operands[
        logicalExprIndex
      ] as TSESTree.LogicalExpression;
      operands.splice(logicalExprIndex, 1, logicalExpr.left, logicalExpr.right);

      const result: {
        a: A | null;
        b: B | null;
        c: C | null;
        d: D | null;
      } = {
        a: null,
        b: null,
        c: null,
        d: null,
      };
      for (const operand of operands) {
        if (!result.a) if ((result.a = a(operand))) continue;
        if (!result.b) if ((result.b = b(operand))) continue;
        if (!result.c) if ((result.c = c(operand))) continue;
        if (!result.d) if ((result.d = d(operand))) continue;
      }
      if (result.a && result.b && result.c && result.d) {
        return postprocess(result.a, result.b, result.c, result.d);
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
  a: (operand: TSESTree.Expression) => A | null,
  b: (operand: TSESTree.Expression) => B | null,
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
  a: (operand: TSESTree.Expression) => A | null,
  b: (operand: TSESTree.Expression) => B | null,
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
