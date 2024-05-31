import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToNumberIsFinite } from "../utils/number";
import { getInfoForTransformingToNumberIsFinite } from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

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
      canUseIsFinite:
        "Can use 'Number.isFinite({{id}})' instead of {{expression}}.",
      canUseNotIsFinite:
        "Can use '!Number.isFinite({{id}})' instead of {{expression}}.",
      replace: "Replace using 'Number.isFinite({{id}})'.",
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

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: !transform.not ? "canUseIsFinite" : "canUseNotIsFinite",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToNumberIsFinite) {
      const id = getIdText(info.argument, "n");
      let expression = "";
      switch (info.from) {
        case "global.isFinite":
          expression = !info.not
            ? `'typeof ${id} === "number" && isFinite(${id})'`
            : `'typeof ${id} !== "number" || !isFinite(${id})'`;
          break;
      }
      return {
        id,
        expression,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
