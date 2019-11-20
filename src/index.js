const path = require('path')
const express = require('express')
const http = require('http')
const socketio = require('socket.io')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New socket connection')

    socket.emit('message', 'welcome')

    socket.on('submitted', (message) => {
        io.emit('message', message)
    })

})
server.listen(port, () => {
    console.log(`app is running on port ${port}`)
})