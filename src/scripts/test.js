const logger = require("@darekkay/logger");

const { hasPkgProp, hasFile } = require("../utils");

process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("Running [test]");

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

// script arguments

jestArguments.push(...args);

// run jest

logger.debug("Arguments", jestArguments);

// eslint-disable-next-line jest/no-jest-import
require("jest").run(jestArguments);
