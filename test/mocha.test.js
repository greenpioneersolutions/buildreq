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
        }]).then(function (Person) {
          Blog.create([{
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

  // /api/v1/Blog?where=created&gt=2015-11-17&lt=2016-12-30
  // equals  http://localhost:3000/api/v1/campaigns?where=email&equals=john@greenpioneersolutions.com
  // in  http://localhost:3000/api/v1/campaigns?where=emails&in=javier@greenpioneersolutions.com
  // ne  http://localhost:3000/api/v1/campaigns?where=email&ne=john@greenpioneersolutions.com
  // nin http://localhost:3000/api/v1/campaigns?where=emails&nin=javier@greenpioneersolutions.com
  // regex & options http://localhost:3000/api/v1/campaigns?where=email&regex=\/com\/&options=%3Coptions%3E
  // size  http://localhost:3000/api/v1/campaigns?where=emails&size=2
  // all http://localhost:3000/api/v1/campaigns?where=email&all=shawn@greenpioneersolutions.com
  // find  http://localhost:3000/api/v1/campaigns?where=email&find=shawn@
  // aggregate http://localhost:3000/api/v1/campaigns/task/aggregated?aggregate[$unwind]=$donations&aggregate[$group][_id]=$_id&aggregate[$group][balance][$sum]=$donations.amount
  })
})
