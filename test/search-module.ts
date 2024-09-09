import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import { getProjectRootPath } from '../lib/search-module';

let baseDir: string;

async function createTempDir(): Promise<void> {
  baseDir = await fs.mkdtemp(path.join(os.tmpdir(), 'electron-rebuild-test-'));
}

async function removeTempDir(): Promise<void> {
  await fs.remove(baseDir);
}

describe('search-module', function() {
  describe('getProjectRootPath', function() {
    describe('multi-level workspace', function() {
      for (const lockFile of ['yarn.lock', 'package-lock.json', 'pnpm-lock.yaml']) {
        describe(lockFile, function() {
          before(async function() {
            await createTempDir();
            await fs.copy(path.resolve(__dirname, 'fixture', 'multi-level-workspace'), baseDir);
            await fs.ensureFile(path.join(baseDir, lockFile));
          });

          it('finds the folder with the lockfile', async function() {
            const packageDir = path.join(baseDir, 'packages', 'bar');
            expect(await getProjectRootPath(packageDir)).to.equal(baseDir);
          });

          after(removeTempDir);
        });
      }
    });

    describe('no workspace', function() {
      before(createTempDir);

      it('returns the input directory if a lockfile cannot be found', async function() {
        expect(await getProjectRootPath(baseDir)).to.equal(baseDir);
      });

      after(removeTempDir);
    });
  });
});
