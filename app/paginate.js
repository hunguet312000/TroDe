const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");
const Op = require('Sequelize').Op
const bookingManage = require("./bookingManage");

exports.calculateRoomsPages = async(req, res, type, district, area) => {
  try {
    const currentPage = Number(req.params.page);
    const roomPerPage = 12;
    const roomsNum = await Phong_tro.count({
      where: {
          [Op.or]: [{
                  phan_loai: type
              },
              {
                  quan_huyen: district
              },
              {
                  quan_huyen: {
                      [Op.or]: area
                  }
              }
          ]
      },
      include: [{
          model: Nguoi_dung,
          required: true
      }]
    });

    return {
      pages: Math.ceil(roomsNum/roomPerPage),
      offset: (roomPerPage*currentPage)-roomPerPage,
      limit: roomPerPage,
      roomsNum: roomsNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateBookedPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const bookedPerPage = 3;
    const bookedNum = await Lich_hen.count({
      where: {
        [Op.and]: [
          {id_nguoi_hen: req.session.passport.user.id_nguoi_dung},
          {tinh_trang: null}
        ]
      },
      include: [
        {
          model: Phong_tro,
          required: true,
          include: {model: Nguoi_dung, required: true}
        }
      ]
    });
    return {
      pages: Math.ceil(bookedNum/bookedPerPage),
      offset: (bookedPerPage*currentPage)-bookedPerPage,
      limit: bookedPerPage,
      bookedNum: bookedNum
    }
  } catch (e) {
    console.log(e);
  }
}
