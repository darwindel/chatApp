const express = require('express');
const http = require('http');
const socketIo =  require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// serve static files  from the 'public' folder
app.use(express.static('public'));


//handle web socket connections
io.on('connection', (socket) => { 
    console.log('New user connected');

    // listen for chat messages 
    socket.on('chat message', (msg) => {
        io.emit('chat message' , msg); 
    });

    //handle user disconnection
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT,  () => { 
    console.log(`Server running on local host port ${PORT}`);
});

