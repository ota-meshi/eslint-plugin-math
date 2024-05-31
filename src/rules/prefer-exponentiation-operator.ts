import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { getInfoForTransformingToExponentiation } from "../utils/operator";
import {
  Precedence,
  existComment,
  getPrecedence,
  isWrappedInParenOrComma,
} from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-exponentiation-operator", {
  meta: {
    docs: {
      description:
        "enforce the use of exponentiation (`**`) operator instead of other calculations",
      categories: [],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseExponentiationInsteadOfMultiplication:
        "Can use 'n ** {{num}}' instead of '{{expression}}'.",
      canUseExponentiationInsteadOfMathPow:
        "Can use 'n ** x' instead of 'Math.pow(n, x)'.",
      replace: "Replace using 'n ** x'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const reportedBinaryExpressions = new Set<TSESTree.BinaryExpression>();

    /**
     * Verify if the given node can be converted to `a ** b`.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToExponentiation(
        node,
        sourceCode,
      );
      if (!transform) return;

      if (transform.from === "*") {
        reportedBinaryExpressions.add(transform.node);
        const { parent } = transform.node;
        if (
          parent.type === "BinaryExpression" &&
          reportedBinaryExpressions.has(parent)
        ) {
          // Already reported
          return;
        }
      }

      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        let left = sourceCode.getText(transform.left);
        let right =
          transform.from === "*"
            ? String(transform.right)
            : sourceCode.getText(transform.right);
        const leftPrecedence = getPrecedence(transform.left, sourceCode);
        if (
          leftPrecedence.precedence <= Precedence.exponentiation ||
          // The left-hand side cannot have precedence 14.
          leftPrecedence.precedence === Precedence.prefixOperators
        ) {
          left = `(${left})`;
        }
        if (transform.from !== "*") {
          if (
            Precedence.exponentiation >
            getPrecedence(transform.right, sourceCode).precedence
          ) {
            right = `(${right})`;
          }
        }
        let expression = `${left} ** ${right}`;
        if (!isWrappedInParenOrComma(node, sourceCode)) {
          const parent = node.parent;
          if (parent.type === "ClassDeclaration") {
            expression = `(${expression})`;
          } else if (parent.type.endsWith("Expression")) {
            const parentPrecedence = getPrecedence(parent, sourceCode);
            if (parentPrecedence.precedence > Precedence.exponentiation) {
              expression = `(${expression})`;
            } else if (
              parentPrecedence.precedence === Precedence.exponentiation &&
              !(
                parent.type === "BinaryExpression" &&
                parent.operator === "**" &&
                parent.right === node
              )
            ) {
              expression = `(${expression})`;
            }
          }
        }

        return fixer.replaceText(node, expression);
      };

      context.report({
        node,
        messageId:
          transform.from === "*"
            ? "canUseExponentiationInsteadOfMultiplication"
            : "canUseExponentiationInsteadOfMathPow",
        data:
          transform.from === "*"
            ? {
                num: String(transform.right),
                expression: "n".repeat(transform.right).split("").join(" * "),
              }
            : {},
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
      });
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
