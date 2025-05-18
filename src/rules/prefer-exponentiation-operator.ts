import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToExponentiation } from "../utils/operator";
import { getInfoForTransformingToExponentiation } from "../utils/operator";
import {
  Precedence,
  existComment,
  getPrecedence,
  isWrappedInParenOrComma,
} from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

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
      canUseExponentiationInsteadOfExpression:
        "Can use '{{id}} ** {{exponent}}' instead of '{{expression}}'.",
      canUseExponentiationInsteadOfMathPow:
        "Can use '{{id}} ** {{exponent}}' instead of 'Math.pow({{id}}, {{exponent}})'.",
      replace: "Replace using '{{id}} ** {{exponent}}'.",
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

      if (transform.from === "*" || transform.from === "nesting**") {
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
          transform.from === "*" || transform.from === "nesting**"
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
        if (transform.from === "pow") {
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

      const data = getMessageData(transform);
      context.report({
        node,
        messageId:
          transform.from === "*" || transform.from === "nesting**"
            ? "canUseExponentiationInsteadOfExpression"
            : "canUseExponentiationInsteadOfMathPow",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToExponentiation) {
      const id = getIdText(info.left, "n");
      let expression: string, exponent: string;
      if (info.from === "*" || info.from === "nesting**") {
        const exponentNum = info.right;
        expression =
          info.from === "*"
            ? Array<string>(exponentNum).fill(id).join(" * ")
            : `${id} ** ${exponentNum}`;
        exponent = String(exponentNum);
      } else {
        expression = "";
        exponent =
          info.right.type === "Literal"
            ? info.right.raw
            : getIdText(info.right, id !== "x" ? "x" : "y");
      }
      return {
        id,
        exponent,
        expression,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
