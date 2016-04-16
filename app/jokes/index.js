const Jokes = require('./jokes')

module.exports = (app) => {
  var getJokes = Jokes(app)

  return {

    all: getJokes,

    // Return a random joke
    random (done) {
      getJokes((err, jokes) => {
        if (err) {
          return done(err, jokes)
        }

        done(null, jokes[Math.floor(Math.random() * jokes.length)])
      })
    }

  }
}
