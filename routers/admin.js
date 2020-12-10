const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const adminPostManage = require('../app/adminPostManage');
const adminUserManage = require("../app/adminUserManage");
const adminReportManage = require("../app/adminReportManage")
const forgetPassword = require("../app/forgetPassword");
require('dotenv').config();

module.exports = (app, passport) => {
  app.get("/admin-control", function(req, res) {
      if (req.isAuthenticated()) {
          res.render("admin-control", { username: req.user.ten_nguoi_dung });
      } else {
          res.redirect('/login');
      }
  });

  app.get("/admin-control-post/:page", adminPostManage.displayAllPostForAdmin);

  app.get("/admin-control-user/:page",adminUserManage.displayListUser );

  app.get("/admin-control-report/:page", adminReportManage.displayListReport);
  app.post("/admin-control-user/:page", adminUserManage.searchUser);
}
