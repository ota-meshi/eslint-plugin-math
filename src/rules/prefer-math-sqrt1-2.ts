import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  existComment,
  isGlobalObjectMethodCall,
  isStaticValue,
} from "../utils/ast";
import type { Rule } from "eslint";
import { getInfoForTransformingToMathSqrt } from "../utils/math";
import { isHalf } from "../utils/number";

export default createRule("prefer-math-sqrt1-2", {
  meta: {
    docs: {
      description: "enforce the use of Math.SQRT1_2 instead of other ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathSqrt1_2: "Can use 'Math.SQRT1_2' instead of '{{expression}}'.",
      replace: "Replace using 'Math.SQRT1_2'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.SQRT1_2.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      let expression: string;
      const transform = getInfoForTransformingToMathSqrt(node, sourceCode);
      if (transform) {
        if (!isHalf(transform.argument)) return;
        expression =
          transform.from === "exponentiation"
            ? "(1 / 2) ** (1 / 2)"
            : "Math.pow(1 / 2, 1 / 2)";
      } else if (isGlobalObjectMethodCall(node, "Math", "sqrt", sourceCode)) {
        if (node.arguments.length < 1 || !isHalf(node.arguments[0])) return;
        expression = "Math.sqrt(1 / 2)";
      } else if (isStaticValue(node, Math.SQRT1_2)) {
        expression = `${Math.SQRT1_2}`;
      } else {
        return;
      }
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(node, `Math.SQRT1_2`);
      };

      context.report({
        node,
        messageId: "canUseMathSqrt1_2",
        data: { expression },
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
