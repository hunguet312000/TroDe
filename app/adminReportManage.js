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
            order: ['id_bao_cao']
            })
            res.render("admin-control-report", { username: req.user.ten_nguoi_dung, userData : bao_cao });
        }catch(err){
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}
