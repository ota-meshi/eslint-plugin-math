import type { TSESTree } from "@typescript-eslint/types";
import type { Scope as TSESListScope } from "@typescript-eslint/scope-manager";
import type { Scope } from "eslint";
export {
  ReferenceTracker,
  TrackedReferences,
  isParenthesized,
} from "../../../node_modules/@types/eslint-utils";

export function findVariable(
  initialScope: TSESListScope | Scope,
  nameOrNode: TSESTree.Identifier | string,
): Scope.Variable | null;

/**
 * Get the property name from a MemberExpression node or a Property node.
 */
export function getPropertyName(
  node:
    | TSESTree.MemberExpression
    | TSESTree.MethodDefinition
    | TSESTree.Property
    | TSESTree.PropertyDefinition,
  initialScope?: TSESListScope | Scope,
): string | null;
