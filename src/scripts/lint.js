const path = require("path");

const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const { hasPkgProp, resolveBin, hasFile, fromRoot } = require("../utils");

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("Running [lint]");

const args = process.argv.slice(2);

const here = (p) => path.join(__dirname, p);
const hereRelative = (p) => here(p).replace(process.cwd(), ".");

const eslintArguments = [];

// config file

const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile(".eslintrc") &&
  !hasFile(".eslintrc.js") &&
  !hasPkgProp("eslintConfig");

if (useBuiltinConfig) {
  eslintArguments.push("--config", hereRelative("../config/eslintrc.js"));
}

// file extensions

const defaultExtensions = ".js,.jsx,.ts,.tsx";
if (!args.includes("--ext")) {
  eslintArguments.push("--ext", defaultExtensions);
}

// eslintignore

const useBuiltinIgnore =
  !args.includes("--ignore-path") &&
  !hasFile(".eslintignore") &&
  !hasPkgProp("eslintIgnore");

if (useBuiltinIgnore) {
  eslintArguments.push("--ignore-path", hereRelative("../config/eslintignore"));
}

// cache

if (!args.includes("--no-cache")) {
  eslintArguments.push(
    "--cache",
    "--cache-location",
    fromRoot("node_modules/.cache/.eslintcache")
  );
}

// fix

if (!args.includes("--no-fix")) {
  eslintArguments.push("--fix");
}

// script arguments

eslintArguments.push(...args);

// lint all supported files

eslintArguments.push(".");

// spawn eslint

logger.debug("Arguments", eslintArguments);

const result = spawn.sync(resolveBin("eslint"), eslintArguments, {
  stdio: "inherit",
});

process.exit(result.status);
