const path = require("node:path");

const camelcase = require("camelcase");

/**
 * A custom Jest transformer turning SVG file imports into React components.
 * https://github.com/facebook/create-react-app/tree/master/packages/react-scripts/config/jest
 */
module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    // Based on how SVGR generates a component name:
    // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
    const pascalCaseFilename = camelcase(path.parse(filename).name, {
      pascalCase: true,
    });
    const componentName = `Svg${pascalCaseFilename}`;
    return {
      code: `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`,
    };
  },
};
