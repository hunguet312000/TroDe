const { request } = require("express");
var express = require("express");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
var app = express();
const mysql = require('mysql');
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');

dotenv.config({path: './.env'});

app.listen(3000);

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
})

db.connect((error) =>{
    if(error) {console.log(error)}
    else {console.log("connected!")}
})
app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extend:false}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
    name : 'tuto-session',
    keys : ['key1', 'key2']
}))

//routers
app.use('/', require('./routers/pages'));
app.use('/', require('./routers/authentication'));

