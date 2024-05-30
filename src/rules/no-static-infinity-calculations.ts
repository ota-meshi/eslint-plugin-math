import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  isGlobalObject,
  isGlobalObjectProperty,
  isStaticValue,
} from "../utils/ast";

export default createRule("no-static-infinity-calculations", {
  meta: {
    docs: {
      description: "disallow static calculations that go to infinity",
      categories: ["recommended"],
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      alwaysInfinity:
        "This calculation will always result in infinity, use explicit `Infinity` or `Number.POSITIVE_INFINITY` instead.",
      alwaysNegativeInfinity:
        "This calculation will always result in negative infinity, use explicit `-Infinity` or `Number.NEGATIVE_INFINITY` instead.",
      replaceWithInfinity: "Replace using 'Infinity'.",
      replaceWithNegativeInfinity: "Replace using '-Infinity'.",
      replaceWithNumberPositiveInfinity:
        "Replace using 'Number.POSITIVE_INFINITY'.",
      replaceWithNumberNegativeInfinity:
        "Replace using 'Number.NEGATIVE_INFINITY'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to Infinity.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (
        isGlobalObject(node, "Infinity", sourceCode) ||
        isGlobalObjectProperty(
          node,
          "Number",
          "POSITIVE_INFINITY",
          sourceCode,
        ) ||
        (node.type === "UnaryExpression" &&
          node.operator === "-" &&
          isGlobalObject(node.argument, "Infinity", sourceCode)) ||
        isGlobalObjectProperty(node, "Number", "NEGATIVE_INFINITY", sourceCode)
      )
        return;
      let positive: boolean;
      if (isStaticValue(node, Number.POSITIVE_INFINITY, sourceCode)) {
        positive = true;
      } else if (isStaticValue(node, Number.NEGATIVE_INFINITY, sourceCode)) {
        positive = false;
      } else return;

      if (positive) {
        context.report({
          node,
          messageId: "alwaysInfinity",
          suggest: [
            {
              messageId: "replaceWithInfinity",
              fix: (fixer) => {
                return fixer.replaceText(node, "Infinity");
              },
            },
            {
              messageId: "replaceWithNumberPositiveInfinity",
              fix: (fixer) => {
                return fixer.replaceText(node, "Number.POSITIVE_INFINITY");
              },
            },
          ],
        });
      } else {
        context.report({
          node,
          messageId: "alwaysNegativeInfinity",
          suggest: [
            {
              messageId: "replaceWithNegativeInfinity",
              fix: (fixer) => {
                return fixer.replaceText(node, "-Infinity");
              },
            },
            {
              messageId: "replaceWithNumberNegativeInfinity",
              fix: (fixer) => {
                return fixer.replaceText(node, "Number.NEGATIVE_INFINITY");
              },
            },
          ],
        });
      }
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
    };
  },
});
