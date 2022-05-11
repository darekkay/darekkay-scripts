const path = require("path");

/**
 * A custom Jest transformer turning file imports into file names.
 * https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config/jest
 */
module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));
    return {
      code: `module.exports = ${assetFilename};`,
    };
  },
};
