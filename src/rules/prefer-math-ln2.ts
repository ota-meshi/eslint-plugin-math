import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathLN2 } from "../utils/math";
import { getInfoForTransformingToMathLN2 } from "../utils/math";
import { getIdText } from "../utils/messages";

export default createRule("prefer-math-ln2", {
  meta: {
    docs: {
      description: "enforce the use of Math.LN2 instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathLN2: "Can use 'Math.LN2' instead of '{{expression}}'.",
      replace: "Replace using 'Math.LN2'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.LN2.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLN2(node, sourceCode);
      if (!transform) return;

      const hasComment = existComment(node, sourceCode);

      const fix = !transform.inverse
        ? (fixer: Rule.RuleFixer) => {
            return fixer.replaceText(node, `Math.LN2`);
          }
        : function* (fixer: Rule.RuleFixer) {
            const operator = sourceCode.getTokenBefore(transform.node)!;
            yield fixer.replaceText(operator, `*`);
            yield fixer.replaceText(transform.node, `Math.LN2`);
          };

      context.report({
        node,
        messageId: "canUseMathLN2",
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
    function getMessageExpression(info: TransformingToMathLN2): string {
      switch (info.from) {
        case "log":
          return "Math.log(2)";
        case "literal":
          return `${Math.LN2}`;
        case "LOG2E":
          return !info.inverse
            ? "1 / Math.LOG2E"
            : `${getIdText(info.parent.left, "x")} / Math.LOG2E`;
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
