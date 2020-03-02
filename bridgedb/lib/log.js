const winston = require('winston')
const path = require('path')

const filename = path.join(__dirname, '../log/bridge.log')
const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
    custom: 7
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow'
  }
}
winston.addColors(config.colors)
const Log = winston.createLogger({
  levels: config.levels,
  format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new winston.transports.File({ filename })
  ]
})

module.exports = Log
