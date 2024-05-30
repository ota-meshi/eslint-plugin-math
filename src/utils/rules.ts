// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import type { RuleModule } from "../types";
import abs from "../rules/abs";
import noStaticInfinityCalculations from "../rules/no-static-infinity-calculations";
import noStaticNanCalculations from "../rules/no-static-nan-calculations";
import preferMathCbrt from "../rules/prefer-math-cbrt";
import preferMathE from "../rules/prefer-math-e";
import preferMathLn10 from "../rules/prefer-math-ln10";
import preferMathLn2 from "../rules/prefer-math-ln2";
import preferMathLog10 from "../rules/prefer-math-log10";
import preferMathLog10e from "../rules/prefer-math-log10e";
import preferMathLog2 from "../rules/prefer-math-log2";
import preferMathLog2e from "../rules/prefer-math-log2e";
import preferMathPi from "../rules/prefer-math-pi";
import preferMathSqrt from "../rules/prefer-math-sqrt";
import preferMathSqrt12 from "../rules/prefer-math-sqrt1-2";
import preferMathSqrt2 from "../rules/prefer-math-sqrt2";
import preferMathTrunc from "../rules/prefer-math-trunc";
import preferNumberEpsilon from "../rules/prefer-number-epsilon";
import preferNumberIsFinite from "../rules/prefer-number-is-finite";
import preferNumberIsInteger from "../rules/prefer-number-is-integer";
import preferNumberIsNan from "../rules/prefer-number-is-nan";
import preferNumberIsSafeInteger from "../rules/prefer-number-is-safe-integer";
import preferNumberMaxSafeInteger from "../rules/prefer-number-max-safe-integer";
import preferNumberMinSafeInteger from "../rules/prefer-number-min-safe-integer";

export const rules = [
  abs,
  noStaticInfinityCalculations,
  noStaticNanCalculations,
  preferMathCbrt,
  preferMathE,
  preferMathLn10,
  preferMathLn2,
  preferMathLog10,
  preferMathLog10e,
  preferMathLog2,
  preferMathLog2e,
  preferMathPi,
  preferMathSqrt,
  preferMathSqrt12,
  preferMathSqrt2,
  preferMathTrunc,
  preferNumberEpsilon,
  preferNumberIsFinite,
  preferNumberIsInteger,
  preferNumberIsNan,
  preferNumberIsSafeInteger,
  preferNumberMaxSafeInteger,
  preferNumberMinSafeInteger,
] as RuleModule[];
