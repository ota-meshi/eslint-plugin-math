import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { isLiteral } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-math-pi", {
  meta: {
    docs: {
      description: "enforce the use of Math.PI instead of literal number",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: false,
    schema: [],
    messages: {
      canUseMathPI: "Can use 'Math.PI' instead of '{{expression}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    /**
     * Verify if the given node can be converted to Math.PI.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (isLiteral(node, Math.PI)) {
        const fix = (fixer: Rule.RuleFixer) => {
          return fixer.replaceText(node, `Math.PI`);
        };

        context.report({
          node,
          messageId: "canUseMathPI",
          data: {
            expression: `${Math.PI}`,
          },
          fix,
        });
      }
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
