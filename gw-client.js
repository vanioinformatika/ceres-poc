const express = require('express')
const app = express()
const request = require('request')
const uuid = require('uuid')
const config = require('./' + process.env.CONFIG)

// config
const env = process.env.NODE_ENV

// security
app.disable('x-powered-by')

app.get('/service/person/:id', function (req, res) {
  console.log('gatewayId: ' + config.id)
  console.log('req.headers: ', req.headers)

  let options = {
    url: config.req.url + req.params.id,
    headers: {}
  }

  const clientGatewayId = req.get('x-gw-client-id') || config.id
  const serviceGatewayId = req.get('x-gw-service-id') || config.id
  const requestId = req.get('x-request-id') || uuid.v4()

  // client gw request?
  if (req.get('x-gw-client-id')) {
    options.headers['x-gw-service-id'] = serviceGatewayId
  }

  options.headers['x-request-id'] = requestId
  options.headers['x-gw-client-id'] = clientGatewayId

  res.set({
    'x-request-id': requestId,
    'x-gw-client-id': clientGatewayId,
    'x-gw-service-id': serviceGatewayId
  })

  request(options,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(config.id + ' response.headers: ', response.headers)
      }
    }).pipe(res)
})

var server = app.listen(config.port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Gateway listening at http://%s:%s', host, port)
})
