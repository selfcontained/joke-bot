module.exports = {
  production: {
    port: process.env.PORT,
    spreadsheet: {
      ttl: '15 minutes',
      id: '1v5e3261-S7dxMONglcgnGwSWgiN7_rStiXEu8TBFV4k',
      sheet: 1
    },
    facebook: {
      verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    },
    logging: {
      colorize: false,
      timestamp: true,
      loggers: {
        debug: 'rainbow',
        facebook: 'blue',
        info: 'green',
        error: 'red'
      },
      enabled: {
        debug: false,
        facebook: true,
        info: true,
        error: true
      }
    }
  },
  // Applied over production values
  development: {
    port: 8080,
    logging: {
      colorize: true,
      timestamp: true,
      enabled: {
        debug: true
      }
    }
  }
}
