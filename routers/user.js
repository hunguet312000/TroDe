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

    app.get('/wish-list/:page',  userProfileManage.showWishList);

    app.get('/booked-list/:page', bookingManage.bookedList);

    app.get('/booked-list/:status/:page', bookingManage.bookedListStatus);

    app.get('/await-bookings/:page', bookingManage.awaitBooking);

    app.get('/await-bookings/:status/:page', bookingManage.awaitBookingStatus);

    app.post('/await-bookings/:id/:response', bookingManage.bookingResponse);

    app.get('/profile/edit', userProfileManage.viewUserProfile);

    app.post("/profile/edit", upload.array('image'), userProfileManage.editAvatarAndProfile)

    app.get('/list-host/:page', postManage.displayUserListPost);

    app.get('/profile/address', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address', { user: user });
    });

    app.get('/profile/address-edit', function(req, res) {
        const user = req.session.passport.user;
        res.render('user-profile-address-edit', { user: user });
    });

    app.get("/user-profile/:id", function(req, res){
        const user = req.session.passport.user;
        res.render('user-profile', {user : user})
    });

    app.get("/host-profile/:id/:page", userProfileManage.viewHostProfile)

}
