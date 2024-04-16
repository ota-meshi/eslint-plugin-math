import { createRule } from "../utils";

export default createRule("indent", {
  meta: {
    docs: {
      description: "enforce consistent indentation",
      categories: ["standard"],
    },
    fixable: "whitespace",
    schema: [
      {
        oneOf: [
          {
            enum: ["tab"],
          },
          {
            type: "integer",
            minimum: 0,
          },
        ],
      },
      {
        type: "object",
        properties: {
          subTables: { type: "integer", minimum: 0 },
          keyValuePairs: { type: "integer", minimum: 0 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      wrongIndentation:
        "Expected indentation of {{expected}} but found {{actual}}.",
    },
    type: "layout",
  },
  create(_context) {
    // const _sourceCode = getSourceCode(context);

    return {
      "Program:exit"(_node) {
        // noop
      },
    };
  },
});
