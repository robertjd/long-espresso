const request = require('supertest');

/**
 * This sepc file would be pulled in by the existing yo generator flow, but the AppServerHarness would
 * need to be changed out in each repo.
 */
const AppServerHarness = require('../harness/spring-harness');

describe(AppServerHarness.name, () => {

  describe('auth code flow', () => {

    it('should redirect me to my final destination if all is well', () => {
      const appServer = new AppServerHarness({
        redirect_uri: '/hello'
      }).withHappyPath();
      await appServer.start();
      const agent = request(appServer.host);
      .get('/login')
      .expect('Location', '/hello');
      await appServer.stop();
    });

    it('should fail if the state does not match', () => {
      const appServer = AppServerHarness().withBadStateCallback();
      await appServer.start();
      const agent = request(appServer.host);
      agent
      .get('/login')
      .expect(400, 'Invalid state token');
      await appServer.stop();
    });

  });
});