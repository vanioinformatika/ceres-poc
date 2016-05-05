'use strict'

const request = require('request')

// client specific headers: x-client-*
let options = {
  url: 'http://localhost:18080/service/person/' + '17001010000',
  headers: {
    'x-client-id': 'specified_by_client',
    'x-client-name': 'MY_CLIENT_NAME',
    'cache-control': 'no-cache'
  }
}

request(options,
  (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log('response.headers: ', response.headers)
      console.log('response.body: ', body)
    } else {
      console.log(error)
    }
  })
