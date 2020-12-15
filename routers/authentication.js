const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const { updateInfo, changePassword } = require("../app/userProfileManage");
const bcrypt = require('bcrypt');
const postManage = require('../app/postManage');
const forgetPassword = require("../app/forgetPassword");
const { check, validationResult } = require('express-validator');
require('dotenv').config();

module.exports = (app, passport) => {

  app.get("/login", function(req, res) {
      res.render("user-login", {
          message: req.flash("loginMessage")
      });
  });

  app.post("/login", passport.authenticate("local-login", {
      successRedirect: '/', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
  }), function(req, res) {

      // res.redirect("/")
      // if (req.body.remember) {
      //   req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 1 days
      // } else {
      //   req.session.cookie.expires = false; // Cookie expires at end of session
      // }
  });

  app.get("/login/error", function(req, res) {
      res.render("user-login", {
          message: "Email đã được sử dụng."
      });
  });

  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/auth/google/user-home", passport.authenticate("google", {
          failureRedirect: '/login/error' ,
          failureFlash: true
      }),
      function(req, res) {
          // Successful authentication, redirect home.
          res.redirect('/');
      });

  app.get('/auth/facebook',
      passport.authenticate('facebook', { scope: ["email"] })
  );

  app.get('/auth/facebook/user-home',passport.authenticate('facebook', {
        failureRedirect: '/login/error' ,
        failureFlash: true
      }),
      function(req, res) {
          // Successful authentication, redirect home.
          res.redirect('/');
      });

  app.get("/signup", function(req, res) {
      res.render("user-signup", {
          message: req.flash("signupMessage"),
          errors : undefined
      })
  });

  app.post("/signup",
  [
        check('username', 'Tên đăng nhập cần có tối thiểu 4 chữ.').isLength({ min: 4 }),
        check('email', 'Email không hợp lệ.').isEmail(),
        check('password', 'Mật khẩu cần có tối thiểu 8 ký tự.').isLength({ min: 8 }),
        check("password", "Mật khẩu cần bao gồm cả chữ và số trong đó có ít nhất một chữ cái viết hoa.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i"),
        check("phone", "Số điện thoại có 10 chữ số.").isLength({min: 10, max: 10}),
        check('confirmPassword')
            .trim()
            .custom(async (confirmPassword, {req}) => {
            const password = req.body.password
            if(password !== confirmPassword){
                throw new Error('Mật khẩu nhập lại không giống.')
            }
            }),
  ],
  (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //console.log(errors)
            res.render("user-signup", {
                errors: errors.array(),
                message : ""
            })
        }
        else {
            passport.authenticate("local-signup",
            {
                successRedirect: '/', // redirect to the secure profile section
                failureRedirect: '/signup', // redirect back to the signup page if there is an error
                failureFlash: true // allow flash messages
            })(req,res);
        }
  });

  app.get("/logout", function(req, res) {
      req.logout();
      res.redirect("/");
  });

  app.get('/profile/change-password', function(req, res) {
      if (req.isAuthenticated()) {
          const user = req.session.passport.user;
          //console.log(user)
          res.render('user-profile-change-password', {
            user: user,
            message: '',
            errors: undefined
           });
      } else { res.redirect('/login') }
  });

  app.post("/profile-change-password",
  [
        check('newPass', 'Mật khẩu cần có tối thiểu 8 ký tự.').isLength({ min: 8 }),
        check("newPass", "Mật khẩu mới cần bao gồm cả chữ và số trong đó có ít nhất một chữ cái viết hoa.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i"),
        check('renewPass')
            .trim()
            .custom(async (renewPass, {req}) => {
            if(req.body.newPass !== req.body.reNewPass){
                throw new Error('Mật khẩu nhập lại không giống.')
            }
            }),
        check('oldPass')
            .trim()
            .custom(async (oldPass, {req}) => {
            if (!bcrypt.compareSync(req.body.oldPass, req.session.passport.user.mat_khau)){
                throw new Error('Mật khẩu cũ không đúng.')
            }
            }),
  ],
  function(req, res) {
    const newInfo = req.body;
    const oldInfo = req.session.passport.user;
    const id_nguoi_dung = oldInfo.id_nguoi_dung;
    const oldPass = oldInfo.mat_khau;
    const typedOldPass = newInfo.oldPass;
    const newPass = newInfo.newPass;
    const renewPass = newInfo.reNewPass;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log(errors)\
        res.render('user-profile-change-password', {
          user: req.session.passport.user,
          errors: errors.array(),
          message: ''
        });
    }else {
        changePassword(newInfo, oldInfo);
        req.logout();
        res.redirect("/login")
    }

      // if (!bcrypt.compareSync(typedOldPass, oldPass)) {
      //     res.render('user-profile-change-password', {
      //       user: req.session.passport.user,
      //       message: "Sai mật khẩu.",
      //       errors: ''
      // });
      // }else if (newPass != renewPass){
      //     res.render('user-profile-change-password', {
      //       user: req.session.passport.user,
      //       message: "Mật khẩu nhập lại không giống.",
      //       errors: ''
      //     });
      //   }
  });

  app.get("/reset-password/:token", forgetPassword.checkToken);

  app.post("/reset-password/:token",
  [
        check('password', 'Mật khẩu cần có tối thiểu 8 ký tự.').isLength({ min: 8 }),
        check("password", "Mật khẩu mới cần bao gồm cả chữ và số trong đó có ít nhất một chữ cái viết hoa.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "i"),
        check('rePassword')
            .trim()
            .custom(async (rePassword, {req}) => {
            if(req.body.password !== req.body.rePassword){
                throw new Error('Mật khẩu nhập lại không giống.')
            }
            }),
  ],
  forgetPassword.resetPassword);

  app.get("/forget-password", function(req, res){
    res.render("user-forget-password", { message: '' })
  });

  app.post("/forget-password", forgetPassword.forgetPassword)

  app.get("/verification", function(req, res) {
      res.render("user-verification", { message: '' })
  });

  app.get("/verification-email", function(req, res) {
      res.render("user-verification-email", { message: '' })
  });
}
