import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToMathSqrt } from "../utils/math";
import { getInfoForTransformingToMathSqrt } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

export default createRule("prefer-math-sqrt", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.sqrt() instead of other square root calculations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseSqrtInsteadOfExponentiation:
        "Can use 'Math.sqrt({{id}})' instead of '{{id}} ** {{exponent}}'.",
      canUseSqrtInsteadOfMathPow:
        "Can use 'Math.sqrt({{id}})' instead of 'Math.pow({{id}}, {{exponent}})'.",
      replace: "Replace using 'Math.sqrt()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.sqrt().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathSqrt(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.sqrt(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId:
          transform.from === "**"
            ? "canUseSqrtInsteadOfExponentiation"
            : "canUseSqrtInsteadOfMathPow",
        data: getMessageData(transform),
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathSqrt) {
      return {
        id: getIdText(info.argument, "n"),
        exponent:
          info.exponentMeta.type === "Literal"
            ? info.exponentMeta.raw
            : info.from === "**"
              ? "(1 / 2)"
              : "1 / 2",
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
