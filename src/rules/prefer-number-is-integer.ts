import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { getInfoForTransformingToNumberIsInteger } from "../utils/number";
import type { Rule } from "eslint";

export default createRule("prefer-number-is-integer", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.isInteger() instead of other checking ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseIsInteger:
        "Can use 'Number.isInteger()' instead of {{expression}}.",
      canUseNotIsInteger:
        "Can use '!Number.isInteger()' instead of {{expression}}.",
      replace: "Replace using 'Number.isInteger()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isInteger().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberIsInteger(
        node,
        sourceCode,
      );
      if (!transform) return;
      const hasComment = sourceCode.commentsExistBetween(
        sourceCode.getFirstToken(node),
        sourceCode.getLastToken(node),
      );

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,

          `${transform.method !== "!isInteger" ? "" : "!"}Number.isInteger(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId:
          transform.method !== "!isInteger"
            ? "canUseIsInteger"
            : "canUseNotIsInteger",
        data: {
          expression:
            transform.from === "trunc"
              ? transform.method !== "!isInteger"
                ? "'Math.trunc(n) === n'"
                : "'Math.trunc(n) !== n'"
              : transform.from === "floor"
                ? transform.method !== "!isInteger"
                  ? "'Math.floor(n) === n'"
                  : "'Math.floor(n) !== n'"
                : transform.from === "ceil"
                  ? transform.method !== "!isInteger"
                    ? "'Math.ceil(n) === n'"
                    : "'Math.ceil(n) !== n'"
                  : transform.method !== "!isInteger"
                    ? "'Math.trunc(n) === n' like expression"
                    : "'Math.trunc(n) !== n' like expression",
        },
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
