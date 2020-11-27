const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const userProfileManage = require("../app/userProfileManage");
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {
    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-profile-info", { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/wish-list',  userProfileManage.showWishList);

    app.get('/booked-list', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-booked-list", { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/await-bookings', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-await-bookings", { user: user });
        } else { res.redirect('/login') }
    });


    app.get('/profile-edit', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render('user-profile-edit', { user: user });
        } else { res.redirect('/login') }
    });

    app.post("/profile-edit", function(req, res) {
        if (req.isAuthenticated()) {
            const newInfo = req.body;
            const oldInfo = req.session.passport.user;
            updateInfo(newInfo, oldInfo);
            req.logout();
            res.redirect("/login")
        } else { res.redirect('/login') }
    });

    app.get('/profile-info', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render('user-profile-info', { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/list-host', postManage.displayUserListPost);

    app.get('/profile-address', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address', { user: user });
    });

    app.get('/address-edit', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address-edit', { user: user });
    });

}
