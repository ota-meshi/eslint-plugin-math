import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToMathLog2 } from "../utils/math";
import { getInfoForTransformingToMathLog2 } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("prefer-math-log2", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.log2() instead of other calculation methods.",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseLog2: "Can use 'Math.log2(n)' instead of '{{expression}}'.",
      replace: "Replace using 'Math.log2()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isFinite().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathLog2(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.log2(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId: "canUseLog2",
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
    function getMessageExpression(info: TransformingToMathLog2): string {
      switch (info.from) {
        case "logWithLOG2E":
          return `Math.log(n) * Math.LOG2E`;
        case "logWithLN2":
          return `Math.log(n) / Math.LN2`;
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
