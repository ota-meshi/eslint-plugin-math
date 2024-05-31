import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  getInfoForTransformingToNumberIsSafeInteger,
  type TransformingToNumberIsSafeInteger,
} from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

export default createRule("prefer-number-is-safe-integer", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.isSafeInteger() instead of other checking ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseIsSafeInteger:
        "Can use 'Number.isSafeInteger({{id}})' instead of {{expression}}.",
      canUseNotIsSafeInteger:
        "Can use '!Number.isSafeInteger({{id}})' instead of {{expression}}.",
      replace: "Replace using 'Number.isSafeInteger({{id}})'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isSafeInteger().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberIsSafeInteger(
        node,
        sourceCode,
      );
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `${transform.not ? "!" : ""}Number.isSafeInteger(${sourceCode.getText(transform.argument)})`,
        );
      };

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: !transform.not
          ? "canUseIsSafeInteger"
          : "canUseNotIsSafeInteger",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToNumberIsSafeInteger) {
      const id = getIdText(info.argument, "n");
      const suffix = !info.not
        ? ` && Math.abs(${id}) <= Number.MAX_SAFE_INTEGER`
        : ` || Math.abs(${id}) > Number.MAX_SAFE_INTEGER`;
      let expression = `'${info.not ? "!" : ""}Number.isInteger(${id})${suffix}'`;
      switch (info.from) {
        case "isInteger":
          break;
        case "isIntegerLike":
          expression += ` like expression`;
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
