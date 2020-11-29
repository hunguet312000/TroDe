const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Bao_cao } = require("../config/sequelize");
const Op = require('Sequelize').Op


function format(s){ 
    return (s == undefined) ? "" : s
}
exports.createReport = async(req, res) =>{
    const uploader = async(path) => await cloudinary.uploads(path, 'Image');
    let insert_hinh_anh_values = []
    let files = req.files;
    for (const file of files) {
        const {path} = file
        const newPath = await uploader(path)
        insert_hinh_anh_values.push(newPath);
        //fs.unlinkSync(path);
    }
    const bao_cao_value = {
        id_phong_tro : req.params.room,
        id_nguoi_dung : req.user.id_nguoi_dung,
        tieu_de : req.body['tieu-de'],
        noi_dung : format(req.body['ly-do-1']) + " " + format(req.body['ly-do-2']) + " " + format(req.body.thong_tin_khac),
        hinh_anh : insert_hinh_anh_values[0].path_anh
    }
    const bao_cao = await Bao_cao.create(bao_cao_value);
    res.redirect("/");
}

exports.report = async(req, res) =>{
    if (req.isAuthenticated()) {
        res.render("user-report", {room : req.params.room});
    } else {
        res.redirect('/login');
    }
}
exports.reportInfo = async(req, res) => {
    if (req.isAuthenticated()) {
        try{
            const bao_cao = await Bao_cao.findAll({
                where: {
                    id_bao_cao : req.params.id
                }
            });
            console.log(bao_cao);
            res.render("report-info", { username: req.user.ten_nguoi_dung, userData : bao_cao });
        }catch(err){
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}
exports.displayListReport = async(req, res) => {
    if (req.isAuthenticated()) {
        try{
            const bao_cao = await Bao_cao.findAll({
                include: [{
                    model: Nguoi_dung,
                    required: true
                },
                {
                    model: Phong_tro,
                    required: true
                }

            ],
            })
            res.render("admin-control-report", { username: req.user.ten_nguoi_dung, userData : bao_cao });
        }catch(err){
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}