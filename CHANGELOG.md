<!-- markdownlint-disable -->
<!-- eslint-disable markdown/no-missing-label-refs -->

# 📜 Changelog

## ✨ What's Changed in v1.0.3

- <b>Commit Range: ➡️</b> [`v1.0.2...v1.0.3`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.2...v1.0.3 "View full commit range on GitHub")

### 🧹 Chores

- [`3682e69`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/3682e697284a16d387a78a229480f55a949a9b9a "Diff: 11 files, +48839 | -48628") — _(tooling)_ Migrate shared package configs&nbsp;<sub><em>(11&nbsp;files,&nbsp;+48839,&nbsp;-48628)</em></sub>
  - 🔧 [chore] Adopt shared NCU, TypeDoc, lint, and formatter presets and compose shared Secretlint rules with the existing project policy.
  - 🐛 [fix] Load the package's TypeDoc plugin from its local build while retaining the rest of the shared plugin set.
  - ⬆️ [chore] Refresh npm 12 dependencies, lockfile metadata, and synchronized Node version files.

- [`d21031b`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/d21031b0938fc23440e044e53addddb5211861d8 "Diff: 4 files, +186 | -234") — 🔧 [chore] Adopt shared validation configs&nbsp;<sub><em>(4&nbsp;files,&nbsp;+186,&nbsp;-234)</em></sub>
  - 🔧 [chore] Wire JSCPD, git-cliff, and Lychee through shared config packages.
  - 👷 [ci] Point release-note generation at the shared git-cliff config where workflows invoke git-cliff directly.

### 👷 CI/CD

- [`ee15ef8`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/ee15ef85f8f9011369f7d703756db9784d8c420e "Diff: 4 files, +49 | -18") — _(release)_ Guard git-cliff note generation&nbsp;<sub><em>(4&nbsp;files,&nbsp;+49,&nbsp;-18)</em></sub>
  - Validate the authoritative release tag at HEAD immediately before git-cliff and export GitHub authentication for enriched notes. Standardize Actionlint configuration and direct package CLI usage where applicable.

### 📦 Dependencies

- [`2e0bca2`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/2e0bca28e9cdad6b4578b3689d8dc2beafc6aef6 "Diff: 1 file, +6 | -6") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+6,&nbsp;-6)</em></sub>

- [`c882c8d`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/c882c8d6e71f360efacec17d525e78331b81074a "Diff: 1 file, +3 | -3") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+3,&nbsp;-3)</em></sub>

- [`ac04e73`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/ac04e7370ba3b67c009d7fa86e73f53643c8ab2b "Diff: 1 file, +10 | -10") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+10,&nbsp;-10)</em></sub>

- [`07a9468`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/07a9468997ce977dc5507866c89cdea3eb6bf081 "Diff: 1 file, +25 | -25") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+25,&nbsp;-25)</em></sub>

- [`e55ec59`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/e55ec59d42dec4eeb940a68dafe39b070ef4c581 "Diff: 1 file, +66 | -841") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+66,&nbsp;-841)</em></sub>

- [`0da8f1c`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/0da8f1c29058579d6279b68ea64a89d289056557 "Diff: 1 file, +48649 | -48665") — ⬆️ [build] Update npm_and_yarn dependencies&nbsp;<sub><em>(1&nbsp;file,&nbsp;+48649,&nbsp;-48665)</em></sub>

### 🛡️ Security

- [`0a6913b`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/0a6913b367f7a64ef9068098b42027f57b2f76d0 "Diff: 26 files, +17101 | -18897") — 🐛 [fix] (links) resolve source-backed references (#7)&nbsp;<sub><em>(26&nbsp;files,&nbsp;+17101,&nbsp;-18897)</em></sub>
  - Resolve file-oriented TypeDoc links to concrete source-backed reflections, scope explicit relative paths to their owner, harden npm 12 lifecycle policy and release verification, refresh compatible tooling, improve tests/docs, and address hosted security and quality findings.

### New Contributors

- @dependabot[bot] made their first contribution in [#6](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/pull/6)

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.2...v1.0.3

## ✨ What's Changed in v1.0.2

- <b>Commit Range: ➡️</b> [`v1.0.1...v1.0.2`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.1...v1.0.2 "View full commit range on GitHub")

### 🛠️ Bug Fixes

- [`6d76f7f`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/6d76f7ffb81a265d09ae6e954386eca02f8dab64 "Diff: 7 files, +331 | -331") — 💚 [fix] Restore release verification formatting&nbsp;<sub><em>(7&nbsp;files,&nbsp;+331,&nbsp;-331)</em></sub>

### 🎨 Styling

- [`50b95c7`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/50b95c7b2144c183198af45c251719421613b909 "Diff: 3 files, +160 | -160") — 🎨 [style] Format TOML with Tombi&nbsp;<sub><em>(3&nbsp;files,&nbsp;+160,&nbsp;-160)</em></sub>
  - 🎨 [style] Apply Linux Tombi formatting to release TOML files so CI and local lint agree.
  - 🔧 [chore] Ignore TOML in Prettier because Tombi is the canonical TOML formatter.

### 🧹 Chores

- [`c8e16e2`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/c8e16e2132b84e5bfc9a719f976033498873aa3f "Diff: 2 files, +3 | -3") — Release v1.0.2&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>

### 📦 Dependencies

- [`193090e`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/193090ec75b11089320275ce7cafd8c34ef5cd05 "Diff: 9 files, +48413 | -46792") — ⬆️ [build] Update dependency and release tooling&nbsp;<sub><em>(9&nbsp;files,&nbsp;+48413,&nbsp;-46792)</em></sub>
  - ⬆️ [build] Update TypeDoc, lint, package validation, docs, and runtime dependency ranges after the dependency refresh.
  - 🔧 [chore] Add project Secretlint and Yamllint configs required by the updated shared ESLint stack.
  - 👷 [ci] Refresh pinned GitHub Actions versions and normalize workflow strings/names for the stricter YAML and Actions lint rules.
  - 🧪 [test] Verified with npm run release:verify before publishing.

### 🛡️ Security

- [`f20d6d1`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/f20d6d1ecedacd0dcb84cef4c72c3b3b2941403d "Diff: 13 files, +47158 | -47206") — 👷 [ci] Use shared workflow callers&nbsp;<sub><em>(13&nbsp;files,&nbsp;+47158,&nbsp;-47206)</em></sub>
  - 👷 [ci] Switches the Dependabot auto-merge caller to workflow-templates@main and replaces local security and maintenance workflows with shared reusable callers.
  - ⬆️ [build] Updates eslint-config-nick2bad4u to the published caller override version and records any peer dependency needed for the shared ESLint config to load.

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.1...v1.0.2

## ✨ What's Changed in v1.0.1

- <b>Commit Range: ➡️</b> [`v1.0.0...v1.0.1`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.0...v1.0.1 "View full commit range on GitHub")

### ✨ Features

- [`245e5f6`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/245e5f6031da7d37c95854c120a6fdadcd3856da "Diff: 17 files, +879 | -102") — ✨ [feat] Polish docs and shared config integration&nbsp;<sub><em>(17&nbsp;files,&nbsp;+879,&nbsp;-102)</em></sub>

### 🧪 Testing

- [`86f212e`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/86f212e5b78ef263ac981ff3dadfe517f0a61670 "Diff: 2 files, +39 | -1") — ✅ [test] Restore Codecov matrix uploads&nbsp;<sub><em>(2&nbsp;files,&nbsp;+39,&nbsp;-1)</em></sub>

### 🧹 Chores

- [`881e55b`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/881e55b9cb669d82035c0aaefc3e134ec434298c "Diff: 2 files, +3 | -3") — Release v1.0.1&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v1.0.0...v1.0.1

## ✨ What's Changed in v1.0.0

- <b>Commit Range: ➡️</b> [`v0.1.0...v1.0.0`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v0.1.0...v1.0.0 "View full commit range on GitHub")

### ✨ Features

- [`f2a4cbd`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/f2a4cbd95bc8fe0314e7e16824d60cc7d8343f95 "Diff: 37 files, +41463 | -13879") — ✨ [feat] Add Docusaurus docs and release verification&nbsp;<sub><em>(37&nbsp;files,&nbsp;+41463,&nbsp;-13879)</em></sub>
  - ✨ [feat] Add a Docusaurus documentation workspace with TypeDoc API generation, local search, PWA assets, and end-user docs tailored to the plugin behavior.
  - 👷 [ci] Add docs deployment, Codecov OIDC uploads, generated-output ignores, Stylelint, Remark, and package-lint coverage to the release verification gate.
  - 🚜 [refactor] Tighten TypeDoc hook typing for readonly lint rules while preserving the plugin mutation points through explicit safe casts.
  - 🧪 [test] Keep test fixtures quiet by validating the rewritten TypeDoc link shape without relying on Vitest experimental typecheck.

### 🛠️ Bug Fixes

- [`c660636`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/c660636acde3f29f56d80ea9fdda097b4d009b6d "Diff: 2 files, +6 | -0") — 🐛 [fix] Repair docs deploy and Gitleaks workflows&nbsp;<sub><em>(2&nbsp;files,&nbsp;+6,&nbsp;-0)</em></sub>
  - 🐛 [fix] Add the missing Gitleaks configuration so the existing secret scan workflow can load the default rule set instead of failing before scan startup.
  - 👷 [ci] Allow the Docusaurus Pages workflow to enable GitHub Pages during the first repository deployment.

### 🚜 Refactor

- [`755054b`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/755054b3a872ea9fa46b61557fb24e520a22c4ee "Diff: 13 files, +204 | -260") — Build hash link plugin from TypeScript&nbsp;<sub><em>(13&nbsp;files,&nbsp;+204,&nbsp;-260)</em></sub>

### 🧹 Chores

- [`44f71ed`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/44f71ed6efb0d9063a10f83729d536968659f53b "Diff: 2 files, +3 | -3") — Release v1.0.0&nbsp;<sub><em>(2&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>

- [`0a899cc`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/0a899cc7a8e57a7447ad151b6e3de901e4d39352 "Diff: 3 files, +3 | -3") — 🔧 [chore] Fix repository metadata references&nbsp;<sub><em>(3&nbsp;files,&nbsp;+3,&nbsp;-3)</em></sub>
  - 🔧 [chore] Correct copied repository metadata in GitHub configuration.
- Update the funding configuration comment to reference typedoc-plugin-hash-link-references.
- Update workflow agent guidance to name typedoc-plugin-hash-link-references instead of the source template package.
- Use the canonical SchemaStore stale configuration schema URL.

### 👷 CI/CD

- [`6f5a4da`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/6f5a4da8536e44073639c9f06a82f228198fa545 "Diff: 13 files, +1721 | -333") — 👷 [ci] Add repository automation and dependency tooling&nbsp;<sub><em>(13&nbsp;files,&nbsp;+1721,&nbsp;-333)</em></sub>
  - 👷 [ci] Add GitHub workflow coverage for dependency review, secret scanning, label sync, stale issue management, and Dependabot auto-merge routing.
- Include workflow-local AGENTS guidance so automation changes have scoped repository instructions.
- Add reusable workflow callers for Gitleaks, TruffleHog, Labeler, Stale, and dependency review checks.
  - 🔧 [chore] Add repository configuration for funding, labels, stale handling, and agent commit-message formatting.
- Document the emoji and bracketed-type commit header format expected from automation and future agent-authored commits.
  - ⬆️ [build] Update shared linting and formatting config packages.
- Bump eslint, npm-package-json-lint, and Prettier shared configs.
- Refresh the package lockfile after dependency updates.
  - 🔨 [build] Route package scripts through npx and add dependency maintenance helpers.
- Update build, lint, test, changelog, package, and typecheck scripts to resolve CLI tools through npx.
- Add helper scripts for type syncing, action updates, and dependency updates.

### New Contributors

- @github-actions[bot] made their first contribution

> [!NOTE]
> **Release comparison**: https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/v0.1.0...v1.0.0

## ✨ What's Changed in v0.1.0

- <b>Commit Range: ➡️</b> [`0f26433...v0.1.0`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/compare/0f2643369f31006950af74fe1a60aeaa21c49093...v0.1.0 "View full commit range on GitHub")

### ✨ Features

- [`0f26433`](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/commit/0f2643369f31006950af74fe1a60aeaa21c49093 "Diff: 42 files, +22533 | -0") — Create standalone TypeDoc hash link plugin&nbsp;<sub><em>(42&nbsp;files,&nbsp;+22533,&nbsp;-0)</em></sub>

### New Contributors

- @Nick2bad4u made their first contribution

## ⭐ Contributors

Thanks to anyone who has 🧑‍💻 [contributed](https://github.com/Nick2bad4u/typedoc-plugin-hash-link-references/graphs/contributors).

_This changelog was automatically generated with ⛰️ [git-cliff](https://github.com/orhun/git-cliff)._
