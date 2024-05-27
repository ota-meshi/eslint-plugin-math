import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  getInfoForTransformingToNumberIsSafeInteger,
  type TransformingToNumberIsSafeInteger,
} from "../utils/number";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

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
        "Can use 'Number.isSafeInteger()' instead of {{expression}}.",
      canUseNotIsSafeInteger:
        "Can use '!Number.isSafeInteger()' instead of {{expression}}.",
      replace: "Replace using 'Number.isSafeInteger()'.",
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

      context.report({
        node,
        messageId: !transform.not
          ? "canUseIsSafeInteger"
          : "canUseNotIsSafeInteger",
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
    function getMessageExpression(
      info: TransformingToNumberIsSafeInteger,
    ): string {
      const suffix = !info.not
        ? " && Math.abs(n) <= Number.MAX_SAFE_INTEGER"
        : " || Math.abs(n) > Number.MAX_SAFE_INTEGER";
      switch (info.from) {
        case "isInteger":
          return `'${!info.not ? "Number.isInteger(n)" : "!Number.isInteger(n)"}${suffix}'`;
        case "isIntegerLike":
          return `'${
            !info.not ? "Number.isInteger(n)" : "!Number.isInteger(n)"
          }${suffix}' like expression`;
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
