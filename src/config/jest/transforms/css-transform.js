/**
 * A custom Jest transformer turning style imports into empty objects.
 * https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config/jest
 */
module.exports = {
  process() {
    return {
      code: "module.exports = {};",
    };
  },
  getCacheKey() {
    // The output is always the same.
    return "cssTransform";
  },
};
