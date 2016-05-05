const express = require('express')
const app = express()
const fs = require('fs')

// security
app.disable('x-powered-by')

const person = {
  'id': 8123412125555,
  'name': 'John Doe',
  'birthdate': '1994.01.01',
  'birthplace': 'Hungary, Budapest'
}

app.get('/service/person/:id', function (req, res) {
  console.log('req sender (service) gw id: ' + req.get('x-gw-service-id'))
  console.log('requested resource id: ' + req.params.id)
  console.log('request.headers: ', req.headers)

  res.set({
    'x-request-id': req.get('x-request-id'),
    'x-gw-client-id': req.get('x-gw-client-id'),
    'x-gw-service-id': req.get('x-gw-service-id')
  })

  res.end(JSON.stringify(person))
})

var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Service app listening at http://%s:%s', host, port)
})
