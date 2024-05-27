import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/abs";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run("abs", rule as any, loadTestCases("abs"));
