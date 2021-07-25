const WebSocket = require('ws')
const http = require('http')
const express = require("express");

const express_server = express()
const server = http.createServer(express_server);
const wss = new WebSocket.Server({ server });
express_server.use(express.static(__dirname + "/public"));
express_server.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
wss.on('connection', (ws) => {
    var peerConnection = new SimplePeer({
        stream : window.audiosource,
    }) ;
    peerConnection.on('data',(data)=>{
        console.info(">>>>>>>>>>>>>>>"  + data);
    });
    peerConnection.on('signal',function (s){
        sendData({topic: "signal",object : s});
        console.log("Sent Signal");
    });
    ws.on('message', (message) => {
        let data = JSON.parse(message);
        switch (data.topic){
            case "signal":
                console.log("received signal");
                peerConnection.signal(data.object)
                break;
        }
    });
    if(window.audiosource == null ) {
        sendData({
            topic: "error",
            message : "unable to start audio device"
        })
    }else{
        sendData({
            topic: "pong",
            message : "Ready to accept the offer"
        })
    }
    console.log("GOT CONNECTION FROM " + ws._socket.remoteAddress);
    function sendData(object){
        ws.send(JSON.stringify(object));
    }
});
server.listen(65432, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});