// IMPORTANT!
// This file has been automatically generated,
// in order to update its content execute "npm run update"
import path from "path";
const base = require.resolve("./base");
const baseExtend =
  path.extname(`${base}`) === ".ts" ? "plugin:math/base" : base;
export = {
  extends: [baseExtend],
  rules: {
    // eslint-plugin-math rules
    "math/indent": "error",
  },
};
