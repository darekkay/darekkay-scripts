const { createTransformer } = require("babel-jest").default;

/**
 * A custom Jest transformer using babel.
 * https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config/jest
 */
module.exports = createTransformer({
  presets: [require.resolve("../babelrc.js")],
});
