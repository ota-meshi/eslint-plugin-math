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
): node is TSESTree.Identifier {
  if (node.type !== "Identifier" || node.name !== name) return false;
  const variable = findVariable(sourceCode.getScope(node), node);
  if (variable && variable.defs.length > 0) return false; // Not a global
  return true;
}
/**
 * Checks whether the given node is a global object method call.
 */
export function isGlobalObjectMethodCall<N extends keyof typeof globalThis>(
  node: TSESTree.Node,
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
  node: TSESTree.Node,
  name: N,
  property: keyof (typeof globalThis)[N],
  sourceCode: SourceCode,
): node is TSESTree.CallExpression {
  return (
    node.type === "MemberExpression" &&
    isGlobalObject(node.object, name, sourceCode) &&
    getPropertyName(node) === property
  );
}
/**
 * Checks whether the given node is a global method call.
 */
export function isGlobalMethodCall(
  node: TSESTree.Node,
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
 * Checks whether the given node is a Literal with the given value.
 */
export function isLiteral<V extends TSESTree.Literal["value"]>(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
  value: V,
): node is TSESTree.Literal & { value: V } {
  return node.type === "Literal" && node.value === value;
}
