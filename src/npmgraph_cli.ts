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
  hide?: string | boolean;
  deps?: string;
  color?: string;
  collapse?: string;
  registry?: string;
  sizing?: boolean;
  tab?: string;
  section?: string;
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
      'select modules: exact:<key>, name:<name>, license:<license>, maintainer:<name>',
    )
    .option(
      '--hide [type]',
      'hide inspector panel (or "graph" for report-only view)',
    )
    .option(
      '--deps <deps>',
      'include dependency types: devDependencies, peerDependencies',
    )
    .option(
      '--color <mode>',
      'colorization mode: moduleType (default), bus, outdated',
    )
    .option(
      '--collapse <modules>',
      'collapse module subtrees (comma-separated)',
    )
    .option(
      '--registry <url>',
      'custom npm registry URL (defaults to npmjs.org)',
    )
    .option('--sizing', 'scale modules by unpacked size')
    .option('--tab <name>', 'active tab: info, report, module, or view')
    .option('--section <name>', 'inspector section to expand/scroll into view')
    .argument('[packages...]', 'public npm package names or versions')
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
      if (options.hide) {
        hash.set('hide', typeof options.hide === 'string' ? options.hide : '');
      }

      if (options.deps) hash.set('deps', options.deps);
      if (options.color) hash.set('color', options.color);
      if (options.collapse) hash.set('collapse', options.collapse);
      if (options.sizing) hash.set('sizing', '');
      if (options.tab) hash.set('tab', options.tab);
      if (options.section) hash.set('section', options.section);

      url.searchParams.set('q', q.join(','));
      if (options.registry) {
        url.searchParams.set('registry', options.registry);
      }

      url.hash = hash.toString();

      await open(url.toString());
    });

  program.parse();
}
