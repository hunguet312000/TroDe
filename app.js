const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require('connect-flash');
const dotenv = require('dotenv');
const mysql = require('mysql');
const dgconfig = require("./config/database");
const paginate = require('express-paginate');
dotenv.config({ path: './.env' });
const port = process.env.PORT || 3000;

const app = express();

require('./config/passport.js')(passport); // pass passport for configuration

app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret:  process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
// app.use(express.urlencoded({ extend: true }));
// app.use(express.json());
// app.use(cookieParser());

//Mysql routes
//app.use(paginate.middleware(10, 50));
require("./routers/authentication.js")(app,passport);
require("./routers/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

// const {sequelizeInit, Nguoi_dung} = require("./config/sequelize.js");
//
// (async function(){
//
//   const miho = await Nguoi_dung.create({
//     ten_nguoi_dung: "miho",
//     email: "minhhoan1109@gmail.com",
//     mat_khau: "123",
//   });
//   console.log(JSON.stringify(miho));
// })();
// const {sequelizeInit, User } = require("./config/sequelize");
//
// (async function() {
//   try {
//     const users = await User.findAll();
//     console.log(JSON.stringify(users,null, 2));
//   } catch (error) {
//     console.error(error);
//   }
// })();

// const dbConnection = mysql.createConnection(dgconfig);
//
// dbConnection.connect((error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log("Connected to MySql!")
//       dbConnection.end();
//     }
// });

app.listen(port, function(req, res){
  console.log("Sever is running!");
});
