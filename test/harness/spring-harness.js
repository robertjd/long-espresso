const AuthServerHarness = require('./auth-server-harness');

/**
 * The harness is responsible for bootstrapping the app server under test, while doing so
 * it must bootstrap the mock auth serer so that the issuer can be known
 */
class SpringAppServerHarness extends AuthServerHarness {
  constructor(options) {
    super(options);
    this.name = 'Spring App Server';
    this.options = Object.assign({
      redirect_uri: '/' // defaults, these are for the SUT
    }, options || {})
  }
  start() {
    this.startAuthServer().then(authSeverDetails => {
      return new Promise((resolve, reject) => {

        // Do what's needed, such as create a child process, to bootstrap the SUT

        // The authSeverDetails map will contain an `issuer` that should be provided to the SUT

        resolve({
          host: 'http://localhost:8080' // the location of this app server, for the specs to use
        })
      });
    })
  }
  stop() {
    this.stopAuthServer().then(() => {
      // Tear down the SUT
    });
  }
}

module.exports = SpringAppServerHarness;