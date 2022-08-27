const express = require('express')
const path = require('path')
const http = require('http')
const cors = require('cors')
const chalk = require('chalk')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server) 

const port = process.env.PORT || 3000
app.use(cors())

const publicDirectoryPath = path.join(__dirname, "../public")

app.use(express.static(publicDirectoryPath))



io.on('connection', (socket)=> {
  console.log('new websocket connection');
  socket.emit('message', "Welcome")
  socket.broadcast.emit('message', "A new user has joined") // emits the event for all the users except for this one

  socket.on('sendMessage', (message, callback)=>{
    const filter = new Filter()

    if (filter.isProfane(message)) {
      callback('Profane')      
    }
    io.emit('message', message)
    callback("Delivered!")
  })

  socket.on('sendLocation', (coords,callback)=>{
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    callback('Location shared')
  })

  socket.on('disconnect', ()=>{
    io.emit('message', "A user has left the chat")
  })
})



server.listen(port, ()=> {
  console.log(chalk.green.bold.inverse(`server is running at port ${port}`));
})