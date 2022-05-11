const path = require("path");

const spawn = require("cross-spawn");
const glob = require("glob");
const logger = require("@darekkay/logger");

// https://github.com/isaacs/node-glob/issues/467#issuecomment-1114240501
const scriptsGlobPattern = path
  .join(__dirname, "scripts", "*")
  .split(path.sep)
  .join("/");

const availableScripts = new Set(
  glob.sync(scriptsGlobPattern).map((script) => path.basename(script, ".js"))
);

if (process.argv.length < 3) {
  logger.error("Unspecified script.");
  process.exit(1);
}

// find the script to execute
const args = process.argv.slice(2);
const scriptIndex = args.findIndex((x) => availableScripts.has(x));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

if (scriptIndex === -1) {
  logger.error(`Unknown script "${script}".`);
  process.exit(1);
}

const relativeScriptPath = path.join(__dirname, "./scripts", script);
const scriptPath = require.resolve(relativeScriptPath);

// node arguments can be passed after "dks" and before the actual script
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

// attempt to start the script with the passed node arguments
const result = spawn.sync(
  process.argv[0],
  [...nodeArgs, scriptPath, ...args.slice(scriptIndex + 1)],
  { stdio: "inherit" }
);

function handleSignal(signal) {
  if (signal === "SIGKILL") {
    logger.error(
      `The script "${script}" failed because the process exited too early. ` +
        "This probably means the system ran out of memory or someone called " +
        "`kill -9` on the process."
    );
  } else if (signal === "SIGTERM") {
    logger.error(
      `The script "${script}" failed because the process exited too early. ` +
        "Someone might have called `kill` or `killall`, or the system could " +
        "be shutting down."
    );
  }
  process.exit(1);
}

if (result.signal) {
  handleSignal(result.signal);
} else {
  process.exit(result.status);
}
