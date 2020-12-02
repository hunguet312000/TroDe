const cloudinary = require('../config/cloudinary');

const mysql = require('mysql');

const dbconfig = require('../config/database');
const bcrypt = require('bcrypt');
const { sequelizeInit, Nguoi_dung, Phong_tro, Danh_sach_yeu_thich } = require("../config/sequelize");
const paginate = require("./paginate");
const Op = require('Sequelize').Op

exports.updateInfo = async(newInfo, oldInfo) => {
    const username = newInfo.username;
    const email = newInfo.email;
    const phone = newInfo.phone;
    const dob = newInfo.DOB;
    const sex = newInfo.sex;
    const id_nguoi_dung = oldInfo.id_nguoi_dung;

    try {
        const nguoi_dung = await Nguoi_dung.update({
            ten_nguoi_dung: username,
            email: email,
            sdt: phone,
            gioi_tinh: sex,
            ngay_sinh: dob
        }, {
            where: { id_nguoi_dung: id_nguoi_dung }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.changePassword = async(newInfo, oldInfo) => {
    const id_nguoi_dung = oldInfo.id_nguoi_dung;
    const oldPass = oldInfo.mat_khau;
    const typedOldPass = newInfo.oldPass;
    const newPass = newInfo.newPass;
    const renewPass = newInfo.reNewPass;
    const newHashPass = bcrypt.hashSync(newPass, 10);

    try {
        const nguoi_dung = await Nguoi_dung.update({
            mat_khau: newHashPass
        }, {
            where: { id_nguoi_dung: id_nguoi_dung }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.showWishList = async(req, res) => {
    //console.log("ALO: " + req.params.page);
    let roomList = [];
    const calculatePagniate = await paginate.calculateWishListPages(req, res);
    if (req.isAuthenticated()) {
        const user = req.session.passport.user;
        try {
            const roomIdList = await Danh_sach_yeu_thich.findAll({
                offset: calculatePagniate.offset,
                limit: calculatePagniate.limit,
                where: {
                    id_nguoi_dung: user.id_nguoi_dung
                },
                order: [
                    ["createdAt", "ASC"]
                ]
            });
            for (room of roomIdList) {
                const roomInfo = await Phong_tro.findAll({
                    where: {
                        id_phong_tro: room.id_phong_tro
                    }
                });
                roomList.push(roomInfo);
            }
            res.render("user-wish-list", {
                user: user,
                roomList: roomList,
                pages: calculatePagniate.pages,
                current: req.params.page,
                postNum: calculatePagniate.postNum,
                type: "wish-list"
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/login')
    }
}

exports.isInWishList = async(id_phong_tro, id_nguoi_dung) => {
    //console.log("ALO: " + req.params.page);
    try {
        const roomIdList = await Danh_sach_yeu_thich.findAll({
            where: {
                [Op.and]: [
                    { id_nguoi_dung: id_nguoi_dung },
                    { id_phong_tro: id_phong_tro }
                ]
            }
        });
        if (roomIdList.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}


exports.watchUserProfile = async(req, res) => {
    if (req.isAuthenticated()) {
        try {
            const nguoi_dung = await Nguoi_dung.findAll({
                where: { id_nguoi_dung: req.user.id_nguoi_dung }
            })
            const user = req.session.passport.user;
            console.log(nguoi_dung[0].dataValues.avatar_path)
            res.render("user-profile-info", { user: user, userData: nguoi_dung });
        } catch (err) { console.log(err) }
    } else { res.redirect('/login') }
}
exports.changeAvatar = async(req, res) => {
    try {
        const uploader = async(path) => await cloudinary.uploads(path, 'Image');
        let insert_hinh_anh_values = []
        for (const file of req.files) {
            const { path } = file
            const newPath = await uploader(path)
            insert_hinh_anh_values.push(newPath);
        }
        const result = await Nguoi_dung.update({ avatar_path: insert_hinh_anh_values[0].path_anh }, { where: { id_nguoi_dung: req.user.id_nguoi_dung } })

        console.log(result)
        res.redirect("/profile");
    } catch (err) {
        console.log(err)
    }

}
exports.editUserProfile = async(req, res) => {
    if (req.isAuthenticated()) {
        const user = req.session.passport.user;
        res.render('user-profile-edit', { user: user });
    } else { res.redirect('/login') }
}


exports.watchHostProfile = async(req, res) => {
    try {
        const nguoi_dung = await Nguoi_dung.findAll({
            where: { id_nguoi_dung: req.params.id }
        })
        res.render("hosts", { user: req.user, login: req.isAuthenticated(), userData: nguoi_dung })
    } catch (err) {
        console.log(err);
    }

}