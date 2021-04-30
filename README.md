# @darekkay/scripts

A CLI that abstracts away all configuration for my projects (linting, testing, building, ...). Inspired by [react-scripts](https://www.npmjs.com/package/react-scripts) and [kcd-scripts](https://www.npmjs.com/package/kcd-scripts)

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
