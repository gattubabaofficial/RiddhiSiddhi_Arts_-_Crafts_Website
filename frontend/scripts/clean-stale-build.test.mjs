import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { cleanStaleBuild, isProductionBuild } from './clean-stale-build.mjs';

function makeNextDir(files) {
  const root = mkdtempSync(join(tmpdir(), 'next-clean-'));
  const nextDir = join(root, '.next');
  mkdirSync(join(nextDir, 'server'), { recursive: true });
  for (const [name, contents] of Object.entries(files)) {
    writeFileSync(join(nextDir, name), contents);
  }
  return nextDir;
}

test('a production build is detected by its BUILD_ID', () => {
  const dir = makeNextDir({ 'BUILD_ID': 'abc123' });
  assert.equal(isProductionBuild(dir), true);
  rmSync(dir, { recursive: true, force: true });
});

test('a dev-only directory is not mistaken for a production build', () => {
  const dir = makeNextDir({ 'build-manifest.json': '{}' });
  assert.equal(isProductionBuild(dir), false);
  rmSync(dir, { recursive: true, force: true });
});

test('prerender-manifest.json alone does NOT mean a production build', () => {
  // `next dev` writes this file too. Treating it as a production marker made
  // the guard delete the dev cache on every single startup.
  const dir = makeNextDir({
    'prerender-manifest.json': '{}',
    'build-manifest.json': '{}',
  });
  assert.equal(isProductionBuild(dir), false);
  assert.equal(cleanStaleBuild(dir), 'kept');
  assert.equal(existsSync(dir), true);
  rmSync(dir, { recursive: true, force: true });
});

test('export-marker.json identifies a production build', () => {
  const dir = makeNextDir({ 'export-marker.json': '{}' });
  assert.equal(isProductionBuild(dir), true);
  rmSync(dir, { recursive: true, force: true });
});

test('a stale production build is removed', () => {
  const dir = makeNextDir({ 'BUILD_ID': 'abc123' });
  assert.equal(cleanStaleBuild(dir), 'removed');
  assert.equal(existsSync(dir), false);
});

test('a real production build is removed even without BUILD_ID', () => {
  const dir = makeNextDir({ 'export-marker.json': '{}' });
  assert.equal(cleanStaleBuild(dir), 'removed');
  assert.equal(existsSync(dir), false);
});

test('a dev cache is preserved so startups stay fast', () => {
  const dir = makeNextDir({ 'build-manifest.json': '{}' });
  assert.equal(cleanStaleBuild(dir), 'kept');
  assert.equal(existsSync(dir), true);
  rmSync(dir, { recursive: true, force: true });
});

test('--force removes a dev directory too', () => {
  const dir = makeNextDir({ 'build-manifest.json': '{}' });
  assert.equal(cleanStaleBuild(dir, { force: true }), 'removed');
  assert.equal(existsSync(dir), false);
});

test('a missing directory is not an error', () => {
  const dir = join(tmpdir(), 'next-clean-does-not-exist-12345');
  assert.equal(cleanStaleBuild(dir), 'absent');
});
