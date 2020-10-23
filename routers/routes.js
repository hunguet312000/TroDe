const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const authenticationController = require('../app/authenticate');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');

require('dotenv').config();

module.exports = (app, passport) => {
  app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
      const username = req.session.passport.user.ten_nguoi_dung;
      res.render("user-home",{username: username});
    } else {
      res.render("home");
    }
  });

  app.get("/user-home", function(req, res) {
    if (req.isAuthenticated()) {
      res.render("user-home");
    } else {
      res.redirect("login");
    }
  });

  app.get("/login", function(req, res) {
    res.render("user-login", {
      message: req.flash("loginMessage")
    });
  });

  app.post("/login", passport.authenticate("local-login"
    // , {
    // successRedirect: '/user-home', // redirect to the secure profile section
    // failureRedirect: '/login', // redirect back to the signup page if there is an error
    // failureFlash: true // allow flash messages
    // }
  ), function(req, res) {
    res.redirect("/")
    if (req.body.remember) {
      req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 1 days
    } else {
      req.session.cookie.expires = false; // Cookie expires at end of session
    }
  });

  app.get("/auth/google",passport.authenticate("google", {scope: ["profile", "email"]}));

  app.get("/auth/google/user-home",passport.authenticate("google", {
      failureRedirect: "/login"
    }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/user-home');
    });

  app.get("/signup", function(req, res) {
    res.render("user-signup", {
      message: req.flash("signupMessage")
    })
  });

  app.post("/signup", passport.authenticate("local-signup", {
    successRedirect: '/user-home', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }),
  function(req, res) {
  });

  app.get("/content", function(req, res) {
      res.render("content")
  });

  app.get('/profile', function(req, res) {
      const username = req.session.passport.user.ten_nguoi_dung;
      res.render("user-profile",{username: username});
  })

  app.get('/profile-info', function(req, res) {
      const username = req.session.passport.user.ten_nguoi_dung;
      res.render('user-profile-info',{username: username});
  })

  app.get('/profile-edit', function(req, res) {
      const username = req.session.passport.user.ten_nguoi_dung;
      res.render('user-profile-edit',{username: username});
  })

  app.get('/profile-change-password', function(req, res) {
      res.render('user-profile-change-password');
  })
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  app.get("/reset-password", function(req, res) {
      res.render("user-reset-password", { message: '' })
  });

  app.get("/forget-password", function(req, res) {
      res.render("user-forget-password", { message: '' })
  });

  app.get("/verification", function(req, res) {
      res.render("user-verification", { message: '' })
  });

  app.get("/verification-email", function(req, res) {
      res.render("user-verification-email", { message: '' })
  });

  app.get("/post", function(req, res) {
    res.render("user-post");
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
    res.render("user-home");
  });
}
