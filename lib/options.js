module.exports = {
  response: {
    method: 'get',
    data: {},
    user: {},
    count: 0,
    hostname: '',
    query: {},
    type: '',
    actions: {
      prev: true,
      next: true,
      reload: true
    },
    delete: []
  },
  query: {
    sort: '-created',
    filter: {},
    limit: 20,
    select: '',
    populateId: '',
    populateItems: '',
    lean: false,
    skip: 0,
    where: '',
    gt: 1,
    lt: 0,
    in: [],
    equals: '',
    errorMessage: 'Unknown Value',
    delete: [],
    mongoose: true,
    schema: []
  },
  routing: {
    schema: true,
    url: '/api/v1/',
    build: true
  },
  console: true
}
