# typedoc-plugin-hash-link-references

[![NPM license.](https://flat.badgen.net/npm/license/typedoc-plugin-hash-link-references?color=purple)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/blob/main/LICENSE) [![NPM total downloads.](https://flat.badgen.net/npm/dt/typedoc-plugin-hash-link-references?color=pink)](https://www.npmjs.com/package/typedoc-plugin-hash-link-references) [![Latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/typedoc-plugin-hash-link-references?color=cyan)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/typedoc-plugin-hash-link-references?color=yellow)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/typedoc-plugin-hash-link-references?color=orange)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/typedoc-plugin-hash-link-references?color=red)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/issues) [![Codecov.](https://flat.badgen.net/codecov/github/Nick2bad4u/typedoc-plugin-hash-link-references?color=blue)](https://codecov.io/gh/Nick2bad4u/typedoc-plugin-hash-link-references) [![Repo Checks.](https://flat.badgen.net/github/checks/Nick2bad4u/typedoc-plugin-hash-link-references?color=green)](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/actions)

Write TypeDoc inline links that stay readable in editors, then publish them as
TypeDoc declaration references.

`typedoc-plugin-hash-link-references` rewrites inline TypeDoc link tags such as
`{@link src/widgets/Button.ts#Button}` into
`{@link src/widgets/Button.ts!Button}` before TypeDoc resolves links. That lets
source comments keep the familiar `path#Symbol` shape while TypeDoc receives the
`path!Symbol` declaration-reference syntax it expects.

## Install

```sh
npm install --save-dev typedoc typedoc-plugin-hash-link-references
```

## Configure

Add the plugin to your TypeDoc config:

```json
{
 "plugin": ["typedoc-plugin-hash-link-references"]
}
```

If you use a JavaScript or TypeScript TypeDoc config, the same value belongs in
the `plugin` array.

## Link Behavior

The plugin rewrites only inline TypeDoc tags:

- `{@link path/to/file.ts#ExportedName}`
- `{@linkcode path/to/file.ts#ExportedName}`
- `{@linkplain path/to/file.ts#ExportedName}`

It leaves URL-like targets, anchor-only links, existing TypeDoc
`path!Symbol` references, and plain text untouched.

## Example

```ts
/**
 * Creates the default widget.
 *
 * @see {@link src/widgets/create-widget.ts#CreateWidgetOptions}
 */
export function createWidget() {}
```

TypeDoc receives the link target as
`src/widgets/create-widget.ts!CreateWidgetOptions`, so generated docs can resolve
the declaration reference without making source comments harder to read.

## API

Most projects only need the TypeDoc plugin entrypoint. The package also exports
`typedoc-plugin-hash-link-references/core` for tests or custom integrations that
want to call the rewrite helper directly.

Full docs and generated API reference are published with the repository site:
<https://nick2bad4u.github.io/typedoc-plugin-hash-link-references/>.
