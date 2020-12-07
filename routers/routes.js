const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const forgetPassword = require("../app/forgetPassword");
const formidable = require("formidable");
require('dotenv').config();
const passport = require("../config/passport.js");
const userProfileManage = require("../app/userProfileManage")
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");

module.exports = (app, passport) => {
    // app.get("/", function(req, res) {
    //     if (req.isAuthenticated()) {
    //         res.render("user-home", { user: req.user });
    //     } else { res.render('home') }
    // });

    app.get("/", function(req, res) {
        res.render("home", { user: req.user, login: req.isAuthenticated() })
    });

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
                    tien_ich_tien_nghi: ""
                },
                action: "/host"
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post('/host', upload.array('image'), postManage.savePosts);

    app.get("/host-edit/:id", async function(req, res) {
        let phong_tro = await postManage.getPostInfo(req.params.id);
        //console.log(phong_tro[0].dataValues);
        //console.log(phong_tro[0].dataValues.hinh_anhs);
        if (req.isAuthenticated()) {
            res.render("user-host-edit", {
                username: req.user.ten_nguoi_dung,
                phong_tro: phong_tro[0].dataValues,
                action: "/host-edit/" + req.params.id
            });
        } else {
            res.redirect('/login');
        }
    });

    app.post("/host-edit/:id", upload.fields([{name : "update_image"}, {name : "image_avatar"}, {name : "image"}]),async(req, res) =>   {
        try{
            let phong_tro_insert = req.body;
            const uploader = async(path) => await cloudinary.uploads(path, 'Image');
            if(req.files.image_avatar != undefined){
                let files = req.files.image_avatar;
                for (const file of files) {
                    const {path} = file
                    const newPath = await uploader(path)
                    phong_tro_insert.path_anh_noi_bat = newPath.path_anh;
                }
            }

            if(req.files.image != undefined){
                let files = req.files.image;
                let insert_hinh_anh_values = []
                for (const file of files) {
                    const {path} = file
                    const newPath = await uploader(path)
                    insert_hinh_anh_values.push(newPath);
                }
                insert_hinh_anh_values.forEach(function(value) {
                    value.id_phong_tro = req.params.id
                })
                const hinh_anh = await Hinh_anh.bulkCreate(insert_hinh_anh_values);

            }
            if(req.files.update_image != undefined) {
                let files = req.files.update_image;
                let value = ''
                let id_anh_list = req.body.order;
                id_anh_list= id_anh_list.filter(item => item !== value);
                for(let i = 0; i < id_anh_list.length; i++) {
                    const {path} = files[i]
                    const newPath = await uploader(path)
                    const hinh_anh_update = Hinh_anh.update({
                        path_anh : newPath.path_anh
                    }, {
                        where : {
                            id_anh : id_anh_list[i]
                        }
                    })
                }
            }
            const updateHost = await Phong_tro.update(phong_tro_insert, {
                where: {id_phong_tro : req.params.id}
            })
            res.redirect(req.url);
        }catch(err){
            console.log(err)
        }

    });

    app.get("/host-delete/:id", postManage.deletePost);

}
