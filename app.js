var express = require("express");
var app = express();

var path = require("path");//path

const exphbs = require('express-handlebars');//express-handlebars

var bodyParser = require('body-parser');//express body-parser for text only

var room = require('./public/js/rooms.json'); //import rooms.json file

var HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true })); //middleware for urlencoded form data

//express-handlebar engine
app.engine('.hbs', exphbs()); 
app.set('view engine', '.hbs');

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

//setup the static folder that static resources can load from
app.use(express.static('./public'));

//setup a route on home (/)
app.get("/", function(req,res){ //home
    res.sendFile(path.join(__dirname,"/views/home_page.html"));
  });

  //POST (/)
  app.post("/", function(req,res){

    res.send("Hello, you booked a room for " + req.body.guests + " in " + req.body.location + " from " + req.body.checkin + " to " + req.body.checkout);

  })

  //setup a route on roomlisting
  app.get("/roomlisting", function(req,res){ //roomlisting

  res.render('room_listing_page', {
      data: room,
      layout: false // do not use the default Layout (main.hbs)
  });
  });

  //setup a route on registration
  app.get("/registration", function(req,res){ //registration
    res.sendFile(path.join(__dirname,"/views/registration_page.html"));
  });

  //POST registration
  app.post("/registration", function(req,res){

    res.send("Hello " + req.body.firstName + " " + req.body.lastName + " with birth date of " + req.body.month + " " + req.body.day + ", " + req.body.year);

  })

  //setup a route on login
  app.get("/login", function(req,res){ //login
    res.sendFile(path.join(__dirname,"/views/login.html"));
  });

  //POST dashboard
  app.post("/dashboard", function(req,res){ //login dashboard
    res.sendFile(path.join(__dirname,"/views/dashboard.html"));
  });
 

app.listen(HTTP_PORT, onHttpStart);