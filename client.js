'use strict'

const fetch = require('node-fetch')

fetch('http://localhost:18080/service/person/123456789')
  .then(function (res) {
    return res.headers.raw()
  })
  .then(function (val) {
    console.log(val)
  })

  // cache-control: no-cache
  // x-gw-request-id
  // x-request-id
  // x-served-by
  // x-runtime
