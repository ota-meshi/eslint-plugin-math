import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathHypot } from "../utils/math";
import { getInfoForTransformingToMathHypot } from "../utils/math";

export default createRule("prefer-math-hypot", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.hypot() instead of other hypotenuse calculations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathHypot:
        "Can use 'Math.hypot(a, b)' instead of '{{expression}}'.",
      replace: "Replace using 'Math.hypot()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.hypot().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathHypot(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.hypot(${transform.arguments
            .map((argument) => sourceCode.getText(argument))
            .join(", ")})`,
        );
      };

      context.report({
        node,
        messageId: "canUseMathHypot",
        data: {
          expression: getMessageExpression(transform),
        },
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
      });
    }

    /**
     * Get the expression text in the message for the given information.
     */
    function getMessageExpression(info: TransformingToMathHypot): string {
      switch (info.from) {
        case "sqrt":
          return "Math.sqrt(a ** 2 + b ** 2)";
        case "exponentiation":
          return "(a ** 2 + b ** 2) ** (1 / 2)";
        case "pow":
          return "Math.pow(a ** 2 + b ** 2, 1 / 2)";
      }
      return "";
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
