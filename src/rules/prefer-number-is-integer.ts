import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToNumberIsInteger } from "../utils/number";
import { getInfoForTransformingToNumberIsInteger } from "../utils/number";
import type { Rule } from "eslint";
import { existComment } from "../utils/ast";

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
      const hasComment = existComment(node, sourceCode);

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
          expression: getMessageExpression(transform),
        },
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
      });
    }

    /**
     * Get the expression text in the message for the given information.
     */
    function getMessageExpression(info: TransformingToNumberIsInteger): string {
      switch (info.from) {
        case "trunc":
          return info.method !== "!isInteger"
            ? "'Math.trunc(n) === n'"
            : "'Math.trunc(n) !== n'";
        case "floor":
          return info.method !== "!isInteger"
            ? "'Math.floor(n) === n'"
            : "'Math.floor(n) !== n'";
        case "ceil":
          return info.method !== "!isInteger"
            ? "'Math.ceil(n) === n'"
            : "'Math.ceil(n) !== n'";
        case "truncLike":
          return info.method !== "!isInteger"
            ? "'Math.trunc(n) === n' like expression"
            : "'Math.trunc(n) !== n' like expression";
        case "modulo":
          return info.method !== "!isInteger"
            ? "'n % 1 !== 0'"
            : "'n % 1 === 0'";
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
