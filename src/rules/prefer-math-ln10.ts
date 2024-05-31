import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathLN10 } from "../utils/math";
import { getInfoForTransformingToMathLN10 } from "../utils/math";
import { getIdText } from "../utils/messages";

export default createRule("prefer-math-ln10", {
  meta: {
    docs: {
      description: "enforce the use of Math.LN10 instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathLN10: "Can use 'Math.LN10' instead of '{{expression}}'.",
      replace: "Replace using 'Math.LN10'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.LN10.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLN10(node, sourceCode);
      if (!transform) return;

      const hasComment = existComment(node, sourceCode);

      const fix = !transform.inverse
        ? (fixer: Rule.RuleFixer) => {
            return fixer.replaceText(node, `Math.LN10`);
          }
        : function* (fixer: Rule.RuleFixer) {
            const operator = sourceCode.getTokenBefore(transform.node)!;
            yield fixer.replaceText(operator, `*`);
            yield fixer.replaceText(transform.node, `Math.LN10`);
          };

      context.report({
        node,
        messageId: "canUseMathLN10",
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
    function getMessageExpression(info: TransformingToMathLN10): string {
      switch (info.from) {
        case "log":
          return "Math.log(10)";
        case "literal":
          return `${Math.LN10}`;
        case "LOG10E":
          return !info.inverse
            ? "1 / Math.LOG10E"
            : `${getIdText(info.parent.left, "x")} / Math.LOG10E`;
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
