import { findVariable, getPropertyName } from "@eslint-community/eslint-utils";
import { WELLKNOWN_GLOBALS, getPropertyType } from "./es-types";
import type { ObjectTypeChecker } from "./utils";
import { checkExpressionNodeType } from "./utils";
import type { AST, Rule } from "eslint";
import type { TSESTree } from "@typescript-eslint/types";
import type { TypeInfo, TypeName } from "./types";
import type { Scope } from "eslint";

/**
 * Build object type checker.
 * @param context The rule context.
 * @param aggressiveResult The value to return if the type cannot be determined.
 * @returns Returns an object type checker.
 */
export function buildObjectTypeCheckerForES(
  context: Rule.RuleContext,
  aggressiveResult: false | "aggressive" = false,
): ObjectTypeChecker {
  const getType = buildExpressionTypeProvider(context);
  return function (objectNode, className) {
    const result = checkExpressionNodeType(objectNode, className);
    if (result != null) {
      return result;
    }

    const type = getType(objectNode);
    if (type == null) {
      return aggressiveResult;
    }
    return type === className;
  };
}

const cache = new WeakMap<
  AST.Program,
  (node: TSESTree.Expression) => TypeName | null
>();

/**
 * Build expression type provider.
 * @param context The rule context.
 * @returns Returns an expression type provider.
 */
export function buildExpressionTypeProvider(
  context: Rule.RuleContext,
): (node: TSESTree.Expression) => TypeName | null {
  const key = context.sourceCode.ast;
  let result = cache.get(key);
  if (!result) {
    cache.set(key, (result = buildExpressionTypeProviderImpl(context)));
  }
  return result;
}

/**
 * Build expression type provider.
 * @param context The rule context.
 * @returns Returns an expression type provider.
 */
function buildExpressionTypeProviderImpl(
  context: Rule.RuleContext,
): (node: TSESTree.Expression) => TypeName | null {
  const GET_TYPE_INFOS = {
    ArrayExpression: (): TypeInfo | null => ({ type: "Array" }),
    ObjectExpression: getObjectExpressionTypeInfo,
    FunctionDeclaration: getFunctionTypeInfo,
    ArrowFunctionExpression: getFunctionTypeInfo,
    FunctionExpression: getFunctionTypeInfo,
    Literal: getLiteralTypeInfo,
    TemplateLiteral: (): TypeInfo | null => ({ type: "String" }),
    Identifier: getIdentifierTypeInfo,
    ImportExpression: (): TypeInfo | null => ({ type: "Promise" }),
    MemberExpression: getMemberExpressionTypeInfo,
    BinaryExpression: (node: TSESTree.BinaryExpression): TypeInfo | null =>
      getOperatorTypeInfo(node.operator, node.left, node.right),
    LogicalExpression: (node: TSESTree.LogicalExpression): TypeInfo | null =>
      getOperatorTypeInfo(node.operator, node.left, node.right),
    AssignmentExpression: (
      node: TSESTree.AssignmentExpression,
    ): TypeInfo | null =>
      getOperatorTypeInfo(node.operator, node.left, node.right),
    UnaryExpression: getUnaryExpressionTypeInfo,
    UpdateExpression: (): TypeInfo | null => ({ type: "Number" }),
    ClassExpression: (): TypeInfo | null => ({ type: "Function" }),
    ChainExpression: (node: TSESTree.ChainExpression): TypeInfo | null =>
      getTypeInfo(node.expression),
    SequenceExpression: (node: TSESTree.SequenceExpression): TypeInfo | null =>
      getTypeInfo(node.expressions[node.expressions.length - 1]),
    CallExpression: getCallExpressionTypeInfo,
    NewExpression: getCallExpressionTypeInfo,
    TaggedTemplateExpression: getCallExpressionTypeInfo,
    ConditionalExpression(
      node: TSESTree.ConditionalExpression,
    ): TypeInfo | null {
      const consequent = getTypeInfo(node.consequent);
      const alternate = getTypeInfo(node.alternate);
      return {
        get type() {
          return consequent?.type === alternate?.type
            ? (consequent?.type ?? null)
            : null;
        },
        get return() {
          return consequent?.return?.type === alternate?.return?.type
            ? (consequent?.return ?? null)
            : null;
        },
      };
    },
  };

  const trackedTypeInfo = new Map();
  return (node: TSESTree.Expression): TypeName | null =>
    getTypeInfo(node)?.type ?? null;

  /**
   * Gets the type info of the given node.
   * @param node The Expression node
   * @returns The type info of expression.
   */
  function getTypeInfo(
    node:
      | TSESTree.Expression
      | TSESTree.FunctionDeclaration
      | TSESTree.PrivateIdentifier,
  ): TypeInfo | null {
    if (trackedTypeInfo.has(node)) {
      return trackedTypeInfo.get(node);
    }
    trackedTypeInfo.set(node, null);
    try {
      const fn = GET_TYPE_INFOS[node.type as keyof typeof GET_TYPE_INFOS];
      const result = fn?.(node as never) ?? null;
      trackedTypeInfo.set(node, result);
      return result;
    } catch {
      return null;
    }
  }

  /**
   * Finds the variable from the identifier node.
   * @param node The Identifier node.
   * @returns The variable or null if not found.
   */
  function findVariableFromIdentifier(node: TSESTree.Identifier) {
    return findVariable(context.sourceCode.scopeManager.globalScope, node);
  }

  /**
   * Gets the type info of the given literal node.
   * @param node The Literal node
   * @returns The type info of literal.
   */
  function getLiteralTypeInfo(node: TSESTree.Literal): TypeInfo | null {
    if ("regex" in node && node.regex) {
      return { type: "RegExp" };
    }
    if ("bigint" in node && node.bigint) {
      return { type: "BigInt" };
    }
    if (node.value == null) {
      return { type: "null" };
    }
    const valueType = typeof node.value;
    if (valueType === "string") {
      return { type: "String" };
    }
    if (valueType === "number") {
      return { type: "Number" };
    }
    if (valueType === "boolean") {
      return { type: "Boolean" };
    }
    if (valueType === "symbol") {
      return { type: "Symbol" };
    }
    if (valueType === "undefined") {
      return { type: "undefined" };
    }
    if (valueType === "bigint") {
      return { type: "BigInt" };
    }
    return {
      type: `${valueType[0].toUpperCase()}${valueType.slice(1)}` as TypeName,
    };
  }

  /**
   * Gets the type info of the given identifier node.
   * @param node The Identifier node
   * @returns The type info of identifier.
   */
  function getIdentifierTypeInfo(node: TSESTree.Identifier): TypeInfo | null {
    const variable = findVariableFromIdentifier(node);
    if (!variable) {
      return null;
    }
    if (variable.defs.length === 0) {
      // It is a global variable
      return WELLKNOWN_GLOBALS[node.name] ?? null;
    }
    if (variable.defs.length !== 1) {
      return null;
    }
    const def = variable.defs[0];
    if (def.type === "Variable") {
      if (
        // It has an initial value.
        def.node.init &&
        // It does not write new values.
        def.parent.kind === "const"
      ) {
        // The type of the initial value is the type of the variable.
        const init = getTypeInfo(def.node.init);
        return init && getPatternTypeInfo(def.name, def.node.id, init);
      }
      if (def.parent.kind === "const") {
        return null;
      }
      return getAssignableVariableTypeInfo(variable);
    } else if (def.type === "FunctionName") {
      return getTypeInfo(def.node);
    }
    return null;
  }

  /**
   * Gets the type info of the assignable variable.
   * @param variable The variable to get type info.
   * @returns The type info of assignable variable or null if unknown.
   */
  function getAssignableVariableTypeInfo(
    variable: Scope.Variable,
  ): TypeInfo | null {
    const typeInfos: TypeInfo[] = [];
    for (const reference of variable.references) {
      if (!reference.writeExpr) {
        continue;
      }
      const parent = reference.writeExpr.parent;
      if (!parent) {
        return null; // unknown
      }
      if (parent.type === "VariableDeclarator") {
        if (reference.writeExpr !== parent.init) {
          return null; // unknown
        }
        const init = getTypeInfo(reference.writeExpr);
        if (!init) {
          return null; // unknown
        }
        const typeInfo = getPatternTypeInfo(
          reference.identifier,
          parent.id,
          init,
        );
        if (!typeInfo) {
          return null; // unknown
        }
        typeInfos.push(typeInfo);
      } else if (
        parent.type === "AssignmentExpression" ||
        parent.type === "AssignmentPattern"
      ) {
        if (reference.writeExpr !== parent.right) {
          return null; // unknown
        }
        const right = getTypeInfo(reference.writeExpr);
        if (!right) {
          return null; // unknown
        }
        const typeInfo = getPatternTypeInfo(
          reference.identifier,
          parent.left,
          right,
        );
        if (!typeInfo) {
          return null; // unknown
        }
        typeInfos.push(typeInfo);
      } else {
        return null; // unknown
      }
    }
    const firstTypeInfo = typeInfos.shift();
    if (!firstTypeInfo) {
      return null;
    }
    if (!typeInfos.length) {
      return firstTypeInfo;
    }
    if (typeInfos.every((t) => t.type === firstTypeInfo.type)) {
      return {
        type: firstTypeInfo.type,
        get return() {
          if (typeInfos.every((t) => t.return === firstTypeInfo.return)) {
            return firstTypeInfo.return;
          }
          return null;
        },
      };
    }
    return null;
  }

  /**
   * Gets the type info of the given object expression node.
   * @param node The ObjectExpression node
   * @returns The type info of object expression.
   */
  function getObjectExpressionTypeInfo(
    node: TSESTree.ObjectExpression,
  ): TypeInfo | null {
    let properties: TypeInfo["properties"] | null = null;
    return {
      type: "Object",
      get properties() {
        if (properties) {
          return properties;
        }

        properties = {};
        for (const prop of node.properties) {
          if (prop.type !== "Property") {
            return (properties = {});
          }
          const propertyName = getPropertyName(
            prop,
            context.sourceCode.getScope(node),
          );
          if (propertyName == null) {
            continue;
          }
          Object.defineProperty(properties, propertyName, {
            get() {
              return getTypeInfo(prop.value as TSESTree.Expression);
            },
          });
        }
        return properties;
      },
    };
  }

  /**
   * Gets the type info of the operator.
   * @param operator The operator to get type info.
   * @param leftNode The left node of the operator.
   * @param rightNode The right node of the operator.
   * @returns The type info of operator or null if unknown.
   */
  function getOperatorTypeInfo(
    operator:
      | TSESTree.BinaryExpression["operator"]
      | TSESTree.LogicalExpression["operator"]
      | TSESTree.AssignmentExpression["operator"],
    leftNode: TSESTree.Expression | TSESTree.PrivateIdentifier,
    rightNode: TSESTree.Expression,
  ): TypeInfo | null {
    if (operator === "=") {
      return getTypeInfo(rightNode);
    }
    if (operator === "+" || operator === "+=") {
      return getPlusOperatorTypeInfo(leftNode, rightNode);
    }
    if (
      operator === "==" ||
      operator === "!=" ||
      operator === "===" ||
      operator === "!==" ||
      operator === "<" ||
      operator === "<=" ||
      operator === ">" ||
      operator === ">=" ||
      operator === "in" ||
      operator === "instanceof"
    ) {
      return { type: "Boolean" };
    }
    if (
      operator === "-" ||
      operator === "-=" ||
      operator === "*" ||
      operator === "*=" ||
      operator === "/" ||
      operator === "/=" ||
      operator === "%" ||
      operator === "%=" ||
      operator === "^" ||
      operator === "^=" ||
      operator === "**" ||
      operator === "**=" ||
      operator === "&" ||
      operator === "&=" ||
      operator === "|" ||
      operator === "|="
    ) {
      const left = getTypeInfo(leftNode);
      const right = getTypeInfo(rightNode);
      if (left?.type === "BigInt" || right?.type === "BigInt") {
        return { type: "BigInt" };
      }
      return left?.type == null && right?.type == null
        ? null
        : { type: "Number" };
    }
    if (
      operator === "<<" ||
      operator === "<<=" ||
      operator === ">>" ||
      operator === ">>=" ||
      operator === ">>>" ||
      operator === ">>>="
    ) {
      return { type: "Number" };
    }
    if (
      operator === "&&" ||
      operator === "&&=" ||
      operator === "||" ||
      operator === "||=" ||
      operator === "??" ||
      operator === "??="
    ) {
      const left = getTypeInfo(leftNode);
      const right = getTypeInfo(rightNode);
      return left?.type && left.type === right?.type
        ? { type: left.type }
        : null;
    }
    return null;
  }

  /**
   * Gets the type info of the plus operator.
   * @param leftNode The left node of the plus operator.
   * @param rightNode The right node of the plus operator.
   * @returns The type info of plus operator or null if unknown.
   */
  function getPlusOperatorTypeInfo(
    leftNode: TSESTree.Expression | TSESTree.PrivateIdentifier,
    rightNode: TSESTree.Expression,
  ): TypeInfo | null {
    const left = getTypeInfo(leftNode);
    const right = getTypeInfo(rightNode);
    if (left?.type === "String" || right?.type === "String") {
      return { type: "String" };
    }
    if (left?.type === "BigInt" || right?.type === "BigInt") {
      return { type: "BigInt" };
    }
    if (right?.type === "Number") {
      return { type: "Number" };
    }
    if (left?.type === "Number") {
      if (right?.type === "null" || right?.type === "undefined") {
        return { type: "Number" };
      }
    }
    if (right == null) {
      return null;
    }
    return { type: "String" };
  }

  /**
   * Gets the type info of the unary expression.
   * @param node The UnaryExpression node
   * @returns The type info of unary expression.
   */
  function getUnaryExpressionTypeInfo(
    node: TSESTree.UnaryExpression,
  ): TypeInfo | null {
    if (node.operator === "!" || node.operator === "delete") {
      return { type: "Boolean" };
    }
    if (node.operator === "+") {
      return { type: "Number" };
    }
    if (node.operator === "-" || node.operator === "~") {
      const argument = getTypeInfo(node.argument);
      if (argument?.type === "BigInt") {
        return { type: "BigInt" };
      }
      return argument == null ? null : { type: "Number" };
    }
    if (node.operator === "typeof") {
      return { type: "String" };
    }
    if (node.operator === "void") {
      return { type: "undefined" };
    }
    return null;
  }

  /**
   * Gets the type info of the call expression.
   * @param node The CallExpression, NewExpression, or TaggedTemplateExpression node
   * @returns The type info of call expression.
   */
  function getCallExpressionTypeInfo(
    node:
      | TSESTree.CallExpression
      | TSESTree.NewExpression
      | TSESTree.TaggedTemplateExpression,
  ): TypeInfo | null {
    const callee =
      node.type === "CallExpression" || node.type === "NewExpression"
        ? node.callee
        : node.tag;
    return getTypeInfo(callee)?.return ?? null;
  }

  /**
   * Gets the type info of the function node.
   * @param node The FunctionExpression, ArrowFunctionExpression, or FunctionDeclaration node
   * @returns The type info of function.
   */
  function getFunctionTypeInfo(
    node:
      | TSESTree.FunctionExpression
      | TSESTree.ArrowFunctionExpression
      | TSESTree.FunctionDeclaration,
  ): TypeInfo | null {
    return {
      type: "Function",
      get return(): TypeInfo | null {
        if (node.async) {
          return { type: "Promise" };
        }
        if (node.generator) {
          return { type: "Iterator" };
        }
        if (node.body.type !== "BlockStatement") {
          return getTypeInfo(node.body);
        }
        let returnStatement: TypeInfo | null = null;
        for (const st of iterateReturn(node.body.body)) {
          if (!st.argument) {
            continue;
          }
          const argument = getTypeInfo(st.argument);
          if (!argument) return null;
          if (!returnStatement) {
            returnStatement = argument;
          } else if (returnStatement.type === argument.type) {
            const base: TypeInfo = returnStatement;
            // Merge return type
            returnStatement = {
              type: base.type,
              get return() {
                const type1 = base.return?.type;
                const type2 = argument.return?.type;
                if (!type1 || !type2 || type1 !== type2) {
                  return null;
                }
                return {
                  type: type1,
                };
              },
            };
          } else {
            return null;
          }
        }

        return returnStatement;

        /**
         * Iterates through the statements and yields ReturnStatement nodes.
         */
        function* iterateReturn(
          statements: TSESTree.Statement[],
        ): Generator<TSESTree.ReturnStatement> {
          for (const statement of statements) {
            if (statement.type === "ReturnStatement") {
              yield statement;
            } else if (statement.type === "BlockStatement") {
              yield* iterateReturn(statement.body);
            } else if (
              statement.type === "LabeledStatement" ||
              statement.type === "WithStatement" ||
              statement.type === "ForStatement" ||
              statement.type === "ForInStatement" ||
              statement.type === "ForOfStatement" ||
              statement.type === "WhileStatement" ||
              statement.type === "DoWhileStatement"
            ) {
              yield* iterateReturn([statement.body]);
            } else if (statement.type === "IfStatement") {
              yield* iterateReturn([statement.consequent]);
              if (statement.alternate) {
                yield* iterateReturn([statement.alternate]);
              }
            } else if (statement.type === "SwitchStatement") {
              for (const caseClause of statement.cases) {
                yield* iterateReturn(caseClause.consequent);
              }
            } else if (statement.type === "TryStatement") {
              yield* iterateReturn([statement.block]);
              if (statement.handler) {
                yield* iterateReturn([statement.handler.body]);
              }
              if (statement.finalizer) {
                yield* iterateReturn([statement.finalizer]);
              }
            }
          }
        }
      },
    };
  }

  /**
   * Gets the type info of the member expression node.
   * @param node The MemberExpression node
   * @returns The type info of member expression.
   */
  function getMemberExpressionTypeInfo(node: TSESTree.MemberExpression) {
    const propertyName = getPropertyName(
      node,
      context.sourceCode.getScope(node),
    );
    if (propertyName == null) {
      return null;
    }
    const object = getTypeInfo(node.object);
    if (!object) {
      return null;
    }
    if (propertyName === "prototype" && object.prototypeType) {
      return { type: object.prototypeType };
    }
    return getPropertyType(object, propertyName);
  }

  /**
   * Gets the type info of the pattern.
   * @param id The Identifier node.
   * @param pattern The pattern to get type info.
   * @param expression The expression to get type info.
   * @returns The type info of pattern or null if not found.
   */
  function getPatternTypeInfo(
    id: TSESTree.Identifier,
    pattern:
      | TSESTree.DestructuringPattern
      | TSESTree.Expression
      | TSESTree.TSEmptyBodyFunctionExpression,
    expression: TypeInfo,
  ): TypeInfo | null {
    if (pattern.type === "Identifier") {
      return pattern === id ? expression : null;
    }
    if (pattern.type === "ObjectPattern") {
      for (const prop of pattern.properties) {
        if (prop.type !== "Property") {
          continue;
        }
        const propertyName = getPropertyName(
          prop,
          context.sourceCode.getScope(pattern),
        );
        if (propertyName == null) {
          continue;
        }
        const property = getPropertyType(expression, propertyName);
        if (property == null) {
          continue;
        }
        const patternType = getPatternTypeInfo(id, prop.value, property);
        if (patternType != null) {
          return patternType;
        }
      }
      return null;
    }
    if (pattern.type === "ArrayPattern") {
      for (const [index, entry] of pattern.elements.entries()) {
        if (!entry) {
          continue;
        }
        const indexType = getPropertyType(expression, index);
        if (indexType == null) {
          continue;
        }
        const patternType = getPatternTypeInfo(id, entry, indexType);
        if (patternType != null) {
          return patternType;
        }
      }
      return null;
    }
    if (pattern.type === "AssignmentPattern") {
      return getPatternTypeInfo(id, pattern.left, expression);
    }
    return null;
  }
}
