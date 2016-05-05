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
    function (Person, callback) {
      console.log(Person, 'users')
      Blog.create([{
        title: 'Development Tools',
        user: Person._id
      }, {
        title: 'Server and Client integration',
        user: Person._id
      }, {
        title: 'Smart Build System',
        user: Person._id
      }, {
        title: 'Modular Structure',
        user: Person._id
      }, {
        title: 'Optimized Build',
        user: Person._id
      }, {
        title: 'Deployment Ready',
        user: Person._id
      }, {
        title: 'Development Tools',
        user: Person._id
      }, {
        title: 'Server and Client integration',
        user: Person._id
      }, {
        title: 'Smart Build System',
        user: Person._id
      }, {
        title: 'Modular Structure',
        user: Person._id
      }, {
        title: 'Optimized Build',
        user: Person._id
      }, {
        title: 'Deployment Ready',
        user: Person._id
      }, {
        title: 'Development Tools',
        user: Person._id
      }, {
        title: 'Server and Client integration',
        user: Person._id
      }, {
        title: 'Smart Build System',
        user: Person._id
      }, {
        title: 'Modular Structure',
        user: Person._id
      }, {
        title: 'Optimized Build',
        user: Person._id
      }, {
        title: 'Deployment Ready',
        user: Person._id
      }, {
        title: 'Development Tools',
        user: Person._id
      }, {
        title: 'Server and Client integration',
        user: Person._id
      }, {
        title: 'Smart Build System',
        user: Person._id
      }, {
        title: 'Modular Structure',
        user: Person._id
      }, {
        title: 'Optimized Build',
        user: Person._id
      }, {
        title: 'Deployment Ready',
        user: Person._id
      }]).then(function (blogs) {
        callback(null, Person, blogs)
      })
    }
  ], function (err, users, blogs) {
    if (err) throw err
    console.log('madfsksdfj')
    cb({
      users: users,
      blogs: blogs
    })
  })
}
