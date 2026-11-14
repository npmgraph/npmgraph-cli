import path from 'node:path';
import { fileURLToPath } from 'node:url';
import open from 'open';
import { program } from 'commander';
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';

const BASE = 'https://npmgraph.js.org/';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type PackageJSON = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

type ProgramOptions = {
  file?: string[];
  select?: string;
  hide?: boolean;
  zoom?: string;
  deps?: string;
  color?: string;
};

function getVersion(): string {
  const packagePathname = path.join(__dirname, '..', 'package.json');
  const pkg = fs.readFileSync(packagePathname, 'utf8');
  return JSON.parse(pkg).version;
}

async function getLocalPackage(
  pathname: string,
): Promise<PackageJSON | undefined> {
  let pkgPath: string | undefined = undefined;
  let pkgJson: string | undefined = undefined;
  const cwd = process.cwd();

  // Get package
  for (pkgPath of [
    path.resolve(cwd, pathname),
    path.resolve(cwd, pathname, 'package.json'),
  ]) {
    try {
      pkgJson = await readFile(path.resolve(cwd, pkgPath), 'utf8');
    } catch (err) {
      // fail silently
    }

    if (pkgJson) break;
  }

  if (!pkgJson) {
    console.warn(`Could not find package.json at "${pkgPath}"`);
    return undefined;
  }

  try {
    const pkg = JSON.parse(pkgJson);

    if (!pkg.name) {
      console.warn(`Package at "${pathname}" needs a \`name\` field`);
    }

    const sanitizedPackage: PackageJSON = {} as PackageJSON;
    for (const k of [
      'name',
      'version',
      'dependencies',
      'devDependencies',
      'peerDependencies',
    ]) {
      if (k in pkg) {
        sanitizedPackage[k] = pkg[k];
      }
    }

    return sanitizedPackage;
  } catch (err) {
    console.warn(`Invalid JSON at "${pathname}"`, (err as Error).message);
  }

  return undefined;
}

export default async function cli(): Promise<void> {
  process.title = 'npmgraph';

  program
    .version(getVersion())
    .option('-f, --file <files...>', 'use local package.json file')
    .option(
      '--select [select]',
      'see https://github.com/npmgraph/npmgraph#select-hash-param',
    )
    .option(
      '--hide',
      'see https://github.com/npmgraph/npmgraph#hide-hash-param',
    )
    .option(
      '--zoom [zoom]',
      'see https://github.com/npmgraph/npmgraph#zoom-hash-param',
    )
    .option(
      '--deps [deps]',
      'see https://github.com/npmgraph/npmgraph#deps-hash-param',
    )
    .option(
      '--color [color]',
      'see https://github.com/npmgraph/npmgraph#color-hash-param',
    )
    .argument('[packages...]', 'Public NPM package names')
    .action(async (packages: string[]): Promise<void> => {
      const options = program.opts<ProgramOptions>();
      let filePackages: (PackageJSON | undefined)[] = [];
      const url = new URL(BASE);
      const q: string[] = [];

      const hash = new URLSearchParams();

      if (options.file?.length && options.file.length > 0) {
        filePackages = await Promise.all(
          options.file.map(f => getLocalPackage(f)),
        );

        for (const filePackage of filePackages) {
          if (!filePackage) continue;
          q.push(`${filePackage.name}@${filePackage.version}`);
        }

        hash.set(
          'packages',
          JSON.stringify(
            filePackages.filter((pkg): pkg is PackageJSON => Boolean(pkg)),
          ),
        );
      } else if (packages.length) {
        for (const packageName of packages) {
          q.push(packageName);
        }
      }

      if (options.select) hash.set('select', options.select);
      if (options.hide) hash.set('hide', '');
      if (options.zoom) hash.set('zoom', options.zoom);
      if (options.deps) hash.set('deps', options.deps);
      if (options.color) hash.set('color', options.color);

      url.searchParams.set('q', q.join(','));
      url.hash = hash.toString();

      await open(url.toString());
    });

  program.parse();
}
