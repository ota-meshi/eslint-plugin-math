import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment, isGlobalObjectMethodCall } from "../utils/ast";
import type { Rule } from "eslint";
import { getInfoForTransformingToMathSqrt } from "../utils/math";
import { isTwo } from "../utils/number";

export default createRule("prefer-math-sqrt2", {
  meta: {
    docs: {
      description: "enforce the use of Math.SQRT2 instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathSqrt2: "Can use 'Math.SQRT2'.",
      replace: "Replace using 'Math.SQRT2'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.SQRT2.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathSqrt(node, sourceCode);
      if (transform) {
        if (!isTwo(transform.argument)) return;
      } else if (isGlobalObjectMethodCall(node, "Math", "sqrt", sourceCode)) {
        if (node.arguments.length < 1 || !isTwo(node.arguments[0])) return;
      } else {
        return;
      }
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(node, `Math.SQRT2`);
      };

      context.report({
        node,
        messageId: "canUseMathSqrt2",
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
