'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api"',
  LOGIN_URL: '"http://www2.btclass.cn/sealtalk"',
  APP_KEY: '"sfci50a7s4woi"'
})
