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
const paginate = require("./paginate");

exports.displayListReport = async(req, res) => {
    if (req.isAuthenticated()) {
      const calculatePagniate = await paginate.calculateAdminReportListPages(req, res);
        try{
            const bao_cao = await Bao_cao.findAll({
              offset: calculatePagniate.offset,
              limit: calculatePagniate.limit,
                include: [{
                    model: Nguoi_dung,
                    required: true
                },
                {
                    model: Phong_tro,
                    required: true
                }

            ],
            order: [
              ['id_bao_cao', "DESC"]
            ]
            })
            res.render("admin-control-report", {
              user: req.user,
              userData : bao_cao,
              type: "/admin-control-report",
              pages: calculatePagniate.pages,
              current: req.params.page,
              reportNum: calculatePagniate.reportNum
            });
        }catch(err){
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}

exports.adminReportChecked = async (req, res) =>{
  try {
    const checkedReport = await Bao_cao.destroy({
      where:{
        id_bao_cao: req.params.id
      }
    });
      res.redirect(req.get('referer'));
  } catch (e) {
    console.log(e);
  }
}
