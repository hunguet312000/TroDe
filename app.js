const { request } = require("express");
var express = require("express");
var app = express();
app.listen(3000);

app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));


app.get("/home", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login")
});

app.get("/signup", function(req, res) {
    res.render("signup")
});

app.get("/c", function(req, res) {
    res.render("content")
});