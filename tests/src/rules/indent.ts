import { RuleTester } from "../test-lib/eslint-compat";
import rule from "../../../src/rules/indent";
import { loadTestCases } from "../../utils/utils";

const tester = new RuleTester();

tester.run("indent", rule as any, loadTestCases("indent"));
