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
              where:{
                tinh_trang: null
              },
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
    const checkedReport = await Bao_cao.update(
      {
        tinh_trang: 1
      },
      {
      where:{id_bao_cao: req.params.id}
    });
      res.redirect(req.get('referer'));
  } catch (e) {
    console.log(e);
  }
}

exports.reportInfo = async(req, res) => {
    if (req.isAuthenticated()) {
        try{
            const bao_cao = await Bao_cao.findAll({
                where: {
                    id_bao_cao : req.params.id
                },
                include: [{
                    model: Hinh_anh_bao_cao,
                    required: true
                }],
            });
            //console.log(bao_cao);
            res.render("report-info", {
              user: req.user,
              bao_cao : bao_cao
            });
        }catch(err){
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}

exports.getDoneReport = async(req, res) => {
    if (req.isAuthenticated()) {
      const calculatePagniate = await paginate.calculateAdminDoneReportListPages(req, res);
        try{
            const bao_cao = await Bao_cao.findAll({
              offset: calculatePagniate.offset,
              limit: calculatePagniate.limit,
              where: {
                  tinh_trang: 1
              },
              include: [
                {
                  model: Hinh_anh_bao_cao,
                  required: true
                },
                {
                  model: Nguoi_dung,
                  required: true
                }
            ],
            });
            //console.log(bao_cao);
            res.render("admin-control-report-done", {
              user: req.user,
              bao_cao : bao_cao,
              type: "/admin-done-report",
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
