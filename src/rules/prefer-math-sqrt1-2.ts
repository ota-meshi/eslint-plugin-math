import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  existComment,
  isGlobalObjectMethodCall,
  isGlobalObjectProperty,
  isStaticValue,
} from "../utils/ast";
import type { Rule } from "eslint";
import {
  getInfoForTransformingToMathSqrt,
  getInfoForTransformingToMathSQRT2,
} from "../utils/math";
import { isHalf, isOne } from "../utils/number";

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
        if (!isHalf(transform.argument, sourceCode)) return;
        expression =
          transform.from === "**"
            ? "(1 / 2) ** (1 / 2)"
            : "Math.pow(1 / 2, 1 / 2)";
      } else if (isGlobalObjectMethodCall(node, "Math", "sqrt", sourceCode)) {
        if (node.arguments.length < 1 || !isHalf(node.arguments[0], sourceCode))
          return;
        expression = "Math.sqrt(1 / 2)";
      } else if (node.type === "BinaryExpression" && node.operator === "/") {
        if (!isOne(node.left as TSESTree.Expression, sourceCode)) return;
        const sqrt2 =
          isGlobalObjectProperty(node.right, "Math", "SQRT2", sourceCode) ||
          getInfoForTransformingToMathSQRT2(node.right, sourceCode);
        if (!sqrt2) return;
        expression = "1 / Math.SQRT2";
      } else if (
        isStaticValue(node, Math.SQRT1_2, sourceCode) &&
        !isGlobalObjectProperty(node, "Math", "SQRT1_2", sourceCode)
      ) {
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
