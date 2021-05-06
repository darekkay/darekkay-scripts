const babelJest = require("babel-jest");

/**
 * A custom Jest transformer using babel.
 * https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config/jest
 */
module.exports = babelJest.createTransformer({
  presets: [require.resolve("../babelrc.js")],
});
