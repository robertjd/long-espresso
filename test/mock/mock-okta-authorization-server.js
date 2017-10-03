const MockExpressServer = require('./mock-express-server');
const url = require('url');
const querystring = require('querystring');

/**
 * An HTTP server that mocks a subset of an authorization server
 */
class MockOktaAuthorizationServer extends MockExpressServer {
  constructor(options) {
    this.options = Object.assign({
      forIssuer: `http://localhost:3000/oauth/default` // the default
    }, options || {});
    const issuerUrl = url.parse(this.options.forIssuer);
    super({
      port: issuerUrl.port
    });
    /**
     * All test cases are going to need the well-known, so always provide a mock response for that
     */
    bindWellKnown()
  }
  bindWellKnown() {
    const issuerUrl = url.parse(this.options.forIssuer);
    this.app.get(issuerUrl.path + '/.well-known/oauth-authorization-server', (req, res) => {
      res.json({
        issuer: `${issuerUrl}`,
        authorization_endpoint: `${issuerUrl}/v1/authorize`,
        token_endpoint: `${issuerUrl}/v1/token`,
        registration_endpoint: '${issuerUrl.host}/oauth2/v1/clients',
        jwks_uri: `${issuerUrl}/v1/keys`,
        response_types_supported: [
          "code",
          "token",
          "code token"
        ],
        response_modes_supported: [
          "query",
          "fragment",
          "form_post",
          "okta_post_message"
        ],
        grant_types_supported: [
          "authorization_code",
          "implicit",
          "refresh_token",
          "password",
          "client_credentials"
        ],
        subject_types_supported: [
          "public"
        ],
        scopes_supported: [
          "offline_access"
        ],
        token_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
          "client_secret_jwt",
          "none"
        ],
        claims_supported: [
          "ver",
          "jti", "iss", "aud", "iat", "exp", "cid", "uid", "scp", "sub"
        ],
        code_challenge_methods_supported: [
          "S256"
        ],
        introspection_endpoint: `${issuerUrl}/v1/introspect`,
        introspection_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
          "client_secret_jwt",
          "none"
        ],
        revocation_endpoint: `${issuerUrl}/v1/revoke`,
        revocation_endpoint_auth_methods_supported: [
          "client_secret_basic",
          "client_secret_post",
          "client_secret_jwt",
          "none"
        ],
        end_session_endpoint: `${issuerUrl}/v1/logout`
      });
    });
  }
  withHappyPath() {
    // Simply go to the callback with the provided params
    this.app.get('/authorize', (req, res) => {
      const params = url.parse(req.url).query;
      const goto = x.query.redirect_uri + '?' + querystring.stringify(params);
      res.redirect(goto);
    });
  }
  withInvalidStateResponse() {
    // Modify the state to be invalided before calling back
    this.app.get('/authorize', (req, res) => {
      const params = url.parse(req.url).query;
      params.state = 'foo';
      const goto = x.query.redirect_uri + '?' + querystring.stringify(params);
      res.redirect(goto);
    });
  }

  withBadNonceCallback() {
    // TODO
  }
}

module.exports = MockOktaAuthorizationServer;
