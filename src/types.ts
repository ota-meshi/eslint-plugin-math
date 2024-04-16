/* eslint @typescript-eslint/naming-convention: off, @typescript-eslint/no-explicit-any: off -- for type */
import type { Rule } from "eslint";
import type { JSONSchema4 } from "json-schema";

export interface RuleModule extends Rule.RuleModule {
  meta: RuleMetaData;
  create(context: Rule.RuleContext): Rule.RuleListener;
}

export interface RuleMetaData {
  docs: {
    description: string;
    categories: ("recommended" | "standard")[] | null;
    url: string;
    ruleId: string;
    ruleName: string;
    default?: "error" | "warn";
  };
  messages: { [messageId: string]: string };
  fixable?: "code" | "whitespace";
  hasSuggestions?: boolean;
  schema: JSONSchema4 | JSONSchema4[];
  deprecated?: boolean;
  replacedBy?: string[];
  type: "problem" | "suggestion" | "layout";
}

export interface PartialRuleModule {
  meta: PartialRuleMetaData;
  create(context: Rule.RuleContext): Rule.RuleListener;
}

export interface PartialRuleMetaData {
  docs: {
    description: string;
    categories: ("recommended" | "standard")[] | null;
    default?: "error" | "warn";
  };
  messages: { [messageId: string]: string };
  fixable?: "code" | "whitespace";
  hasSuggestions?: boolean;
  schema: JSONSchema4 | JSONSchema4[];
  deprecated?: boolean;
  replacedBy?: string[];
  type: "problem" | "suggestion" | "layout";
}
