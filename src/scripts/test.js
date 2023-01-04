/* eslint-disable jest/require-hook */

const logger = require("@darekkay/logger");

const { isCI, hasPkgProp, hasFile, handleResult } = require("../utils");

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("[test] started");

const args = process.argv.slice(2);

const jestArguments = [];

// config file

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile("jest.config.js") &&
  !hasPkgProp("jest");

if (useBuiltinConfig) {
  jestArguments.push(
    "--config",
    JSON.stringify(require("../config/jest.config"))
  );
}

// silent output

if (isCI()) {
  jestArguments.push("--silent");
}

// script arguments

jestArguments.push(...args);

// run jest

logger.debug("Arguments", jestArguments);

let resultStatus = 0;

// eslint-disable-next-line
require("jest")
  .run(jestArguments)
  .catch((error) => {
    logger.error(error);
    resultStatus = 1;
  })
  .finally(() => {
    handleResult("test", resultStatus);
  });
