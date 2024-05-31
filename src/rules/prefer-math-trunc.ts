import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils/index";
import type {
  MathMethodInfo,
  TransformingToMathTrunc,
  TransformingToMathTruncStatement,
} from "../utils/math";
import {
  extractTransformingToMathTruncStatements,
  getInfoForMathCeil,
  getInfoForMathFloor,
  getInfoForTransformingToMathTrunc,
} from "../utils/math";
import type { Rule } from "eslint";
import { existComment, existCommentBetween } from "../utils/ast";
import { getIdText } from "../utils/messages";

export default createRule("prefer-math-trunc", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.trunc() instead of other truncations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseTruncInsteadOfBitwise:
        "Can use 'Math.trunc({{id}})' instead of '{{expression}}'.",
      canUseTruncInsteadOfConditional:
        "Can use 'Math.trunc({{id}})', instead of branching on value and using 'Math.floor({{id}})' / 'Math.ceil({{id}})'.",
      replace: "Replace using 'Math.trunc({{id}})'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const floorExpressions: MathMethodInfo<"floor">[] = [];
    const ceilExpressions: MathMethodInfo<"ceil">[] = [];
    const reportedNodes = new Set<TSESTree.Node>();

    /**
     * Verify if the given node can be converted to Math.trunc().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathTrunc(node, sourceCode);
      if (!transform) return;
      reportedNodes.add(node);
      const hasComment = existComment(node, sourceCode);

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.trunc(${sourceCode.getText(transform.argument)})`,
        );
      };

      const data = getMessageData(transform);
      context.report({
        node,
        messageId:
          transform.from === "bitwise"
            ? "canUseTruncInsteadOfBitwise"
            : "canUseTruncInsteadOfConditional",
        data,
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", data, fix }] : null,
      });
    }

    /**
     * Verify if the branch statements can be converted to Math.trunc().
     */
    function verifyForStatements() {
      for (const info of extractTransformingToMathTruncStatements(
        floorExpressions,
        ceilExpressions,
        sourceCode,
      )) {
        if (reportedNodes.has(info.node)) continue;

        const item =
          info.floor.node.range[0] < info.ceil.node.range[0]
            ? info.floor
            : info.ceil;
        const hasCommentOrShadowed =
          (item.block.type === "BlockStatement" &&
            hasShadowedVariable(item.block)) ||
          existCommentBetween(
            [info.node.range[0], item.block.range[0]],
            sourceCode,
          ) ||
          existComment(item.node, sourceCode) ||
          existCommentBetween(
            [item.block.range[1], info.node.range[1]],
            sourceCode,
          );

        const fix = function* (fixer: Rule.RuleFixer) {
          yield fixer.removeRange([info.node.range[0], item.block.range[0]]);
          if (
            info.node.type === "IfStatement" &&
            item.block.type === "BlockStatement"
          ) {
            // Remove braces
            yield fixer.remove(sourceCode.getFirstToken(item.block)!);
            yield fixer.remove(sourceCode.getLastToken(item.block)!);
          }
          yield fixer.replaceText(
            item.node,
            `Math.trunc(${sourceCode.getText(item.argument)})`,
          );
          yield fixer.removeRange([item.block.range[1], info.node.range[1]]);
        };

        const data = getMessageDataFromStatement(info);
        context.report({
          node: info.node,
          messageId: "canUseTruncInsteadOfConditional",
          data,
          fix: !hasCommentOrShadowed ? fix : null,
          suggest: hasCommentOrShadowed
            ? [{ messageId: "replace", data, fix }]
            : null,
        });
      }
    }

    /** Checks whether the specified block has a shadowed variable declaration. */
    function hasShadowedVariable(node: TSESTree.BlockStatement) {
      const scope = sourceCode.getScope(node);
      for (const variable of scope.variables) {
        let upper = scope.upper;
        while (upper) {
          if (upper.set.has(variable.name)) return true;
          upper = upper.upper;
        }
      }
      return false;
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathTrunc) {
      const id = getIdText(info.argument, "n");
      let expression = "";
      if (info.from === "bitwise") {
        expression =
          info.node.type === "UnaryExpression"
            ? `~~${id}`
            : `${id} ${info.node.operator} ${sourceCode.getText(info.node.right)}`;
      }
      return {
        id,
        expression,
      };
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageDataFromStatement(
      info: TransformingToMathTruncStatement,
    ) {
      const id = getIdText(info.argument, "n");
      return {
        id,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
        const floor = getInfoForMathFloor(node, sourceCode);
        if (floor) {
          floorExpressions.push(floor);
        } else {
          const ceil = getInfoForMathCeil(node, sourceCode);
          if (ceil) {
            ceilExpressions.push(ceil);
          }
        }
      },
      "Program:exit"() {
        verifyForStatements();
      },
    };
  },
});
