const path = require("path");

const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const { resolveBin, hasFile } = require("../utils");

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("Running [format]");

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
    hereRelative("../config/prettierignore")
  );
}

// write

if (!args.includes("--no-write")) {
  prettierArguments.push("--write");
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

process.exit(result.status);
