const path = require("path");

const { ifAnyDep, hasFile, hasPkgProp, fromRoot } = require("../utils");

const here = (p) => path.join(__dirname, p);

const useBuiltInBabelConfig =
  !hasFile(".babelrc") &&
  !hasFile(".babelrc.js") &&
  !hasFile("babel.config.json") &&
  !hasFile("babel.config.js") &&
  !hasPkgProp("babel");

const ignores = [
  "/node_modules/",
  "/__fixtures__/",
  "/fixtures/",
  "/__stories__/",
  "/__tests__/helpers/",
  "/__tests__/utils/",
  "__mocks__",
  "/dist/",
  "/build/",
];

/** @type {import('@jest/types').Config.InitialOptions} */
const jestConfig = {
  // jest will fail if a root folder is missing (since v27)
  roots: ["src", "bin"]
    .filter((folder) => hasFile(folder))
    .map((folder) => fromRoot(folder)),

  modulePaths: [fromRoot("src")],

  testEnvironment: ifAnyDep(
    ["webpack", "rollup", "react", "preact"],
    "jsdom",
    "node",
  ),

  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, "src/(umd|cjs|esm)-entry.js$"],

  // allow transforming (s)css files from node_modules
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
  ],

  // automatically reset mock state before every test
  resetMocks: true,

  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

const setupFiles = [
  "src/setupTests.js",
  "src/setupTests.ts",
  "src/setupTests.tsx",
];
for (const setupFile of setupFiles) {
  if (hasFile(setupFile)) {
    jestConfig.setupFilesAfterEnv = [fromRoot(setupFile)];
  }
}

if (useBuiltInBabelConfig) {
  jestConfig.transform = {
    "^.+\\.(js|jsx)$": here("./jest/transforms/babel-transform"),
    "^.+\\.(css|scss)$": here("./jest/transforms/css-transform"),
    "^.+\\.svg$": here("./jest/transforms/svg-transform"),
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|scss|svg|json)$)": here(
      "./jest/transforms/file-transform",
    ),
  };
}

module.exports = jestConfig;
