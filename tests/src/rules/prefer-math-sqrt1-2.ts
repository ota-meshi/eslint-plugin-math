import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-sqrt1-2";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-math-sqrt1-2",
  rule as any,
  loadTestCases("prefer-math-sqrt1-2"),
);
