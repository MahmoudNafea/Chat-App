const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('./utils/messages')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

//socket.emit,io.emit,socket.broadcast.emit
//io.to.emit,socket.broadcast.to().emit (for chat rooms)
io.on('connection', (socket) => {
    console.log('New socket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined`))
    })

    socket.on('submitted', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            callback('Profanity is not allowed')
        }
        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocation(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left'))
    })
})
server.listen(port, () => {
    console.log(`app is running on port ${port}`)
})