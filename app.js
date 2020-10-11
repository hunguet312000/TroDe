const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require('connect-flash');
const dotenv = require('dotenv');
const mysql = require('mysql');
const dgconfig = require("./config/database");
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

//routes
require('./routers/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

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
