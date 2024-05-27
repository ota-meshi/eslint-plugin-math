// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types";
import abs from "../rules/abs";
import preferMathCbrt from "../rules/prefer-math-cbrt";
import preferMathSqrt from "../rules/prefer-math-sqrt";
import preferMathTrunc from "../rules/prefer-math-trunc";
import preferNumberIsInteger from "../rules/prefer-number-is-integer";
import preferNumberIsSafeInteger from "../rules/prefer-number-is-safe-integer";
import preferNumberMaxSafeInteger from "../rules/prefer-number-max-safe-integer";
import preferNumberMinSafeInteger from "../rules/prefer-number-min-safe-integer";

export const rules = [
  abs,
  preferMathCbrt,
  preferMathSqrt,
  preferMathTrunc,
  preferNumberIsInteger,
  preferNumberIsSafeInteger,
  preferNumberMaxSafeInteger,
  preferNumberMinSafeInteger,
] as RuleModule[];
