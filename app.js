const express = require("express");
const socket = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socket(server);


app.use(express.static(__dirname + "/public"));
app.get("/" , (req , res) => {
    res.render("index.ejs");
})
let connectedSockets = new Set();
let onConnection = (socket) => {
    console.log(`socket connected with id ${socket.id}`);
    connectedSockets.add(socket.id);
    io.emit("total-client" , connectedSockets.size);

    socket.on("disconnect" , () => {
        console.log("disconnected");
        connectedSockets.delete(socket.id);
        io.emit("total-client" , connectedSockets.size);
    })
    socket.on("message" , (data) => {
        socket.broadcast.emit("message" , data);
    })

    socket.on("feedback" , (data) => {
        socket.broadcast.emit("send-feedback" , data);
    })
}

io.on("connection" , onConnection);



    

server.listen(3000 , () => {
    console.log("running");
})