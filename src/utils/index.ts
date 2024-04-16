/* eslint @typescript-eslint/no-explicit-any: off -- util */
import type { Rule } from "eslint";
import type { PartialRuleModule, RuleModule } from "src/types";

/**
 * Define the rule.
 * @param ruleName ruleName
 * @param rule rule module
 */
export function createRule(
  ruleName: string,
  rule: PartialRuleModule,
): RuleModule {
  return {
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta.docs,
        url: `https://ota-meshi.github.io/eslint-plugin-math/rules/${ruleName}.html`,
        ruleId: `math/${ruleName}`,
        ruleName,
      },
    },
    create(context: Rule.RuleContext): any {
      return rule.create(context as any);
    },
  };
}
