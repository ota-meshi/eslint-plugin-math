import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-number-is-safe-integer";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-number-is-safe-integer",
  rule as any,
  loadTestCases("prefer-number-is-safe-integer"),
);
