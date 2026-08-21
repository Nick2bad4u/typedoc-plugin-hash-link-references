---
id: link-behavior
title: Link Behavior
---

# Link Behavior

The plugin processes inline TypeDoc link tags:

- `@link`
- `@linkcode`
- `@linkplain`

Only path- or module-like targets are changed. A target is considered eligible
when it contains a path separator, starts with a package scope, contains a dash,
or otherwise looks like a module path.

## Rewritten

```md
{@link src/index.ts#load}
{@link @scope/package#Export | Export label}
{@linkcode ../runtime/cache.ts#CacheStore}
```

File-oriented targets are matched to source-backed TypeDoc reflections. The
first and third examples therefore become real links to the `load` and
`CacheStore` reflections. The scoped-package example uses
`@scope/package!Export` as its declaration-reference fallback.

TypeDoc interprets text before `!` as a literal module name and explicitly does
not treat it as a source-file path. The plugin therefore does not depend on an
invalid `src/index.ts!load` reference when it can identify the concrete
reflection.

## Left alone

```md
{@link https://example.com/docs#section}
{@link mailto:hello@example.com}
{@link SymbolName}
{@link src/index.ts#}
```

External URLs, valid URI schemes, empty hash suffixes, and plain symbol names are
left unchanged. File-path resolution also requires one unambiguous reflection
with the requested name and a matching source file; TypeDoc's normal invalid-link
validation remains responsible for reporting unresolved fallbacks.
