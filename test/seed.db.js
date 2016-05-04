module.exports = seed
var mongoose = require('mongoose')
var async = require('async')
var User = mongoose.model('Users')
var Blog = mongoose.model('Blog')

function seed (cb) {
  async.waterfall([
    function (callback) {
      async.parallel({
        User: function (callback) {
          User.find({}).remove().exec(function () {
            callback(null, true)
          })
        },
        Blog: function (callback) {
          Blog.find({}).remove().exec(function () {
            callback(null, true)
          })
        }
      },
        function (err, results) {
          if (err) throw err
          callback(null, true)
        })
    },
    function (done, callback) {
      User.create([{
        email: 'jason@greenpioneersolutions.com',
        name: 'jason',
        username: 'jason greenpioneer'
      }, {
        email: 'accounting@greenpioneersolutions.com',
        name: 'accounting',
        username: 'accounting greenpioneer'
      }, {
        email: 'ceo@greenpioneersolutions.com',
        name: 'ceo',
        username: 'ceo greenpioneer'
      }, {
        email: 'development@greenpioneersolutions.com',
        name: 'development',
        username: 'development greenpioneer'
      }, {
        email: 'qa@greenpioneersolutions.com',
        name: 'qa',
        username: 'qa greenpioneer'
      }, {
        email: 'help@greenpioneersolutions.com',
        name: 'help',
        username: 'help greenpioneer'
      }]).then(function (users) {
        callback(null, users)
      })
    },
    function (users, callback) {
      Blog.create([{
        title: 'Mean',
        user: users[0]._id

      }, {
        title: 'Green Pioneer Solutions',
        user: users[0]._id

      }, {
        title: 'expertise',
        user: users[1]._id

      }, {
        title: 'combination',
        user: users[2]._id

      }, {
        title: 'goals',
        user: users[2]._id

      }, {
        title: 'energy-efficient',
        user: users[3]._id

      }, {
        title: 'vision',
        user: users[4]._id

      }, {
        title: 'sustainability',
        user: users[4]._id

      }, {
        title: 'Sustainable',
        user: users[5]._id

      }, {
        title: 'computing',
        user: users[5]._id

      }, {
        title: 'example',
        user: users[5]._id

      }]).then(function (blogs) {
        callback(null, users, blogs)
      })
    }
  ], function (err, users, blogs) {
    if (err) throw err
    cb({
      users: users,
      blogs: blogs
    })
  })
}
