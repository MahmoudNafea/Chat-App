const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New socket connection')

    socket.emit('message', 'welcome')
    socket.broadcast.emit('message', 'A new user has joined')
    socket.on('submitted', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            callback('Profanity is not allowed')
        }
        io.emit('message', message)
        callback()
    })
    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})
server.listen(port, () => {
    console.log(`app is running on port ${port}`)
})