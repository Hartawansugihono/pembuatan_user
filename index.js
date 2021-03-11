const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 1996
var cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var routes = require('./route/routes')
routes(app)

app.listen(port, () => console.log('Server started o port 1996'))
