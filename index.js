const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)   // passing the reference of server
const { v4: uuidV4 } = require('uuid')    // passing the ids of server

app.set('view engine', 'ejs')
app.use(express.static('public'))







app.get('/', (req, res) => {
  try {
    res.redirect(`/${uuidV4()}`)       //redirecting the user to this url
  }
  catch(error)
  {
    if (error.message) {
      res.status(400).send({
          status: "failed",
          message: error.message
      });
  }
  }
  
})
app.get('/:room', (req, res) => {
  try{
    res.render('room', { roomId: req.params.room })

  }
  catch(error)
  {
    if (error.message) {
      res.status(400).send({
          status: "failed",
          message: error.message
      });
  }
  }
 
  })
  io.on('connection', socket => {          // whenever the new event will fire the sockect will creat new connection
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
  })
server.listen(3000,()=>{
    console.log('server is running at port 3000')
})