const BeepBoopSlack = require('beepboop-smallwins-slack')

module.exports = (slack, config) => {
  config = config || {}

  // Only run the presence polyfill if we have resourcer config
  var runPolyfill = config.serverUrl || process.env.BEEPBOOP_RESOURCER

  if (!runPolyfill) {
    console.log('No BEEPBOOP_RESOURCER environment variable. Not starting Beep Boop Slapp Presence Polyfill 😶')
    return
  }

  console.log('Starting Beep Boop Slapp Presence Polyfill 😘')
  BeepBoopSlack.start(slack, config)
}

