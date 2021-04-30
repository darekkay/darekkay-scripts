const path = require("path");

const { ifAnyDep, hasFile, hasPkgProp, fromRoot } = require("../utils");

const here = (p) => path.join(__dirname, p);

// const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel");

const ignores = [
  "/node_modules/",
  "/__fixtures__/",
  "/fixtures/",
  "/__tests__/helpers/",
  "/__tests__/utils/",
  "__mocks__",
  "/dist/",
  "/build/",
];

const jestConfig = {
  roots: [fromRoot("src")],

  testEnvironment: ifAnyDep(
    ["webpack", "rollup", "react", "preact"],
    "jsdom",
    "node"
  ),

  collectCoverageFrom: ["src/**/*.+(js|jsx|ts|tsx)"],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, "src/(umd|cjs|esm)-entry.js$"],

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
  "tests/setup-env.js",
  "tests/setup-env.ts",
  "tests/setup-env.tsx",
];
for (const setupFile of setupFiles) {
  if (hasFile(setupFile)) {
    jestConfig.setupFilesAfterEnv = [fromRoot(setupFile)];
  }
}

// if (useBuiltInBabelConfig) {
//   jestConfig.transform = {
//     "^.+\\.(js|jsx|ts|tsx)$": here("./babel-transform"),
//   };
// }

module.exports = jestConfig;
