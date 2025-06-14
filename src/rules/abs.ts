import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { MathAbsOrLike } from "../utils/math";
import { getInfoForMathAbsOrLike } from "../utils/math";
import {
  Precedence,
  existComment,
  getPrecedence,
  isWrappedInParenOrComma,
} from "../utils/ast";
import type { Rule } from "eslint";
import { getIdText } from "../utils/messages";
import { buildObjectTypeChecker } from "../utils/type-checker/object-type-checker";

type Option = {
  prefer: "Math.abs" | "expression";
};

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
          aggressive: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      canUseX: "Can use '{{prefer}}' instead of {{expression}}.",
      replace: "Replace using '{{prefer}}'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const prefer: "Math.abs" | "expression" =
      (context.options[0] as Option | undefined)?.prefer ?? "Math.abs";

    const objectTypeChecker =
      prefer === "Math.abs"
        ? buildObjectTypeChecker(context, { pluginNamespace: "math" })
        : null;

    /**
     * Verify if the given node can be converted to Number.isSafeInteger().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForMathAbsOrLike(node, sourceCode);
      if (!transform) return;
      if (
        // If the transform is already Math.abs, skip.
        (prefer === "Math.abs" && transform.from === "abs") ||
        // If the transform is already expression, skip.
        (prefer === "expression" && transform.from === "-")
      ) {
        return;
      }
      let canFix = true;
      if (transform.from === "-" && objectTypeChecker) {
        // Need type check
        const result = objectTypeChecker(transform.node, "Number");
        if (!result) {
          return;
        }
        if (result === "aggressive") {
          // If aggressive, allow to fix.
          canFix = false;
        }
      }
      if (existComment(node, sourceCode)) {
        // If there is a comment, do not fix.
        canFix = false;
      }

      const n = sourceCode.getText(transform.argument);
      const fix =
        prefer === "Math.abs"
          ? (fixer: Rule.RuleFixer) => {
              return fixer.replaceText(node, `Math.abs(${n})`);
            }
          : (fixer: Rule.RuleFixer) => {
              let expression = `${n} < 0 ? -${n} : ${n}`;
              if (!isWrappedInParenOrComma(node, sourceCode)) {
                const parent = node.parent;
                if (parent.type === "ClassDeclaration") {
                  expression = `(${expression})`;
                } else if (parent.type.endsWith("Expression")) {
                  const parentPrecedence = getPrecedence(parent, sourceCode);
                  if (
                    parentPrecedence.precedence >
                    Precedence.assignmentAndMiscellaneous
                  ) {
                    expression = `(${expression})`;
                  }
                }
              }
              return fixer.replaceText(node, expression);
            };

      const data = getMessageData(transform);
      context.report({
        node,
        messageId: "canUseX",
        data: getMessageData(transform),
        fix: canFix ? fix : null,
        suggest: !canFix
          ? [
              {
                messageId: "replace",
                data,
                fix,
              },
            ]
          : null,
      });
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: MathAbsOrLike) {
      const id = getIdText(info.argument, "n");
      return {
        prefer:
          prefer === "Math.abs"
            ? `Math.abs(${id})`
            : `${id} < 0 ? -${id} : ${id}`,
        expression:
          info.from === "abs"
            ? `Math.abs(${id})`
            : info.from === "*-1"
              ? `${id} < 0 ? ${id} * -1 : ${id}`
              : `${id} < 0 ? -${id} : ${id}`,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
