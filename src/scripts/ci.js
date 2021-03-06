const spawn = require("cross-spawn");
const logger = require("@darekkay/logger");

const { resolveBin, ifScript, handleResult } = require("../utils");

process.env.CI = "true";

logger.setLevel(process.env.DEBUG ? "debug" : "info");
logger.info("[ci] started");

const scripts = [
  "--continue-on-error",

  // note: passing script arguments without "--" doesn't work and with "--" you'll get yarn warnings
  ifScript("typecheck", "typecheck"),
  ifScript("format", "format"),
  ifScript("lint", "lint"),
  ifScript("test", "test"),
].filter(Boolean);

if (scripts.length === 0) {
  logger.warn("None of the supported npm scripts is present.");
  process.exit(1);
}

// run all valid scripts

logger.debug("Scripts", scripts);

const result = spawn.sync(resolveBin("npm-run-all"), scripts, {
  stdio: "inherit",
});

handleResult("ci", result.status);
