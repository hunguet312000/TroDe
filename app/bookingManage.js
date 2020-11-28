const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");

exports.booking = async(req, res) => {
  //console.log(req.body);
  const bookerName = req.body.bookerName;
  const bookerPhone = req.body.phone;
  const bookerEmail = req.body.email;
  const bookerId = req.body.bookerId;
  const phongTroId = req.body.phongTroId;
  const bookDate = req.body.bookDate;
  try{
    const lichHen = await Lich_hen.create({
      id_nguoi_hen: bookerId,
      id_phong_tro: phongTroId,
      thoi_gian: bookDate
    });
    res.redirect("/room/" + phongTroId);
  }catch(err){
    console.log(err);
  }
}

exports.bookedList = async(req, res) => {
  if (req.isAuthenticated()) {
      const user = req.session.passport.user;
      const bookedList = await Lich_hen.findAll({
        where:{
          id_nguoi_hen: user.id_nguoi_dung
        },
        include: [{
            model: Phong_tro,
            required: true
        }],
      });
      //console.log(bookedList);
      res.render("user-booked-list", {
        user: user,
        bookedList: bookedList
      });
  } else {
    res.redirect('/login') ;
  }
}
