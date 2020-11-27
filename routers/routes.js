const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const { updateInfo, changePassword } = require("../app/updateUserProfile");
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const userManage = require("../app/userManage");
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();
const passport = require("../config/passport.js");
module.exports = (app, passport) => {
    // app.get("/", function(req, res) {
    //     if (req.isAuthenticated()) {
    //         res.render("user-home", { user: req.user });
    //     } else { res.render('home') }
    // });

    app.get("/", function(req, res) {
        res.render("home", {user : req.user, login : req.isAuthenticated()})
    })

    app.post("/", postManage.search);

    app.get("/user-home", function(req, res) {
        res.redirect('/');
    });

    app.get("/rooms/:type", postManage.displayListPost);
    app.get("/rooms/:type/:option", postManage.displayPostByNumOfPeopleOrPrice);
    app.get("/room/:id", postManage.displayPostProfile);
    app.post("/rooms/:type", postManage.filterListPostByType);
    app.post("/rooms/:type/:option", postManage.filterListPostByNumOfPeopleOrPrice)
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

    require("./user.js")(app, passport);

    app.get("/host", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-host", {
                username: req.user.ten_nguoi_dung,
                phong_tro: {
                    dataValues: "",
                    tien_ich_tien_nghi: "",
                },
                action: "new-post"
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post('/host', upload.array('image'), postManage.savePosts);

    app.get("/host-edit/:id", async function(req, res) {
        let phong_tro = await postManage.getPostInfo(req.params.id);
        console.log(phong_tro[0].dataValues);
        console.log(phong_tro[0].dataValues.tien_ich_tien_nghi);
        if (req.isAuthenticated()) {
            res.render("user-host-edit", {
                username: req.user.ten_nguoi_dung,
                phong_tro: phong_tro[0].dataValues,
                action: "post-edit"
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post("/host-edit/:id", async function(req, res) {
        console.log(req.body);
    });

    app.get("/host-delete/:id", postManage.deletePost);

    app.get("/report", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-report");
        } else {
            res.redirect('/login');
        }
    });

    app.get("/admin-control", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("admin-control", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

    app.get("/admin-control-post", postManage.displayAllPost);

    app.get("/admin-control-user", userManage.displayListUser);

    app.get("/admin-control-report", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("admin-control-report", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

    app.get("/report-info", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("report-info", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

    app.get("/checkout", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-checkout", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

    app.get("/confirm-checkout", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-confirm-checkout", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });


    app.post("/comment", postManage.saveComment);
    app.post("/saveFavPost", postManage.saveFavPost);
    app.get("/rooms", postManage.displayListPostBySearch);
    app.post("/rooms", postManage.filterListPostBySearch);
}