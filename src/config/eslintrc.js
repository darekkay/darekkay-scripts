const { ifAnyDep, ifTypescript } = require("../utils");

/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: [
    require.resolve("@darekkay/eslint-config/base"),
    ifAnyDep(
      ["express", "nodemon"],
      require.resolve("@darekkay/eslint-config/nodejs"),
    ),
    ifAnyDep("react", require.resolve("@darekkay/eslint-config/react")),
    ifTypescript(require.resolve("@darekkay/eslint-config/typescript")),
  ].filter(Boolean),
};
