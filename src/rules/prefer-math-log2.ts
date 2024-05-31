import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToMathLog2 } from "../utils/math";
import { getInfoForTransformingToMathLog2 } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";

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
      canUseLog2: "Can use 'Math.log2({{id}})' instead of '{{expression}}'.",
      replace: "Replace using 'Math.log2({{id}})'.",
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

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: "canUseLog2",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathLog2) {
      const id = getIdText(info.argument, "n");
      let expression = "";
      switch (info.from) {
        case "logWithLOG2E":
          expression = `Math.log(${id}) * Math.LOG2E`;
          break;
        case "logWithLN2":
          expression = `Math.log(${id}) / Math.LN2`;
          break;
      }
      return {
        id,
        expression,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
