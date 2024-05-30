import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/no-static-nan-calculations";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "no-static-nan-calculations",
  rule as any,
  loadTestCases("no-static-nan-calculations"),
);
