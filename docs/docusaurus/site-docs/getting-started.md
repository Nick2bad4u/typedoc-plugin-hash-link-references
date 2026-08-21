---
id: getting-started
title: Getting Started
---

# Getting Started

Install the plugin next to TypeDoc:

```sh
npm install --save-dev typedoc typedoc-plugin-hash-link-references
```

Add it to your TypeDoc configuration:

```json
{
 "plugin": ["typedoc-plugin-hash-link-references"]
}
```

Then keep writing hash-style inline links in comments:

```ts
/**
 * Builds the same shape returned by {@link src/config.ts#loadConfig}.
 */
export function createConfig(): void {}
```

The plugin runs before TypeDoc's own link resolver. It finds the `loadConfig`
reflection associated with `src/config.ts` and attaches that reflection as the
link target. This is important because TypeDoc's `module!Export` syntax expects
a module name before `!`, not a source-file path.

## With typedoc-plugin-markdown

The plugin can be used with TypeDoc's default renderer or with
`typedoc-plugin-markdown`:

```json
{
 "plugin": ["typedoc-plugin-hash-link-references", "typedoc-plugin-markdown"]
}
```

Place this plugin before render-output plugins when you want the rewrite to
happen as early as possible.
