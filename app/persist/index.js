const Router = require('express').Router

module.exports = (app) => {
  var router = new Router()

  // Setup some data retrieval endpoints for testing
  router.get('/list', function (req, res) {
    app.persist.list(function (err, keys) {
      if (err) {
        app.log.error(err)
        return res.json({
          error: err
        })
      }

      res.json(keys)
    })
  })

  router.get('/key/:key', function (req, res) {
    app.persist.get(req.params.key, function (err, value) {
      if (err) {
        app.log.error(err)
        return res.json({
          error: err
        })
      }

      res.json(value)
    })
  })

  // TODO: kill this route once done debugging 🔥
  router.get('/del/:key', function (req, res) {
    app.persist.del(req.params.key, function (err) {
      if (err) {
        app.log.error(err)
        return res.json({
          error: err
        })
      }

      res.send('deleted ' + req.params.key)
    })
  })

  return router
}
