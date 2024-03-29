const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const { hasAnyDep, resolveBin, hasFile, handleResult } = require("../utils");

const args = process.argv.slice(2);

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("[typecheck] started");

if (!hasAnyDep("typescript") || !hasFile("tsconfig.json")) {
  throw new Error(
    "The 'typecheck' script requires typescript to be installed and tsconfig.json to be present.",
  );
}

// only check types

const typescriptArguments = [
  "--noEmit",
  "--incremental",
  "--tsBuildInfoFile",
  "node_modules/.cache/.tsbuildinfo",
];

// script arguments

typescriptArguments.push(...args);

// spawn tsc

logger.debug("Arguments", typescriptArguments);

const result = spawn.sync(
  resolveBin("typescript", { executable: "tsc" }),
  typescriptArguments,
  {
    stdio: "inherit",
  },
);

handleResult("typecheck", result.status);
