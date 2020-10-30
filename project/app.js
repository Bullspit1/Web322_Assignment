var express = require("express");
var app = express();

var path = require("path");//path

const exphbs = require('express-handlebars');//express-handlebars

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs()); //express-handlebar engine
app.set('view engine', '.hbs');

app.get("/", function(req,res){ //home
    app.use(express.static('./public'));
    res.sendFile(path.join(__dirname,"/views/home_page.html"));
  });


  app.get("/roomlisting", function(req,res){ //roomlisting
    app.use(express.static('./public'));

    var employee = [{
      name: "James",
      age: 50,
      occupation: "developer",
      company: "Scotiabank",
      fulltime: true
  },
  {
      name: "Sarah",
      age: 32,
      occupation: "manager",
      company: "TD",
      fulltime: false
  }];

  res.render('room_listing_page', {
      empData: employee,
      layout: false // do not use the default Layout (main.hbs)
  });

    //res.sendFile(path.join(__dirname,"../client/html/room_listing_page.hbs"));
  });

  app.get("/registration", function(req,res){ //registration
    app.use(express.static('./public'));
    res.sendFile(path.join(__dirname,"/views/registration_page.html"));
  });

  app.get("/login", function(req,res){ //login
    app.use(express.static('./public'));
    res.sendFile(path.join(__dirname,"/views/login.html"));
  });
 

app.listen(HTTP_PORT, onHttpStart);