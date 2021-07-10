const express = require('express')
const app = express()
const cors = require("cors");
app.use(cors());
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})



server.listen(3001, function(){
    console.log('server is running on port 3001');
});

let users = new Map();
app.get('/userConnected', (req, res) => {
    let userIdList = [];
    for (var [key , value] of users) {
       userIdList.push(value)
    }
    res.json(userIdList)
})
io.on('connection', function(socket) {

    console.log('new connection: ' + socket.id)

    // User Logged in
    socket.on('login', (userId) => {
        // Map socket.id to the name
        users.set(socket.id, userId);
        // Broadcast to everyone else (except the sender).
        // Say that the user has logged in.
        console.log('connection: ' + userId )
        socket.broadcast.emit('login',userId)
    })

    // Message Recieved
    socket.on('msg', (message) => {
        // Broadcast to everyone else (except the sender)
        socket.broadcast.emit('msg', message)

    })

    // Disconnected
    socket.on('disconnect', function() {
        socket.broadcast.emit('userDisconnect', users.get(socket.id))
        console.log('diconnect: ' + users.get(socket.id) )
        users.delete(socket.id);
    })
})


