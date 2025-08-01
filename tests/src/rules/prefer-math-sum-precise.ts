import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-sum-precise";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-math-sum-precise",
  rule as any,
  loadTestCases("prefer-math-sum-precise"),
);
