import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-ln2";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run("prefer-math-ln2", rule as any, loadTestCases("prefer-math-ln2"));
