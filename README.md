# npmgraph-cli

Command-line interface for launching
[the npmgraph web site](https://npmgraph.js.org) to show module dependency
graphs.

Please note that the `npmgraph-cli` does _not_ render dependency graphs
directly. It's simply a convenience (albeit a pretty powerful one) for opening
`npmgraph.js.org` URLs in accordance with the
[npmgraph URL API](https://github.com/npmgraph/npmgraph#url-api).

## Getting Started

To install:

```bash
npm install --global npmgraph-cli
```

To see command help:

```bash
npmgraph -h
```

## CLI Options

All options map directly to the
[npmgraph URL API](https://github.com/npmgraph/npmgraph#url-api) parameters.

### Core Options

- **`[packages...]`** - Package names, versions, or GitHub URLs to graph
- **`--file <files...>` / `-f`** - Local `package.json` file(s) to include
- **`--registry <url>`** - Custom npm registry URL (defaults to npmjs.org)

### Display Options

- **`--color <mode>`** - Colorization mode:
  - `moduleType` (default) - by package format/types
  - `bus` - by number of maintainers
  - `outdated` - by how outdated the package is
- **`--sizing`** - Scale nodes by unpacked package size
- **`--tab <name>`** - Initial tab to show: `info` (default), `report`, `module`,
  `view`

### Filtering & Selection

- **`--select <selector>`** - Highlight modules in graph. Formats:
  - `exact:<key>` - exact module version
  - `name:<name>` - all versions of a module
  - `license:<license>` - modules by license
  - `maintainer:<name>` - modules by maintainer
- **`--collapse <modules>`** - Collapse subtrees (comma-separated module names)
- **`--hide [type]`** - Hide the inspector panel, or:
  - `--hide graph` - show report-only view (hide the graph)

### Dependency Types

- **`--deps <types>`** - Include additional dependency types
  (comma-separated). Options:
  - `devDependencies` - include dev dependencies for all packages
  - `peerDependencies` - include peer dependencies

### Inspector

- **`--section <name>`** - Open specific inspector section when graph loads

## Examples

### Basic Usage

```bash
# Graph a single package
npmgraph express

# Graph multiple packages
npmgraph react react-dom next

# Graph with version range
npmgraph lodash@^4.0.0

# Graph from GitHub shorthand
npmgraph npmgraph/npmgraph
```

### Local Files

```bash
# Graph your project's dependencies
npmgraph --file ./package.json

# Graph with dev dependencies
npmgraph --file ./package.json --deps devDependencies

# Graph multiple local projects
npmgraph -f ./packages/a/package.json -f ./packages/b/package.json
```

### Visualization

```bash
# Colorize by maintainer bus factor
npmgraph express --color bus

# View by package size
npmgraph webpack --sizing

# Hide the inspector panel
npmgraph express --hide

# Show report-only view
npmgraph express --hide graph

# Set initial tab
npmgraph express --tab report
```

### Selection & Filtering

```bash
# Select and highlight a specific module
npmgraph express --select exact:compression@1.7.4

# Select all versions of a module
npmgraph express --select name:debug

# Select by license
npmgraph express --select license:MIT

# Collapse certain dependencies
npmgraph webpack --collapse terser,webpack-sources

# Show only peer dependencies
npmgraph package --deps peerDependencies
```

### Custom Registry

```bash
# Graph packages from a private registry
npmgraph my-private-package --registry https://registry.example.com
```

### Combined Examples

```bash
# Graph express, include dev deps, colorize by type, show report
npmgraph express --deps devDependencies --color moduleType --tab report

# Graph local project, collapse debug, show licenses section
npmgraph -f ./package.json --collapse debug --section licenses

# Graph multiple packages from private registry
npmgraph @company/pkg-a @company/pkg-b --registry https://npm.company.com
```

## URL API Reference

This CLI tool generates URLs that conform to the
[npmgraph URL API](https://github.com/npmgraph/npmgraph#url-api). For
full documentation of available parameters, see:

- **Search parameters**: `q` (packages), `registry` (npm registry)
- **Hash parameters**: `color`, `collapse`, `deps`, `hide`, `packages`,
  `section`, `select`, `sizing`, `tab`

## Notes

- Web-hosted `package.json` URLs (from GitHub) must be
  [CORS accessible](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- Local files can be relative paths or absolute paths
- Package names support version ranges (e.g., `lodash@^4.0.0`)
- All option values are URL-encoded automatically
