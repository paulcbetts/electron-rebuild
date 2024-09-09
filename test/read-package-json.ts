import * as path from 'path';
import { expect } from 'chai';

import { readPackageJson } from '../lib/read-package-json';

describe('read-package-json', function() {
  it('should find a package.json file from the given directory', async function() {
     
    expect(await readPackageJson(path.resolve(__dirname, '..'))).to.deep.equal(require('../package.json'));
  });
});
