import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToMathLog10 } from "../utils/math";
import { getInfoForTransformingToMathLog10 } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-math-log10", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.log10() instead of other calculation methods.",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseLog10: "Can use 'Math.log10(n)' instead of '{{expression}}'.",
      replace: "Replace using 'Math.log10()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isFinite().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLog10(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.log10(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId: "canUseLog10",
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
    function getMessageExpression(info: TransformingToMathLog10): string {
      switch (info.from) {
        case "logWithLOG10E":
          return `Math.log(n) * Math.LOG10E`;
        case "logWithLN10":
          return `Math.log(n) / Math.LN10`;
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
