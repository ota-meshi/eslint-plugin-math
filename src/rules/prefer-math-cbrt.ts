import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { getInfoForTransformingToMathCbrt } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

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
        "Can use 'Math.cbrt()' instead of 'n ** (1 / 3)'.",
      canUseCbrtInsteadOfMathPow:
        "Can use 'Math.cbrt()' instead of 'Math.pow(n, 1 / 3)'.",
      replace: "Replace using 'Math.cbrt()'.",
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

      context.report({
        node,
        messageId:
          transform.from === "exponentiation"
            ? "canUseCbrtInsteadOfExponentiation"
            : "canUseCbrtInsteadOfMathPow",
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
