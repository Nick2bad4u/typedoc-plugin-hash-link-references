---
id: intro
title: Overview
slug: /intro
---

# typedoc-plugin-hash-link-references

`typedoc-plugin-hash-link-references` lets documentation authors keep writing
links that are comfortable in source code:

```ts
/**
 * See {@link src/runtime/cache.ts#CacheStore}.
 */
export function loadCache(): void {}
```

Before TypeDoc resolves inline links, the plugin matches eligible file paths and
symbol names to the converted project's source-backed reflections.

That keeps source comments readable in editors, code review, and GitHub while
still producing working TypeDoc API links. Module-like sources which are not
file paths use TypeDoc's `module!Export` declaration-reference syntax as a
fallback.

## When to use it

Use this plugin when your comments refer to symbols inside local files and you
prefer the `path#Symbol` form while authoring. The plugin is intentionally
small: it only handles inline TypeDoc link tags and only processes path- or
module-like targets where `#` separates a source from a symbol.

## What it does not do

The plugin does not rewrite normal Markdown links, external URLs, issue
references, or plain text. It is scoped to TypeDoc comment display parts so it
can run safely before TypeDoc's built-in link resolver.
