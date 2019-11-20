const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#typed-message').addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.message.value
    socket.emit('submitted', msg)
})