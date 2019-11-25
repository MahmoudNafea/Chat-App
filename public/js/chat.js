const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#typed-message').addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.message.value
    socket.emit('submitted', msg, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('message delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return 'Geolocation is not available'
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('location shared')
        })
    })
})