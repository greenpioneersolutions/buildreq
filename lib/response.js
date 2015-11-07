var _ = require('lodash')

function response (setup) {
  var settings = setup()
  var response = {}
  response.actions = {}
  var url = ''

  function urlBuilder (data) {
    data = data.trim().replace(/\s/g, '%20')
    if (url === '') {
      url = '?' + data
    } else {
      url += '&' + data
    }
    return url
  }

  function queryBuilder (skipfield) {
    function skip (field) {
      return skipfield === field ? 0 : 1
    }
    _.forEach(settings.options.query, function (n, key) {
      if (_.isArray(n)) {
        _.forEach(settings.value.query[key], function (k, keyArr) {
          urlBuilder(keyArr + '=' + k)
        })
      } else if (_.isObject(n)) {
        _.forEach(settings.value.query[key], function (j, keyObj) {
          urlBuilder(keyObj + '=' + j)
        })
      } else if (settings.value.query[key] && settings.value.query[key] !== n) {
        if (skip(key)) {
          urlBuilder(key + '=' + settings.value.query[key])
        }
      }
    })
  }
  // need to update - known issue http://localhost:3000/api/v1/blog?limit=3
  function reload () {
    if (settings.options.response.actions.reload) {
      url = ''
      queryBuilder()
      response.actions.reload = {
        allowed: _.keys(settings.value.route.methods),
        ref: settings.value.hostname + url
      }
    }
  }

  function next (number) {
    if (settings.options.response.actions.next) {
      url = ''
      queryBuilder('skip')
      var dataSkip = parseInt(settings.value.query.limit, 10) + parseInt(settings.value.query.skip, 10)
      if (dataSkip < settings.value.count) {
        urlBuilder('skip=' + dataSkip)
        response.actions.next = {
          allowed: _.keys(settings.value.route.methods),
          ref: settings.value.hostname + url
        }
      }
    }
  }

  function prev (number) {
    if (settings.options.response.actions.prev) {
      url = ''
      queryBuilder('skip')
      var dataSkip = parseInt(settings.value.query.skip, 10) - parseInt(settings.value.query.limit, 10)
      if (dataSkip > 0) {
        urlBuilder('skip=' + dataSkip)
        response.actions.prev = {
          allowed: _.keys(settings.value.route.methods),
          ref: settings.value.hostname + url
        }
      } else {
        response.actions.prev = {
          allowed: _.keys(settings.value.route.methods),
          ref: settings.value.hostname + url
        }
      }
    }
  }
  response.query = settings.value.query || settings.options.response.query
  if (settings.value.data && _.isArray(settings.value.data)) {
    response.count = settings.value.data.length || settings.options.response.count
    response.itemPerPage = settings.value.data.length
  }
  response.data = settings.value.data || settings.options.response.data
  response.user = settings.value.user || settings.options.response.user
  response.type = settings.value.type || settings.options.response.type
  response.error = settings.value.error || {}
  response.success = true

  if (settings.value.count) {
    if (settings.value.data && settings.value.data.length < settings.value.count) {
      reload()
      next(settings.value.data.length)
    } else {
      reload()
    }
    if (settings.value.query.skip !== 0) {
      prev(settings.value.query.skip)
    }
  } else {
    reload()
  }

  _.forEach(settings.options.response.delete, function (n, key) {
    if (_.isString(response[n]) || _.isArray(response[n]) || _.isObject(response[n]) || _.isNumber(response[n])) {
      delete response[n]
    }
  })
  settings.res[settings.value.method](response)
}
module.exports = response
