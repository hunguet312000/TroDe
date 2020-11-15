const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const { updateInfo, changePassword } = require("../app/updateUserProfile");
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {
    app.get("/", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-home", { username: req.user.ten_nguoi_dung});
        } else { res.render('guest-home')}
    });

    app.get("/user-home", function(req, res) {
        res.redirect('/');
    });

    app.get("/rooms/:type", postManage.displayListPost);

    app.get("/room/:id", postManage.displayPostProfile);

    app.get('/content-user', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("content-user", { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/room-user', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-room", { user: user });
        } else { res.redirect('/login') }
    });

    require("./user.js")(app,passport);

    app.get("/host", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-host", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

    app.post('/host', upload.array('image'), postManage.savePosts);

    app.get("/host-edit", function(req, res) {
       if (req.isAuthenticated()) {
           res.render("user-host-edit", { username: req.user.ten_nguoi_dung });
       } else {
           res.redirect('/login');
       }
   });

   app.post("/comment", postManage.saveComment);
}
