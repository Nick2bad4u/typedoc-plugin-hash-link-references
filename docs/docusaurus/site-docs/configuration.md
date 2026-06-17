---
id: configuration
title: Configuration
---

# Configuration

The package is a standard TypeDoc plugin. It does not add custom TypeDoc
options, so configuration is just the plugin name:

```json
{
 "plugin": ["typedoc-plugin-hash-link-references"]
}
```

## Package exports

The package exposes two entrypoints:

| Export                                     | Purpose                                             |
| ------------------------------------------ | --------------------------------------------------- |
| `typedoc-plugin-hash-link-references`      | TypeDoc plugin entrypoint with `load(app)`.         |
| `typedoc-plugin-hash-link-references/core` | Pure rewrite helpers for focused tests and tooling. |

The core helpers are useful when you want to test a comment transform without
starting a TypeDoc conversion.
