const path = require("node:path");

const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const {
  isCI,
  hasPkgProp,
  resolveBin,
  hasFile,
  fromRoot,
  handleResult,
} = require("../utils");

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("[lint] started");

const args = process.argv.slice(2);

const here = (p) => path.join(__dirname, p);
const hereRelative = (p) => here(p).replace(process.cwd(), ".");

const eslintArguments = [];

// config file

// TODO: adjust for ESLint 9
// https://eslint.org/docs/latest/use/configure/configuration-files-new
const useBuiltinConfig =
  !args.includes("--config") &&
  !hasFile(".eslintrc") &&
  !hasFile(".eslintrc.js") &&
  !hasFile(".eslintrc.cjs") &&
  !hasFile(".eslintrc.json") &&
  !hasFile(".eslintrc.yml") &&
  !hasFile(".eslintrc.yaml") &&
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
    fromRoot("node_modules/.cache/.eslintcache"),
  );
}

// fix

if (!args.includes("--no-fix") && !isCI()) {
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

handleResult("lint", result.status);
