const { ifAnyDep, ifTypescript } = require("../../utils");

/**
 * Babel configuration for Jest tests.
 */
module.exports = () => ({
  assumptions: {
    // When using public class fields, assume that they don't shadow any getter in the current class, in its subclasses or in its superclass. Thus, it's safe to assign them rather than using Object.defineProperty.
    setPublicClassFields: true,
  },

  presets: [
    [require.resolve("@babel/preset-env")],
    ifAnyDep("react", [
      require.resolve("@babel/preset-react"),
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: true,
      },
    ]),
    ifAnyDep("vite", [require.resolve("babel-preset-vite")]),
    ifTypescript([require.resolve("@babel/preset-typescript")]),
  ].filter(Boolean),

  plugins: [
    // Enable class fields proposal
    // https://github.com/tc39/proposal-class-fields
    [require.resolve("@babel/plugin-transform-class-properties")],
  ],
});
