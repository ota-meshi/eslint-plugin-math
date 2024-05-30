import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/no-static-infinity-calculations";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run(
  "no-static-infinity-calculations",
  rule as any,
  loadTestCases("no-static-infinity-calculations"),
);
