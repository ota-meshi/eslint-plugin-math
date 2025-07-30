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
  isStaticValue,
} from "./ast";
import type { ExtractFunctionKeys } from "./type";
import {
  processFourOperands,
  processLR,
  processThreeOperands,
  processTwoOperands,
  processTwoParams,
} from "./process";
import type { TypeChecker } from "eslint-type-tracer";

export type NumberMethod = ExtractFunctionKeys<NumberConstructor>;
export type NumberMethodInfo<M extends NumberMethod> = {
  method: M;
  node: TSESTree.Expression;
  argument: TSESTree.Expression;
};
export type NumberPropertyInfo<M extends keyof NumberConstructor> = {
  property: M;
  node: TSESTree.Expression;
};
/**
 * Returns information if the condition checks whether the given expression is a positive number (or zero).
 */
export function getInfoForIsPositive(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      ">": isZero,
      ">=": isZero,
    },
    sourceCode,
  );
}
/**
 * Returns information if the condition checks whether the given expression is a negative number (or zero).
 */
export function getInfoForIsNegative(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      "<": isZero,
      "<=": isZero,
    },
    sourceCode,
  );
}
/**
 * Returns information if the given expression is a to negative number.
 */
export function getInfoForToNegative(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  from: "*-1" | "-";
  argument: TSESTree.Expression;
} {
  if (node.type === "UnaryExpression" && node.operator === "-") {
    return { from: "-", argument: node.argument };
  }
  if (node.type === "BinaryExpression" && node.operator === "*") {
    for (const [left, right] of processLR(node)) {
      if (isMinusOne(right, sourceCode)) {
        return { from: "*-1", argument: left };
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
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 0, sourceCode);
}
/**
 * Checks whether the given node is a `1`.
 */
export function isOne(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 1, sourceCode);
}
/**
 * Checks whether the given node is a `2`.
 */
export function isTwo(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 2, sourceCode);
}
/**
 * Checks whether the given node is a `10`.
 */
export function isTen(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 10, sourceCode);
}
/**
 * Checks whether the given node is a `-1`.
 */
export function isMinusOne(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, -1, sourceCode);
}
/**
 * Checks whether the given node is a `1/2`.
 */
export function isHalf(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 0.5, sourceCode);
}
/**
 * Checks whether the given node is a `1/3`.
 */
export function isOneThird(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, 1 / 3, sourceCode);
}
/**
 * Checks whether the given node is a Number.MAX_SAFE_INTEGER.
 */
export function isMaxSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, Number.MAX_SAFE_INTEGER, sourceCode);
}
/**
 * Checks whether the given node is a Number.MIN_SAFE_INTEGER.
 */
export function isMinSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): node is TSESTree.Expression {
  return isStaticValue(node, Number.MIN_SAFE_INTEGER, sourceCode);
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
        if (isModuloOne(left, sourceCode) && isZero(right, sourceCode)) {
          // n % 1 === 0
          return {
            from: "modulo",
            method: "isInteger",
            not,
            node,
            argument: left.left as TSESTree.Expression,
          };
        }
      }
    }
    if (isModuloOne(node, sourceCode)) {
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
          argument: node.left as TSESTree.Expression,
        };
      }
    }
    return null;
  }
  if (node.type === "UnaryExpression") {
    if (node.operator !== "!") return null;
    const argument = node.argument;
    if (!isModuloOne(argument, sourceCode)) return null;
    // !(n % 1)
    return {
      from: "modulo",
      method: "isInteger",
      not: false,
      node,
      argument: argument.left as TSESTree.Expression,
    };
  }
  if (node.type === "CallExpression") {
    if (!isGlobalObject(node.callee, "Boolean", sourceCode)) return null;
    const argument = node.arguments.length > 0 ? node.arguments[0] : null;
    if (!argument || !isModuloOne(argument, sourceCode)) return null;
    // Boolean(n % 1)
    return {
      from: "modulo",
      method: "isInteger",
      not: true,
      node,
      argument: argument.left as TSESTree.Expression,
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
        const [argument] = a.arguments;
        if (a.arguments.length > 1 && !isTen(a.arguments[1], sourceCode)) {
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
      from: "global.isNaN with number";
      node: TSESTree.LogicalExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isNaN"> & {
      from: "global.isNaN";
      node: TSESTree.Expression;
      not?: undefined;
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
  objectTypeChecker: TypeChecker,
): null | TransformingToNumberIsNaN {
  if (node.type === "LogicalExpression") {
    const { operator } = node;
    if (operator !== "&&" && operator !== "||") return null;

    const not = operator === "||";
    return processTwoOperands(
      node,
      (operand) => getInfoForTypeOfNumber(operand, sourceCode),
      (operand) => getInfoForGlobalIsNaN(operand, sourceCode),
      (typeofNumber, globalIsNaN) => {
        if (
          typeofNumber.not !== not ||
          globalIsNaN.not !== not ||
          !equalNodeTokens(
            typeofNumber.argument,
            globalIsNaN.argument,
            sourceCode,
          )
        )
          return null;
        return {
          from: "global.isNaN with number",
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
    const { left, right } = node;
    if (!equalNodeTokens(left, right, sourceCode)) return null;
    return {
      from: "notEquals",
      node,
      argument: right,
      not: false,
      method: "isNaN",
    };
  }
  if (node.type === "CallExpression") {
    const info = getInfoForGlobalIsNaN(node, sourceCode);
    if (
      info &&
      !info.not &&
      objectTypeChecker(info.argument, "Number") === true
    ) {
      return {
        ...info,
        from: "global.isNaN",
        not: undefined,
      };
    }
  }
  if (!isGlobalObjectMethodCall(node, "Object", "is", sourceCode)) return null;

  return processTwoParams(
    node,
    (param) => (isGlobalObject(param, "NaN", sourceCode) ? param : null),
    (param) => param,
    (_a, b) => {
      return {
        from: "Object.is",
        node,
        argument: b,
        not: false,
        method: "isNaN",
      };
    },
  );
}

export type TransformingToNumberEPSILON =
  | (NumberPropertyInfo<"EPSILON"> & {
      from: "**";
      node: TSESTree.BinaryExpression;
    })
  | (NumberPropertyInfo<"EPSILON"> & {
      from: "pow";
      node: TSESTree.CallExpression;
    })
  | (NumberPropertyInfo<"EPSILON"> & {
      from: "literal";
      node: TSESTree.Expression;
    });
/**
 * Returns information if the given expression can be transformed to Number.isNaN().
 */
export function getInfoForTransformingToNumberEPSILON(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | TransformingToNumberEPSILON {
  if (node.type === "BinaryExpression") {
    if (
      node.operator === "**" &&
      isTwo(node.left as TSESTree.Expression, sourceCode) &&
      isStaticValue(node.right, -52, sourceCode)
    ) {
      return {
        from: "**",
        node,
        property: "EPSILON",
      };
    }
  } else if (node.type === "CallExpression") {
    if (
      isGlobalObjectMethodCall(node, "Math", "pow", sourceCode) &&
      node.arguments.length >= 2
    ) {
      if (
        isTwo(node.arguments[0], sourceCode) &&
        isStaticValue(node.arguments[1], -52, sourceCode)
      ) {
        return {
          from: "pow",
          node,
          property: "EPSILON",
        };
      }
    }
  }
  if (
    isStaticValue(node, Number.EPSILON, sourceCode) &&
    !isGlobalObjectProperty(node, "Number", "EPSILON", sourceCode)
  ) {
    return {
      from: "literal",
      node,
      property: "EPSILON",
    };
  }

  return null;
}

export type TransformingToNumberIsFinite =
  | (NumberMethodInfo<"isFinite"> & {
      from: "global.isFinite with number";
      node: TSESTree.LogicalExpression;
      not: boolean;
    })
  | (NumberMethodInfo<"isFinite"> & {
      from: "global.isFinite";
      node: TSESTree.Expression;
      not?: undefined;
    })
  | (NumberMethodInfo<"isFinite"> & {
      from: "conditional";
      node: TSESTree.LogicalExpression;
      not: boolean;
    });
/**
 * Returns information if the given expression can be transformed to Number.isNaN().
 */
export function getInfoForTransformingToNumberIsFinite(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
  objectTypeChecker: TypeChecker,
): null | TransformingToNumberIsFinite {
  if (node.type === "LogicalExpression") {
    const { operator } = node;
    if (operator !== "&&" && operator !== "||") return null;

    const not = operator === "||";
    return (
      processTwoOperands(
        node,
        (operand) => getInfoForTypeOfNumber(operand, sourceCode),
        (operand) => getInfoForGlobalIsFinite(operand, sourceCode),
        (typeofNumber, globalIsFinite) => {
          if (
            typeofNumber.not !== not ||
            globalIsFinite.not !== not ||
            !equalNodeTokens(
              typeofNumber.argument,
              globalIsFinite.argument,
              sourceCode,
            )
          )
            return null;
          return {
            from: "global.isFinite with number",
            node,
            argument: typeofNumber.argument,
            not,
            method: "isFinite",
          };
        },
      ) ||
      processFourOperands(
        node,
        (operand) => getInfoForTypeOfNumber(operand, sourceCode),
        (operand) => getInfoForEqualValue(operand, Infinity, sourceCode),
        (operand) => getInfoForEqualValue(operand, -Infinity, sourceCode),
        (operand) => getInfoForGlobalIsNaN(operand, sourceCode),
        (typeofNumber, eqInf, eqNInf, globalIsNaN) => {
          if (
            typeofNumber.not !== not ||
            eqInf.not === not ||
            eqNInf.not === not ||
            globalIsNaN.not === not ||
            !equalNodeTokens(
              typeofNumber.argument,
              eqInf.argument,
              eqNInf.argument,
              globalIsNaN.argument,
              sourceCode,
            )
          )
            return null;
          return {
            from: "conditional",
            node,
            argument: typeofNumber.argument,
            not,
            method: "isFinite",
          };
        },
      )
    );
  }
  if (node.type === "CallExpression") {
    const info = getInfoForGlobalIsFinite(node, sourceCode);
    if (
      info &&
      !info.not &&
      objectTypeChecker(info.argument, "Number") === true
    ) {
      return {
        ...info,
        from: "global.isFinite",
        not: undefined,
      };
    }
  }
  return null;
}

/**
 * Checks whether the given node is a `n % 1`.
 */
function isModuloOne(
  node: TSESTree.Expression | TSESTree.SpreadElement,
  sourceCode: SourceCode,
): node is TSESTree.BinaryExpression {
  return (
    node.type === "BinaryExpression" &&
    node.operator === "%" &&
    isOne(node.right, sourceCode)
  );
}

/**
 * Returns information if the given expression is Number.isInteger().
 */
function getInfoFoNumberIsInteger(
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

/**
 * Returns information if the condition checks whether the given expression is less than or equal Number.MAX_SAFE_INTEGER.
 */
function getInfoForIsLTEMaxSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      "<=": (right) => isMaxSafeInteger(right, sourceCode),
    },
    sourceCode,
  );
}

/**
 * Returns information if the condition checks whether the given expression is greater than Number.MAX_SAFE_INTEGER.
 */
function getInfoForIsGTMaxSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      ">": (right) => isMaxSafeInteger(right, sourceCode),
    },
    sourceCode,
  );
}

/**
 * Returns information if the condition checks whether the given expression is greater than or equal Number.MIN_SAFE_INTEGER.
 */
function getInfoForIsGTEMinSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      ">=": (right) => isMinSafeInteger(right, sourceCode),
    },
    sourceCode,
  );
}

/**
 * Returns information if the condition checks whether the given expression is less than Number.MIN_SAFE_INTEGER.
 */
function getInfoForIsLTMinSafeInteger(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
): null | {
  argument: TSESTree.Expression;
} {
  return getArgumentFromBinaryExpression(
    node,
    {
      "<": (right) => isMinSafeInteger(right, sourceCode),
    },
    sourceCode,
  );
}

/**
 * Returns information if the given expression is `typeof x === 'number'`.
 */
function getInfoForTypeOfNumber(
  node: TSESTree.Expression,
  sourceCode: SourceCode,
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
    if (!isStaticValue(right, "number", sourceCode)) continue;
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
  node: TSESTree.Expression,
  operators: Partial<
    Record<
      TSESTree.BinaryExpression["operator"],
      (right: TSESTree.Expression, sourceCode: SourceCode) => boolean
    >
  >,
  sourceCode: SourceCode,
): null | { argument: TSESTree.Expression } {
  if (node.type !== "BinaryExpression") return null;
  const { left, right, operator } = node;
  if (operators[operator]?.(right, sourceCode)) {
    return { argument: left as TSESTree.Expression };
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
  if (operators[reverse]?.(left as TSESTree.Expression, sourceCode)) {
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
 * Returns information if the condition checks whether the given expression is isNaN().
 */
function getInfoForGlobalIsNaN(
  node: TSESTree.Expression,
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
  node: TSESTree.Expression,
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

/**
 * Returns information if the given expression is `x === value` or `x !== value`.
 */
function getInfoForEqualValue(
  node: TSESTree.Expression,
  value: number,
  sourceCode: SourceCode,
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
    if (!isStaticValue(left, value, sourceCode)) continue;
    return {
      argument: right,
      not,
    };
  }
  return null;
}
