import { SnapshotRuleTester } from "eslint-snapshot-rule-tester";
import rule from "../../../src/rules/prefer-math-sqrt";
import { loadTestCases } from "../../utils/utils";

const tester = new SnapshotRuleTester();

tester.run("prefer-math-sqrt", rule as any, loadTestCases("prefer-math-sqrt"));
