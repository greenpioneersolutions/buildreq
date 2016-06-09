require('../ex/app.js')

var assert = require('chai').assert
var request = require('supertest')
var mongoose = require('mongoose')
var User = mongoose.model('Users')
var Blog = mongoose.model('Blog')
describe('BuildREQ', function () {
  before(function (done) {
    // require('./seed.db.js')
    User.find({}).remove().exec(function () {
      Blog.find({}).remove().exec(function () {
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
        }]).then(function (Person) {
          Blog.create([{
            _id: '575796a2286ab1f5075dcd11',
            title: 'Development Tools',
            user: Person[0]._id
          }, {
            title: 'Server and Client integration',
            user: Person[0]._id
          }, {
            title: 'Smart Build System',
            user: Person[0]._id
          }, {
            title: 'Modular Structure',
            user: Person[0]._id
          }, {
            title: 'Optimized Build',
            user: Person[1]._id
          }, {
            title: 'Deployment Ready',
            user: Person[1]._id
          }, {
            title: 'Development Tools',
            user: Person[1]._id
          }, {
            title: 'Server and Client integration',
            user: Person[2]._id
          }, {
            title: 'Smart Build System',
            user: Person[2]._id
          }, {
            title: 'Modular Structure',
            user: Person[2]._id
          }, {
            title: 'Optimized Build',
            user: Person[3]._id
          }, {
            title: 'Deployment Ready',
            user: Person[3]._id
          }, {
            title: 'Development Tools',
            user: Person[3]._id
          }, {
            title: 'Server and Client integration',
            user: Person[4]._id
          }, {
            title: 'Smart Build System',
            user: Person[4]._id
          }, {
            title: 'Modular Structure',
            user: Person[4]._id
          }, {
            title: 'Optimized Build',
            user: Person[5]._id
          }, {
            title: 'Deployment Ready',
            user: Person[5]._id
          }, {
            title: 'Development Tools',
            user: Person[5]._id
          }, {
            title: 'Server and Client integration',
            user: Person[0]._id
          }, {
            title: 'Smart Build System',
            user: Person[1]._id
          }, {
            title: 'Modular Structure',
            user: Person[2]._id
          }, {
            title: 'Optimized Build',
            user: Person[3]._id
          }, {
            title: 'Deployment Ready',
            user: Person[4]._id
          }]).then(function (blogs) {
            done()
          })
        })
      })
    })
  })
  describe('BLOG', function () {
    it('GET /api/v1/blog', function (done) {
      request('localhost:3000/')
        .get('api/v1/blog')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          assert.equal(res.body.type, 'Blog')
          assert.equal(res.body.success, true)
          assert.equal(res.body.actions.reload.ref, 'localhost:3000/api/v1/blog')
          assert.equal(res.body.actions.next.ref, 'localhost:3000/api/v1/blog?skip=20')

          done()
        })
    })
    it('GET /api/v1/bLOG', function (done) {
      request('localhost:3000/')
        .get('api/v1/bLOG')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          assert.equal(res.body.type, 'Blog')
          assert.equal(res.body.success, true)
          assert.equal(res.body.actions.reload.ref, 'localhost:3000/api/v1/bLOG')
          assert.equal(res.body.actions.next.ref, 'localhost:3000/api/v1/bLOG?skip=20')

          done()
        })
    })
    it('GET /api/v1/BLOG', function (done) {
      request('localhost:3000/')
        .get('api/v1/BLOG')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          assert.equal(res.body.type, 'Blog')
          assert.equal(res.body.success, true)
          assert.equal(res.body.actions.reload.ref, 'localhost:3000/api/v1/BLOG')
          assert.equal(res.body.actions.next.ref, 'localhost:3000/api/v1/BLOG?skip=20')

          done()
        })
    })

    it('GET /api/v1/Blog', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          assert.equal(res.body.type, 'Blog')
          assert.equal(res.body.success, true)
          assert.equal(res.body.actions.reload.ref, 'localhost:3000/api/v1/Blog')
          assert.equal(res.body.actions.next.ref, 'localhost:3000/api/v1/Blog?skip=20')

          done()
        })
    })

    it('GET /api/v1/Blog?title=Deployment Ready', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?title=Deployment%20Ready')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.filter.title, 'Deployment Ready')
          assert.equal(res.body.data.length, '4')
          assert.equal(res.body.itemPerPage, '4')
          assert.equal(res.body.count, '4')
          done()
        })
    })
    it('GET /api/v1/Blog?sort=title', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?sort=title')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.sort, 'title')
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })

    it('GET /api/v1/Blog?limit=10', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?limit=10')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.limit, '10')
          assert.equal(res.body.data.length, '10')
          assert.equal(res.body.itemPerPage, '10')
          assert.equal(res.body.count, '24')
          done()
        })
    })

    it('GET /api/v1/Blog?lean=true', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?lean=true')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.lean, 'true')
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })

    it('GET /api/v1/Blog?select=title', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?select=title')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.select, 'title')
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })
    it('GET /api/v1/Blog?where=title', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=title')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.where, 'title')
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })
    it('GET /api/v1/Blog?where=title&find=Smart', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=title&find=Smart')
        .expect(200, function (err, res) {
          if (err) return done(err)

          assert.equal(res.body.query.find, 'Smart')
          assert.isObject(res.body.query.where.title, {})
          assert.equal(res.body.data.length, '4')
          assert.equal(res.body.itemPerPage, '4')
          assert.equal(res.body.count, '4')
          done()
        })
    })

    it('GET /api/v1/Blog?where=created&gt=2015-11-17&lt=2019-12-30', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=created&gt=2015-11-17&lt=2019-12-30')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.gt, '2015-11-17')
          assert.equal(res.body.query.lt, '2019-12-30')

          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })
    it('GET /api/v1/Blog?where=title&equals=Development Tools', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=title&equals=Development Tools')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.equals, 'Development Tools')
          assert.equal(res.body.query.where.title, 'Development Tools')
          assert.equal(res.body.data.length, '4')
          assert.equal(res.body.itemPerPage, '4')
          assert.equal(res.body.count, '4')
          done()
        })
    })
    it('GET /api/v1/Blog?where=title&find=**Tools', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=title&find=**Development Tools')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '0')
          assert.equal(res.body.itemPerPage, '0')
          assert.equal(res.body.count, '0')
          done()
        })
    })
    it('GET /blog/test/', function (done) {
      request('localhost:3000/')
        .get('blog/test')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '20')
          assert.equal(res.body.itemPerPage, '20')
          assert.equal(res.body.count, '24')
          done()
        })
    })
    it('GET /blog/test?where=title&find=Development Tools', function (done) {
      request('localhost:3000/')
        .get('blog/test?where=title&find=Development Tools')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '4')
          assert.equal(res.body.itemPerPage, '4')
          assert.equal(res.body.count, '24')
          done()
        })
    })
    it('GET /api/v1/Blog/23ljlkdf2io3j', function (done) {
      request('localhost:3000/')
        .get('api/v1/Blog?where=title&find=**Development Tools')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '0')
          assert.equal(res.body.itemPerPage, '0')
          assert.equal(res.body.count, '0')
          done()
        })
    })
    it('GET /api/v1/blog/575796a2286ab1f5075dcd11', function (done) {
      request('localhost:3000/')
        .get('api/v1/blog/575796a2286ab1f5075dcd11')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data._id, '575796a2286ab1f5075dcd11')
          assert.equal(res.body.data.name, true)
          assert.equal(res.body.data.author, 'testauthor')
          assert.equal(res.body.data.content, 'testcontent')
          assert.equal(res.body.data.title, 'Development Tools')
          done()
        })
    })

    it('GET /api/v1/Users', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.data.length, '6')
          assert.equal(res.body.itemPerPage, '6')
          assert.equal(res.body.count, '6')
          done()
        })
    })
    it('GET /api/v1/Users?where=roles&in=development', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=roles&in=development')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.roles.$in, 'development')
          assert.equal(res.body.data.length, '1')
          assert.equal(res.body.itemPerPage, '1')
          assert.equal(res.body.count, '1')
          done()
        })
    })
    // ne  http://localhost:3000/api/v1/campaigns?where=email&ne=john@greenpioneersolutions.com
    it('GET /api/v1/Users?where=roles&ne=qa', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=roles&ne=qa')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.roles.$ne, 'qa')
          assert.equal(res.body.data.length, '5')
          assert.equal(res.body.itemPerPage, '5')
          assert.equal(res.body.count, '5')
          done()
        })
    })
    it('GET /api/v1/Users?where=roles&nin=qa', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=roles&nin=qa')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.roles.$nin, 'qa')
          assert.equal(res.body.data.length, '5')
          assert.equal(res.body.itemPerPage, '5')
          assert.equal(res.body.count, '5')
          done()
        })
    })

    // regex & options http://localhost:3000/api/v1/campaigns?where=email&regex=\/com\/&options=%3Coptions%3E
    it('GET /api/v1/Users?where=email&regex=greenpioneersolution&options=<options>', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=email&regex=greenpioneersolution&options=<options>')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.email.$regex, 'greenpioneersolution')
          assert.equal(res.body.query.where.email.$options, '<options>')
          assert.equal(res.body.data.length, '6')
          assert.equal(res.body.itemPerPage, '6')
          assert.equal(res.body.count, '6')
          done()
        })
    })
    // size  http://localhost:3000/api/v1/campaigns?where=emails&size=2
    it('GET /api/v1/UsersUsers?where=roles&size=2', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=roles&size=2')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.roles.$size, '2')
          assert.equal(res.body.data.length, '1')
          assert.equal(res.body.itemPerPage, '1')
          assert.equal(res.body.count, '1')
          done()
        })
    })
    // all http://localhost:3000/api/v1/campaigns?where=email&all=shawn@greenpioneersolutions.com
    it('GET /api/v1/Users?where=roles&all=gps&all=admin', function (done) {
      request('localhost:3000/')
        .get('api/v1/Users?where=roles&all=gps&all=admin')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.where.roles.$all[0], 'gps')
          assert.equal(res.body.query.where.roles.$all[1], 'admin')
          assert.equal(res.body.data.length, '3')
          assert.equal(res.body.itemPerPage, '3')
          assert.equal(res.body.count, '3')
          done()
        })
    })
    // find  http://localhost:3000/api/v1/campaigns?where=email&find=shawn@
    // it('GET /api/v1/Users?where=email&find=jason@', function (done) {
    //   request('localhost:3000/')
    //     .get('api/v1/Users?where=email&find=jason@')
    //     .expect(200, function (err, res) {
    //       if (err) return done(err)

  //       assert.equal(res.body.query.find, 'Smart')
  //       assert.isObject(res.body.query.where.title, {})
  //       assert.equal(res.body.data.length, '4')
  //       assert.equal(res.body.itemPerPage, '4')
  //       assert.equal(res.body.count, '4')
  //       done()
  //     })
  // })
  })
})
