---
id: index
title: Developer Notes
---

# Developer Notes

The runtime is split into two modules:

- `src/plugin.ts` wires the TypeDoc `load(app)` hook and registers the converter
  event listener.
- `src/core.ts` contains the display-part rewrite logic and is exported through
  the `./core` package subpath.

The package build emits ESM JavaScript and declarations into `dist/`. The docs
site generates API pages from the TypeScript source so public helper signatures
stay visible before publish.
