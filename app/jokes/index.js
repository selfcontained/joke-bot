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
    },

    // Grab a new, untold joke based on the identifier provided, i.e. slack team id
    newJoke (identifier, done) {
      // Get list of jokes already told to identifier
      var key = ['told_jokes', identifier].join(':')

      app.persist.get(key, (err, toldJokes) => {
        if (err) {
          return done(err, null)
        }

        // First time telling a joke to this identifier
        if (!toldJokes) {
          toldJokes = []
        }

        // Grab jokes
        getJokes((err, jokes) => {
          if (err) {
            return done(err, null)
          }

          // Filter jokes to untold ones
          var untoldJokes = jokes.filter((joke, idx) => {
            return toldJokes.indexOf(idx) === -1
          })

          // We've told em all - reset
          if (untoldJokes.length === 0) {
            untoldJokes = jokes
            toldJokes = []
          }

          var jokeIndex = Math.floor(Math.random() * untoldJokes.length)

          // Add joke to set of told jokes
          toldJokes.push(jokeIndex)
          app.persist.set(key, toldJokes, (err) => {
            if (err) {
              return done(err, null)
            }

            done(null, jokes[jokeIndex])
          })
        })
      })
    }

  }
}
