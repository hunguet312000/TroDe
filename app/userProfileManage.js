const cloudinary = require('../config/cloudinary');
var formidable = require("formidable");
const mysql = require('mysql');
const { QueryTypes } = require('sequelize');

const dbconfig = require('../config/database');
const bcrypt = require('bcrypt');
const { sequelizeInit, Nguoi_dung, Phong_tro, Danh_sach_yeu_thich, sequelize } = require("../config/sequelize");
const paginate = require("./paginate");
const Op = require('Sequelize').Op

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
                type: "/wish-list"
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

exports.editAvatarAndProfile = async(req, res) => {
    try {
        console.log(req.body.submit)
        switch(req.body.submit){
            case "submit_avatar" :
                if(JSON.stringify(req.files) != "[]" && req.body.submit == "submit_avatar"){
                    const uploader = async(path) => await cloudinary.uploads(path, 'Image');
                    let insert_hinh_anh_values = []
                    for (const file of req.files) {
                        const { path } = file
                        const newPath = await uploader(path)
                        insert_hinh_anh_values.push(newPath);
                    }

                    const result = await Nguoi_dung.update({ avatar_path: insert_hinh_anh_values[0].path_anh }, { where: { id_nguoi_dung: req.user.id_nguoi_dung } })
                }
                break;
            case "submit_profile" : 
                const nguoi_dung = await Nguoi_dung.findAll({
                where: {id_nguoi_dung: req.user.id_nguoi_dung}
                })
                const oldInfoUser = {
                    ten_nguoi_dung : nguoi_dung[0].dataValues.ten_nguoi_dung, 
                    ho_va_ten : nguoi_dung[0].dataValues.ho_va_ten,
                    email : nguoi_dung[0].dataValues.email,
                    sdt : nguoi_dung[0].dataValues.sdt,
                    ngay_sinh : nguoi_dung[0].dataValues.ngay_sinh,
                    gioi_tinh : nguoi_dung[0].dataValues.gioi_tinh,
                }
                const input = req.body
                const newInfoUser = {}
                if(oldInfoUser.ten_nguoi_dung != input.ten_nguoi_dung){newInfoUser.ten_nguoi_dung = input.ten_nguoi_dung}
                if(oldInfoUser.ho_va_ten != input.ho_va_ten) {newInfoUser.ho_va_ten = input.ho_va_ten}
                if(oldInfoUser.email != input.email) {newInfoUser.email = input.email}
                if(oldInfoUser.sdt != input.sdt) {newInfoUser.sdt = input.sdt}
                if(oldInfoUser.ngay_sinh != input.ngay_sinh) {newInfoUser.ngay_sinh = input.ngay_sinh}
                if(oldInfoUser.gioi_tinh != input.gioi_tinh) {newInfoUser.gioi_tinh = input.gioi_tinh}
                if(JSON.stringify(newInfoUser) != "{}"){
                    const nguoi_dung_info = await Nguoi_dung.update(
                        newInfoUser, 
                        {
                            where: { id_nguoi_dung: req.user.id_nguoi_dung }
                        }
                    );
                }
                console.log(JSON.stringify(newInfoUser.gioi_tinh))
                break;
        }
        res.redirect("/profile/edit");
    } catch (err) {
        console.log(err)
    }

    
}

exports.watchUserProfile = async(req, res) => {
    if (req.isAuthenticated()) {
        try{
            const nguoi_dung = await Nguoi_dung.findAll({
                where: {id_nguoi_dung : req.user.id_nguoi_dung}
            })
            const user = req.session.passport.user;
            res.render('user-profile-edit', { user: user, userData : nguoi_dung });
        }
        catch(err){
            console.log(err)
        }
    } else { res.redirect('/login') }
}


exports.watchHostProfile = async(req, res) => {
    try {
        const queryValue = "SELECT *, count(id_phong_tro) as so_bai_dang  FROM nguoi_dung" +
                                " left outer join phong_tro on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung" +
                                " where id_nguoi_dung = " + req.params.id + 
                                " group by nguoi_dung.id_nguoi_dung" +
                                " order by nguoi_dung.id_nguoi_dung desc";
        const nguoi_dung = await sequelize.query(queryValue, { type: QueryTypes.SELECT });
        const phong_tro =await Phong_tro.findAll({
            where: {id_chu_so_huu : req.params.id}
        })
        console.log(phong_tro[0].dataValues.id_phong_tro)
        res.render("hosts", { user: req.user, login: req.isAuthenticated(), nguoi_dung: nguoi_dung, phong_tro :phong_tro })
    } catch (err) {
        console.log(err);
    }

}