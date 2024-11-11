const path = require("node:path");

const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const { isCI, resolveBin, hasFile, handleResult } = require("../utils");

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("[format] started");

const args = process.argv.slice(2);

const here = (p) => path.join(__dirname, p);
const hereRelative = (p) => here(p).replace(process.cwd(), ".");

const prettierArguments = [];

// prettierignore

const useBuiltinIgnore =
  !args.includes("--ignore-path") && !hasFile(".prettierignore");

if (useBuiltinIgnore) {
  prettierArguments.push(
    "--ignore-path",
    hereRelative("../config/prettierignore"),
  );
}

// cache

if (!isCI()) {
  // TODO: remove this code when the following issue is fixed
  // https://github.com/prettier/prettier/issues/13015
  prettierArguments.push("--cache");
}

// log level

if (!args.some((arg) => arg.includes("--log-level"))) {
  // hide affected files from the console by default
  prettierArguments.push("--log-level=warn");
}

// write vs. list

if (!args.includes("--no-write") && !isCI()) {
  prettierArguments.push("--write");
} else {
  prettierArguments.push("--check");
}

// script arguments

prettierArguments.push(...args);

// format all supported files

prettierArguments.push(".");

// spawn prettier

logger.debug("Arguments", prettierArguments);

const result = spawn.sync(resolveBin("prettier"), prettierArguments, {
  stdio: "inherit",
});

handleResult("format", result.status);
