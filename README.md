# @darekkay/scripts

[![npm (scoped)](https://img.shields.io/npm/v/@darekkay/scripts?style=flat-square)](https://www.npmjs.com/package/@darekkay/scripts)
[![Build](https://img.shields.io/github/workflow/status/darekkay/darekkay-scripts/Continuous%20Integration/master?style=flat-square)](https://github.com/darekkay/darekkay-scripts/actions)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/darekkay/darekkay-scripts/blob/master/LICENSE)

A CLI that abstracts away all configuration for my projects (linting, testing, building, ...). Inspired by [react-scripts](https://www.npmjs.com/package/react-scripts) and [kcd-scripts](https://www.npmjs.com/package/kcd-scripts).

## Usage

```shell
dks [node arguments] [script] [script arguments]
```

To output debug information, set `DEBUG` env variable:

```shell
cross-env DEBUG=true dks [script]
```

## Available scripts

- `dks ci`: Run `lint`, `test` and `typecheck`.
- `dks format`: Run Prettier.
- `dks lint`: Run ESlint with `--fix` and `--cache`.
- `dks test`: Run Jest.
- `dks typecheck`: Run TypeScript compiler with `--noEmit`.

## Additional commands

Some additional utilities are included:

- [cross-env](https://www.npmjs.com/package/cross-env)
- [npm-run-all](https://www.npmjs.com/package/npm-run-all)

## License

This project and its contents are open source under the [MIT license](LICENSE).
