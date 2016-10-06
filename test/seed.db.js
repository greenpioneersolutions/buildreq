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
        username: 'jason greenpioneer',
        roles: ['gps', 'admin', 'user']
      }, {
        email: 'accounting@greenpioneersolutions.com',
        name: 'accounting',
        username: 'accounting greenpioneer',
        roles: ['gps', 'user', 'accounting']
      }, {
        email: 'ceo@greenpioneersolutions.com',
        name: 'ceo',
        username: 'ceo greenpioneer',
        roles: ['gps', 'admin', 'ceo']
      }, {
        email: 'development@greenpioneersolutions.com',
        name: 'development',
        username: 'development greenpioneer',
        roles: ['gps', 'user', 'development']
      }, {
        email: 'qa@greenpioneersolutions.com',
        name: 'qa',
        username: 'qa greenpioneer',
        roles: ['gps', 'admin', 'qa']
      }, {
        email: 'help@greenpioneersolutions.com',
        name: 'help',
        username: 'help greenpioneer',
        roles: ['gps', 'help']
      }]).then(function (users) {
        callback(null, users)
      })
    },
    function (Person, callback) {
      Blog.create([{
        _id: '575796a2286ab1f5075dcd11',
        title: 'Development Tools',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[0]._id
      }, {
        title: 'Server and Client integration',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[0]._id
      }, {
        title: 'Smart Build System',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[0]._id
      }, {
        title: 'Modular Structure',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[0]._id
      }, {
        title: 'Optimized Build',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[1]._id
      }, {
        title: 'Deployment Ready',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[1]._id
      }, {
        title: 'Development Tools',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[1]._id
      }, {
        title: 'Server and Client integration',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[2]._id
      }, {
        title: 'Smart Build System',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[2]._id
      }, {
        title: 'Modular Structure',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[2]._id
      }, {
        title: 'Optimized Build',
        authors: [Person[4]._id, Person[0]._id, Person[2]._id],
        user: Person[3]._id
      }, {
        title: 'Deployment Ready',
        authors: [Person[4]._id, Person[0]._id, Person[2]._id],
        user: Person[3]._id
      }, {
        title: 'Development Tools',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[3]._id
      }, {
        title: 'Server and Client integration',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[4]._id
      }, {
        title: 'Smart Build System',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[4]._id
      }, {
        title: 'Modular Structure',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[4]._id
      }, {
        title: 'Optimized Build',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[5]._id
      }, {
        title: 'Deployment Ready',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[5]._id
      }, {
        title: 'Development Tools',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[5]._id
      }, {
        title: 'Server and Client integration',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[0]._id
      }, {
        title: 'Smart Build System',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[1]._id
      }, {
        title: 'Modular Structure',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[2]._id
      }, {
        title: 'Optimized Build',
        authors: [Person[0]._id, Person[1]._id, Person[2]._id],
        user: Person[3]._id
      }, {
        title: 'Deployment Ready',
        authors: [Person[4]._id, Person[5]._id, Person[3]._id],
        user: Person[4]._id
      }]).then(function (blogs) {
        callback(null, Person, blogs)
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
