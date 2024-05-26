import type { TSESTree } from "@typescript-eslint/types";
import type { AST, SourceCode } from "eslint";

/**
 * Checks whether or not the tokens of two given nodes are same.
 */
export function equalNodeTokens(
  a: TSESTree.Node,
  b: TSESTree.Node,
  sourceCode: SourceCode,
): boolean {
  const tokensA = sourceCode.getTokens(a);
  const tokensB = sourceCode.getTokens(b);
  return equalTokens(tokensA, tokensB);
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
