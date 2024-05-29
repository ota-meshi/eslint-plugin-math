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
import { processLR, processThreeOperands, processTwoOperands } from "./process";

export type NumberMethod = ExtractFunctionKeys<typeof Number>;
export type NumberMethodInfo<M extends NumberMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
};
/**
 * Returns information if the condition checks whether the given expression is a positive number (or zero).
 */
export function getInfoForIsPositive(node: TSESTree.Expression): null | {
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
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
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return getArgumentFromBinaryExpression(node, {
    "<": isZero,
    "<=": isZero,
  });
}
/**
 * Returns information if the given expression is a to negative number.
 */
export function getInfoForToNegative(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): null | {
  from: "multiply" | "minus";
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  if (node.type === "UnaryExpression" && node.operator === "-") {
    return { from: "minus", argument: node.argument };
  }
  if (node.type === "BinaryExpression" && node.operator === "*") {
    for (const [left, right] of processLR(node)) {
      if (isMinusOne(right)) {
        return { from: "multiply", argument: left };
      }
    }
    return null;
  }
  return null;
}
/**
 * Checks whether the given node is a `0`.
 */
export function isZero(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): node is TSESTree.Literal | TSESTree.UnaryExpression {
  if (isLiteral(node, 0)) return true;
  const neg = getInfoForToNegative(node);
  return (neg && isZero(neg.argument)) || false;
}
/**
 * Checks whether the given node is a `1`.
 */
export function isOne(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): node is TSESTree.Literal {
  return isLiteral(node, 1);
}
/**
 * Checks whether the given node is a `2`.
 */
export function isTwo(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
): node is TSESTree.Literal {
  return isLiteral(node, 2);
}
/**
 * Checks whether the given node is a `10`.
 */
export function isTen(
  node:
    | TSESTree.Expression
    | TSESTree.PrivateIdentifier
    | TSESTree.SpreadElement,
): node is TSESTree.Literal {
  return isLiteral(node, 10);
}
/**
 * Checks whether the given node is a `-1`.
 */
export function isMinusOne(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): node is TSESTree.Literal | TSESTree.UnaryExpression {
  if (isLiteral(node, -1)) return true; // Just to be safe
  const neg = getInfoForToNegative(node);
  return (neg && isOne(neg.argument)) || false;
}
/**
 * Checks whether the given node is a `1/2`.
 */
export function isHalf(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
): node is TSESTree.Literal | TSESTree.BinaryExpression {
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
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
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
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): boolean {
  return (
    isLiteral(node, Number.MAX_SAFE_INTEGER) ||
    isGlobalObjectProperty(node, "Number", "MAX_SAFE_INTEGER", sourceCode) ||
    // 2 ** 53 - 1
    (node.type === "BinaryExpression" &&
      // 2 ** 53
      node.left.type === "BinaryExpression" &&
      isTwo(node.left.left) &&
      node.left.operator === "**" &&
      isFiftyThree(node.left.right) &&
      // - 1
      node.operator === "-" &&
      isOne(node.right))
  );
}
/**
 * Checks whether the given node is a Number.MIN_SAFE_INTEGER.
 */
export function isMinSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): boolean {
  if (
    isLiteral(node, Number.MIN_SAFE_INTEGER) ||
    isGlobalObjectProperty(node, "Number", "MIN_SAFE_INTEGER", sourceCode)
  )
    return true;
  const neg = getInfoForToNegative(node);
  return (neg && isMaxSafeInteger(neg.argument, sourceCode)) || false;
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
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | TransformingToNumberIsInteger {
  if (node.type === "BinaryExpression") {
    const { operator } = node;
    if (operator === "===" || operator === "!==") {
      const not = operator === "!==";
      for (const [left, right] of processLR(node)) {
        const toInt = getToIntegerWay(left);
        if (toInt) {
          if (!equalNodeTokens(toInt.argument, right, sourceCode)) continue;
          return {
            from: toInt.type,
            method: "isInteger",
            not,
            node,
            argument: toInt.argument,
          };
        }
        if (isModuloOne(left) && isZero(right)) {
          // n % 1 === 0
          return {
            from: "modulo",
            method: "isInteger",
            not,
            node,
            argument: left.left,
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
          argument: node.left,
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
  function getToIntegerWay(
    a: TSESTree.Expression | TSESTree.PrivateIdentifier,
  ) {
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
        const [argument] = a.arguments;
        if (a.arguments.length > 1 && !isTen(a.arguments[1])) {
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
  const { operator } = node;
  if (operator === "&&" || operator === "||") {
    const not = operator === "||";

    return (
      processThreeOperands(
        node,
        (operand) => getInfoForNumberIsIntegerOrLike(operand, sourceCode),
        !not
          ? (operand) => getInfoForIsLTEMaxSafeInteger(operand, sourceCode)
          : (operand) => getInfoForIsGTMaxSafeInteger(operand, sourceCode),
        !not
          ? (operand) => getInfoForIsGTEMinSafeInteger(operand, sourceCode)
          : (operand) => getInfoForIsLTMinSafeInteger(operand, sourceCode),
        (
          isInteger,
          compMax,
          compMin,
        ): TransformingToNumberIsSafeInteger | null => {
          if (
            isInteger.not !== not ||
            !equalNodeTokens(
              isInteger.argument,
              compMax.argument,
              compMin.argument,
              sourceCode,
            )
          )
            return null;

          // Number.isInteger(n) && n <= Number.MAX_SAFE_INTEGER && n >= Number.MIN_SAFE_INTEGER
          // or
          // !Number.isInteger(n) || n <= Number.MAX_SAFE_INTEGER || n >= Number.MIN_SAFE_INTEGER
          return {
            from: isInteger.from,
            node,
            argument: isInteger.argument,
            not,
            method: "isSafeInteger",
          };
        },
      ) ||
      processTwoOperands(
        node,
        (operand) => getInfoForNumberIsIntegerOrLike(operand, sourceCode),
        (operand) => {
          const compMax = !not
            ? getInfoForIsLTEMaxSafeInteger(operand, sourceCode)
            : getInfoForIsGTMaxSafeInteger(operand, sourceCode);
          return (
            compMax && getInfoForMathAbsOrLike(compMax.argument, sourceCode)
          );
        },
        (isInteger, abs): TransformingToNumberIsSafeInteger | null => {
          if (
            isInteger.not !== not ||
            !equalNodeTokens(abs.argument, isInteger.argument, sourceCode)
          )
            return null;

          // Number.isInteger(n) && Math.abs(n) <= Number.MAX_SAFE_INTEGER
          // or
          // !Number.isInteger(n) || Math.abs(n) > Number.MAX_SAFE_INTEGER
          return {
            from: isInteger.from,
            node,
            argument: isInteger.argument,
            not,
            method: "isSafeInteger",
          };
        },
      )
    );
  }
  return null;
}
export type TransformingToNumberIsNaN =
  | (NumberMethodInfo<"isNaN"> & {
      from: "global.isNaN";
      node: TSESTree.LogicalExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isNaN"> & {
      from: "notEquals";
      node: TSESTree.BinaryExpression;
      not: false;
    })
  | (NumberMethodInfo<"isNaN"> & {
      from: "Object.is";
      node: TSESTree.CallExpression;
      not: false;
    });
/**
 * Returns information if the given expression can be transformed to Number.isNaN().
 */
export function getInfoForTransformingToNumberIsNaN(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsNaN {
  if (node.type === "LogicalExpression") {
    const { operator } = node;
    if (operator !== "&&" && operator !== "||") return null;

    const not = operator === "||";
    return processTwoOperands(
      node,
      getInfoForTypeOfNumber,
      (operand) => getInfoForGlobalIsNaN(operand, sourceCode),
      (typeofNumber, globalIsNaN) => {
        if (
          globalIsNaN.not !== not ||
          !equalNodeTokens(
            typeofNumber.argument,
            globalIsNaN.argument,
            sourceCode,
          )
        )
          return null;
        return {
          from: "global.isNaN",
          node,
          argument: typeofNumber.argument,
          not,
          method: "isNaN",
        };
      },
    );
  }
  if (node.type === "BinaryExpression") {
    const { operator } = node;
    if (operator !== "!==" && operator !== "!=") return null;
    for (const [left, right] of processLR(node)) {
      if (!equalNodeTokens(left, right, sourceCode)) continue;
      return {
        from: "notEquals",
        node,
        argument: right,
        not: false,
        method: "isNaN",
      };
    }
  }
  if (
    !isGlobalObjectMethodCall(node, "Object", "is", sourceCode) ||
    node.arguments.length < 2
  )
    return null;
  const [x, y] = node.arguments;
  for (const [a, b] of [
    [x, y],
    [y, x],
  ]) {
    if (a.type === "SpreadElement") continue;
    if (isGlobalObject(b, "NaN", sourceCode)) {
      return {
        from: "Object.is",
        node,
        argument: a,
        not: false,
        method: "isNaN",
      };
    }
  }
  return null;
}

export type TransformingToNumberIsFinite = NumberMethodInfo<"isFinite"> & {
  from: "global.isFinite";
  node: TSESTree.LogicalExpression;
  not: boolean;
};
/**
 * Returns information if the given expression can be transformed to Number.isNaN().
 */
export function getInfoForTransformingToNumberIsFinite(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberIsFinite {
  if (node.type === "LogicalExpression") {
    const { operator } = node;
    if (operator !== "&&" && operator !== "||") return null;

    const not = operator === "||";
    return processTwoOperands(
      node,
      getInfoForTypeOfNumber,
      (operand) => getInfoForGlobalIsFinite(operand, sourceCode),
      (typeofNumber, globalIsFinite) => {
        if (
          globalIsFinite.not !== not ||
          !equalNodeTokens(
            typeofNumber.argument,
            globalIsFinite.argument,
            sourceCode,
          )
        )
          return null;
        return {
          from: "global.isFinite",
          node,
          argument: typeofNumber.argument,
          not,
          method: "isFinite",
        };
      },
    );
  }
  return null;
}

/**
 * Checks whether the given node is a `n % 1`.
 */
function isModuloOne(
  node:
    | TSESTree.Expression
    | TSESTree.SpreadElement
    | TSESTree.PrivateIdentifier,
): node is TSESTree.BinaryExpression {
  return (
    node.type === "BinaryExpression" &&
    node.operator === "%" &&
    isOne(node.right)
  );
}

/**
 * Checks whether the given node is a `53`.
 */
function isFiftyThree(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): node is TSESTree.Literal {
  return isLiteral(node, 53);
}

/**
 * Returns information if the given expression is Number.isInteger().
 */
function getInfoFoNumberIsInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
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

/**
 * Returns information if the condition checks whether the given expression is less than or equal Number.MAX_SAFE_INTEGER.
 */
function getInfoForIsLTEMaxSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return getArgumentFromBinaryExpression(node, {
    "<=": (right) => isMaxSafeInteger(right, sourceCode),
  });
}

/**
 * Returns information if the condition checks whether the given expression is greater than Number.MAX_SAFE_INTEGER.
 */
function getInfoForIsGTMaxSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return getArgumentFromBinaryExpression(node, {
    ">": (right) => isMaxSafeInteger(right, sourceCode),
  });
}

/**
 * Returns information if the condition checks whether the given expression is greater than or equal Number.MIN_SAFE_INTEGER.
 */
function getInfoForIsGTEMinSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return getArgumentFromBinaryExpression(node, {
    ">=": (right) => isMinSafeInteger(right, sourceCode),
  });
}

/**
 * Returns information if the condition checks whether the given expression is less than Number.MIN_SAFE_INTEGER.
 */
function getInfoForIsLTMinSafeInteger(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression | TSESTree.PrivateIdentifier;
} {
  return getArgumentFromBinaryExpression(node, {
    "<": (right) => isMinSafeInteger(right, sourceCode),
  });
}

/**
 * Returns information if the given expression is `typeof x === 'number'`.
 */
function getInfoForTypeOfNumber(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
): null | {
  argument: TSESTree.Expression;
  not: boolean;
} {
  if (
    node.type !== "BinaryExpression" ||
    (node.operator !== "===" &&
      node.operator !== "==" &&
      node.operator !== "!==" &&
      node.operator !== "!=")
  )
    return null;

  const { operator } = node;
  const not = operator === "!==" || operator === "!=";
  for (const [left, right] of processLR(node)) {
    if (left.type !== "UnaryExpression" || left.operator !== "typeof") continue;
    if (!isLiteral(right, "number")) continue;
    return {
      argument: left.argument,
      not,
    };
  }
  return null;
}

/**
 * Get the argument from the binary expression.
 */
function getArgumentFromBinaryExpression(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  operators: Partial<
    Record<
      TSESTree.BinaryExpression["operator"],
      (right: TSESTree.Expression | TSESTree.PrivateIdentifier) => boolean
    >
  >,
): null | { argument: TSESTree.Expression | TSESTree.PrivateIdentifier } {
  if (node.type !== "BinaryExpression") return null;
  const { left, right, operator } = node;
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
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
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
 * Returns information if the condition checks whether the given expression is isNaN().
 */
function getInfoForGlobalIsNaN(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
):
  | (NumberMethodInfo<"isNaN"> & {
      not: boolean;
    })
  | null {
  if (
    isGlobalMethodCall(node, "isNaN", sourceCode) &&
    node.arguments.length > 0 &&
    node.arguments[0].type !== "SpreadElement"
  ) {
    return {
      method: "isNaN",
      node,
      argument: node.arguments[0],
      not: false,
    };
  }
  if (node.type !== "UnaryExpression" || node.operator !== "!") return null;
  const argument = node.argument;
  if (
    isGlobalMethodCall(argument, "isNaN", sourceCode) &&
    argument.arguments.length > 0 &&
    argument.arguments[0].type !== "SpreadElement"
  ) {
    return {
      method: "isNaN",
      node,
      argument: argument.arguments[0],
      not: true,
    };
  }
  return null;
}

/**
 * Returns information if the condition checks whether the given expression is isFinite().
 */
function getInfoForGlobalIsFinite(
  node: TSESTree.Expression | TSESTree.PrivateIdentifier,
  sourceCode: SourceCode,
):
  | (NumberMethodInfo<"isFinite"> & {
      not: boolean;
    })
  | null {
  if (
    isGlobalMethodCall(node, "isFinite", sourceCode) &&
    node.arguments.length > 0 &&
    node.arguments[0].type !== "SpreadElement"
  ) {
    return {
      method: "isFinite",
      node,
      argument: node.arguments[0],
      not: false,
    };
  }
  if (node.type !== "UnaryExpression" || node.operator !== "!") return null;
  const argument = node.argument;
  if (
    isGlobalMethodCall(argument, "isFinite", sourceCode) &&
    argument.arguments.length > 0 &&
    argument.arguments[0].type !== "SpreadElement"
  ) {
    return {
      method: "isFinite",
      node,
      argument: argument.arguments[0],
      not: true,
    };
  }
  return null;
}
