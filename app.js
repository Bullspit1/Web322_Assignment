/*
Stephen Ditta
scditta@myseneca.ca
WEB322NBB
Sharmin Ahmed 
*/

const express = require("express");
const app = express();

const path = require("path");//path

const exphbs = require('express-handlebars');//express-handlebars

const bodyParser = require('body-parser');//express body-parser for text only

const clientSessions = require("client-sessions");//client-sessions
//const session = require('express-session')//express-session

const room = require('./public/js/rooms.json'); //import rooms.json file

const mongoose = require("mongoose");
const Users = require('./models/Users'); //import mongoUsers
const { db } = require("./models/Users");

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(bodyParser.urlencoded({ extended: true })); //middleware for urlencoded form data

//express-handlebar engine
app.engine('.hbs', exphbs());
app.set('view engine', '.hbs');

//setup the static folder that static resources can load from
app.use(express.static('./public'));

//---------------------------------------------- clientSession -------------------------------------------------------

app.use(clientSessions({
  cookieName: "session",
  secret: "assignment",
  duration: .5 * 60 * 1000,
  activeDuration: 1000 * 60
}));

// app.set('trust proxy', 1) // trust first proxy

//   app.use(session({
//     secret: "assignment",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
//   }));

//---------------------------------------------- clientSession -------------------------------------------------------



//---------------------------------------------- home -------------------------------------------------------
//setup a route on home (/)
app.get("/", function(req,res){
    res.render('home_page', {
      user: req.session.theUser,
      data: room,
      layout: false // do not use the default Layout (main.hbs)
  });
  });

  //POST (/)
  app.post("/", function(req,res){
    res.send("Hello, you booked a room for " + req.body.guests + " in " + req.body.location + " from " + req.body.checkin + " to " + req.body.checkout);
  });
//---------------------------------------------- home -------------------------------------------------------

  //---------------------------------------------- roomlisting -------------------------------------------------------
  //setup a route on roomlisting
  app.get("/roomlisting", function(req,res){ //roomlisting

  //const noUser =  req.session.theUser === undefined || req.session.theUser === NULL;

  res.render('room_listing_page', {
      user: req.session.theUser,
      data: room,
      layout: false // do not use the default Layout (main.hbs)
  });
  });
//---------------------------------------------- roomlisting -------------------------------------------------------


  
  
  //---------------------------------------------- registration -------------------------------------------------------
  //setup a route on registration
  app.get("/registration", function(req,res){ //registration
    //res.sendFile(path.join(__dirname,"/views/registration_page.hbs"));
    res.render('registration_page', {
      userTakenError: false, 
      pLengthError: false,
      layout: false // do not use the default Layout (main.hbs)
  });
  });

  //POST registration
  app.post("/registration", function(req,res){

    const m_email = req.body.email;
    const m_password = req.body.password;

    if(m_password.length < 6 || m_password.length > 12) {
      return res.render('registration_page', {
        userTakenError: false,
        pLengthError: true,
        layout: false // do not use the default Layout (main.hbs)
    });
    }

    var loginUser = new Users({
      firstname: req.body.firstName,
      lastname: req.body.lastName,
      email:  m_email,
      password: m_password,
      dateOfBirth: req.body.month + " " + req.body.day + " "  + req.body.year,
      admin: false
    });

    loginUser.save((err) => {
      if(err) {
        console.log("There was an error saving the user");
        //if error saving room
        res.render('registration_page', {
          userTakenError: true,
          pLengthError: false,
          layout: false // do not use the default Layout (main.hbs)
      });
      } else {
        console.log("The user was saved to the userlogins collection");

        res.redirect('/login');
      }
    });

    //res.send("Hello " + req.body.firstName + " " + req.body.lastName + " with birth date of " + req.body.month + " " + req.body.day + ", " + req.body.year);

  });
  //---------------------------------------------- registration -------------------------------------------------------


  //setup a route on login
  //---------------------------------------------- login -------------------------------------------------------
  app.get("/login", function(req,res){ //login
    //res.sendFile(path.join(__dirname,"/views/login.html"));
    res.render('login', {
      logInError: false,
      layout: false // do not use the default Layout (main.hbs)
    });
  });

  app.post("/login", function(req,res){ //TODO

    const m_email = req.body.email;
    const m_password = req.body.password;
    const m_firstname = req.body.firstname;
    const m_lastname = req.body.lastname;


    Users.findOne({email : m_email},
    (err, theUser) => {
      if(err){
       console.log(err);
      }

      if(!theUser){
        console.log("Email not found");
        return res.render('login', {
          logInError: true,
          layout: false // do not use the default Layout (main.hbs)
        });
      }

      //compares the password due to it being encrypted
      theUser.comparePassword(m_password, 
        (err, match) => {
          if (err) {
            throw err;
          }
            //console.log(m_password + ": " + match);

            if(match){
             //console.log(theUser.firstname);

              req.session.theUser = {
                firstname: theUser.firstname,
                lastname: theUser.lastname,
                email:  theUser.email,
                password: theUser.password,
                dateOfBirth: theUser.dateOfBirth,
              }

              //delete the password (dont want to send to the client)
              delete req.session.theUser.password;

              res.redirect("/dashboard");
            }else{
              console.log("user and pass not found");
              return res.render('login', {
                logInError: true,
                layout: false // do not use the default Layout (main.hbs)
              });
            }
        });
    });

    // const foundUser = Users.findOne ({ "email" : m_email });
    // console.log(foundUser);

    // if(username === user.username && password === user.password) {
    //   req.session.user = {

    //   }
    // }

  });
  //---------------------------------------------- login -------------------------------------------------------

  
  //---------------------------------------------- dashboard -------------------------------------------------------
  //middleware
  function ensureLogin(req, res, next) {
    if (!req.session.theUser) {
      res.redirect("/login");
    } else {
      next();
    }
  }

  //GET dashboard
  app.get("/dashboard", ensureLogin, function(req,res){ //registration
    //res.sendFile(path.join(__dirname,"/views/registration_page.hbs"));
    res.render('dashboard', {
      user: req.session.theUser,
      layout: false // do not use the default Layout (main.hbs)
  });
  });

  //POST dashboard
  app.post("/dashboard", function(req,res){ //login dashboard
    //res.sendFile(path.join(__dirname,"/views/dashboard.html"));
  });
 //---------------------------------------------- dashboard -------------------------------------------------------



 //---------------------------------------------- Logout -------------------------------------------------------

 app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});

 //---------------------------------------------- Logout -------------------------------------------------------



app.listen(HTTP_PORT, onHttpStart);