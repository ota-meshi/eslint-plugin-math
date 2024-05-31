import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";
import type { TransformingToMathHypot } from "../utils/math";
import { getInfoForTransformingToMathHypot } from "../utils/math";
import { getIdTextList } from "../utils/messages";

export default createRule("prefer-math-hypot", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.hypot() instead of other hypotenuse calculations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseMathHypot:
        "Can use 'Math.hypot({{idList}})' instead of '{{expression}}'.",
      replace: "Replace using 'Math.hypot()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Math.hypot().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathHypot(node, sourceCode);
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.hypot(${transform.arguments
            .map((argument) => sourceCode.getText(argument))
            .join(", ")})`,
        );
      };

      context.report({
        node,
        messageId: "canUseMathHypot",
        data: getMessageData(transform),
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathHypot) {
      const idList = getIdTextList(info.arguments);
      const operands = idList
        .map((id, index) => {
          const meta = info.argumentsMeta[index];
          if (meta.from === "pow") return `Math.pow(${id}, 2)`;
          if (meta.from === "*") return `${id} * ${id}`;
          // if (meta.from === "**") return `${id} ** 2`;
          return `${id} ** 2`;
        })
        .join(" + ");
      let expression = "";
      switch (info.from) {
        case "sqrt":
          expression = `Math.sqrt(${operands})`;
          break;
        case "**":
          expression = `(${operands}) ** ${info.exponentMeta.type === "Literal" ? info.exponentMeta.raw : "(1 / 2)"}`;
          break;
        case "pow":
          expression = `Math.pow(${operands}, ${info.exponentMeta.type === "Literal" ? info.exponentMeta.raw : "1 / 2"})`;
          break;
      }
      return {
        expression,
        idList: idList.join(", "),
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
