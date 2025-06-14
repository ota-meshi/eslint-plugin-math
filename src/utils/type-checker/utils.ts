import type { TSESTree } from "@typescript-eslint/types";
import type { TypeName } from "./types";

export type ObjectTypeChecker = (
  objectNode: TSESTree.Expression,
  className: TypeName,
  memberAccessNode?: TSESTree.MemberExpression | TSESTree.Property,
) => boolean | "aggressive";
/**
 * Check if the type of the given node is given class or not.
 * @param node The expression node.
 * @param className The class name to disallow.
 * @returns `true` if should disallow it.
 */
export function checkExpressionNodeType(
  node: TSESTree.Expression | TSESTree.Super,
  className: TypeName,
): boolean | null {
  // If it's obvious, shortcut.
  if (node.type === "ArrayExpression") {
    return className === "Array";
  }
  if (node.type === "Literal") {
    if ("regex" in node && node.regex) {
      return className === "RegExp";
    }
    if ("bigint" in node && node.bigint) {
      return className === "BigInt";
    }
    if (typeof node.value === "string") {
      return className === "String";
    }
    if (typeof node.value === "number") {
      return className === "Number";
    }
    if (typeof node.value === "boolean") {
      return className === "Boolean";
    }
    return false;
  }
  if (node.type === "TemplateLiteral") {
    return className === "String";
  }
  if (
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression" ||
    node.type === "ClassExpression"
  ) {
    return className === "Function";
  }
  if (node.type === "UpdateExpression") {
    return className === "Number";
  }

  return null;
}
