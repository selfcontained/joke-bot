var path = require('path')
var Crampon = require('crampon')

module.exports = function () {
  var environment = process.env.NODE_ENV || 'development'
  var crampon = new Crampon(['production', 'development'])
    .addFile(path.join(__dirname, 'config.js'))
    .addOverride({ environment: environment })

  return crampon.getConfig(environment)
}
