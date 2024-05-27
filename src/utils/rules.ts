// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types";
import preferMathCbrt from "../rules/prefer-math-cbrt";
import preferMathSqrt from "../rules/prefer-math-sqrt";
import preferMathTrunc from "../rules/prefer-math-trunc";
import preferNumberIsInteger from "../rules/prefer-number-is-integer";

export const rules = [
  preferMathCbrt,
  preferMathSqrt,
  preferMathTrunc,
  preferNumberIsInteger,
] as RuleModule[];
