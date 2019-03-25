const app = require('express')();
const server = require('http').Server(app)
const socket = require('socket.io')(server)
const path = require('path')
const mustacheExpress = require('mustache-express')
const controller = require('./controller')

const PORT = process.env.PORT || 5000

app.use(require('express').static(path.join(__dirname, 'public')))
app.engine('html', mustacheExpress())
app.set('view engine','html')
app.set('views',path.join(__dirname, 'pages'))

controller(app, socket);

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})