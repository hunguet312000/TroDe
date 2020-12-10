const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Bao_cao, Hinh_anh_bao_cao } = require("../config/sequelize");
const Op = require('Sequelize').Op

exports.createReport = async(req, res) =>{

    const uploader = async(path) => await cloudinary.uploads(path, 'Image');
    let insert_hinh_anh_values = []
    let files = req.files;
    console.log(req.body)
    for (const file of files) {
        const {path} = file
        const newPath = await uploader(path)
        insert_hinh_anh_values.push(newPath);
        //fs.unlinkSync(path);
    }

    const bao_cao_value = {
        id_phong_tro : req.params.room,
        id_nguoi_dung : req.user.id_nguoi_dung,
        tieu_de : req.body.tieu_de,
        noi_dung : ""
    }
    if(req.body.ly_do_1 != undefined) {bao_cao_value.noi_dung+=(req.body.ly_do_1 + " ")}
    if(req.body.ly_do_2 != undefined) {bao_cao_value.noi_dung+=(req.body.ly_do_2 + " ")}
    if(req.body.thong_tin_khac != undefined) {bao_cao_value.noi_dung+=req.body.thong_tin_khac}
    const bao_cao = await Bao_cao.create(bao_cao_value);

    insert_hinh_anh_values.forEach(function(value) {
        value.id_bao_cao = bao_cao.id_bao_cao
    })
    const hinh_anh_bao_cao = await Hinh_anh_bao_cao.bulkCreate(insert_hinh_anh_values);
    res.redirect("/");
}

exports.report = async(req, res) =>{
    if (req.isAuthenticated()) {
        res.render("user-report", {room : req.params.room});
    } else {
        res.redirect('/login');
    }
}
