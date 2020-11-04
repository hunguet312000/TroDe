const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const { updateInfo, changePassword } = require("../app/updateUserProfile");
const bcrypt = require('bcrypt');
const postManage = require('../app/savePosts');
const forgetPassword = require("../app/forgetPassword")
require('dotenv').config();

module.exports = (app, passport) => {
    app.get("/", postManage.displayPostHome);

    app.get("/user-home", function(req, res) {
        res.redirect('/');
    });
    app.get("/login", function(req, res) {
        res.render("user-login", {
            message: req.flash("loginMessage")
        });
    });

    app.post("/login", passport.authenticate("local-login", {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }), function(req, res) {
        // res.redirect("/")
        // if (req.body.remember) {
        //   req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 1 days
        // } else {
        //   req.session.cookie.expires = false; // Cookie expires at end of session
        // }
    });

    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    app.get("/auth/google/user-home", passport.authenticate("google", {
            failureRedirect: "/login"
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    app.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ["email"]})
    );

    app.get('/auth/facebook/user-home',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

    app.get("/signup", function(req, res) {
        res.render("user-signup", {
            message: req.flash("signupMessage")
        })
    });

    app.post("/signup", passport.authenticate("local-signup", {
            successRedirect: '/', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }),
        function(req, res) {});

    app.get("/content", function(req, res) {
        res.render("content123")
    });

    app.get('/profile', function(req, res) {
        if(req.isAuthenticated()){
            const user = req.session.passport.user;
            res.render("user-profile", { user: user });
        }
        else{res.redirect('/login')}
    })

    app.get('/profile-info', function(req, res) {
        if(req.isAuthenticated()){
            const user = req.session.passport.user;
            res.render('user-profile-info', { user: user });
        }
        else {res.redirect('/login')}
    })

    app.get('/profile-edit', function(req, res) {
        if(req.isAuthenticated()){
            const user = req.session.passport.user;
            res.render('user-profile-edit', { user: user });
        }
        else {res.redirect('/login')}
    })

    app.post("/profile-edit", function(req, res) {
        if(req.isAuthenticated()){
            const newInfo = req.body;
            const oldInfo = req.session.passport.user;
            updateInfo(newInfo, oldInfo);
            req.logout();
            res.redirect("/login")
        }
        else {res.redirect('/login')}
    })

    app.get('/profile-change-password', function(req, res) {
        if(req.isAuthenticated()){
            const user = req.session.passport.user;
            console.log(user)
            res.render('user-profile-change-password', { user: user });
        }else {res.redirect('/login')}
    })

    app.post("/profile-change-password", function(req, res) {
        const newInfo = req.body;
        const oldInfo = req.session.passport.user;

        const id_nguoi_dung = oldInfo.id_nguoi_dung;
        const oldPass = oldInfo.mat_khau;
        const typedOldPass = newInfo.oldPass;
        const newPass = newInfo.newPass;
        const renewPass = newInfo.reNewPass;
        if (newPass != renewPass || !bcrypt.compareSync(typedOldPass, oldPass)) {
            console.log("Sai mat khau");
        } else {
            changePassword(newInfo, oldInfo);
            req.logout();
            res.redirect("/login")
        }
    })

    app.get('/profile-address', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address', { user: user });
    })

    app.get('/address-edit', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address-edit', { user: user });
    })

    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    app.get("/reset-password/:token", forgetPassword.checkToken)

    app.post("/reset-password/:token", forgetPassword.resetPassword)

    app.get("/forget-password", function(req, res){
      res.render("user-forget-password", { message: '' })
    });

    app.post("/forget-password", forgetPassword.forgetPassword)

    app.get("/verification", function(req, res) {
        res.render("user-verification", { message: '' })
    });

    app.get("/verification-email", function(req, res) {
        res.render("user-verification-email", { message: '' })
    });

    app.get("/post", function(req, res) {
        if(req.isAuthenticated()) {
             res.render("user-post", {username: req.user.ten_nguoi_dung});
        }
        else {
            res.redirect('/login');
        }
    });

    app.post('/post', upload.array('image'), postManage.savePosts);
}
