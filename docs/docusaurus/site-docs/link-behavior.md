---
id: link-behavior
title: Link Behavior
---

# Link Behavior

The plugin rewrites inline TypeDoc link tags:

- `@link`
- `@linkcode`
- `@linkplain`

Only module-source-like targets are changed. A target is considered eligible
when it contains a path separator, starts with a package scope, contains a dash,
or otherwise looks like a module path.

## Rewritten

```md
{@link src/index.ts#load}
{@link @scope/package#Export | Export label}
{@linkcode ../runtime/cache.ts#CacheStore}
```

These become TypeDoc declaration references using `!`.

## Left alone

```md
{@link https://example.com/docs#section}
{@link mailto:hello@example.com}
{@link SymbolName}
{@link src/index.ts#}
```

External URLs, URL-like schemes, empty hash suffixes, and plain symbol names are
left unchanged.
