const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const userManage = require("../app/userManage");
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {
    app.get("/", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("user-home", { user: req.user });
        } else { res.render('guest-home') }
    });

    app.post("/", postManage.search);

    app.get("/user-home", function(req, res) {
        res.redirect('/');
    });

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
    require("./admin.js")(app, passport);
    require("./room.js")(app, passport);

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

    app.get("/report-info", function(req, res) {
        if (req.isAuthenticated()) {
            res.render("report-info", { username: req.user.ten_nguoi_dung });
        } else {
            res.redirect('/login');
        }
    });

}
