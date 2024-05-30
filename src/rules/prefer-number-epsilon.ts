import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToNumberEPSILON } from "../utils/number";
import { getInfoForTransformingToNumberEPSILON } from "../utils/number";

export default createRule("prefer-number-epsilon", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.EPSILON instead of literal number",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: false,
    schema: [],
    messages: {
      canUseNumberEPSILON:
        "Can use 'Number.EPSILON' instead of '{{expression}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.EPSILON.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberEPSILON(node, sourceCode);
      if (!transform) return;

      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(node, `Number.EPSILON`);
      };

      context.report({
        node,
        messageId: "canUseNumberEPSILON",
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
    function getMessageExpression(info: TransformingToNumberEPSILON): string {
      switch (info.from) {
        case "exponentiation":
          return "2 ** -52";
        case "pow":
          return "Math.pow(2, -52)";
        case "literal":
          return `${Number.EPSILON}`;
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
