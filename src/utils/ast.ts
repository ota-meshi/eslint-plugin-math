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
export function isGlobalObject<G extends keyof typeof globalThis>(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: G,
  sourceCode: SourceCode,
): node is TSESTree.Identifier | TSESTree.MemberExpression {
  if (node.type === "Identifier") {
    if (node.name !== name) return false;
    return isGlobal(node, sourceCode);
  }
  if (
    node.type === "MemberExpression" &&
    isGlobalNamespace(node.object, sourceCode)
  ) {
    return getPropertyName(node, sourceCode.getScope(node)) === name;
  }
  return false;
}
/**
 * Checks whether the given node is a global object method call.
 */
export function isGlobalObjectMethodCall<
  G extends keyof typeof globalThis,
  N extends ExtractFunctionKeys<G>,
>(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: G,
  method: N,
  sourceCode: SourceCode,
): node is TSESTree.CallExpression {
  if (node.type !== "CallExpression") return false;
  const { callee } = node;
  return isGlobalObjectProperty<G, N>(callee, name, method, sourceCode);
}
/**
 * Checks whether the given node is a global object property.
 */
export function isGlobalObjectProperty<
  G extends keyof typeof globalThis,
  N extends keyof (typeof globalThis)[G],
>(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  name: G,
  property: N,
  sourceCode: SourceCode,
): node is TSESTree.MemberExpression {
  return (
    node.type === "MemberExpression" &&
    getPropertyName(node, sourceCode.getScope(node)) === property &&
    isGlobalObject<G>(node.object, name, sourceCode)
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
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  const v = getStaticValue(node, sourceCode);
  return v != null && (Object.is(v.value, value) || v.value === value);
}

/**
 * Gets the static value of the given node.
 */
export function getStaticValue(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): {
  value: string | number | bigint | boolean | RegExp | null | undefined;
} | null {
  try {
    if (node.type === "Literal") return node;
    if (node.type === "UnaryExpression") {
      const v = getStaticValue(node.argument, sourceCode);
      if (v == null) return null;
      const value = v.value;
      if (node.operator === "+") return { value };
      if (node.operator === "-") return { value: -value! };
      if (node.operator === "~") return { value: ~value! };
      if (node.operator === "!") return { value: !value };
      if (node.operator === "typeof") return { value: typeof value };
      if (node.operator === "void") return { value: undefined };
      if (node.operator === "delete") return { value: true };
      return null;
    }
    if (node.type === "BinaryExpression" || node.type === "LogicalExpression") {
      const left = getStaticValue(node.left, sourceCode);
      const right = getStaticValue(node.right, sourceCode);
      if (left == null || right == null) return null;
      const l = left.value as never;
      const r = right.value as never;
      /* eslint-disable @typescript-eslint/restrict-plus-operands -- Ignore */
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
      /* eslint-enable @typescript-eslint/restrict-plus-operands -- Ignore */
      if (node.operator === "&&") return { value: l && r };
      if (node.operator === "||") return { value: l || r };
      if (node.operator === "??") return { value: l ?? r };
      return null;
    }
    if (node.type === "ConditionalExpression") {
      const test = getStaticValue(node.test, sourceCode);
      if (test)
        return test.value
          ? getStaticValue(node.consequent, sourceCode)
          : getStaticValue(node.alternate, sourceCode);
      return null;
    }
    if (
      node.type === "TSAsExpression" ||
      node.type === "TSTypeAssertion" ||
      node.type === "TSSatisfiesExpression" ||
      node.type === "TSNonNullExpression" ||
      node.type === "TSInstantiationExpression"
    )
      return getStaticValue(node.expression, sourceCode);
    if (node.type === "Identifier") {
      if (!isGlobal(node, sourceCode)) return null;
      return getGlobal(node.name);
    }
    if (node.type === "MemberExpression") {
      const name = getPropertyName(node, sourceCode.getScope(node));
      if (name == null) return null;
      if (isGlobalNamespace(node.object, sourceCode)) {
        return getGlobal(name);
      }
      if (isGlobalObject(node.object, "Number", sourceCode)) {
        const value = Number[name as unknown as keyof typeof Number];
        return typeof value === "number" ? { value } : null;
      }
      if (isGlobalObject(node.object, "Math", sourceCode)) {
        const value = Math[name as unknown as keyof typeof Math];
        return typeof value === "number" ? { value } : null;
      }
    }
  } catch {
    // ignore
  }
  return null;

  /**
   * Get the global value.
   */
  function getGlobal(name: string) {
    if (name === "undefined") return { value: undefined };
    if (name === "Infinity") return { value: Infinity };
    if (name === "NaN") return { value: NaN };
    return null;
  }
}

/**
 * Checks whether the given node is a global variable.
 */
function isGlobal(
  node: TSESTree.Identifier,
  sourceCode: SourceCode,
): node is TSESTree.Identifier {
  const variable = findVariable(sourceCode.getScope(node), node);
  if (variable && variable.defs.length > 0) return false; // Not a global
  return true;
}

/**
 * Checks whether the given node is a global namespace.
 */
function isGlobalNamespace(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Identifier | TSESTree.MemberExpression {
  if (node.type === "Identifier") {
    if (
      node.name === "globalThis" ||
      node.name === "self" ||
      node.name === "window" ||
      node.name === "global"
    )
      return isGlobal(node, sourceCode);
    return false;
  }
  if (node.type === "MemberExpression") {
    const name = getPropertyName(node, sourceCode.getScope(node));
    if (name == null) return false;
    return isGlobalNamespace(node.object, sourceCode);
  }
  return false;
}
