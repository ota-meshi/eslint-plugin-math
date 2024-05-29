import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-number-is-finite";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-number-is-finite",
  rule as any,
  loadTestCases("prefer-number-is-finite"),
);
