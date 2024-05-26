import type { RuleModule } from "./types";
import { rules as ruleList } from "./utils/rules";
import * as recommended from "./configs/recommended";
import * as flatRecommended from "./configs/flat/recommended";
import * as meta from "./meta";
import type { Linter } from "eslint";

const configs = {
  "recommended-legacy": recommended,
  recommended: flatRecommended satisfies Linter.FlatConfig,
};

const rules = ruleList.reduce(
  (obj, r) => {
    obj[r.meta.docs.ruleName] = r;
    return obj;
  },
  {} as { [key: string]: RuleModule },
);

export { meta, configs, rules };
export default { meta, configs, rules };
