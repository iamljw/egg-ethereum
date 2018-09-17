'use strict';

const mock = require('egg-mock');

describe('test/ethereum-utils.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/ethereum-utils-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, ethereumUtils')
      .expect(200);
  });
});
