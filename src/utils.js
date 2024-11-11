const fs = require("node:fs");
const path = require("node:path");

const logger = require("@darekkay/logger");
const arrify = require("arrify");
const has = require("lodash.has");
const readPackageUp = require("read-pkg-up");
const which = require("which");

const { packageJson, path: packageJsonPath } = readPackageUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});
const appDirectory = path.dirname(packageJsonPath);

const fromRoot = (...p) => path.join(appDirectory, ...p);
const hasFile = (...p) => fs.existsSync(fromRoot(...p));
const ifFile = (files, t, f) =>
  arrify(files).some((file) => hasFile(file)) ? t : f;

const hasPkgProp = (props) =>
  arrify(props).some((prop) => has(packageJson, prop));

const hasPkgSubProp = (pkgProp) => (props) =>
  hasPkgProp(arrify(props).map((p) => `${pkgProp}.${p}`));

const ifPkgSubProp = (pkgProp) => (props, t, f) =>
  hasPkgSubProp(pkgProp)(props) ? t : f;

const hasScript = hasPkgSubProp("scripts");
const hasPeerDep = hasPkgSubProp("peerDependencies");
const hasDep = hasPkgSubProp("dependencies");
const hasDevDep = hasPkgSubProp("devDependencies");
const hasAnyDep = (args) =>
  [hasDep, hasDevDep, hasPeerDep].some((fn) => fn(args));

const ifPeerDep = ifPkgSubProp("peerDependencies");
const ifDep = ifPkgSubProp("dependencies");
const ifDevDep = ifPkgSubProp("devDependencies");
const ifAnyDep = (deps, t, f) => (hasAnyDep(arrify(deps)) ? t : f);
const ifScript = ifPkgSubProp("scripts");

const hasTypescript = hasAnyDep("typescript") && hasFile("tsconfig.json");
const ifTypescript = (t, f) => (hasTypescript ? t : f);

function envIsSet(name) {
  return (
    // eslint-disable-next-line no-prototype-builtins
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== "undefined"
  );
}

function parseEnv(name, def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name]);
    } catch {
      return process.env[name];
    }
  }
  return def;
}

function isCI() {
  const ci = process.env.CI;
  return ci === "true" || ci === true;
}

function uniq(arr) {
  return [...new Set(arr)];
}

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {},
) {
  let pathFromWhich;
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
    if (pathFromWhich && pathFromWhich.includes(".CMD")) return pathFromWhich;
  } catch {
    // ignore _error
  }
  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);
    const { bin } = require(modPkgPath);
    const binPath = typeof bin === "string" ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);
    if (fullPathToBin === pathFromWhich) {
      return executable;
    }
    return fullPathToBin.replace(cwd, ".");
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }
    throw error;
  }
}

function handleResult(task, status) {
  if (status !== 0) {
    logger.error(`[${task}] failed`);
  } else {
    logger.success(`[${task}] finished successfully`);
  }
  process.exit(status);
}

module.exports = {
  appDirectory,
  fromRoot,
  hasFile,
  hasPkgProp,
  hasScript,
  hasAnyDep,
  hasDep,
  ifAnyDep,
  ifDep,
  ifDevDep,
  ifFile,
  ifPeerDep,
  ifScript,
  isCI,
  hasTypescript,
  ifTypescript,
  parseEnv,
  resolveBin,
  uniq,
  handleResult,
};
