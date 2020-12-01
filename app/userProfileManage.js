const mysql = require('mysql');
const dbconfig = require('../config/database');
const bcrypt = require('bcrypt');
const { sequelizeInit, Nguoi_dung, Phong_tro, Danh_sach_yeu_thich } = require("../config/sequelize");
const paginate = require("./paginate");

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
    console.log("ALO: " + req.params.page);
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
