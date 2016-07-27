module.exports = {
  production: {
    port: process.env.PORT,
    spreadsheet: {
      ttl: '15 minutes',
      id: '1v5e3261-S7dxMONglcgnGwSWgiN7_rStiXEu8TBFV4k',
      sheet: 1
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN
    },
    slack: {
      verifyToken: process.env.SLACK_VERIFY_TOKEN
    },
    facebook: {
      verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    },
    cache: {
      store: 'redis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      options: {
        password: process.env.REDIS_PASS
      }
    },
    logging: {
      colorize: false,
      timestamp: true,
      loggers: {
        debug: 'rainbow',
        slackapp: 'magenta',
        info: 'green',
        error: 'red'
      },
      enabled: {
        debug: false,
        slackapp: true,
        info: true,
        error: true
      }
    }
  },
  // Applied over production values
  development: {
    port: process.env.PORT || 3000,
    cache: {
      store: 'memory'
    },
    logging: {
      colorize: true,
      timestamp: true,
      enabled: {
        debug: true
      }
    }
  }
}
