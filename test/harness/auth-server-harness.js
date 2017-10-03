const MockOktaAuthorizationServer = require('../mock/mock-okta-authorization-server');

/**
 * This harness is responsible for bootstrapping the app server under test, then providing it's issuer to the callee
 */
class AuthServerHarness {
  constructor(options) {
    this.mockAuthServer = new MockOktaAuthorizationServer(options);
  }
  startAuthServer() {
    return this.mockAuthServer.start.then(() => {
      resolve({
        issuer: this.mockAuthServer.options.forIssuer // provide the issuer URL to the SUT
      })
    });
  }
  stopAuthServer() {
    return this.mockAuthServer.stop();
  }
  withHappyPath() {
    this.mockAuthServer.withHappyPath();
  }
  withBadStateCallback() {
    this.mockAuthServer.withBadStateCallback();
  }
  withBadNonceCallback() {
    this.mockAuthServer.withBadNonceCallback();
  }
}

module.exports = AuthServerHarness ;