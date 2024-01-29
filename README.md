# npmgraph-cli

Command-line interface for launching [the npmgraph web site](https://npmgraph.js.org) to show module dependency graphs.

Please note that the `npmgraph-cli` does *not* render dependency graphs directly.  It's simply a convenience (albeit a pretty powerful one) for opening `npmgraph.js.org` URLs in accordance with the [npmgraph URL API](https://github.com/npmgraph/npmgraph#url-api).

# Getting Started

To install:
```bash
npm install --global npmgraph-cli
```

To see command help:
```bash
npmgraph -h
```

## Examples

| Command | Shows dependencies...|
| --- | --- |
| `npmgraph express` | ... for the `express` package |
| `npmgraph --hide express` | ... with the inspector minimized |
| `npmgraph --color=bus --deps=devDependencies express` | ... colorized by # of maintainers, including `devDependencies` |
| `npmgraph minimatch cross-env rimraf` | ... for multiple NPM packages |
| `npmgraph -f ./my-project/package.json` |  ... for a local package.json file |
| `npmgraph -f my-project/package.json my-project/packages/*/package.json` |  ... for multiple local files (useful when local packages depend on one another) |
| `npmgraph https://github.com/npmgraph/npmgraph/blob/main/package.json` |  ... for a web-hosted package.json URL |


> [!NOTE]
> Web-hosted URLs must be [CORS accessible](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

