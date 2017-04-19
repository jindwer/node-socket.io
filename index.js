var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3000);

var num = 0;

app.get('/',function(req,res){
  res.sendFile(__dirname+'/html/index.html');
});
// console.log(__filename);
io.on("connection",function(socket){
  num++;
  socket.emit("head",{title:"欢迎来到 Smith.Jing 聊天室",id:socket.id});
  io.sockets.emit("number",num);
  // socket.broadcast.emit("hello","");

  socket.on('mes',function(data,fn){
    if(data.send.length==0){
      socket.broadcast.emit("broad",data);
    }else{
      data.send.forEach(function(cur){
        io.sockets.connected[cur].emit("broad",data);
      });
    }
    fn(1);
  });
  //删除
  socket.on('delete',function(data,fn){
    socket.broadcast.emit('del',data);
    fn(1);
  });

  socket.on("disconnect",function(){
    num--;
    io.sockets.emit("number",num);
  });
  socket.on("reconnect",function(){
    num++;
    io.sockets.emit("number",num);
  });
});
