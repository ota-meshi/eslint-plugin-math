import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToMathCbrt } from "../utils/math";
import { getInfoForTransformingToMathCbrt } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

export default createRule("prefer-math-cbrt", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.cbrt() instead of other cube root calculations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseCbrtInsteadOfExponentiation:
        "Can use 'Math.cbrt({{id}})' instead of '{{id}} ** (1 / 3)'.",
      canUseCbrtInsteadOfMathPow:
        "Can use 'Math.cbrt({{id}})' instead of 'Math.pow({{id}}, 1 / 3)'.",
      replace: "Replace using 'Math.cbrt({{id}})'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.cbrt().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathCbrt(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.cbrt(${sourceCode.getText(transform.argument)})`,
        );
      };

      const data = getMessageData(transform);
      context.report({
        node,
        messageId:
          transform.from === "**"
            ? "canUseCbrtInsteadOfExponentiation"
            : "canUseCbrtInsteadOfMathPow",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathCbrt) {
      const id = getIdText(info.argument, "n");
      return {
        id,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
