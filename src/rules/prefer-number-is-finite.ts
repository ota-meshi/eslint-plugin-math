import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToNumberIsFinite } from "../utils/number";
import { getInfoForTransformingToNumberIsFinite } from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-number-is-finite", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.isFinite() instead of other checking ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseIsFinite: "Can use 'Number.isFinite()' instead of {{expression}}.",
      canUseNotIsFinite:
        "Can use '!Number.isFinite()' instead of {{expression}}.",
      replace: "Replace using 'Number.isFinite()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isFinite().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberIsFinite(
        node,
        sourceCode,
      );
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `${transform.not ? "!" : ""}Number.isFinite(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId: !transform.not ? "canUseIsFinite" : "canUseNotIsFinite",
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
    function getMessageExpression(info: TransformingToNumberIsFinite): string {
      switch (info.from) {
        case "global.isFinite":
          return !info.not
            ? "'typeof n === \"number\" && isFinite(n)'"
            : "'typeof n !== \"number\" || !isFinite(n)'";
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
