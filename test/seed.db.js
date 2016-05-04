module.exports = seed
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var User = mongoose.model('Users')
var Blog = mongoose.model('Blog')

function seed (cb) {
  console.log('seed')
  User.find({}).remove().then(function () {
    Blog.find({}).remove().then(function () {
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
          if (cb)cb()
        })
      })
    })
  })
}
