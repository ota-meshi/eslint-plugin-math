import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-exponentiation-operator";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "prefer-exponentiation-operator",
  rule as any,
  loadTestCases("prefer-exponentiation-operator"),
);
