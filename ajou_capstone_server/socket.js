const app = require('express')()
const http = require('http').createServer(app)
var mysql= require('mysql');

var connection = mysql.createConnection({
  host : '27.96.131.37',
  user     : 'hong',
  password : 'ckwjdgus',
  database : 'trap'

});

connection.connect(function(err){
  if(err){
  console.log("fail");
    console.error('error connecting'+err.stack);
    return;
  }
  else{
        console.log("suc");
  }
})

app.get('/', (req, res) => {
        //서버를 연다.
    res.send("Node Server is running. Yay!!")
})

//소켓을 연다.
const io = require('socket.io')(http)
var clients = [];
io.on('connection', (socket)=> {
        console.log("SOCKETIO connection EVENT: ", socket.id, " client connected");

            socket.on("joinRoom",(data) => {
                //클라가 joinRoom을 보낼시
                var j = 0;
                var clientInfo = new Object();
                 //Info를 만들고 이미 있는 Info인지 검사한다. 있으면 지우고 바뀐 룸으로 다시 생성하고, 없으면 새로 생성한다.
                for( var i=0, len=clients.length; i<len; ++i ){
                    // clients는 socket에 연결된 user들의 목록이다. socket ID와 custom ID, 현재 접속한 room을 저장한다.
                    var c = clients[i];
                    if(c.customId == data.id){
                            if(c.clientRoom == data.room){
                                console.log('checkpoint');
                                break;
                            }
                            // 해당 room을 leave하고 client가 잡히지 않도록 splice해 에러를 막는다.
                            socket.leave(clients[i].clientRoom);
                            console.log('Bye_room : ' + clients[i].clientRoom);
                            clients.splice(i,1);
                            //받은 클라이언트 정보 저장 후 clients에 푸시, 그 후 joinRoom을 한다.
                            clientInfo.customId = data.id;
                            clientInfo.clientId = socket.id;
                            clientInfo.clientRoom = data.room;
                            clients.push(clientInfo);
                            socket.join(data.room);
                            roomName = data.room;
                            socket.broadcast.to(data.room).emit('receive_join', data);
                            console.log('Hello_room : ' + roomName);
                            j = 1;
                        break;
                    }
                    }
                    if(j==0){
                // 없을 시 신규 등록을 하는 작업
                var clientInfo = new Object();
                clientInfo.customId = data.id;
                clientInfo.clientId = socket.id;
                clientInfo.clientRoom = data.room;
                clients.push(clientInfo);
                console.log('Hello_user room : ' + data);
                socket.join(data.room);
                roomName = data.room;
                socket.broadcast.to(data.room).emit('receive_join', data);
            }
            });

        socket.on("send_message", (data) => {       // 클라이언트가 채팅 내용을 보냈을 시
            // 전달한 roomName에 존재하는 본인을 제외한 소켓 전부에게 broadcast라는 이벤트 emit
            var j = 0;
            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];
                if(c.clientId == socket.id){
                        console.log('cid : ' + c.customId);
                        console.log('cmessage : ' + data.message);
                        console.log('croom : ' + c.clientRoom);
                        socket.broadcast.to(data.room).emit('receive_message', data);

                        j=1;
                    break;
                }
            }

            if(j==0){
                var clientInfo = new Object();
                clientInfo.customId = data.id;
                clientInfo.clientId = socket.id;
                clientInfo.clientRoom = data.room;
                clients.push(clientInfo);
                socket.join(data.room);
                console.log('nid : ' + clientInfo.customId);
                console.log('nmessage : ' + data.message);
                console.log('nroom : ' + clientInfo.clientRoom);
                socket.broadcast.to(data.room).emit('receive_join', data);
                socket.broadcast.to(data.room).emit('receive_message', data);

            }
        });

        socket.on("kickip", (data) => {       // 방장이 이 이벤트를 실행했을 시
            // 이벤트에 해당하는 유저에게 kickip_message 이벤트를 전달하는 명령어
            console.log(data.id);
            console.log(data.room);
            connection.query('INSERT INTO denied_list (room_num, id) VALUES (?, ?);', [data.room, data.id], function(err, rows){
                if(!err){
<<<<<<< HEAD
                    connection.query('DELETE FROM chat_userlist WHERE room = ? AND id = ?;', [data.room, data.id])
		            var sql_detete_room = "UPDATE user SET room_num = (SELECT * FROM (SELECT REPLACE(room_num, ',?' , '') FROM user where id = ?) as t) where id = ?;";
		            var param_delete_room = [data.room, data.id, data.id];
		            console.log(param_delete_room);
		            connection.query(sql_detete_room,param_delete_room);
		            connection.query("UPDATE user SET room_num = (SELECT * FROM (SELECT REPLACE(room_num, '?' , '') FROM user where id = ?) as t) where id = ?;", [data.room, data.id, data.id], function(err,rowa) {
		                  if(!err){
		                    console.log('check_2');
		                  }
		                })

                 }
            })
            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];
                if(c.customId == data.id){
                    console.log('kickip');
                    io.sockets.to(c.clientId).emit('kickip_message',data);
                    io.sockets.in(data.room).emit('kick_message1',data);
                    break;
                }

            }
        });

    socket.on('kicked',(data)=>{
        //해당 유저를 방에서 강퇴시키는 이벤트
            for( var i=0, len=clients.length; i<len; i++ ){
                var c = clients[i];

                if(c.customId == data.id){
                    socket.leave(c.clientRoom);
                    clients.splice(i, 1);
                    socket.join(data.room);
                    console.log('you_kicked');
                    break;
                }
            }
 });

        socket.on("send_leave", (data) => {       // 클라이언트가 채팅 내용을 보냈을 시
            // 전달한 roomName에 존재하는 본인을 제외한 소켓 전부에게 broadcast라는 이벤트 emit
           
        io.sockets.in(data.room).emit('receive_leave',data);
        });
        socket.on('disconnect', function() {

            for( var i=0, len=clients.length; i<len; ++i ){
                var c = clients[i];

                if(c.clientId == socket.id){
                    clients.splice(i,1);
                    break;
                }
            }

        console.log("SOCKETIO disconnect EVENT: ", socket.id, " client disconnect");
                });
    })

console.log("서버 실행")
http.listen(3002)
