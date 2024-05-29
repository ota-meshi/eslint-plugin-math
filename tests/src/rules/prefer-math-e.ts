import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-e";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run("prefer-math-e", rule as any, loadTestCases("prefer-math-e"));
