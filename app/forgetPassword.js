const mysql = require('mysql');
const dbconfig = require("../config/database");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sequelizeInit, Nguoi_dung} = require("../config/sequelize");
var nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');

exports.forgetPassword = async (req, res) => {
    console.log(req.body.email)
    try{
        const nguoi_dung = await Nguoi_dung.findAll({
            where: {
                email: req.body.email
            }
        })
        try{
            console.log(nguoi_dung[0].dataValues.email)
            let token = jwt.sign({_id: nguoi_dung[0].dataValues.email}, process.env.RESET_PASSWORD_KEY, {expiresIn: '10m'});
            try{
                await Nguoi_dung.update(
                    {token: token},
                    {where:{
                        email: req.body.email
                        }
                    }
                )
            }catch(err){
                console.log(err)
            }
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'trodehn@gmail.com',
                  pass: 'trode10000'
                }
              });

              var mailOptions = {
                from: 'trodehn@gmail.com',
                to: req.body.email,
                subject: 'Đổi mật khẩu cho tài khoản của bạn',
                html: '<p>Để thay đổi mật khẩu của bạn xin vui lòng nhấn vào <a href="http://localhost:3000/reset-password/' + token + '">link.</a> </p>'
              };

              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.render("user-verification");
        }catch(err){
            res.render("user-forget-password", { message: 'Tài khoản không hợp lệ' })
        }
    }catch(err){
        console.log(err)
    }
}

exports.checkToken = async (req,res) => {
   var reset_link = req.params.token;
   console.log("checkToken");
   if( reset_link ){
       jwt.verify(reset_link, process.env.RESET_PASSWORD_KEY, async(err, decoded_data)=>{
           if( err ){
               res.status(404).json({
                   error: "Incorrect token or it is."
                })
           }
           let token = await Nguoi_dung.findAll({
               where:{
                   token: reset_link
               }
           })
           try{
                console.log(token[0].dataValues.token)
                res.render('user-reset-password', {
                  message:'',
                  action:"/reset-password/" + reset_link,
                  errors: undefined})
           }catch(err){
               res.send("Sai cú pháp")
           }
       })
   }
}

exports.resetPassword = async(req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    var reset_link = req.params.token;
    if (!errors.isEmpty()) {
        //console.log(errors)\
        res.render('user-reset-password', {
          action:"/reset-password/" + reset_link,
          errors: errors.array(),
          message: ''
        });
    }else {
      if ( req.body.password == req.body.rePassword ){
          console.log(req.body);
          const hashPass = bcrypt.hashSync(req.body.password, 10);
          try{
              const newPass = await Nguoi_dung.update({
                  mat_khau: hashPass
              },{
                  where:{
                      token: reset_link
                  }
              })
              console.log(newPass);
          }catch(err){
              res.render('user-reset-password', { message:'Thay đổi mật khẩu không thành công. Xin vui lòng thử lại.', action:"/reset-password/" + reset_link})
          }
          res.redirect('/login');
      }
    }
    // else{
    //     res.render('user-reset-password', {message:'Mật khẩu xác thực không trùng khớp.', action:"/reset-password/" + reset_link, errors: })
    // }
}
