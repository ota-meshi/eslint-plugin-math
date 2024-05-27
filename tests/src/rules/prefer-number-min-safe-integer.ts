import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-number-min-safe-integer";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-number-min-safe-integer",
  rule as any,
  loadTestCases("prefer-number-min-safe-integer"),
);
