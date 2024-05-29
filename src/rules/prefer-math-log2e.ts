import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathLOG2E } from "../utils/math";
import { getInfoForTransformingToMathLOG2E } from "../utils/math";

export default createRule("prefer-math-log2e", {
  meta: {
    docs: {
      description: "enforce the use of Math.LOG2E instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathLOG2E: "Can use 'Math.LOG2E' instead of '{{expression}}'.",
      replace: "Replace using 'Math.LOG2E'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.LOG2E.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLOG2E(node, sourceCode);
      if (!transform) return;

      const hasComment = existComment(node, sourceCode);

      const fix = !transform.inverse
        ? (fixer: Rule.RuleFixer) => {
            return fixer.replaceText(node, `Math.LOG2E`);
          }
        : function* (fixer: Rule.RuleFixer) {
            const operator = sourceCode.getTokenBefore(transform.node)!;
            yield fixer.replaceText(operator, `*`);
            yield fixer.replaceText(transform.node, `Math.LOG2E`);
          };

      context.report({
        node,
        messageId: "canUseMathLOG2E",
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
    function getMessageExpression(info: TransformingToMathLOG2E): string {
      switch (info.from) {
        case "log2":
          return "Math.log2(Math.E)";
        case "literal":
          return `${Math.LOG2E}`;
        case "LN2":
          return !info.inverse ? "1 / Math.LN2" : "x / Math.LN2";
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
