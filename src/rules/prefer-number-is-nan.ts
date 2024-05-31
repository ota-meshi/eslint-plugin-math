import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  getInfoForTransformingToNumberIsNaN,
  type TransformingToNumberIsNaN,
} from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

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
      canUseIsNaN: "Can use 'Number.isNaN({{id}})' instead of {{expression}}.",
      canUseNotIsNaN:
        "Can use '!Number.isNaN({{id}})' instead of {{expression}}.",
      replace: "Replace using 'Number.isNaN({{id}})'.",
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

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: !transform.not ? "canUseIsNaN" : "canUseNotIsNaN",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToNumberIsNaN) {
      const id = getIdText(info.argument, "n");
      let expression = "";
      switch (info.from) {
        case "global.isNaN":
          expression = !info.not
            ? `'typeof ${id} === "number" && isNaN(${id})'`
            : `'typeof ${id} !== "number" || !isNaN(${id})'`;
          break;
        case "notEquals":
          expression = `'${id} !== ${id}'`;
          break;
        case "Object.is":
          expression = `'Object.is(${id}, NaN)'`;
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
