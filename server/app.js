var express = require("express");
var app = express();

var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    app.use(express.static('../client'));
    res.sendFile(path.join(__dirname,"../client/html/home_page.html"));
  });

  app.get("/roomlisting", function(req,res){
    app.use(express.static('../client'));
    res.sendFile(path.join(__dirname,"../client/html/room_listing_page.html"));
  });

  app.get("/registration", function(req,res){
    app.use(express.static('../client'));
    res.sendFile(path.join(__dirname,"../client/html/registration_page.html"));
  });

  app.get("/login", function(req,res){
    app.use(express.static('../client'));
    res.sendFile(path.join(__dirname,"../client/html/login.html"));
  });
 

app.listen(HTTP_PORT, onHttpStart);