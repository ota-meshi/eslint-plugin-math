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

export const enum Associativity {
  leftToRight,
  rightToLeft,
  na,
}
export const enum Precedence {
  comma = 1,
  assignmentAndMiscellaneous = 2,
  logicalORAndNullishCoalescing = 3,
  logicalAND = 4,
  bitwiseOR = 5,
  bitwiseXOR = 6,
  bitwiseAND = 7,
  equalityOperators = 8,
  relationalOperators = 9,
  bitwiseShift = 10,
  additiveOperators = 11,
  multiplicativeOperators = 12,
  exponentiation = 13,
  prefixOperators = 14,
  postfixOperators = 15,
  new = 16,
  accessAndCall = 17,
  unknown = 20,
}

/**
 * Get the precedence level from the given node.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
 */
export function getPrecedence(
  node: TSESTree.Node,
  sourceCode: SourceCode,
): { precedence: Precedence; associativity: Associativity } {
  // 18: grouping
  // if (isParenthesized(node, sourceCode)) return{precedence:18, associativity: Associativity.na];

  switch (node.type) {
    // 1: comma
    case "SequenceExpression":
      return {
        precedence: Precedence.comma,
        associativity: Associativity.leftToRight,
      };
    // 2: assignment and miscellaneous
    case "AssignmentExpression":
    case "ArrowFunctionExpression":
    case "ConditionalExpression":
      return {
        precedence: Precedence.assignmentAndMiscellaneous,
        associativity: Associativity.rightToLeft,
      };
    case "YieldExpression":
      return {
        precedence: Precedence.assignmentAndMiscellaneous,
        associativity: Associativity.na,
      };
    // 3: logical OR, nullish coalescing
    case "LogicalExpression":
      switch (node.operator) {
        case "||":
        case "??":
          return {
            precedence: Precedence.logicalORAndNullishCoalescing,
            associativity: Associativity.leftToRight,
          };
        // 4: logical AND
        case "&&":
          return {
            precedence: Precedence.logicalAND,
            associativity: Associativity.leftToRight,
          };
      }
      break;
    case "BinaryExpression":
      switch (node.operator) {
        // 3: logical OR, nullish coalescing
        case "||":
          return {
            precedence: Precedence.logicalORAndNullishCoalescing,
            associativity: Associativity.leftToRight,
          };
        // 4: logical AND
        case "&&":
          return {
            precedence: Precedence.logicalAND,
            associativity: Associativity.leftToRight,
          };
        // 5: bitwise OR
        case "|":
          return {
            precedence: Precedence.bitwiseOR,
            associativity: Associativity.leftToRight,
          };
        // 6: bitwise XOR
        case "^":
          return {
            precedence: Precedence.bitwiseXOR,
            associativity: Associativity.leftToRight,
          };
        // 7: bitwise AND
        case "&":
          return {
            precedence: Precedence.bitwiseAND,
            associativity: Associativity.leftToRight,
          };
        // 8: equality operators
        case "==":
        case "!=":
        case "===":
        case "!==":
          return {
            precedence: Precedence.equalityOperators,
            associativity: Associativity.leftToRight,
          };
        // 9: relational operators
        case "<":
        case "<=":
        case ">":
        case ">=":
        case "in":
        case "instanceof":
          return {
            precedence: Precedence.relationalOperators,
            associativity: Associativity.leftToRight,
          };
        // 10: bitwise shift
        case "<<":
        case ">>":
        case ">>>":
          return {
            precedence: Precedence.bitwiseShift,
            associativity: Associativity.leftToRight,
          };
        // 11: additive operators
        case "+":
        case "-":
          return {
            precedence: Precedence.additiveOperators,
            associativity: Associativity.leftToRight,
          };
        // 12: multiplicative operators
        case "*":
        case "/":
        case "%":
          return {
            precedence: Precedence.multiplicativeOperators,
            associativity: Associativity.leftToRight,
          };
        // 13: exponentiation
        case "**":
          return {
            precedence: Precedence.exponentiation,
            associativity: Associativity.rightToLeft,
          };
      }
      break;
    // 14: prefix operators
    case "UnaryExpression":
    case "AwaitExpression":
      return {
        precedence: Precedence.prefixOperators,
        associativity: Associativity.na,
      };
    case "UpdateExpression":
      if (node.prefix) {
        return {
          precedence: Precedence.prefixOperators,
          associativity: Associativity.na,
        };
      }
      // 15: postfix operators
      return {
        precedence: Precedence.postfixOperators,
        associativity: Associativity.na,
      };

    case "NewExpression":
      if (sourceCode.getTokenAfter(node)?.value !== "(") {
        // 16: new (`new` without argument list `new x`)
        return { precedence: Precedence.new, associativity: Associativity.na };
      }
      // 17: access and call
      return {
        precedence: Precedence.accessAndCall,
        associativity: Associativity.na,
      };
    // 17: access and call
    case "CallExpression":
    case "ImportExpression":
      return {
        precedence: Precedence.accessAndCall,
        associativity: Associativity.na,
      };
    case "ChainExpression":
      return {
        precedence: Precedence.accessAndCall,
        associativity: Associativity.leftToRight,
      };
    case "MemberExpression":
      if (node.computed) {
        return {
          precedence: Precedence.accessAndCall,
          associativity: Associativity.leftToRight,
        };
      }
      return {
        precedence: Precedence.accessAndCall,
        associativity: Associativity.na,
      };
    default:
  }
  // Unknown
  return { precedence: Precedence.unknown, associativity: Associativity.na };
}

/**
 * Checks whether the given node is wrapped in parentheses or commas.
 */
export function isWrappedInParenOrComma(
  node: TSESTree.Node,
  sourceCode: SourceCode,
): boolean {
  const beforeToken = sourceCode.getTokenBefore(node);
  const afterToken = sourceCode.getTokenAfter(node);
  return Boolean(
    beforeToken &&
      afterToken &&
      (beforeToken.value === "(" ||
        beforeToken.value === "[" ||
        beforeToken.value === ",") &&
      (afterToken.value === ")" ||
        afterToken.value === "]" ||
        afterToken.value === ","),
  );
}
