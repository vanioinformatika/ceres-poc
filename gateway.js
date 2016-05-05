const express = require('express')
const app = express()
const request = require('request')
const uuid = require('uuid')
const config = require('./' + process.env.CONFIG)

// config
const env = process.env.NODE_ENV

// security
app.disable('x-powered-by')

app.get('/service/person/:id', (req, res) => {

  let runtimeStart = Date.now()

  console.log('gatewayId: ' + config.id)
  console.log('gw req.headers: ', req.headers)

  // request headers
  let options = {
    url: config.req.url + req.params.id,
    headers: {}
  }

  // x-client-* headers specified by client request
  // copy x-client-* headers
  for (let key in req.headers) {
    if (key.startsWith('x-client-')) {
      options.headers[key] = req.headers[key]
    }
  }

  const clientGatewayId = req.get('x-gw-client-id') || config.id
  const clientGatewayName = req.get('x-gw-client-name') || config.name
  const clientGatewayTimestamp = req.get('x-gw-client-ts') || Date.now()
  const serviceGatewayId = req.get('x-gw-service-id') || config.id
  const serviceGatewayName = req.get('x-gw-service-name') || config.name
  const serviceGatewayTimestamp = req.get('x-gw-service-ts') || Date.now()
  const requestId = req.get('x-request-id') || uuid.v4()
  let runtime = req.get('x-runtime') || 0

  // client gw request?
  if (req.get('x-gw-client-id')) {
    options.headers['x-gw-service-id'] = serviceGatewayId
    options.headers['x-gw-service-name'] = serviceGatewayName
  }

  options.headers['x-request-id'] = requestId
  options.headers['x-gw-client-id'] = clientGatewayId
  options.headers['x-gw-client-name'] = clientGatewayName
  options.headers['x-gw-client-ts'] = clientGatewayTimestamp
  options.headers['x-gw-service-ts'] = serviceGatewayTimestamp

  // put back request headers into response
  let responseHeaders = {
    'x-env': process.env.NODE_ENV,
    'x-request-id': requestId,
    'x-gw-client-id': clientGatewayId,
    'x-gw-service-id': serviceGatewayId,
    'x-gw-client-name': clientGatewayName,
    'x-gw-service-name': serviceGatewayName,
    'x-gw-client-ts': clientGatewayTimestamp,
    'x-gw-service-ts': serviceGatewayTimestamp
  }
  for (let key in req.headers) {
    if (key.startsWith('x-client-')) {
      responseHeaders[key] = req.headers[key]
    }
  }

  request(options,
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(config.id + ' response.headers: ', response.headers)
      }
    }).pipe(res)

  responseHeaders.runtime = Date.now() - runtimeStart
  res.set(responseHeaders)
})

var server = app.listen(config.port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Gateway listening at http://%s:%s', host, port)
})
