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

function getVersion() {
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
    for (const k of ['name', 'version', 'dependencies', 'devDependencies']) {
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

export default async function () {
  process.title = 'npmgraph';

  program
    .version(getVersion())
    .option('-f, --file <files...>', 'use local package.json file')
    // YOU WERE Headers, IMPLEMENTING PATHS
    // use '<' and '>' to indicate required arguments
    // use '[...]' to indicate optional arguments
    .argument('[packages...]', 'Public NPM package names')
    .action(async function (packages: string[]) {
      const options = program.opts();
      let filePackages: (PackageJSON | undefined)[] = [];
      const url = new URL(BASE);
      const q: string[] = [];

      const hash = new URLSearchParams();

      if (options.file?.length > 0) {
        filePackages = await Promise.all(
          (options.file as string[]).map((f) => getLocalPackage(f)),
        );

        for (const filePackage of filePackages) {
          if (!filePackage) continue;
          q.push(`${filePackage.name}@${filePackage.version}`);
        }

        hash.set(
          'packages',
          JSON.stringify(filePackages.filter((pkg) => Boolean(pkg))),
        );
      } else if (packages.length) {
        for (const packageName of packages) {
          q.push(packageName);
        }
      }

      url.searchParams.set('q', q.join(','));
      url.hash = hash.toString();

      await open(url.toString());
    });

  program.parse();
}
