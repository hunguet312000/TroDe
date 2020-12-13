const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const adminPostManage = require('../app/adminPostManage');
const adminUserManage = require("../app/adminUserManage");
const adminReportManage = require("../app/adminReportManage")
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Bao_cao, Hinh_anh_bao_cao, Quan_tri_vien } = require("../config/sequelize");
const userPostManage = require("../app/adminPostManage");
const userUserManage = require("../app/adminUserManage");
const userReportManage = require("../app/adminReportManage");


module.exports = (app, passport) => {

  app.get("/admin", function(req, res){
    res.redirect("/admin-login");
  })

  app.get("/admin-login", async function(req, res){
    if(req.isAuthenticated()){
      if(req.user.role === 1){
        try{
          const postNum = await Phong_tro.count({});
          const userNum = await Nguoi_dung.count({});
          const reportNum = await Bao_cao.count({});
          //console.log(req.user);
          const admin = await Quan_tri_vien.findAll({
              where:{
                id_nguoi_dung: req.user.id_nguoi_dung
              }
          });
          //console.log(admin);
          if(admin[0]){
            res.render("admin-control", {
              user: admin[0],
              postNum: postNum,
              userNum: userNum,
              reportNum: reportNum
            });
          }else{
            res.render("admin-require-noti");
          }
        }catch(e){
          console.log(e);
        }
      }else{
        res.render("admin-require-noti");
      }
    }else{
      res.render("admin-login",{
          message: req.flash("loginMessage")
      });
    }
  });

  app.post("/admin-login", passport.authenticate("admin-local-login", {
      successRedirect: '/admin-control', // redirect to the secure profile section
      failureRedirect: '/admin-login', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
  }), function(req, res) {

      // res.redirect("/")
      // if (req.body.remember) {
      //   req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 1 days
      // } else {
      //   req.session.cookie.expires = false; // Cookie expires at end of session
      // }
  });

  app.get("/admin-control", async function(req, res) {
      if (req.isAuthenticated()) {
        if(req.user.role === 1){
          try{
            const postNum = await Phong_tro.count({});
            const userNum = await Nguoi_dung.count({});
            const reportNum = await Bao_cao.count({});
            const admin = await Quan_tri_vien.findAll({
                where:{
                  id_nguoi_dung: req.user.id_nguoi_dung
                }
            });
            // console.log(admin[0]);
            res.render("admin-control", {
              user: admin[0],
              postNum: postNum,
              userNum: userNum,
              reportNum: reportNum
            });
          }catch(e){
            console.log(e);
          }
        }else{
          res.render("admin-require-noti");
        }
      } else {
          res.redirect('/admin-login');
      }
  });

  app.get("/admin-control-post/:page", adminPostManage.displayAllPostForAdmin);

  app.get("/admin-control-user/:page",adminUserManage.displayListUser);

  app.get("/admin-control-report/:page", adminReportManage.displayListReport);

  app.get("/admin/post-delete/:id", adminPostManage.adminDeletePost);

  app.get("/admin/user-delete/:id", adminUserManage.adminDeleteUser);

  app.get("/admin/report-checked/:id", adminReportManage.adminReportChecked);

  app.get("/report-info/:id", adminReportManage.reportInfo);

  app.post("/admin-control-user/:page", adminUserManage.searchUser);

  app.get("/admin-done-report/:page", adminReportManage.getDoneReport);

}
