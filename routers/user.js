const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const userProfileManage = require("../app/userProfileManage");
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const bookingManage = require("../app/bookingManage");
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {
    app.get('/profile', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-profile-info", { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/wish-list/:page',  userProfileManage.showWishList);

    app.get('/booked-list/:page', bookingManage.bookedList);

    app.get('/booked-list/:status/:page', bookingManage.bookedListStatus);

    app.get('/await-bookings/:page', bookingManage.awaitBooking);

    app.get('/await-bookings/:status/:page', bookingManage.awaitBookingStatus);

    app.post('/await-bookings/:id/:response', bookingManage.bookingResponse);

    app.get('/user/:id/profile', function(req, res){
      res.render('user-profile', {
        user: req.session.passport.user
      })
    })

    app.get('/profile/edit', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render('user-profile-edit', { user: user });
        } else { res.redirect('/login') }
    });

    app.post("/profile-edit", function(req, res) {
        if (req.isAuthenticated()) {
            const newInfo = req.body;
            const oldInfo = req.session.passport.user;
            userProfileManage.updateInfo(newInfo, oldInfo);
            req.logout();
            res.redirect("/login")
        } else { res.redirect('/login') }
    });

    app.get('/profile/info', function(req, res) {
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render('user-profile-info', { user: user });
        } else { res.redirect('/login') }
    });

    app.get('/list-host/:page', postManage.displayUserListPost);

    app.get('/profile/address', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address', { user: user });
    });

    app.get('/profile/address-edit', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address-edit', { user: user });
    });

}
