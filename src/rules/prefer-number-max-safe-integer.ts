import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { isMaxSafeInteger } from "../utils/number";
import { existComment, isGlobalObjectProperty } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-number-max-safe-integer", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.MAX_SAFE_INTEGER instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMaxSafeInteger: "Can use 'Number.MAX_SAFE_INTEGER'.",
      replace: "Replace using 'Number.MAX_SAFE_INTEGER'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.MAX_SAFE_INTEGER.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (
        isGlobalObjectProperty(node, "Number", "MAX_SAFE_INTEGER", sourceCode)
      )
        return;
      if (!isMaxSafeInteger(node, sourceCode)) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(node, `Number.MAX_SAFE_INTEGER`);
      };

      context.report({
        node,
        messageId: "canUseMaxSafeInteger",
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
