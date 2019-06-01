const socketListener = require('./socket-listener')

module.exports = function (app, io) {
  io.on('connection',socketListener)

  app.get('/', (req, res) => {
    res.render('index.html')
  })

  app.get('/dashboard', (req, res) => {
    res.render('index.html')
  })
}