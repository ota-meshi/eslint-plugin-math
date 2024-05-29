import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathLOG10E } from "../utils/math";
import { getInfoForTransformingToMathLOG10E } from "../utils/math";

export default createRule("prefer-math-log10e", {
  meta: {
    docs: {
      description: "enforce the use of Math.LOG10E instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathLOG10E: "Can use 'Math.LOG10E' instead of '{{expression}}'.",
      replace: "Replace using 'Math.LOG10E'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.LOG10E.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLOG10E(node, sourceCode);
      if (!transform) return;

      const hasComment = existComment(node, sourceCode);

      const fix = !transform.inverse
        ? (fixer: Rule.RuleFixer) => {
            return fixer.replaceText(node, `Math.LOG10E`);
          }
        : function* (fixer: Rule.RuleFixer) {
            const operator = sourceCode.getTokenBefore(transform.node)!;
            yield fixer.replaceText(operator, `*`);
            yield fixer.replaceText(transform.node, `Math.LOG10E`);
          };

      context.report({
        node,
        messageId: "canUseMathLOG10E",
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
    function getMessageExpression(info: TransformingToMathLOG10E): string {
      switch (info.from) {
        case "log10":
          return "Math.log10(Math.E)";
        case "literal":
          return `${Math.LOG10E}`;
        case "LN10":
          return !info.inverse ? "1 / Math.LN10" : "x / Math.LN10";
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
