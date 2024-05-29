import type { TSESTree } from "@typescript-eslint/types";
import { findVariable, getPropertyName } from "@eslint-community/eslint-utils";
import type { AST, SourceCode } from "eslint";
import type { ExtractFunctionKeys } from "./type";

/**
 * Checks whether the given node has a comment.
 */
export function existComment(
  node: TSESTree.Node,
  sourceCode: SourceCode,
): boolean {
  return sourceCode.commentsExistBetween(
    sourceCode.getFirstToken(node)!,
    sourceCode.getLastToken(node)!,
  );
}
/**
 * Checks whether the given range has a comment.
 */
export function existCommentBetween(
  range: [number, number],
  sourceCode: SourceCode,
): boolean {
  const left = sourceCode.getNodeByRangeIndex(range[0])!;
  const right = sourceCode.getNodeByRangeIndex(range[1])!;
  if (left.range[0] === range[0] && right.range[1] === range[1]) {
    return sourceCode.commentsExistBetween(
      sourceCode.getFirstToken(left)!,
      sourceCode.getLastToken(right)!,
    );
  }
  let token: AST.Token | TSESTree.Comment | null =
    sourceCode.getFirstToken(left);
  while (token && token.range[1] <= range[1]) {
    if (
      (range[0] <= token.range[0] && token.type === "Line") ||
      token.type === "Block"
    )
      return true;
    token = sourceCode.getTokenAfter(token, { includeComments: true });
  }
  return false;
}
/**
 * Checks whether the given node is a global object.
 */
export function isGlobalObject(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: keyof typeof globalThis,
  sourceCode: SourceCode,
): node is TSESTree.Identifier | TSESTree.MemberExpression {
  if (node.type === "Identifier") {
    if (node.name !== name) return false;
    const variable = findVariable(sourceCode.getScope(node), node);
    if (variable && variable.defs.length > 0) return false; // Not a global
    return true;
  }
  return (
    node.type === "MemberExpression" &&
    (isGlobalObjectProperty(node, "globalThis", name, sourceCode) ||
      isGlobalObjectProperty(node, "self", name, sourceCode) ||
      isGlobalObjectProperty(node, "window", name, sourceCode) ||
      isGlobalObjectProperty(node, "global", name, sourceCode))
  );
}
/**
 * Checks whether the given node is a global object method call.
 */
export function isGlobalObjectMethodCall<N extends keyof typeof globalThis>(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: N,
  method: ExtractFunctionKeys<(typeof globalThis)[N]>,
  sourceCode: SourceCode,
): node is TSESTree.CallExpression {
  if (node.type !== "CallExpression") return false;
  const { callee } = node;
  return isGlobalObjectProperty(callee, name, method, sourceCode);
}
/**
 * Checks whether the given node is a global object property.
 */
export function isGlobalObjectProperty<N extends keyof typeof globalThis>(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: N,
  property: keyof (typeof globalThis)[N],
  sourceCode: SourceCode,
): node is TSESTree.CallExpression {
  return (
    node.type === "MemberExpression" &&
    getPropertyName(node, sourceCode.getScope(node)) === property &&
    isGlobalObject(node.object, name, sourceCode)
  );
}
/**
 * Checks whether the given node is a global method call.
 */
export function isGlobalMethodCall(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  name: ExtractFunctionKeys<typeof globalThis>,
  sourceCode: SourceCode,
): node is TSESTree.CallExpression {
  if (node.type !== "CallExpression") return false;
  const { callee } = node;
  return isGlobalObject(callee, name, sourceCode);
}

/**
 * Checks whether or not the tokens of two given nodes are same.
 */
export function equalNodeTokens(
  a: TSESTree.Node,
  b: TSESTree.Node,
  sourceCode: SourceCode,
): boolean;
export function equalNodeTokens(
  a: TSESTree.Node,
  b: TSESTree.Node,
  c: TSESTree.Node,
  sourceCode: SourceCode,
): boolean;
/**
 * Checks whether or not the tokens of two given nodes are same.
 */
export function equalNodeTokens(
  a: TSESTree.Node,
  b: TSESTree.Node,
  c: TSESTree.Node | SourceCode,
  d?: SourceCode,
): boolean {
  const sourceCode = d ?? (c as SourceCode);
  const tokensA = sourceCode.getTokens(a);
  const tokensB = sourceCode.getTokens(b);
  if (!equalTokens(tokensA, tokensB)) return false;
  if (!d) return true;
  return equalTokens(tokensA, sourceCode.getTokens(c as TSESTree.Node));
}

/**
 * Checks whether or not two given tokens are same.
 */
export function equalTokens(
  tokensA: AST.Token[],
  tokensB: AST.Token[],
): boolean {
  if (tokensA.length !== tokensB.length) return false;
  for (const [index, tokenA] of tokensA.entries()) {
    const tokenB = tokensB[index];
    if (tokenA.type !== tokenB.type || tokenA.value !== tokenB.value)
      return false;
  }
  return true;
}

/**
 * Checks whether the given node is a expression with the given static value.
 */
export function isStaticValue<V extends TSESTree.Literal["value"]>(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
  value: V,
): node is TSESTree.Expression {
  const v = getStaticValue(node);
  return v != null && v.value === value;
}

/**
 * Gets the static value of the given node.
 */
function getStaticValue(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
): {
  value: string | number | bigint | boolean | RegExp | null | undefined;
} | null {
  if (node.type === "Literal") return node;
  if (node.type === "UnaryExpression") {
    const v = getStaticValue(node.argument);
    if (v == null) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
    const value: any = v.value;
    if (node.operator === "+") return { value };
    if (node.operator === "-") return { value: -value };
    if (node.operator === "~") return { value: ~value };
    if (node.operator === "!") return { value: !value };
    if (node.operator === "typeof") return { value: typeof value };
    if (node.operator === "void") return { value: undefined };
    if (node.operator === "delete") return { value: true };
    return null;
  }
  if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
    const left = getStaticValue(node.left);
    const right = getStaticValue(node.right);
    if (left == null || right == null) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
    const l: any = left.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignore
    const r: any = right.value;
    if (node.operator === "+") return { value: l + r };
    if (node.operator === "-") return { value: l - r };
    if (node.operator === "*") return { value: l * r };
    if (node.operator === "/") return { value: l / r };
    if (node.operator === "%") return { value: l ** r };
    if (node.operator === "**") return { value: l ** r };
    if (node.operator === "<<") return { value: l << r };
    if (node.operator === ">>") return { value: l >> r };
    if (node.operator === ">>>") return { value: l >>> r };
    if (node.operator === "&") return { value: l & r };
    if (node.operator === "|") return { value: l | r };
    if (node.operator === "^") return { value: l ^ r };
    if (node.operator === "&&") return { value: l && r };
    if (node.operator === "||") return { value: l || r };
    if (node.operator === "??") return { value: l ?? r };
    return null;
  }
  if (node.type === "ConditionalExpression") {
    const test = getStaticValue(node.test);
    if (test)
      return test.value
        ? getStaticValue(node.consequent)
        : getStaticValue(node.alternate);
    return null;
  }
  if (
    node.type === "TSAsExpression" ||
    node.type === "TSTypeAssertion" ||
    node.type === "TSSatisfiesExpression" ||
    node.type === "TSNonNullExpression" ||
    node.type === "TSInstantiationExpression"
  )
    return getStaticValue(node.expression);
  return null;
}
