import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getInfoForTransformingToMathSQRT2 } from "../utils/math";

export default createRule("prefer-math-sqrt2", {
  meta: {
    docs: {
      description: "enforce the use of Math.SQRT2 instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathSqrt2: "Can use 'Math.SQRT2' instead of '{{expression}}'.",
      replace: "Replace using 'Math.SQRT2'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.SQRT2.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      let expression: string;
      const transform = getInfoForTransformingToMathSQRT2(node, sourceCode);
      if (!transform) return;
      if (transform.from === "2**1/2") {
        expression = "2 ** (1 / 2)";
      } else if (transform.from === "pow(2,1/2)") {
        expression = "Math.pow(2, 1 / 2)";
      } else if (transform.from === "sqrt(2)") {
        expression = "Math.sqrt(2)";
      } else {
        expression = `${Math.SQRT2}`;
      }
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(node, `Math.SQRT2`);
      };

      context.report({
        node,
        messageId: "canUseMathSqrt2",
        data: { expression },
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
