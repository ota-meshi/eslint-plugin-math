import type { DefaultTheme, UserConfig } from "vitepress";
import { defineConfig } from "vitepress";
import path from "path";
import { fileURLToPath } from "url";
import eslint4b from "vite-plugin-eslint4b";
import type { RuleModule } from "../../src/types.js";
import { viteCommonjs } from "./vite-plugin.mjs";

import "./build-system/build.js";
const dirname = path.dirname(fileURLToPath(import.meta.url));

function ruleToSidebarItem({
  meta: {
    docs: { ruleId, ruleName },
  },
}: RuleModule): DefaultTheme.SidebarItem {
  return {
    text: ruleId,
    link: `/rules/${ruleName}`,
  };
}

export default async (): Promise<UserConfig<DefaultTheme.Config>> => {
  const a = "../../lib/utils/rules.js";
  const { rules } = (await import(a)) as { rules: RuleModule[] };
  return defineConfig({
    base: "/eslint-plugin-math/",
    title: "eslint-plugin-math",
    outDir: path.join(dirname, "./dist/eslint-plugin-math"),
    description: "ESLint plugin related to Math namespace object",
    head: [],

    vite: {
      plugins: [viteCommonjs(), eslint4b()],
      define: {
        "process.env.NODE_DEBUG": "false",
      },
    },

    lastUpdated: true,
    themeConfig: {
      logo: "/logo.svg",
      search: {
        provider: "local",
        options: {
          detailedView: true,
        },
      },
      editLink: {
        pattern:
          "https://github.com/ota-meshi/eslint-plugin-math/edit/main/docs/:path",
      },
      nav: [
        { text: "Introduction", link: "/" },
        { text: "User Guide", link: "/user-guide/" },
        { text: "Rules", link: "/rules/" },
        { text: "Playground", link: "/playground/" },
      ],
      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/ota-meshi/eslint-plugin-math",
        },
      ],
      sidebar: {
        "/rules/": [
          {
            text: "Rules",
            items: [{ text: "Available Rules", link: "/rules/" }],
          },
          {
            text: "Math Rules",
            collapsed: false,
            items: rules
              .filter((rule) => !rule.meta.deprecated)
              .map(ruleToSidebarItem),
          },

          // Rules in no category.
          ...(rules.some((rule) => rule.meta.deprecated)
            ? [
                {
                  text: "Deprecated",
                  collapsed: false,
                  items: rules
                    .filter((rule) => rule.meta.deprecated)
                    .map(ruleToSidebarItem),
                },
              ]
            : []),
        ],
        "/": [
          {
            text: "Guide",
            items: [
              { text: "Introduction", link: "/" },
              { text: "User Guide", link: "/user-guide/" },
              { text: "Rules", link: "/rules/" },
            ],
          },
        ],
      },
    },
  });
};
