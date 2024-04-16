import type { RuleModule } from "./types";
import { rules as ruleList } from "./utils/rules";
import recommended from "./configs/recommended";
import standard from "./configs/standard";
import flatRecommended from "./configs/flat/recommended";
import flatStandard from "./configs/flat/standard";
import * as meta from "./meta";

const configs = {
  recommended,
  standard,
  "flat/recommended": flatRecommended,
  "flat/standard": flatStandard,
};

const rules = ruleList.reduce(
  (obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
  },
  {} as { [key: string]: RuleModule },
);

export = {
  meta,
  configs,
  rules,
};
