const http = require('http')
const env = require('dotenv')

env.config()
const app = require('./app')
const port = process.env.PORT
const server = http.createServer(app)

server.listen(port)