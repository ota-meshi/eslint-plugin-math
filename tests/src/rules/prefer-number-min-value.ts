import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-number-min-value";
import { loadTestCases } from "../../utils/utils";
const tester = new SnapshotRuleTester();
tester.run(
  "prefer-number-min-value",
  rule as any,
  loadTestCases("prefer-number-min-value"),
);
