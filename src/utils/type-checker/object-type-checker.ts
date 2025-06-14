import type { ObjectTypeChecker } from "./utils";
import type { Rule } from "eslint";
import { buildObjectTypeCheckerForES } from "./object-type-checker-for-es";
import { buildObjectTypeCheckerForTS } from "./object-type-checker-for-ts";

export type ObjectTypeCheckerOptions = {
  pluginNamespace: string | string[];
};
/**
 * Build object type checker.
 * @param context The rule context.
 * @param aggressiveResult The value to return if the type cannot be determined.
 * @returns Returns an object type checker.
 */
export function buildObjectTypeChecker(
  context: Rule.RuleContext,
  options: ObjectTypeCheckerOptions,
): ObjectTypeChecker {
  const aggressiveOption = getAggressiveOption(context, options);
  const aggressiveResult = aggressiveOption ? "aggressive" : false;
  return (
    buildObjectTypeCheckerForTS(context, aggressiveResult) ||
    buildObjectTypeCheckerForES(context, aggressiveResult)
  );
}

/**
 * Get `aggressive` option value.
 * @param context The rule context.
 * @returns The gotten `aggressive` option value.
 */
function getAggressiveOption(
  context: Rule.RuleContext,
  option: ObjectTypeCheckerOptions,
): boolean {
  const options = context.options[0];
  if (options && typeof options.aggressive === "boolean") {
    return options.aggressive;
  }

  for (const ns of [option.pluginNamespace].flat()) {
    const globalOptions = context.settings[ns] as
      | Record<string, unknown>
      | undefined;
    if (globalOptions && typeof globalOptions.aggressive === "boolean") {
      return globalOptions.aggressive;
    }
  }

  return false;
}
