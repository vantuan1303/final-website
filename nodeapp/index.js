const express = require('express')
const app = express()
const http = require('http')
const winston = require('winston')
const bodyParser = require('body-parser')

const { PORT, HOST } = require('./helpers/utility.js')
const indexRouter = require('./routes/index.route')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/', indexRouter)

const server = http.createServer(app)

const logger = winston.createLogger({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: '../logs/weblog.log' })
    ]
})

server.on('error', (error) => {
    logger.log('error', error)
})

server.listen(PORT, HOST, () => {
    logger.log('info', `Server is starting at ${new Date()}`)
})

console.log(`Running on: ${HOST}:${PORT}`)