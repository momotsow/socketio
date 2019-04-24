var express = require("express");
var http = require("http");
var mongo = require('mongodb').MongoClient;

var app = express();
var server = http.Server(app);
var io = require("socket.io")(server);
var users = []; // create a list named users

//link html
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
});

//link css
app.get("/style/index.css", function(req, res) {
    res.sendFile(__dirname + "/style/index.css")
});

//connect socket io to show connected
io.on("connection", function(socket) {
    var name = "";
    //connect socket io to show a connected user 
    socket.on("has connected", function(username){
        users.push(username);
        name = username;
        io.emit("has connected", {username: username, usersList: users});
        
    });
    //connect socket io to show disconnected when a user disconnnect
    socket.on("disconnect", function() {
      users.splice(users.indexOf(name), 1);
      io.emit("has disconnected", {username: name, usersList: users});
     });

     //messages
    socket.on("new message", function(data){
        io.emit("new message", data);

});

});



// connect to port 3333
server.listen(3333, function(){
    console.log("Server running on port 3333");
});

