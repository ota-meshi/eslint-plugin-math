import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import {
  getStaticValue,
  isGlobalMethodCall,
  isGlobalObject,
  isGlobalObjectMethodCall,
  isGlobalObjectProperty,
  isStaticValue,
} from "../utils/ast";
import type { MathMethod } from "../utils/math";
import type { NumberMethod } from "../utils/number";

/**
 * Check if the value of a given node is passed through to the `expression` syntax as-is.
 * For example, `a` in (`a!` and `a as x`) are passed through.
 * @param node A node to check.
 * @returns `true` if the node is passed through.
 */
function isPassThrough(
  node: TSESTree.Expression,
): node is
  | TSESTree.ChainExpression
  | TSESTree.TSAsExpression
  | TSESTree.TSSatisfiesExpression
  | TSESTree.TSTypeAssertion
  | TSESTree.TSNonNullExpression
  | TSESTree.TSInstantiationExpression {
  switch (node.type) {
    case "ChainExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
    case "TSInstantiationExpression":
      return true;
    default:
      return false;
  }
}

type UnknownFunction = (...args: unknown[]) => unknown;
const GLOBAL_TO_NUMBER_METHODS = ["Number", "parseInt", "parseFloat"] as const;
const TO_NUMBER_METHODS = new Map<
  "Number" | "Math",
  NumberMethod[] | MathMethod[]
>();
TO_NUMBER_METHODS.set(
  "Number",
  Object.getOwnPropertyNames(Number).filter(
    (key): key is NumberMethod =>
      typeof Number[key as keyof typeof Number] === "function",
  ),
);
TO_NUMBER_METHODS.set(
  "Math",
  Object.getOwnPropertyNames(Math).filter(
    (key): key is MathMethod =>
      typeof Math[key as keyof typeof Math] === "function",
  ),
);

export default createRule("no-static-nan-calculations", {
  meta: {
    docs: {
      description: "disallow static calculations that go to NaN",
      categories: ["recommended"],
    },
    hasSuggestions: true,
    schema: [],
    messages: {
      alwaysNaN:
        "This calculation will always result in NaN, use explicit `NaN` or `Number.NaN` instead.",
      replaceWithNaN: "Replace using 'NaN'.",
      replaceWithNumberNaN: "Replace using 'Number.NaN'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    /**
     * Verify if the given node can be converted to NaN.
     */
    function verifyForExpression(node: TSESTree.Expression) {
      if (
        isGlobalObject(node, "NaN", sourceCode) ||
        isGlobalObjectProperty(node, "Number", "NaN", sourceCode)
      )
        return;
      if (node.type === "CallExpression") {
        let shouldReport = false;
        for (const methodName of GLOBAL_TO_NUMBER_METHODS) {
          if (isGlobalMethodCall(node, methodName, sourceCode)) {
            const args = node.arguments.map((arg) =>
              getStaticValue(arg, sourceCode),
            );
            if (args.some((a) => !a)) return;
            const argValues = args.map((a) => a!.value);
            const method = globalThis[methodName] as UnknownFunction;
            if (!Number.isNaN(method(...argValues))) return;
            shouldReport = true;
            break;
          }
        }
        if (!shouldReport) {
          for (const [id, properties] of TO_NUMBER_METHODS.entries()) {
            const globalObject = globalThis[id];
            for (const property of properties) {
              if (isGlobalObjectMethodCall(node, id, property, sourceCode)) {
                const args = node.arguments.map((arg) =>
                  getStaticValue(arg, sourceCode),
                );
                if (args.some((a) => !a)) return;
                const argValues = args.map((a) => a!.value);

                const method: UnknownFunction =
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- OK
                  (globalObject as any)[property];
                if (!Number.isNaN(method(...argValues))) return;
                shouldReport = true;
              }
            }
          }
        }
        if (!shouldReport) return;
      } else if (!isStaticValue(node, Number.NaN, sourceCode)) return;

      context.report({
        node,
        messageId: "alwaysNaN",
        suggest: [
          {
            messageId: "replaceWithNaN",
            fix: (fixer) => {
              return fixer.replaceText(node, "NaN");
            },
          },
          {
            messageId: "replaceWithNumberNaN",
            fix: (fixer) => {
              return fixer.replaceText(node, "Number.NaN");
            },
          },
        ],
      });
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        if (isPassThrough(node)) {
          return;
        }
        verifyForExpression(node);
      },
    };
  },
});
