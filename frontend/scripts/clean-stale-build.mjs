#!/usr/bin/env node
/**
 * Removes production build output before `next dev` starts.
 *
 * `next build` and `next dev` write incompatible artifacts into the same
 * `.next` directory. Starting the dev server on top of a production build makes
 * it load the production `server/webpack-runtime.js`, which requires chunks the
 * dev bundler never emits:
 *
 *     Cannot find module './611.js'
 *     Require stack: .next/server/webpack-runtime.js
 *                    .next/server/pages/_document.js
 *
 * A production build is identified by `.next/BUILD_ID`, which `next dev` never
 * creates. When it is absent the directory is left alone, so the dev cache
 * survives and startups stay fast.
 *
 * Usage:
 *   node scripts/clean-stale-build.mjs            # clean only if stale
 *   node scripts/clean-stale-build.mjs --force    # always remove
 *   node scripts/clean-stale-build.mjs --dir path # operate on another directory
 */
import { existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Files written ONLY by `next build`, verified empirically against this Next
 * version. Note `prerender-manifest.json` is deliberately NOT in this list:
 * `next dev` writes one too, so treating it as a production marker would delete
 * the dev cache on every startup.
 */
const PRODUCTION_MARKERS = ['BUILD_ID', 'export-marker.json'];

export function isProductionBuild(nextDir) {
  return PRODUCTION_MARKERS.some((marker) => existsSync(join(nextDir, marker)));
}

/**
 * @returns {'removed'|'kept'|'absent'} what happened to the directory
 */
export function cleanStaleBuild(nextDir, { force = false } = {}) {
  if (!existsSync(nextDir)) return 'absent';

  if (force || isProductionBuild(nextDir)) {
    rmSync(nextDir, { recursive: true, force: true });
    return 'removed';
  }
  return 'kept';
}

function parseArgs(argv) {
  const dirFlag = argv.indexOf('--dir');
  return {
    force: argv.includes('--force'),
    dir: dirFlag !== -1 ? argv[dirFlag + 1] : '.next',
  };
}

// Only run when invoked directly, so the functions above stay importable.
// Compare via pathToFileURL: this project's path contains spaces, which
// import.meta.url percent-encodes, so a plain string comparison never matches.
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const { force, dir } = parseArgs(process.argv.slice(2));
  const target = resolve(process.cwd(), dir);

  let result;
  try {
    result = cleanStaleBuild(target, { force });
  } catch (err) {
    // A running dev server can hold a file open on Windows. Warn rather than
    // block the command the developer actually asked for.
    console.warn(
      `[clean-stale-build] could not remove ${dir}: ${err.message}\n` +
        `[clean-stale-build] stop any running dev server and delete ${dir} manually.`
    );
    process.exit(0);
  }

  if (result === 'removed') {
    console.log(`[clean-stale-build] removed stale production build in ${dir}`);
  }
}
