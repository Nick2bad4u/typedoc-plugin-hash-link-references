---
id: index
title: Developer Notes
---

# Developer Notes

The runtime is split into two modules:

- `src/plugin.ts` wires the TypeDoc `load(app)` hook, registers one converter
  listener per TypeDoc application, indexes source-backed reflections for each
  conversion, and resolves file-oriented links to concrete targets.
- `src/core.ts` contains the low-level display-part rewrite logic used for
  module-like declaration-reference fallbacks and is exported through the
  `./core` package subpath.

The package build emits ESM JavaScript and declarations into `dist/`. The docs
site generates API pages from the TypeScript source so public helper signatures
stay visible before publish.
