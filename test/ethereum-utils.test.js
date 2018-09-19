'use strict';

const mock = require('egg-mock');

describe('test/ethereum.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/ethereum-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, ethereum')
      .expect(200);
  });
});
