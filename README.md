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

## Viewing dependencies for NPM modules

A single module:
```bash
npmgraph express

```

To see multiple NPM modules:
```bash
npmgraph minimatch cross-env rimraf

```
## Viewing dependencies for local package.json files

```bash
npmgraph -f my-project/package.json

```

Note: If your local package.json files depend on _other_ local package.json files, you'll need to include each file on the command line.  For example:


```bash
npmgraph -f my-project/package.json my-project/packages/*/package.json

```

## Viewing dependencies for web-hosted files

`npmgraph` has a limited ability to work with files online, however the URL in question needs to be [CORS accessible](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).  (Future versions of the `npmgraph` CLI may remove this restriction.)

```bash
npmgraph https://github.com/npmgraph/npmgraph/blob/main/package.json

```
