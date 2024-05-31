import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { TransformingToNumberIsInteger } from "../utils/number";
import { getInfoForTransformingToNumberIsInteger } from "../utils/number";
import type { Rule } from "eslint";
import { existComment } from "../utils/ast";
import { getIdText } from "../utils/messages";

export default createRule("prefer-number-is-integer", {
  meta: {
    docs: {
      description:
        "enforce the use of Number.isInteger() instead of other checking ways",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseIsInteger:
        "Can use 'Number.isInteger({{id}})' instead of {{expression}}.",
      canUseNotIsInteger:
        "Can use '!Number.isInteger({{id}})' instead of {{expression}}.",
      replace: "Replace using 'Number.isInteger({{id}})'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Number.isInteger().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToNumberIsInteger(
        node,
        sourceCode,
      );
      if (!transform) return;
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `${transform.not ? "!" : ""}Number.isInteger(${sourceCode.getText(transform.argument)})`,
        );
      };

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: !transform.not ? "canUseIsInteger" : "canUseNotIsInteger",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToNumberIsInteger) {
      const id = getIdText(info.argument, "n");
      let expression = "";
      switch (info.from) {
        case "trunc":
          expression = !info.not
            ? `'Math.trunc(${id}) === ${id}'`
            : `'Math.trunc(${id}) !== ${id}'`;
          break;
        case "floor":
          expression = !info.not
            ? `'Math.floor(${id}) === ${id}'`
            : `'Math.floor(${id}) !== ${id}'`;
          break;
        case "ceil":
          expression = !info.not
            ? `'Math.ceil(${id}) === ${id}'`
            : `'Math.ceil(${id}) !== ${id}'`;
          break;
        case "round":
          expression = !info.not
            ? `'Math.round(${id}) === ${id}'`
            : `'Math.round(${id}) !== ${id}'`;
          break;
        case "truncLike":
          expression = !info.not
            ? `'Math.trunc(${id}) === ${id}' like expression`
            : `'Math.trunc(${id}) !== ${id}' like expression`;
          break;
        case "modulo":
          expression = !info.not ? `'${id} % 1 !== 0'` : `'${id} % 1 === 0'`;
          break;
        case "parseInt":
          expression = !info.not
            ? `'parseInt(${id}) === ${id}'`
            : `'parseInt(${id}) !== ${id}'`;
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
