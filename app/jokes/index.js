const Jokes = require('./jokes')

module.exports = (app) => {
  var getJokes = Jokes(app)

  return {

    // Return a random joke
    random (done) {
      getJokes((err, jokes) => {
        if (err) {
          return done(err)
        }

        if ((jokes || []).length === 0) {
          return done(new Error('no jokes returned'))
        }

        done(null, jokes[Math.floor(Math.random() * jokes.length)])
      })
    }

  }
}
