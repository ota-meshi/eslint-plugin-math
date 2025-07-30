import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  equalNodeTokens,
  getStaticValue,
  isGlobalObjectMethodCall,
} from "./ast";

export type OperatorInfo<O extends TSESTree.BinaryExpression["operator"]> = {
  operator: O;
  left: TSESTree.Expression;
  right: TSESTree.Expression | number;
};

export type TransformingToExponentiation =
  | (OperatorInfo<"**"> & {
      from: "pow";
      node: TSESTree.CallExpression;
      right: TSESTree.Expression;
    })
  | (OperatorInfo<"**"> & {
      from: "*";
      node: TSESTree.BinaryExpression;
      right: number;
    })
  | (OperatorInfo<"**"> & {
      from: "nesting**";
      node: TSESTree.BinaryExpression;
      right: number;
    });
/**
 * Returns information if the given expression can be transformed to `x ** y`.
 */
export function getInfoForTransformingToExponentiation(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToExponentiation {
  if (node.type === "BinaryExpression") {
    if (node.operator === "*") {
      for (const exponentiation of parseExponentiation(node, sourceCode)) {
        return {
          from: "*",
          operator: "**",
          left: exponentiation.left,
          right: exponentiation.right,
          node,
        };
      }
    } else if (node.operator === "**") {
      const right = getStaticValue(node.right, sourceCode);
      if (typeof right?.value !== "number") return null;
      for (const exponentiation of parseExponentiation(node, sourceCode)) {
        if (exponentiation.right !== right.value) {
          return {
            from: "nesting**",
            operator: "**",
            left: exponentiation.left,
            right: exponentiation.right,
            node,
          };
        }
      }
    }
    return null;
  }
  if (isGlobalObjectMethodCall(node, "Math", "pow", sourceCode)) {
    if (node.arguments.length < 2) return null;
    const [argument, exponent] = node.arguments;
    if (argument.type === "SpreadElement" || exponent.type === "SpreadElement")
      return null;
    // Math.pow(x, y)
    return {
      from: "pow",
      operator: "**",
      left: argument,
      right: exponent,
      node,
    };
  }
  return null;
}

export type ExponentiationOrLike =
  | (OperatorInfo<"**"> & {
      from: "**";
      right: TSESTree.Expression;
    })
  | TransformingToExponentiation;
/**
 * Returns information if the given expression is `x ** y` or like.
 */
export function getInfoForExponentiationOrLike(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): ExponentiationOrLike | null {
  if (node.type === "BinaryExpression" && node.operator === "**") {
    return {
      from: "**",
      operator: "**",
      left: node.left as TSESTree.Expression,
      right: node.right,
    };
  }
  return getInfoForTransformingToExponentiation(node, sourceCode);
}

type Exponentiation = {
  left: TSESTree.Expression;
  right: number;
};

/**
 * Parses the given expression and iterates over the unified exponentiation information.
 */
function* parseExponentiation(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): Iterable<Exponentiation> {
  if (node.type !== "BinaryExpression") return;

  const cached = new Map<TSESTree.Expression, Exponentiation[]>();
  const iterateWithCache = function* (op: TSESTree.Expression) {
    let cache = cached.get(op);
    if (cache) {
      yield* cache;
      return;
    }
    cache = [];
    cached.set(op, cache);
    for (const operands of parseExponentiation(op, sourceCode)) {
      cache.push(operands);
      yield operands;
    }
  };

  if (node.operator === "**") {
    const right = getStaticValue(node.right, sourceCode);
    if (typeof right?.value === "number") {
      for (const leftOperand of iterateWithCache(
        node.left as TSESTree.Expression,
      )) {
        yield {
          left: leftOperand.left,
          right: leftOperand.right * right.value,
        };
      }
      yield {
        left: node.left as TSESTree.Expression,
        right: right.value,
      };
    }
    return;
  }
  if (node.operator === "*") {
    const { right } = node;
    const left = node.left as TSESTree.Expression;

    for (const leftOperand of iterateWithCache(left)) {
      for (const rightOperand of iterateWithCache(right)) {
        if (equalNodeTokens(leftOperand.left, rightOperand.left, sourceCode)) {
          // (a * a) * (a * a)
          yield {
            left: leftOperand.left,
            right: rightOperand.right + rightOperand.right,
          };
        }
      }
    }
    for (const leftOperand of iterateWithCache(left)) {
      if (equalNodeTokens(leftOperand.left, right, sourceCode)) {
        // (a * a) * a
        yield {
          left: leftOperand.left,
          right: leftOperand.right + 1,
        };
      }
    }
    for (const rightOperand of iterateWithCache(right)) {
      if (equalNodeTokens(left, rightOperand.left, sourceCode)) {
        // a * (a * a)
        yield {
          left,
          right: 1 + rightOperand.right,
        };
      }
    }
    if (equalNodeTokens(left, right, sourceCode)) {
      // a * a
      yield {
        left,
        right: 2,
      };
    }
  }
}
