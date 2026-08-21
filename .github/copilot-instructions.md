# Repository guidance

- This is an ESM TypeDoc plugin. Keep TypeDoc as the consumer-supplied peer and use only its documented public API.
- Install with the Node version in `.node-version` and the exact npm version in `packageManager`. Keep `strict-allow-scripts` enabled and approve required lifecycle scripts by exact package version only.
- Preserve `load(application)` idempotence per `Application` and support repeated conversions without leaking reflection state.
- Treat generated HTML links, package exports, declarations, and the `path#Symbol` syntax documented in `README.md` as public behavior. Add conversion-level regression tests for changes to link resolution.
- Run `npm run release:verify`, `actionlint .github/workflows/*.yml`, and `yamllint -c .yamllint .` before proposing release changes. Verify that these commands do not mutate tracked files.
- Publish only through `.github/workflows/release.yml`. Do not publish locally, weaken trusted publishing, skip verification, or broaden the release commit's explicit staging allowlist.
