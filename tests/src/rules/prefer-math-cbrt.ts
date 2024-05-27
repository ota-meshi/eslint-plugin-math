import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-cbrt";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run("prefer-math-cbrt", rule as any, loadTestCases("prefer-math-cbrt"));
