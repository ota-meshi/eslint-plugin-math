import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-hypot";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-math-hypot",
  rule as any,
  loadTestCases("prefer-math-hypot"),
);
