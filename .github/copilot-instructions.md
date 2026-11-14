# Copilot Agent Instructions

## Pull Requests

When creating a pull request, use a Conventional Commit title in the format `type(scope): description` (for example, `fix(cli): handle package names with special characters`). Use one of these types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, matching the allowed list in `.github/workflows/pr.yml`. Keep the description concise. PR titles are validated by `.github/workflows/pr.yml`.

## Before Committing

If Lefthook pre-commit hooks are enabled, rely on them for formatting, linting, and type checking; fix any reported failures before committing. Do not run these checks separately just for the commit.

If Lefthook pre-commit hooks are not enabled, run `npm run format:check`, `npm run lint`, and `npm run types` before committing. These require Node.js 24+.

## CLI Interface

The CLI should provide options that correspond to all npmgraph URL API parameters.
When syncing CLI options, ensure consistency with the npmgraph README and implementation.

Update README.md with any new options or changes to existing options.

## Release Process

Releases are managed automatically by release-please based on Conventional Commit messages.
