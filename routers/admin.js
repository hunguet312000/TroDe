const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const adminPostManage = require('../app/adminPostManage');
const adminUserManage = require("../app/adminUserManage");
const adminReportManage = require("../app/adminReportManage")
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Bao_cao, Hinh_anh_bao_cao } = require("../config/sequelize");
const userPostManage = require("../app/adminPostManage");
const userUserManage = require("../app/adminUserManage");
const userReportManage = require("../app/adminReportManage");


module.exports = (app, passport) => {
  app.get("/admin-control", async function(req, res) {
      if (req.isAuthenticated()) {
          try{
            const postNum = await Phong_tro.count({});
            const userNum = await Nguoi_dung.count({});
            const reportNum = await Bao_cao.count({});
            res.render("admin-control", {
              user: req.user,
              postNum: postNum,
              userNum: userNum,
              reportNum: reportNum
            });
          }catch(e){
            console.log(e);
          }
        } else {
            res.redirect('/login');
        }
  });

  app.get("/admin-control-post/:page", adminPostManage.displayAllPostForAdmin);

  app.get("/admin-control-user/:page",adminUserManage.displayListUser);

  app.get("/admin-control-report/:page", adminReportManage.displayListReport);

  app.get("/admin/post-delete/:id", adminPostManage.adminDeletePost);

  app.get("/admin/user-delete/:id", adminUserManage.adminDeleteUser);

  app.get("/admin/report-checked/:id", adminReportManage.adminReportChecked);
}
