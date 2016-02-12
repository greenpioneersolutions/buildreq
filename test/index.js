/* global  describe, it */
var app = require('../ex/app.js')
var mongoose = require('mongoose')
var Users = mongoose.model('Users')
var Person = new Users({
  name: 'Green Pioneer',
  email: 'Info@greenpioneersolutions.com',
  username: 'GPS'
})
Person.save()
var Blog = mongoose.model('Blog')
Blog.create({
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
})

var assert = require('assert')
var request = require('supertest')
var _ = require('lodash')
var checkAssert = function (newObj, body) {
  var queryParameters = require('../lib/options.js')
  queryParameters.count = 24
  queryParameters.itemPerPage = 20
  newObj = _.merge(queryParameters, newObj)
  assert.equal(body.count, newObj.count)
  assert.equal(body.itemPerPage, newObj.itemPerPage)
  assert(typeof body.query.error === 'object')
  assert(typeof body.query.warning === 'object')
  _.forEach(body.query.filter, function (n, k) {
    assert.equal(n, newObj.query.filter[k])
  })
  assert.equal(body.query.gt, newObj.query.gt)
  assert.equal(body.query.lt, newObj.query.lt)
  assert.equal(body.query.gte, newObj.query.gte)
  assert.equal(body.query.lte, newObj.query.lte)
  assert.equal(body.query.in, newObj.query.in)
  assert.equal(body.query.ne, newObj.query.ne)
  assert.equal(body.query.nin, newObj.query.nin)
  assert.equal(body.query.regex, newObj.query.regex)
  assert.equal(body.query.options, newObj.query.options)
  assert.equal(body.query.size, newObj.query.size)
  assert.equal(body.query.all, newObj.query.all)
  assert.equal(body.query.equals, newObj.query.equals)
  assert.equal(body.query.find, newObj.query.find)
  if (!_.isString(body.query.where)) {
    _.forEach(body.query.where, function (n, k) {
      assert.equal(_.isEqual(n, newObj.query.where[k]), true)
    })
  } else {
    assert.equal(body.query.where, newObj.query.where)
  }
  assert.equal(body.query.aggregate, newObj.query.aggregate)
  assert.equal(body.query.lean, newObj.query.lean)
  assert.equal(body.query.skip, newObj.query.skip)
  assert.equal(body.query.sort, newObj.query.sort)
  assert.equal(body.query.limit, newObj.query.limit)
  assert.equal(body.query.select, newObj.query.select)
  assert.equal(body.query.populateId, newObj.query.populateId)
  assert.equal(body.query.populateItems, newObj.query.populateItems)
}

describe('API TESTING', function () {
  describe('Blog', function () {
    it('GET /api/v1/blog', function (done) {
      request(app)
        .get('/api/v1/blog')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.equal(res.body.query.populateId, 'user ')
          assert.equal(res.body.query.populateItems, '')
          assert.equal(res.body.count, 24)
          assert.equal(res.body.itemPerPage, 20)
          done()
        })
    })
    it('GET /api/v1/blog?title=Deployment Ready', function (done) {
      request(app)
        .get('/api/v1/blog?title=Deployment%20Ready')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              filter: {
                title: 'Deployment Ready'
              }
            },
            count: 4,
            itemPerPage: 4
          },
            res.body)
          done()
        })
    })
    it('GET /api/v1/blog?sort=title', function (done) {
      request(app)
        .get('/api/v1/blog?sort=title')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              sort: 'title'
            },
            count: 24,
            itemPerPage: 20
          },
            res.body)
          done()
        })
    })

    it('GET /api/v1/blog?limit=10', function (done) {
      request(app)
        .get('/api/v1/blog?limit=10')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              limit: 10
            },
            count: 24,
            itemPerPage: 10
          },
            res.body)
          done()
        })
    })

    it('GET /api/v1/blog?lean=true', function (done) {
      request(app)
        .get('/api/v1/blog?lean=true')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              lean: 'true'
            },
            count: 24,
            itemPerPage: 10
          },
            res.body)
          done()
        })
    })

    it('GET /api/v1/blog?select=title', function (done) {
      request(app)
        .get('/api/v1/blog?select=title')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              select: 'title'
            },
            count: 24,
            itemPerPage: 10
          },
            res.body)
          done()
        })
    })
    it('GET /api/v1/blog?where=title', function (done) {
      request(app)
        .get('/api/v1/blog?where=title')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              where: 'title'
            },
            count: 24,
            itemPerPage: 10
          },
            res.body)
          done()
        })
    })
    it('GET /api/v1/blog?where=title&find=Smart', function (done) {
      request(app)
        .get('/api/v1/blog?where=title&find=Smart')
        .expect(200, function (err, res) {
          if (err) return done(err)
          checkAssert({
            query: {
              populateId: 'user ',
              where: {title: {}},
              find: 'Smart'
            },
            count: 4,
            itemPerPage: 4
          },
            res.body)
          done()
        })
    })

  // /api/v1/blog?where=created&gt=2015-11-17&lt=2016-12-30
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
Blog.find({}).remove().exec()
Users.find({}).remove().exec()
