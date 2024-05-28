// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types";
import abs from "../rules/abs";
import preferMathCbrt from "../rules/prefer-math-cbrt";
import preferMathLn2 from "../rules/prefer-math-ln2";
import preferMathSqrt from "../rules/prefer-math-sqrt";
import preferMathSqrt12 from "../rules/prefer-math-sqrt1-2";
import preferMathSqrt2 from "../rules/prefer-math-sqrt2";
import preferMathTrunc from "../rules/prefer-math-trunc";
import preferNumberIsFinite from "../rules/prefer-number-is-finite";
import preferNumberIsInteger from "../rules/prefer-number-is-integer";
import preferNumberIsNan from "../rules/prefer-number-is-nan";
import preferNumberIsSafeInteger from "../rules/prefer-number-is-safe-integer";
import preferNumberMaxSafeInteger from "../rules/prefer-number-max-safe-integer";
import preferNumberMinSafeInteger from "../rules/prefer-number-min-safe-integer";

export const rules = [
  abs,
  preferMathCbrt,
  preferMathLn2,
  preferMathSqrt,
  preferMathSqrt12,
  preferMathSqrt2,
  preferMathTrunc,
  preferNumberIsFinite,
  preferNumberIsInteger,
  preferNumberIsNan,
  preferNumberIsSafeInteger,
  preferNumberMaxSafeInteger,
  preferNumberMinSafeInteger,
] as RuleModule[];
