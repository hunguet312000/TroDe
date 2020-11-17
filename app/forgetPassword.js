const mysql = require('mysql');
const dbconfig = require("../config/database");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sequelizeInit, Nguoi_dung} = require("../config/sequelize");
var nodemailer = require('nodemailer');

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
                  user: 'vuthiphuong2910@gmail.com',
                  pass: 'ghiaog123'
                }
              });

              var mailOptions = {
                from: 'vuthiphuong2910@gmail.com',
                to: req.body.email,
                subject: 'Sending Email using Node.js',
                html: '<p>Dể thay đổi mật khẩu của bạn xin vui lòng nhấn vào <a href="http://localhost:3000/reset-password/' + token + '">link.</a> </p>'
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
    // console.log(req.body.email);
    // dbConnection = mysql.createConnection(dbconfig);
    // dbConnection.connect();
    // dbConnection.query("SELECT * FROM nguoi_dung WHERE email = ?", [req.body.email], function(err, results){
    //     console.log(results)
    //     if (err){
    //         throw err
    //     }
    //     else if(results.length == 0){
    //         res.render("user-forget-password", { message: 'Tài khoản không hợp lệ' })
    //     }
    //     else {
    //         let token = jwt.sign({_id: results[0].id_nguoi_dung}, process.env.RESET_PASSWORD_KEY, {expiresIn: '10m'});
    //         dbConnection.query("UPDATE nguoi_dung SET token = ? WHERE id_nguoi_dung = ?",[token, results[0].id_nguoi_dung], function(err, rows){
    //             if(err){
    //                 throw err
    //             }
    //         })
    //         var transporter = nodemailer.createTransport({
    //             service: 'gmail',
    //             auth: {
    //               user: 'vuthiphuong2910@gmail.com',
    //               pass: 'ghiaog123'
    //             }
    //           });

    //           var mailOptions = {
    //             from: 'vuthiphuong2910@gmail.com',
    //             to: req.body.email,
    //             subject: 'Sending Email using Node.js',
    //             html: '<p>Click <a href="http://localhost:3000/reset-password/' + token + '">here</a> </p>'
    //           };

    //           transporter.sendMail(mailOptions, function(error, info){
    //             if (error) {
    //               console.log(error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //             }
    //           });
    //         res.render("user-verification");
    //     }
    // });

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
                res.render('user-reset-password', {message:'', action:"/reset-password/" + reset_link})
           }catch(err){
               res.send("Sai cú pháp")
           }
        //    dbConnection = mysql.createConnection(dbconfig);
        //    dbConnection.connect();
        //    dbConnection.query("SELECT token FROM nguoi_dung where token = ?", [reset_link], function(error, result){
        //         if( result.length == 0 ) {
        //             res.send("token does not exist")
        //         }else{
        //             res.render('user-reset-password', {message:'', action:"/reset-password/" + reset_link})
        //         }
        //    });

       })
   }
}

exports.resetPassword = async(req, res) => {
    var reset_link = req.params.token;
    if ( req.body.password == req.body.passwordcf ){
        console.log(req.body);
        const hashPass = bcrypt.hashSync(req.body.password, 10);
        try{
            await Nguoi_dung.update({
                password: hashPass
            },{
                where:{
                    token: reset_link
                }
            })
        }catch(err){
            res.render('user-reset-password', {message:'Thay đổi mật khẩu không thành công. Xin vui lòng thử lại.', action:"/reset-password/" + reset_link})
        }
        // dbConnection = mysql.createConnection(dbconfig);
        // dbConnection.connect();
        // dbConnection.query("UPDATE nguoi_dung SET mat_khau = ? WHERE token = ?",[hashPass, reset_link], function(err, rows){
        //     if(err){
        //         throw err
        //     }else{
        //         console.log('success');
        //     }
        // })
        res.redirect('/login');
    }
    else{
        res.render('user-reset-password', {message:'Mật khẩu xác thực không trùng khớp.', action:"/reset-password/" + reset_link})
    }

}
