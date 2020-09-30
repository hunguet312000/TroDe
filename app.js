const { request } = require("express");
var express = require("express");
var app = express();
app.listen(3000);

app.set('view engine', 'ejs');
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

app.get("", function(req, res) {
    res.render("home");
});

app.get("/home", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login")
});

app.get("/signup", function(req, res) {
    res.render("signup")
});

app.get("/profile", function(req, res) {
    res.render("profile")
});

app.get("/post", function(req, res) {
    res.render("post")
});

app.get("/c", function(req, res) {
    res.render("content")
});