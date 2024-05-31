import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  equalNodeTokens,
  getStaticValue,
  isGlobalObjectMethodCall,
} from "./ast";

export type OperatorInfo<O extends TSESTree.BinaryExpression["operator"]> = {
  operator: O;
  left: TSESTree.Expression | TSESTree.PrivateIdentifier;
  right: TSESTree.Expression | number;
};

export type TransformingToExponentiation =
  | (OperatorInfo<"**"> & {
      from: "pow";
      node: TSESTree.CallExpression;
      right: TSESTree.Expression;
    })
  | (OperatorInfo<"**"> & {
      from: "multiplication";
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
      const exponentiation = parseMultiplication(node, sourceCode);
      if (exponentiation) {
        return {
          from: "multiplication",
          operator: "**",
          left: exponentiation.left,
          right: exponentiation.right,
          node,
        };
      }
    }
    return null;
  }
  if (isGlobalObjectMethodCall(node, "Math", "pow", sourceCode)) {
    if (node.arguments.length < 2) return null;
    const [argument, exponent] = node.arguments;
    if (argument.type === "SpreadElement" || exponent.type === "SpreadElement")
      return null;
    // Math.pow(n, 1/3)
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

type Exponentiation = {
  left: TSESTree.Expression | TSESTree.PrivateIdentifier;
  right: number;
};

/**
 * Parse the given multiplication expression to the exponentiation info.
 */
function parseMultiplication(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): Exponentiation | null {
  if (node.type !== "BinaryExpression" || node.operator !== "*") return null;
  for (const operands of parseMultiplicationInternal(node)) {
    return operands;
  }
  return null;

  /** Internal iterate function. */
  function* parseMultiplicationInternal(
    operand: TSESTree.Expression | TSESTree.PrivateIdentifier,
  ): Iterable<Exponentiation> {
    if (operand.type !== "BinaryExpression") return;

    if (operand.operator === "*") {
      const { left, right } = operand;
      const leftOperandsList = [...parseMultiplicationInternal(left)];
      const rightOperandsList = [...parseMultiplicationInternal(right)];

      for (const leftOperands of leftOperandsList) {
        for (const rightOperands of rightOperandsList) {
          if (
            equalNodeTokens(leftOperands.left, rightOperands.left, sourceCode)
          ) {
            // (a * a) * (a * a)
            yield {
              left: leftOperands.left,
              right: leftOperands.right + rightOperands.right,
            };
          }
        }
      }
      for (const leftOperands of leftOperandsList) {
        if (equalNodeTokens(leftOperands.left, right, sourceCode)) {
          // (a * a) * a
          yield {
            left: leftOperands.left,
            right: leftOperands.right + 1,
          };
        }
      }
      for (const rightOperands of rightOperandsList) {
        if (equalNodeTokens(left, rightOperands.left, sourceCode)) {
          // a * (a * a)
          yield {
            left,
            right: 1 + rightOperands.right,
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
    } else if (operand.operator === "**") {
      const right = getStaticValue(operand.right, sourceCode);
      if (typeof right?.value === "number") {
        yield {
          left: operand.left,
          right: right.value,
        };
      }
    }
  }
}
