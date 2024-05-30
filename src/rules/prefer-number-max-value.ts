import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { isGlobalObjectProperty, isStaticValue } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-number-max-value", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.MAX_VALUE instead of literal number",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: false,
    schema: [],
    messages: {
      canUseNumberMaxValue:
        "Can use 'Number.MAX_VALUE' instead of '{{expression}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.PI.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (
        isStaticValue(node, Number.MAX_VALUE, sourceCode) &&
        !isGlobalObjectProperty(node, "Number", "MAX_VALUE", sourceCode)
      ) {
        const fix = (fixer: Rule.RuleFixer) => {
          return fixer.replaceText(node, `Number.MAX_VALUE`);
        };

        context.report({
          node,
          messageId: "canUseNumberMaxValue",
          data: {
            expression: `${Number.MAX_VALUE}`,
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
