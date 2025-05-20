import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { isGlobalObjectProperty, isStaticValue } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-number-min-value", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.MIN_VALUE instead of literal number",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: false,
    schema: [],
    messages: {
      canUseNumberMinValue:
        "Can use 'Number.MIN_VALUE' instead of '{{expression}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.MIN_VALUE.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (
        isStaticValue(node, Number.MIN_VALUE, sourceCode) &&
        !isGlobalObjectProperty(node, "Number", "MIN_VALUE", sourceCode)
      ) {
        const fix = (fixer: Rule.RuleFixer) => {
          return fixer.replaceText(node, `Number.MIN_VALUE`);
        };

        context.report({
          node,
          messageId: "canUseNumberMinValue",
          data: {
            expression: `${Number.MIN_VALUE}`,
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
