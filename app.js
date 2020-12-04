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
const multer = require("multer"); //express multer for text and images

const clientSessions = require("client-sessions");//client-sessions
//const session = require('express-session')//express-session

//const room = require('./public/js/rooms.json'); //import rooms.json file //Removed

const mongoose = require("mongoose");
const Users = require('./models/Users'); //import mongoUsers
const Rooms = require('./models/roomData'); //import mongoUsers
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
  duration: 2 * 60 * 1000,
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
  app.get("/roomlisting", function(req, res){ //roomlisting

  //const noUser =  req.session.theUser === undefined || req.session.theUser === NULL;
    // Rooms.find((err, rooms) => {
    //   // function getRoomListings(){
    //   //   for(let i = 0; i < result.length; i++{
          
    //   //   }
    //   // }
    //   if(err){
    //     console.log(err);
    //   }else{
    //     console.log(rooms);
    //     res.render('room_listing_page', {
    //       user: req.session.theUser,
    //       data: rooms,
    //       layout: false // do not use the default Layout (main.hbs)
    //     });
    //   }
    // });

    // Rooms.find({}).then({
    //     console.log(rooms);
    //     res.render('room_listing_page', {
    //       user: req.session.theUser,
    //       data: rooms,
    //       layout: false // do not use the default Layout (main.hbs)
    //     });
    // });

    Rooms.find({}).then(rooms => {
      res.render('room_listing_page', {
        user: req.session.theUser,
        data: rooms[0],
        layout: false // do not use the default Layout (main.hbs)
      });
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
        //if error saving user
        res.render('registration_page', {
          userTakenError: true,
          pLengthError: false,
          layout: false // do not use the default Layout (main.hbs)
      });
      } else {
        console.log("The user was saved to the users collection");

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
                admin: theUser.admin
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

  
  //---------------------------------------------- Multer -------------------------------------------------------
  const storage = multer.diskStorage({
    destination: "./public/roomImages",
    filename: function(req, file, cb){
      cb(null, Date.now() + file.originalname);
    }
  });

  const upload = multer({ storage: storage });
  //---------------------------------------------- Multer -------------------------------------------------------


  //middleware ensureLogin if the session does not have a user redirect them to the login page
  function ensureLogin(req, res, next) {
    if (!req.session.theUser) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  
  //---------------------------------------------- dashboard -------------------------------------------------------

  //GET dashboard
  app.get("/dashboard", ensureLogin, function(req,res){ //registration
    //res.sendFile(path.join(__dirname,"/views/registration_page.hbs"));
    res.render('dashboard', {
      user: req.session.theUser,
      layout: false // do not use the default Layout (main.hbs)
  });

  });

  //POST dashboard
  app.post("/dashboard", ensureLogin, upload.array("photos"), function(req,res){ //login dashboard
    //res.sendFile(path.join(__dirname,"/views/dashboard.html"));

    const v_roomtitle = req.body.title;
    const v_price = req.body.price;
    const v_description = req.body.desc;
    const v_location = req.body.location;
    const v_photos = req.body.photos;

    if(v_roomtitle === "" || v_price < 0 || v_location === ""){
      return res.render('dashboard', {
        error: "Please provide information (Room name and location)",
        user: req.session.theUser,
        layout: false // do not use the default Layout (main.hbs)
      });
    }

    if(req.files.length > 10){
      return res.render('dashboard', {
        error: "Only 10 files are allowed",
        user: req.session.theUser,
        layout: false // do not use the default Layout (main.hbs)
      });
    }

    //populate the roomphoto with images (pushes each file path included to photoArr and return it)
    function getArrayOfImg(){
      let photoArr = [];
      for(let i = 0; i < req.files.length; i++){
        photoArr.push(req.files[i].filename);
      }
      return photoArr;
    }

    var createRoom = new Rooms({
      roomtitle: v_roomtitle,
      price: v_price,
      description: v_description,
      location: v_location,
      roomphoto: getArrayOfImg(), //array of strings(room photo links)
      ownername: req.session.theUser.firstname + " " + req.session.theUser.lastname,
      owneremail: req.session.theUser.email
    });

    createRoom.save((err) => {
      if(err) {
        console.log("There was an error saving the room");
        //if error saving room
      //   res.render('registration_page', {
      //     userTakenError: true,
      //     pLengthError: false,
      //     layout: false // do not use the default Layout (main.hbs)
      // });
      } else {
        console.log("The room was saved to the rooms collection");

        res.redirect('/roomlisting');
      }
    });

  });
 //---------------------------------------------- dashboard -------------------------------------------------------



 //---------------------------------------------- Logout -------------------------------------------------------

 app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});

 //---------------------------------------------- Logout -------------------------------------------------------



app.listen(HTTP_PORT, onHttpStart);