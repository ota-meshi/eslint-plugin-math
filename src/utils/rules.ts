// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types";
import abs from "../rules/abs";
import preferMathCbrt from "../rules/prefer-math-cbrt";
import preferMathSqrt from "../rules/prefer-math-sqrt";
import preferMathSqrt2 from "../rules/prefer-math-sqrt2";
import preferMathTrunc from "../rules/prefer-math-trunc";
import preferNumberIsInteger from "../rules/prefer-number-is-integer";
import preferNumberIsNan from "../rules/prefer-number-is-nan";
import preferNumberIsSafeInteger from "../rules/prefer-number-is-safe-integer";
import preferNumberMaxSafeInteger from "../rules/prefer-number-max-safe-integer";
import preferNumberMinSafeInteger from "../rules/prefer-number-min-safe-integer";

export const rules = [
  abs,
  preferMathCbrt,
  preferMathSqrt,
  preferMathSqrt2,
  preferMathTrunc,
  preferNumberIsInteger,
  preferNumberIsNan,
  preferNumberIsSafeInteger,
  preferNumberMaxSafeInteger,
  preferNumberMinSafeInteger,
] as RuleModule[];
