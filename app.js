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

const fs = require('fs');
const roomData = require("./models/roomData");

const HTTP_PORT = process.env.PORT || 8080;

//---------------------------------------------- Mongo Connection -------------------------------------------------------

//mongo connection
mongoose.connect(`mongodb+srv://Stephen:9TbtxsEYVY@assignmentusers.jqq5a.mongodb.net/assignment?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

//(debugging) -- checks if the database is connected
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', `mongodb+srv://Stephen:9TbtxsEYVY@assignmentusers.jqq5a.mongodb.net/assignment?retryWrites=true&w=majority`)
})
db.on('error', err => {
  console.error('connection error:', err)
})

//---------------------------------------------- Mongo Connection -------------------------------------------------------



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
  app.post("/", async function(req,res){
    res.render('room_listing_page', {
      user: req.session.theUser,
      data: await Rooms.find({location : req.body.location}).lean(),
      layout: false // do not use the default Layout (main.hbs)
  });
  });
//---------------------------------------------- home -------------------------------------------------------

  //---------------------------------------------- roomlisting -------------------------------------------------------
  //setup a route on roomlisting
  app.get("/roomlisting", function(req, res){ //roomlisting

    Rooms.find({})
    .lean()
    .exec((err, rooms) => {
      if(!rooms){
        return res.render('room_listing_page', {
          user: req.session.theUser,
          error: "There are no room listings at the moment",
          layout: false // do not use the default Layout (main.hbs)
        });
      }
      if(err){
        return res.render('room_listing_page', {
          user: req.session.theUser,
          error: err,
          layout: false // do not use the default Layout (main.hbs)
        });
      }

      res.render('room_listing_page', {
        user: req.session.theUser,
        data: rooms,
        layout: false // do not use the default Layout (main.hbs)
      });
    });
  
  });
//---------------------------------------------- roomlisting -------------------------------------------------------


  
  
  //---------------------------------------------- registration -------------------------------------------------------
  //setup a route on registration
  app.get("/registration", function(req,res){ //registration
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
  });
  //---------------------------------------------- registration -------------------------------------------------------


  //setup a route on login
  //---------------------------------------------- login -------------------------------------------------------
  app.get("/login", function(req,res){ //login
    res.render('login', {
      logInError: false,
      layout: false // do not use the default Layout (main.hbs)
    });
  });

  app.post("/login", function(req,res){

    const m_email = req.body.email;
    const m_password = req.body.password;
    const m_firstname = req.body.firstname;
    const m_lastname = req.body.lastname;


    Users.findOne({email : m_email})
    .exec()
    .then((theUser) => {
      if(!theUser){
        return res.render('login', {
          logInError: true,
          layout: false // do not use the default Layout (main.hbs)
        });
      }else{
        //compares the password due to it being encrypted
        theUser.comparePassword(m_password, 
          (err, match) => {
            if (err) {
              throw err;
            }

              if(match){

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
      }
    })

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
  app.get("/dashboard", ensureLogin, async function(req,res){ //registration
    //res.sendFile(path.join(__dirname,"/views/registration_page.hbs"));
    res.render('dashboard', {
      user: req.session.theUser,
      room: await Rooms.find().lean(),
      layout: false // do not use the default Layout (main.hbs)
  });

  });

  //POST dashboard
  app.post("/dashboard", ensureLogin, upload.single("photos"), async function(req,res){ //login dashboard

    const v_roomtitle = req.body.title;
    const v_price = req.body.price;
    const v_description = req.body.desc;
    const v_location = req.body.location;
    const v_photos = req.body.photos;

    if(v_roomtitle === "" || v_price < 0 || v_location === ""){
      return res.render('dashboard', {
        error: "Please provide information (Room name and location)",
        user: req.session.theUser,
        room: await Rooms.find({}).lean(),
        layout: false // do not use the default Layout (main.hbs)
      });
    }

    var createRoom = new Rooms({
      roomtitle: v_roomtitle,
      price: v_price,
      description: v_description,
      location: v_location,
      roomphoto: req.file.filename, 
      ownername: req.session.theUser.firstname + " " + req.session.theUser.lastname,
      owneremail: req.session.theUser.email
    });

    createRoom.save((err) => {
      if(err) {
        console.log("There was an error saving the room");
        //if error saving room
        res.render('registration_page', {
          error: err,
          user: req.session.theUser,
          layout: false // do not use the default Layout (main.hbs)
      });
      } else {
        console.log("The room was saved to the rooms collection");

        res.redirect('/roomlisting');
      }
    });
  });


  app.post("/dashboardUpdate", ensureLogin, upload.single("photos"), function(req, res) {

    const v_roomID = req.body.roomID;

    const v_roomtitle = req.body.title;
    const v_price = req.body.price;
    const v_description = req.body.desc;
    const v_location = req.body.location;
    const v_photos = req.body.photos;
    const v_ownName = req.session.theUser.firstname + " " + req.session.theUser.lastname;
    const v_ownEmail = req.session.theUser.email;

    Rooms.findByIdAndUpdate({v_roomID}, {$set: {roomtitle : v_roomtitle, price : v_price, description : v_description, location : v_location, roomphoto : req.file.filename, ownername : v_ownName, owneremail : v_ownEmail}}, function(err, updRoom){
      if(err){
        console.log(err);
      }else{
        console.log("update successful:" + updRoom);
        fs.unlinkSync(__dirname +  "/public/roomImages/" + updRoom.roomphoto);
        res.redirect('/roomlisting');
      }
    });

  });

  app.post("/dashboardRemove", ensureLogin, function(req, res) {

    const v_roomID = req.body.roomID;


    Rooms.deleteOne({_id : v_roomID})
    .exec()
    .then(() => {
      console.log("Deleted");
      res.redirect('/roomlisting');
    });

  });
 //---------------------------------------------- dashboard -------------------------------------------------------



//---------------------------------------------- Room -------------------------------------------------------

app.get("/roomdescription/:_id", async function(req,res){ //registration
  //res.send("get user with Id: " + req.params._id);
  res.render('roomdescription', {
    user: req.session.theUser,
    data: await Rooms.find({_id : req.params._id}).lean(),
    layout: false // do not use the default Layout (main.hbs)
  });
});


app.post("/bookroom", function(req, res){
const firstDate = new Date(req.body.checkin);
const secondDate = new Date(req.body.checkout);
const diff =  secondDate.getTime() - firstDate.getTime();
const days = Math.ceil(diff / (1000 * 3600 * 24));

const roomprice = req.body.priceRoom;

res.render('bookingTicket', {
  user: req.session.theUser,
  firstD: firstDate.toDateString(),
  lastD: secondDate.toDateString(),
  totalD: days,
  price: roomprice,
  totalPriceD: days * roomprice,
  layout: false // do not use the default Layout (main.hbs)
});

});



//---------------------------------------------- Room -------------------------------------------------------



 //---------------------------------------------- Logout -------------------------------------------------------

 app.get("/logout", function(req, res) {
  req.session.reset();
  res.redirect("/login");
});

 //---------------------------------------------- Logout -------------------------------------------------------





app.listen(HTTP_PORT, onHttpStart);