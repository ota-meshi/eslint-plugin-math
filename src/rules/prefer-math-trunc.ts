import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils/index";
import type { MathMethodInfo } from "../utils/math";
import {
  extractTransformingToMathTruncStatements,
  getInfoForMathCeil,
  getInfoForMathFloor,
  getInfoForTransformingToMathTrunc,
} from "../utils/math";
import type { Rule } from "eslint";

export default createRule("prefer-math-trunc", {
  meta: {
    docs: {
      description: "enforce use of Math.trunc() over other truncations",
      categories: ["recommended"],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [],
    messages: {
      canUseTruncInsteadOfBitwise:
        "Can use 'Math.trunc()' instead of '{{expression}}'.",
      canUseTruncInsteadOfConditional:
        "Can use 'Math.trunc()', instead of branching on value and using 'Math.floor()' / 'Math.ceil()'.",
      replace: "Replace using 'Math.trunc()'.",
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
      const hasComment = sourceCode.commentsExistBetween(
        sourceCode.getFirstToken(node),
        sourceCode.getLastToken(node),
      );

      const fix = (fixer: Rule.RuleFixer) => {
        return fixer.replaceText(
          node,
          `Math.trunc(${sourceCode.getText(transform.argument)})`,
        );
      };

      context.report({
        node,
        messageId:
          transform.type === "bitwise"
            ? "canUseTruncInsteadOfBitwise"
            : "canUseTruncInsteadOfConditional",
        data:
          transform.type === "bitwise"
            ? {
                expression:
                  transform.node.type === "UnaryExpression"
                    ? `~~n`
                    : `n ${transform.node.operator} ${sourceCode.getText(transform.node.right)}`,
              }
            : {},
        fix: !hasComment ? fix : null,
        suggest: hasComment ? [{ messageId: "replace", fix }] : null,
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
          sourceCode.commentsExistBetween(
            sourceCode.getFirstToken(info.node),
            sourceCode.getFirstToken(item.block),
          ) ||
          sourceCode.commentsExistBetween(
            sourceCode.getFirstToken(item.node),
            sourceCode.getLastToken(item.node),
          ) ||
          sourceCode.commentsExistBetween(
            sourceCode.getLastToken(item.block),
            sourceCode.getLastToken(info.node),
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

        context.report({
          node: info.node,
          messageId: "canUseTruncInsteadOfConditional",
          fix: !hasCommentOrShadowed ? fix : null,
          suggest: hasCommentOrShadowed
            ? [{ messageId: "replace", fix }]
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