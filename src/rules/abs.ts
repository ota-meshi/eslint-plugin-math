import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import { getInfoForMathAbsOrLike } from "../utils/math";
import { existComment } from "../utils/ast";
import type { Rule } from "eslint";

export default createRule("abs", {
  meta: {
    docs: {
      description:
        "enforce the conversion to absolute values to be the method you prefer",
      categories: [],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          prefer: {
            type: "string",
            enum: ["Math.abs", "expression"],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      canUseX: "Can use '{{prefer}}' instead of {{expression}}.",
      replaceWithAbs: "Replace using 'Math.abs()'.",
      replaceWithExpression: "Replace using 'n < 0 ? -n : n'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const prefer: "Math.abs" | "expression" =
      context.options[0]?.prefer ?? "expression";

    /**
     * Verify if the given node can be converted to Number.isSafeInteger().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForMathAbsOrLike(node, sourceCode);
      if (!transform) return;
      const needTransform =
        transform.from === "multiply" ||
        (prefer === "expression" && transform.from === "abs");
      if (!needTransform) return;
      const hasComment = existComment(node, sourceCode);

      const n = sourceCode.getText(transform.argument);
      const fix =
        prefer === "Math.abs"
          ? (fixer: Rule.RuleFixer) => {
              return fixer.replaceText(node, `Math.abs(${n})`);
            }
          : (fixer: Rule.RuleFixer) => {
              return fixer.replaceText(node, `${n} < 0 ? -${n} : ${n}`);
            };

      context.report({
        node,
        messageId: "canUseX",
        data: {
          prefer: prefer === "Math.abs" ? "Math.abs()" : "n < 0 ? -n : n",
          expression:
            transform.from === "abs"
              ? "Math.abs()"
              : transform.from === "multiply"
                ? "n < 0 ? n * -1 : n"
                : "n < 0 ? -n : n",
        },
        fix: !hasComment ? fix : null,
        suggest: hasComment
          ? [
              {
                messageId:
                  prefer === "Math.abs"
                    ? "replaceWithAbs"
                    : "replaceWithExpression",
                fix,
              },
            ]
          : null,
      });
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});