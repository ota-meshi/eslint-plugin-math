import type { TSESTree } from "@typescript-eslint/types";
import type { SourceCode } from "eslint";
import {
  getInfoForMathAbsOrLike,
  getInfoForMathCeil,
  getInfoForMathFloor,
  getInfoForMathRound,
  getInfoForMathTrunc,
  getInfoForTransformingToMathTrunc,
} from "./math";
import {
  equalNodeTokens,
  isGlobalMethodCall,
  isGlobalObject,
  isGlobalObjectMethodCall,
  isGlobalObjectProperty,
  isLiteral,
} from "./ast";
import type { ExtractFunctionKeys } from "./type";

export type NumberMethod = ExtractFunctionKeys<typeof Number>;
export type NumberMethodInfo<M extends NumberMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression;
};
/**
 * Returns information if the condition checks whether the given expression is a positive number (or zero).
 */
export function getInfoForIsPositive(node: TSESTree.Expression): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    ">": isZero,
    ">=": isZero,
  });
}
/**
 * Returns information if the condition checks whether the given expression is a negative number (or zero).
 */
export function getInfoForIsNegative(node: TSESTree.Expression): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    "<": isZero,
    "<=": isZero,
  });
}
/**
 * Returns information if the condition checks whether the given expression is a to negative number.
 */
export function getInfoForToNegative(node: TSESTree.Expression): null | {
  from: "multiply" | "minus";
  argument: TSESTree.Expression;
} {
  if (node.type === "UnaryExpression" && node.operator === "-") {
    return { from: "minus", argument: node.argument };
  }
  if (node.type === "BinaryExpression" && node.operator === "*") {
    const { left, right } = node;
    if (left.type === "PrivateIdentifier") return null;
    for (const [a, b] of [
      [left, right],
      [right, left],
    ]) {
      if (isMinusOne(b)) {
        return { from: "multiply", argument: a };
      }
    }
    return null;
  }
  return null;
}
/**
 * Checks whether the given node is a `0`.
 */
export function isZero(node: TSESTree.Expression): boolean {
  return (
    isLiteral(node, 0) ||
    (node.type === "UnaryExpression" &&
      node.operator === "-" &&
      isLiteral(node.argument, 0))
  );
}
/**
 * Checks whether the given node is a `1`.
 */
export function isOne(node: TSESTree.Expression): boolean {
  return isLiteral(node, 1);
}
/**
 * Checks whether the given node is a `-1`.
 */
export function isMinusOne(node: TSESTree.Expression): boolean {
  return (
    isLiteral(node, -1) ||
    (node.type === "UnaryExpression" &&
      node.operator === "-" &&
      isLiteral(node.argument, 1))
  );
}
/**
 * Checks whether the given node is a `1/2`.
 */
export function isHalf(
  node: TSESTree.Expression | TSESTree.SpreadElement,
): boolean {
  return (
    isLiteral(node, 0.5) ||
    (node.type === "BinaryExpression" &&
      node.operator === "/" &&
      isLiteral(node.left, 1) &&
      isLiteral(node.right, 2))
  );
}
/**
 * Checks whether the given node is a `1/3`.
 */
export function isOneThird(
  node: TSESTree.Expression | TSESTree.SpreadElement,
): boolean {
  return (
    isLiteral(node, 1 / 3) ||
    (node.type === "BinaryExpression" &&
      node.operator === "/" &&
      isLiteral(node.left, 1) &&
      isLiteral(node.right, 3))
  );
}
/**
 * Checks whether the given node is a Number.MAX_SAFE_INTEGER.
 */
export function isMaxSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): boolean {
  return (
    isLiteral(node, Number.MAX_SAFE_INTEGER) ||
    isGlobalObjectProperty(node, "Number", "MAX_SAFE_INTEGER", sourceCode)
  );
}
/**
 * Checks whether the given node is a Number.MIN_SAFE_INTEGER.
 */
export function isMinSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): boolean {
  return (
    isLiteral(node, Number.MIN_SAFE_INTEGER) ||
    isGlobalObjectProperty(node, "Number", "MIN_SAFE_INTEGER", sourceCode) ||
    (node.type === "UnaryExpression" &&
      node.operator === "-" &&
      isMaxSafeInteger(node.argument, sourceCode))
  );
}
/**
 * Returns information if the given expression is Number.isInteger().
 */
export function getInfoFoNumberIsInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | NumberMethodInfo<"isInteger"> {
  if (
    isGlobalObjectMethodCall(node, "Number", "isInteger", sourceCode) &&
    node.arguments.length > 0 &&
    node.arguments[0].type !== "SpreadElement"
  ) {
    return {
      method: "isInteger",
      node,
      argument: node.arguments[0],
    };
  }
  return null;
}

export type TransformingToNumberIsInteger =
  | (NumberMethodInfo<"isInteger"> & {
      from: "trunc";
      node: TSESTree.BinaryExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "truncLike";
      node: TSESTree.BinaryExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "ceil";
      node: TSESTree.BinaryExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "floor";
      node: TSESTree.BinaryExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "round";
      node: TSESTree.BinaryExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "modulo";
      node:
        | TSESTree.BinaryExpression
        | TSESTree.UnaryExpression
        | TSESTree.CallExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isInteger"> & {
      from: "parseInt";
      node: TSESTree.BinaryExpression;
      not: boolean;
    });
/**
 * Returns information if the given expression can be transformed to Number.isInteger().
 */
export function getInfoForTransformingToNumberIsInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsInteger {
  if (node.type === "BinaryExpression") {
    const { left, right, operator } = node;
    if (left.type === "PrivateIdentifier") return null;
    if (operator === "===" || operator === "!==") {
      const not = operator === "!==";
      for (const [a, b] of [
        [left, right],
        [right, left],
      ]) {
        const toInt = getToIntegerWay(a);
        if (toInt) {
          if (!equalNodeTokens(toInt.argument, b, sourceCode)) continue;
          return {
            from: toInt.type,
            method: "isInteger",
            not,
            node,
            argument: toInt.argument,
          };
        }
        if (isZero(b) && isModuloOne(a)) {
          // n % 1 === 0
          return {
            from: "modulo",
            method: "isInteger",
            not,
            node,
            argument: a.left,
          };
        }
      }
    }
    if (isModuloOne(node)) {
      const parent = node.parent;
      if (
        (parent.type === "ConditionalExpression" ||
          parent.type === "IfStatement" ||
          parent.type === "ForStatement" ||
          parent.type === "WhileStatement" ||
          parent.type === "DoWhileStatement") &&
        parent.test === node
      ) {
        // if (n % 1) { ... }
        return {
          from: "modulo",
          method: "isInteger",
          not: true,
          node,
          argument: left,
        };
      }
    }
    return null;
  }
  if (node.type === "UnaryExpression") {
    if (node.operator !== "!") return null;
    const argument = node.argument as TSESTree.Expression; /* Maybe type bug */
    if (!isModuloOne(argument)) return null;
    // !(n % 1)
    return {
      from: "modulo",
      method: "isInteger",
      not: false,
      node,
      argument: argument.left,
    };
  }
  if (node.type === "CallExpression") {
    if (!isGlobalObject(node.callee, "Boolean", sourceCode)) return null;
    const argument = node.arguments.length > 0 ? node.arguments[0] : null;
    if (!argument || !isModuloOne(argument)) return null;
    // Boolean(n % 1)
    return {
      from: "modulo",
      method: "isInteger",
      not: true,
      node,
      argument: argument.left,
    };
  }
  return null;

  /**
   * Get way to convert to an integer.
   */
  function getToIntegerWay(a: TSESTree.Expression) {
    const trunc = getInfoForMathTrunc(a, sourceCode);
    if (trunc) return { ...trunc, type: "trunc" as const };
    const floor = getInfoForMathFloor(a, sourceCode);
    if (floor) return { ...floor, type: "floor" as const };
    const ceil = getInfoForMathCeil(a, sourceCode);
    if (ceil) return { ...ceil, type: "ceil" as const };
    const round = getInfoForMathRound(a, sourceCode);
    if (round) return { ...round, type: "round" as const };
    const truncLike = getInfoForTransformingToMathTrunc(a, sourceCode);
    if (truncLike) return { ...truncLike, type: "truncLike" as const };

    if (
      isGlobalMethodCall(a, "parseInt", sourceCode) ||
      isGlobalObjectMethodCall(a, "Number", "parseInt", sourceCode)
    ) {
      if (a.arguments.length > 0 && a.arguments[0].type !== "SpreadElement") {
        const argument = a.arguments[0];
        if (a.arguments.length > 1 && !isLiteral(a.arguments[1], 10)) {
          // parseInt(n, x), x is not 10
          return null;
        }
        return { argument, type: "parseInt" as const };
      }
    }
    return null;
  }
}
export type TransformingToNumberIsSafeInteger =
  | (NumberMethodInfo<"isSafeInteger"> & {
      from: "isInteger";
      node: TSESTree.LogicalExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isSafeInteger"> & {
      from: "isIntegerLike";
      node: TSESTree.LogicalExpression;
      not: boolean;
    });
/**
 * Returns information if the given expression can be transformed to Number.isSafeInteger().
 */
export function getInfoForTransformingToNumberIsSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsSafeInteger {
  if (node.type !== "LogicalExpression") return null;
  const { left, right, operator } = node;
  if (operator === "&&") {
    for (const [a, b] of [
      [left, right],
      [right, left],
    ]) {
      if (a.type === "LogicalExpression" && a.operator === "&&") {
        const operands = [a.left, a.right, b];
        const { result: isInteger, array: remainingOperands } = findAndMap(
          operands,
          (operand) => getInfoForNumberIsIntegerOrLike(operand, sourceCode),
        );
        if (isInteger && !isInteger.not) {
          for (const [x, y] of [
            remainingOperands,
            [...remainingOperands].reverse(),
          ]) {
            const lteMax = getInfoForIsLTEMaxSafeInteger(x, sourceCode);
            const gteMin = getInfoForIsGTEMinSafeInteger(y, sourceCode);
            if (
              lteMax &&
              gteMin &&
              equalNodeTokens(
                isInteger.argument,
                lteMax.argument,
                gteMin.argument,
                sourceCode,
              )
            ) {
              // Number.isInteger(n) && n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER
              return {
                from: isInteger.from,
                node,
                argument: isInteger.argument,
                not: false,
                method: "isSafeInteger",
              };
            }
          }
        }
      }
      const isInteger = getInfoForNumberIsIntegerOrLike(a, sourceCode);
      if (!isInteger || isInteger.not) continue;

      const inMax = getInfoForIsLTEMaxSafeInteger(b, sourceCode);
      if (!inMax) continue;
      const abs = getInfoForMathAbsOrLike(inMax.argument, sourceCode);
      if (
        !abs ||
        !equalNodeTokens(abs.argument, isInteger.argument, sourceCode)
      )
        continue;
      // Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER
      return {
        from: isInteger.from,
        node,
        argument: isInteger.argument,
        not: false,
        method: "isSafeInteger",
      };
    }

    return null;
  }
  if (operator === "||") {
    for (const [a, b] of [
      [left, right],
      [right, left],
    ]) {
      if (a.type === "LogicalExpression" && a.operator === "||") {
        const operands = [a.left, a.right, b];
        const { result: isInteger, array: remainingOperands } = findAndMap(
          operands,
          (operand) => getInfoForNumberIsIntegerOrLike(operand, sourceCode),
        );
        if (isInteger?.not) {
          for (const [x, y] of [
            remainingOperands,
            [...remainingOperands].reverse(),
          ]) {
            const gtMax = getInfoForIsGTMaxSafeInteger(x, sourceCode);
            const ltMin = getInfoForIsLTMinSafeInteger(y, sourceCode);
            if (
              gtMax &&
              ltMin &&
              equalNodeTokens(
                isInteger.argument,
                gtMax.argument,
                ltMin.argument,
                sourceCode,
              )
            ) {
              // !Number.isInteger(n) || n <= Number.MAX_SAFE_INTEGER || n >= Number.MIN_SAFE_INTEGE
              return {
                from: isInteger.from,
                node,
                argument: isInteger.argument,
                not: true,
                method: "isSafeInteger",
              };
            }
          }
        }
      }
      const isInteger = getInfoForNumberIsIntegerOrLike(a, sourceCode);
      const isNotInteger = isInteger?.not ? isInteger : null;
      if (!isNotInteger) continue;

      const overMax = getInfoForIsGTMaxSafeInteger(b, sourceCode);
      if (!overMax) continue;
      const abs = getInfoForMathAbsOrLike(overMax.argument, sourceCode);
      if (
        !abs ||
        !equalNodeTokens(abs.argument, isNotInteger.argument, sourceCode)
      )
        continue;
      // !Number.isInteger(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER
      return {
        from: isNotInteger.from,
        node,
        argument: isNotInteger.argument,
        not: true,
        method: "isSafeInteger",
      };
    }
    return null;
  }
  return null;
}

/**
 * Returns information if the condition checks whether the given expression is less than or equal Number.MAX_SAFE_INTEGER.
 */
export function getInfoForIsLTEMaxSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    "<=": (right) => isMaxSafeInteger(right, sourceCode),
  });
}
/**
 * Returns information if the condition checks whether the given expression is greater than Number.MAX_SAFE_INTEGER.
 */
export function getInfoForIsGTMaxSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    ">": (right) => isMaxSafeInteger(right, sourceCode),
  });
}
/**
 * Returns information if the condition checks whether the given expression is greater than or equal Number.MIN_SAFE_INTEGER.
 */
export function getInfoForIsGTEMinSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    ">=": (right) => isMinSafeInteger(right, sourceCode),
  });
}
/**
 * Returns information if the condition checks whether the given expression is less than Number.MIN_SAFE_INTEGER.
 */
export function getInfoForIsLTMinSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(node, {
    "<": (right) => isMinSafeInteger(right, sourceCode),
  });
}

/**
 * Checks whether the given node is a `n % 1`.
 */
function isModuloOne(
  node: TSESTree.Expression | TSESTree.SpreadElement,
): node is TSESTree.BinaryExpression & { left: TSESTree.Expression } {
  return (
    node.type === "BinaryExpression" &&
    node.operator === "%" &&
    isOne(node.right) &&
    node.left.type !== "PrivateIdentifier"
  );
}

/**
 * Get the argument from the binary expression.
 */
function getArgumentFromBinaryExpression(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  operators: Partial<
    Record<
      TSESTree.BinaryExpression["operator"],
      (right: TSESTree.Expression) => boolean
    >
  >,
): null | { argument: TSESTree.Expression } {
  if (node.type !== "BinaryExpression") return null;
  const { left, right, operator } = node;
  if (left.type === "PrivateIdentifier") return null;
  if (operators[operator]?.(right)) {
    return { argument: left };
  }
  const reverse =
    operator === "<"
      ? ">"
      : operator === ">"
        ? "<"
        : operator === "<="
          ? ">="
          : operator === ">="
            ? "<="
            : null;
  if (!reverse) return null;
  if (operators[reverse]?.(left)) {
    return { argument: right };
  }
  return null;
}

/**
 * Returns information if the condition checks whether the given expression is Number.isInteger() or like.
 */
function getInfoForNumberIsIntegerOrLike(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
):
  | (NumberMethodInfo<"isInteger"> & {
      from: "isInteger" | "isIntegerLike";
      not: boolean;
    })
  | null {
  const like = getInfoForTransformingToNumberIsInteger(node, sourceCode);
  if (like) return { ...like, from: "isIntegerLike" };
  const isInteger = getInfoFoNumberIsInteger(node, sourceCode);
  if (isInteger) return { ...isInteger, from: "isInteger", not: false };

  if (node.type !== "UnaryExpression" || node.operator !== "!") return null;
  const isNotInteger = getInfoFoNumberIsInteger(node.argument, sourceCode);
  if (isNotInteger) return { ...isNotInteger, from: "isInteger", not: true };
  return null;
}

/**
 * Find and map the array.
 */
function findAndMap<T, R>(
  array: T[],
  callback: (item: T) => R,
): {
  result: R | null;
  array: T[];
} {
  const remaining: T[] = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const result = callback(element);
    if (result) {
      remaining.push(...array.slice(index + 1));
      return {
        result,
        array: remaining,
      };
    }
    remaining.push(element);
  }
  return {
    result: null,
    array,
  };
}
