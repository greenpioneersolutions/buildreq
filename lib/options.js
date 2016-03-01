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
    gt: false,
    gte: false,
    lte: false,
    lt: false,
    in: false,
    ne: false,
    nin: false,
    regex: false,
    options: false,
    size: false,
    all: false,
    equals: false,
    find: false,
    aggregate: false,
    errorMessage: '< Error',
    warningMessage: '< Warning',
    delete: [],
    mongoose: true,
    schema: []
  },
  routing: {
    schema: true,
    url: '/api/v1/',
    build: true,
    sockets: [],
    socket: false,
    uploads: false,
    multer: {
      temp: '',
      destination: ''
    }
  },
  console: true
}
