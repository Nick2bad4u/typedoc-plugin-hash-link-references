# typedoc-plugin-hash-link-references

[![npm](https://img.shields.io/npm/v/typedoc-plugin-hash-link-references.svg)](https://www.npmjs.com/package/typedoc-plugin-hash-link-references)
[![Continuous Integration](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/actions/workflows/ci.yml/badge.svg)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/actions/workflows/ci.yml)

TypeDoc plugin that rewrites VS Code-friendly `path#Symbol` inline links into
TypeDoc declaration references using `path!Symbol`.

## Install

```sh
npm install --save-dev typedoc-plugin-hash-link-references
```

## Usage

```json
{
 "plugin": ["typedoc-plugin-hash-link-references"]
}
```

The package entrypoint exports TypeDoc's `load(app)` plugin hook. The `./core`
subpath exports the link rewriting helpers for direct tests.
