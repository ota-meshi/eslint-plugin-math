import type { Rule } from "eslint";
import type { TypeChecker } from "eslint-type-tracer";
import { buildTypeChecker } from "eslint-type-tracer";

/**
 * Build object type checker.
 * @param context The rule context.
 * @param aggressiveResult The value to return if the type cannot be determined.
 * @returns Returns an object type checker.
 */
export function buildObjectTypeChecker(context: Rule.RuleContext): TypeChecker {
  const aggressiveOption = getAggressiveOption(context);
  return buildTypeChecker(context.sourceCode, { aggressive: aggressiveOption });
}

/**
 * Get `aggressive` option value.
 * @param context The rule context.
 * @returns The gotten `aggressive` option value.
 */
function getAggressiveOption(context: Rule.RuleContext): boolean {
  const options = context.options[0];
  if (options && typeof options.aggressive === "boolean") {
    return options.aggressive;
  }

  const globalOptions = context.settings.math as
    | Record<string, unknown>
    | undefined;
  if (globalOptions && typeof globalOptions.aggressive === "boolean") {
    return globalOptions.aggressive;
  }

  return false;
}
