'use strict'

exports.config = {
  app_name: ['debugging-walkthrough'],

  // set license key and host via ENV for this example

  logging: {
    level: 'trace'
  },

  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },

  distributed_tracing: {
    enabled: true
  },
}
