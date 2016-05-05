var debug = require('debug')('buildreq:error')
function errorMiddleware (setup) {
  return function errorMiddleware (err, req, res, next) { // Currently just a Sample - Still need to implement
    debug('err:', err)
    if (res.headersSent) {
      return next(err)
    }
    res.status(500)
    res.render('error', {
      error: err
    })
  }
}
module.exports = errorMiddleware
