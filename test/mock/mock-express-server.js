const enableDestroy = require('server-destroy');
const express = require('express');

/**
 * Responsible for creating, starting, and stopping an Express server
 *
 * Any specific behavior (how to respond to requests) should be done by extensions
 */
class MockExpressServer {
  constructor(options) {
    this.app = express();
    this.options = Object.assign({
      port: 3000
    }, options || {});
  }
  start() {
    return new Promise((resolve, reject) => {
      this.httpServer = require('http').createServer(this.app);
      this.httpServer.listen(this.options.PORT, (err) => {
        if (err) {
          return reject(err);
        }
        console.log(`Test app listening on port ${constants.PORT}!`)
        return resolve();
      });
      enableDestroy(this.httpServer);
    });
  }
  stop() {
    console.log('Sever shutting down');
    return new Promise((resolve, reject) => {
      this.httpServer.destroy((err) => {
        console.log('Server destroyed')
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
};

module.exports = MockExpressServer;