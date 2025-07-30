import type { TSESTree } from "@typescript-eslint/types";
import { createRule } from "../utils";
import type { MathMethodInfo } from "../utils/math";
import type { Rule, SourceCode } from "eslint";
import { existComment, getStaticValue } from "../utils/ast";
import { getIdText } from "../utils/messages";
import { buildObjectTypeChecker } from "../utils/type-checker/object-type-checker";
import type { TypeChecker } from "eslint-type-tracer";
import { findVariable, getPropertyName } from "@eslint-community/eslint-utils";

export default createRule("prefer-math-sum-precise", {
  meta: {
    docs: {
      description:
        "enforce the use of Math.sumPrecise() instead of other summation methods",
      categories: [],
    },
    fixable: "code",
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          aggressive: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      canUseSumPreciseInsteadOfReduce:
        "Can use 'Math.sumPrecise({{id}})' instead of '{{id}}.reduce()'.",
      canUseSumPreciseInsteadOfEach:
        "Can use 'Math.sumPrecise({{id}})' instead of summing each value.",
      replace: "Replace using 'Math.sumPrecise()'.",
    },
    type: "suggestion",
  },
  create(context) {
    const sourceCode = context.sourceCode;

    const objectTypeChecker = buildObjectTypeChecker(context);

    /**
     * Report the given transform to Math.sumPrecise.
     */
    function report(transform: TransformingToMathSumPrecise) {
      const hasComment = existComment(transform.node, sourceCode);

      const fix =
        transform.from === "reduce"
          ? (fixer: Rule.RuleFixer) => {
              return fixer.replaceText(
                transform.node,
                `Math.sumPrecise(${sourceCode.getText(transform.argument)})`,
              );
            }
          : transform.from === "forEach" || transform.from === "for"
            ? (fixer: Rule.RuleFixer) => {
                return fixer.replaceText(
                  transform.node,
                  `${sourceCode.getText(transform.assignment)} += Math.sumPrecise(${sourceCode.getText(transform.argument)})`,
                );
              }
            : null;

      const data = getMessageData(transform);
      context.report({
        node: transform.node,
        messageId:
          transform.from === "reduce"
            ? "canUseSumPreciseInsteadOfReduce"
            : "canUseSumPreciseInsteadOfEach",
        data,
        fix: !hasComment && transform.from === "reduce" ? fix : null,
        suggest:
          fix && (hasComment || transform.from !== "reduce")
            ? [{ messageId: "replace", data, fix }]
            : undefined,
      });
    }

    /**
     * Verify if the given node can be converted to Math.trunc().
     */
    function verifyForExpression(node: TSESTree.Expression) {
      const transform = getInfoForTransformingToMathSumPrecise(
        node,
        objectTypeChecker,
        sourceCode,
      );
      if (!transform) return;
      report(transform);
    }

    /**
     * Get the message data from the given information.
     */
    function getMessageData(info: TransformingToMathSumPrecise) {
      const id = getIdText(info.argument, "array");
      return {
        id,
      };
    }

    return {
      ":expression"(node: TSESTree.Expression) {
        verifyForExpression(node);
      },
      ForOfStatement(node: TSESTree.ForOfStatement) {
        const left = node.left;
        if (
          left.type !== "VariableDeclaration" ||
          left.declarations.length !== 1
        )
          return;
        const id = left.declarations[0].id;
        if (id.type !== "Identifier") return;
        if (node.body.type !== "BlockStatement") return;
        const assignment = getInfoForSummaryStatement(
          id,
          node.body,
          objectTypeChecker,
          sourceCode,
        )?.assignment;
        if (!assignment) return;
        report({
          from: "for",
          method: "sumPrecise",
          node,
          argument: node.right,
          assignment,
        });
      },
    };
  },
});

type TransformingToMathSumPrecise =
  | (MathMethodInfo<"sumPrecise"> & {
      from: "reduce";
    })
  | (MathMethodInfo<"sumPrecise"> & {
      from: "forEach";
      assignment: TSESTree.Identifier;
    })
  | (Omit<MathMethodInfo<"sumPrecise">, "node"> & {
      node: TSESTree.ForOfStatement;
      from: "for";
      assignment: TSESTree.Identifier;
    });

/**
 * Returns information if the given expression can be transformed to Math.sumPrecise().
 */
function getInfoForTransformingToMathSumPrecise(
  node: TSESTree.Expression,
  objectTypeChecker: TypeChecker,
  sourceCode: SourceCode,
): null | TransformingToMathSumPrecise {
  if (node.type === "CallExpression") {
    if (
      node.callee.type !== "MemberExpression" ||
      !objectTypeChecker(node.callee.object, "Array")
    )
      return null;
    const methodName = getPropertyName(node.callee, sourceCode.getScope(node));
    if (methodName === "reduce") {
      if (node.arguments.length !== 2) return null;
      const fn = node.arguments[0];
      const init = node.arguments[1];
      if (
        (fn.type !== "FunctionExpression" &&
          fn.type !== "ArrowFunctionExpression") ||
        fn.params.length < 2 ||
        init.type === "SpreadElement"
      )
        return null;
      const accumulator = fn.params[0];
      const current = fn.params[1];
      if (
        accumulator.type !== "Identifier" ||
        current.type !== "Identifier" ||
        getStaticValue(init, sourceCode)?.value !== 0
      )
        return null;
      const body = fn.body;
      let expression: TSESTree.Expression | undefined | null;
      if (body.type !== "BlockStatement") {
        expression = body;
      } else {
        if (body.body.length !== 1) return null;
        const firstStatement = body.body[0];
        if (firstStatement.type !== "ReturnStatement") return null;
        expression = firstStatement.argument;
      }
      if (!expression) return null;
      if (
        expression.type !== "BinaryExpression" ||
        expression.operator !== "+" ||
        expression.left.type !== "Identifier" ||
        expression.right.type !== "Identifier"
      )
        return null;

      if (
        (expression.left.name !== accumulator.name ||
          expression.right.name !== current.name) &&
        (expression.left.name !== current.name ||
          expression.right.name !== accumulator.name)
      ) {
        return null;
      }

      // array.reduce((a, b) => a + b, 0)
      return {
        from: "reduce",
        method: "sumPrecise",
        node,
        argument: node.callee.object,
      };
    } else if (methodName === "forEach") {
      if (node.arguments.length !== 1) return null;
      const fn = node.arguments[0];
      if (
        (fn.type !== "FunctionExpression" &&
          fn.type !== "ArrowFunctionExpression") ||
        fn.params.length < 1
      )
        return null;
      const element = fn.params[0];
      if (element.type !== "Identifier") return null;

      const sum = getInfoForSummaryStatement(
        element,
        fn.body,
        objectTypeChecker,
        sourceCode,
      );
      if (!sum) return null;

      // array.forEach((a) => { sum += a; });
      return {
        from: "forEach",
        method: "sumPrecise",
        node,
        argument: node.callee.object,
        assignment: sum.assignment,
      };
    }
  }
  return null;
}

/**
 * Returns information for a summary statement that sums up values.
 */
function getInfoForSummaryStatement(
  element: TSESTree.Identifier,
  body: TSESTree.Statement | TSESTree.Expression,
  objectTypeChecker: TypeChecker,
  sourceCode: SourceCode,
): null | {
  assignment: TSESTree.Identifier;
} {
  if (body.type === "ExpressionStatement") {
    const expression = body.expression;
    return getInfoForSummaryStatement(
      element,
      expression,
      objectTypeChecker,
      sourceCode,
    );
  }
  if (body.type === "BlockStatement") {
    if (body.body.length !== 1) return null;
    const firstStatement = body.body[0];
    return getInfoForSummaryStatement(
      element,
      firstStatement,
      objectTypeChecker,
      sourceCode,
    );
  }
  if (body.type === "AssignmentExpression") {
    if (body.left.type !== "Identifier") return null;
    const assignment: TSESTree.Identifier = body.left;
    if (body.operator === "+=") {
      if (body.right.type !== "Identifier" || body.right.name !== element.name)
        return null;
    } else if (body.operator === "=") {
      const bin = body.right;
      if (
        bin.type !== "BinaryExpression" ||
        bin.operator !== "+" ||
        bin.left.type !== "Identifier" ||
        bin.right.type !== "Identifier" ||
        ((bin.left.name !== assignment.name ||
          bin.right.name !== element.name) &&
          (bin.left.name !== element.name ||
            bin.right.name !== assignment.name))
      )
        return null;
    } else {
      return null;
    }
    const variable = findVariable(sourceCode.getScope(assignment), assignment);
    if (!variable || variable.defs.length !== 1) return null;
    const def = variable.defs[0];
    if (
      def.type !== "Variable" ||
      !def.node.init ||
      def.node.id.type !== "Identifier"
    )
      return null;
    if (!objectTypeChecker(def.node.init, "Number")) return null;
    return {
      assignment,
    };
  }
  return null;
}
