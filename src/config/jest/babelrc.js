const { ifAnyDep, ifTypescript } = require("../../utils");

/**
 * Babel configuration for Jest tests.
 */
module.exports = () => ({
  presets: [
    [require.resolve("@babel/preset-env")],
    ifAnyDep("react", [require.resolve("@babel/preset-react")]),
    ifAnyDep("vite", [require.resolve("babel-preset-vite")]),
    ifTypescript([require.resolve("@babel/preset-typescript")]),
  ].filter(Boolean),
});
