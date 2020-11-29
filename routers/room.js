const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const userManage = require("../app/userManage");
const bookingManage = require("../app/bookingManage");
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {

    app.get("/rooms/:type", postManage.displayListPost);

    app.get("/rooms/:type/:option", postManage.displayPostByNumOfPeopleOrPrice);

    app.get("/room/:id", postManage.displayPostProfile);

    app.post("/rooms/:type", postManage.filterListPostByType);

    app.post("/rooms/:type/:option", postManage.filterListPostByNumOfPeopleOrPrice);

    app.post("/room/:id/confirm-booking-info", async function(req, res) {
        //console.log(req.body.bookDate);
        const id_phong_tro = req.params.id;
        const book_date = req.body.bookDate;
        const phong_tro = await postManage.getPostInfo(id_phong_tro);
        if (req.isAuthenticated()) {
            const user = req.session.passport.user;
            res.render("user-checkout", {
                user: req.user,
                phong_tro: phong_tro,
                book_date: book_date
            });
        } else {
            res.redirect("/login");
        }
    });

    app.post("/room/:id/book", bookingManage.booking);
    //
    // app.get("/room/:id/confirm-booking", function(req, res) {
    //     console.log(req.body);
    //     res.render("user-checkout", { username: req.user.ten_nguoi_dung });
    // });
    //
    app.post("/comment", postManage.saveComment);
    app.post("/saveFavPost", postManage.saveFavPost);
    app.get("/rooms", postManage.displayListPostBySearch);
    //app.post("/rooms", postManage.filterListPostBySearch);
}