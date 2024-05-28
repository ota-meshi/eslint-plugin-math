import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  getInfoForTransformingToNumberIsNaN,
  type TransformingToNumberIsNaN,
} from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-number-is-nan", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.isNaN() instead of other checking ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseIsNaN: "Can use 'Number.isNaN()' instead of {{expression}}.",
      canUseNotIsNaN: "Can use '!Number.isNaN()' instead of {{expression}}.",
      replace: "Replace using 'Number.isNaN()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isNaN().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberIsNaN(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `${transform.not ? "!" : ""}Number.isNaN(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId: !transform.not ? "canUseIsNaN" : "canUseNotIsNaN",
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
    function getMessageExpression(info: TransformingToNumberIsNaN): string {
      switch (info.from) {
        case "global.isNaN":
          return !info.not
            ? "'typeof n === \"number\" && isNaN(n)'"
            : "'typeof n !== \"number\" || !isNaN(n)'";
        case "notEquals":
          return "'n !== n'";
        case "Object.is":
          return "'Object.is(n, NaN)'";
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
