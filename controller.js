module.exports = function(app, io){
  
  app.get('/', (req, res) => {
    res.render('index.html')
  })

  io.on('connection', (socket) => {
    
    socket.emit('news', { hello: 'world' })

    socket.on('magnet-link', (data) => {
      console.log(data)
    })

  })
}