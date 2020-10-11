const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const authenticationController = require('../app/authenticate');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');

require('dotenv').config();

module.exports = (app, passport) => {
  app.get("/", function(req, res) {
    res.render("home");
  });

  app.get("/home", function(req, res) {
    res.render("home");
  });

  app.get("/login", function(req, res) {
    res.render("login", {
      message: req.flash("loginMessage")
    });
  });

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: '/home-user', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }), function(req, res) {
    if (req.body.remember) {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
      req.session.cookie.expires = false; // Cookie expires at end of session
    }
  });

  app.get("/auth/google",passport.authenticate("google", {scope: ["profile", "email"]}));

  app.get("/auth/google/home-user",passport.authenticate("google", {
      failureRedirect: "/login"
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/home-user');
    });

  app.get("/signup", function(req, res) {
    res.render("signup", {
      message: req.flash("signupMessage")
    })
  });

  app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: '/home-user', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }),
  function(req, res) {

  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/content", function(req, res) {
    res.render("content")
  });

  app.get('/profile', function(req, res) {
    res.render('profile');
  })

  app.get("/home-user", function(req, res) {
    if (req.isAuthenticated()) {
      res.render("home-user");
    } else {
      res.redirect("login");
    }
  });

  app.get("/post", function(req, res) {
    res.render("post");
  });

  app.post('/post', upload.array('photo'), async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Image');
    const urls = []
    console.log(req.body);
    console.log(req.files);
    files = req.files;
    for (const file of files) {
      const {
        path
      } = file
      const newPath = await uploader(path)
      urls.push(newPath);
      console.log(newPath);
      fs.unlinkSync(path);
    }
    res.render("home-user");
  });
}
