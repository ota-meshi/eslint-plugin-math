import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { getInfoForTransformingToMathSqrt } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-math-sqrt", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.sqrt() instead of other square root calculations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseSqrtInsteadOfExponentiation:
        "Can use 'Math.sqrt(n)' instead of 'n ** (1 / 2)'.",
      canUseSqrtInsteadOfMathPow:
        "Can use 'Math.sqrt(n)' instead of 'Math.pow(n, 1 / 2)'.",
      replace: "Replace using 'Math.sqrt()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.sqrt().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathSqrt(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.sqrt(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId:
          transform.from === "exponentiation"
            ? "canUseSqrtInsteadOfExponentiation"
            : "canUseSqrtInsteadOfMathPow",
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
