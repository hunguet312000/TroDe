const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const userManage = require("../app/userManage");
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

  app.get("/admin-control-post", postManage.displayAllPost);

  app.get("/admin-control-user",userManage.displayListUser );

  app.get("/admin-control-report", function(req, res) {
      if (req.isAuthenticated()) {
          res.render("admin-control-report", { username: req.user.ten_nguoi_dung });
      } else {
          res.redirect('/login');
      }
  });

}
