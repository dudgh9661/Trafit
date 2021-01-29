const app = require('express')()
const http = require('http').createServer(app)


app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

//Socket Logic
const io = require('socket.io')(http)
var clients = [];
io.on('connection', (socket)=> {
        console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");

            socket.on("joinRoom",(data) => {
                var j = 0;
                    for( var i=0, len=clients.length; i<len; ++i ){
                        var c = clients[i];
                        if(c.customId == data.id){
                                socket.leave(clients[i].clientRoom);
                                clients[i].clientRoom = data.room;
                                socket.join(data.room);
                                j = 1;
					            socket.broadcast.to(data.room).emit('receive_join', data);
                            break;
                        }
                    }
                    if(j==0){
                var clientInfo = new Object();
                clientInfo.customId = data.id;
                clientInfo.clientId = socket.id;
                clientInfo.clientRoom = data.room;
                clients.push(clientInfo);
                console.log(data);
                console.log('data room: ' + data.room);
                socket.join(data.room);
                roomName = data.room;
                socket.broadcast.to(data.room).emit('receive_join', data);
}
            });

        socket.on("send_message", (data) => {       // 클라이언트가 채팅 내용을 보냈을 시
            // 전달한 roomName에 존재하는 소켓 전부에게 broadcast라는 이벤트 emit
            console.log('id : ' + socket.id);
            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];
                if(c.clientId == socket.id){
                    break;
                }
            }
            console.log('cid : ' + c.customId);
            console.log('message : ' + data.message);
            console.log('croom : ' + c.clientRoom);
            console.log('droom : ' + roomName);
            socket.broadcast.to(c.clientRoom).emit('receive_message', data);
        });

        socket.on("kickip", (data) => {       // 클라이언트가 채팅 내용을 보냈을 시
            // 전달한 roomName에 존재하는 소켓 전부에게 broadcast라는 이벤트 emi
            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];

                if(c.customId == data.id){
                    console.log('asdasdas');
                    io.sockets.to(c.clientId).emit('kickip_message',data);
                    break;
                }

            }
            console.log('kcuId : ' + c.customId);
            console.log('kclId : ' + c.clientId);
        });

    socket.on('kicked',(data)=>{
        console.log('socquit');

            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];

                if(c.customId == data.id){
                    console.log('asdasdas');
                    socket.leave(c.clientRoom);
                    socket.join(data.room);
                    break;
                }

            }
 });


        socket.on('disconnect', function() {
        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
         // 여기서부터 필요한 내용을 작성하면 된다.
                });
    })

console.log("서버 실행")
http.listen(3001)

