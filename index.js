const http = require("http");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 4000 || process.env.PORT;

const users=([]);
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});
const server = http.createServer(app);
const io = require("socket.io")(server);

//const io = socketIO(server);
io.on("connection", (socket) => {
  console.log("new connection");
  socket.on("joined", ({ user }) => {
    users[socket.id]=user;
    console.log(`${user} has joined`);
    socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
    socket.emit('Welcome',{user:"Admin",message:`Welcome to the chat, ${users[socket.id]}`});
  })
  socket.on('message',({message,id})=>{
    io.emit('sendMessage',{user:users[id],message,id})
  })
  socket.on('end',()=>{
    console.log(`${users[socket.id]} Left`);
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
    socket.disconnect(1);
  })
});
server.listen(port, () => {
  console.log(`server is working on ${port}`);
});
