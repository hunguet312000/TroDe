const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Bao_cao } = require("../config/sequelize");
const Op = require('sequelize').Op
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

exports.calculateRoomsByPeopleOrPricePages = async(req, res, type, tong_so_nguoi, gia_tien, quan_huyen) => {
  try {
    const currentPage = Number(req.params.page);
    const roomPerPage = 12;
    const roomsNum = await Phong_tro.count({
      where: {
          [Op.and] : [
            {phan_loai : type},
            {[Op.or] : [
                {tong_so_nguoi : tong_so_nguoi},
                {gia_phong : {[Op.between] : [gia_tien[0], gia_tien[1]]}},
                {quan_huyen : quan_huyen}
            ]}
        ]
      }
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
      }
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

exports.calculateBookedStatusPages = async(req, res, tinh_trang) => {
  try {
    const currentPage = Number(req.params.page);
    const bookedPerPage = 3;
    const bookedStatusNum = await Lich_hen.count({
      where: {
        [Op.and]: [
          {id_nguoi_hen: req.session.passport.user.id_nguoi_dung},
          {tinh_trang: tinh_trang}
        ],
      }
    });
    return {
      pages: Math.ceil(bookedStatusNum/bookedPerPage),
      offset: (bookedPerPage*currentPage)-bookedPerPage,
      limit: bookedPerPage,
      bookedStatusNum: bookedStatusNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateBookingPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const bookingPerPage = 3;
    const bookingNum = await Lich_hen.count({
      include: [
        {
          model: Phong_tro,
          required: true,
          where: {
              id_chu_so_huu: req.session.passport.user.id_nguoi_dung
          }
        }
    ],
      where: {
          tinh_trang: null
      }
    });
    return {
      pages: Math.ceil(bookingNum/bookingPerPage),
      offset: (bookingPerPage*currentPage)-bookingPerPage,
      limit: bookingPerPage,
      bookingNum: bookingNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateBookingStatusPages = async(req, res, tinh_trang) => {
  try {
    const currentPage = Number(req.params.page);
    const bookingPerPage = 3;
    const bookingNum = await Lich_hen.count({
      include: [
        {
          model: Phong_tro,
          required: true,
          where: {
              id_chu_so_huu: req.session.passport.user.id_nguoi_dung
          }
        }
      ],
      where: {
          tinh_trang: tinh_trang
      }
    });
    return {
      pages: Math.ceil(bookingNum/bookingPerPage),
      offset: (bookingPerPage*currentPage)-bookingPerPage,
      limit: bookingPerPage,
      bookingNum: bookingNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateListHostPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const postPerPage = 3;
    const postNum = await Phong_tro.count({
      where: {
          id_chu_so_huu: req.user.id_nguoi_dung
      },
      order: [
          ["id_phong_tro", "DESC"]
      ]
    });
    return {
      pages: Math.ceil(postNum/postPerPage),
      offset: (postPerPage*currentPage)-postPerPage,
      limit: postPerPage,
      postNum: postNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateWishListPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const postPerPage = 12;
    const postNum = await Danh_sach_yeu_thich.count({
      where: {
          id_nguoi_dung:  req.session.passport.user.id_nguoi_dung
      }
    });
    return {
      pages: Math.ceil(postNum/postPerPage),
      offset: (postPerPage*currentPage)-postPerPage,
      limit: postPerPage,
      postNum: postNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateSearchPages = async(req, res, result) => {
  try {
    const currentPage = Number(req.params.page);
    const postPerPage = 12;
    const roomsNum = await Phong_tro.count({
      where: {
          [Op.and]: [{
                  phan_loai: {
                      [Op.like]: "%" + result.phan_loai + "%"
                  }
              },
              {
                  quan_huyen: {
                      [Op.like]: "%" + result.quan_huyen + "%"
                  }
              },
              {
                  phuong_xa: {
                      [Op.like]: "%" + result.phuong_xa + '%'
                  }
              },
              {
                  tong_so_nguoi: {
                      [Op.like]: "%" + result.tong_so_nguoi + "%"
                  }
              },
              {
                  gia_phong: {
                      [Op.between]: [result.gia_phong[0], result.gia_phong[1]]
                  }
              }
          ],

      }
    });
    return {
      pages: Math.ceil(roomsNum/postPerPage),
      offset: (postPerPage*currentPage)-postPerPage,
      limit: postPerPage,
      roomsNum: roomsNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateHostProfilePages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const postPerPage = 6;
    const postNum = await Phong_tro.count({
      where: {
          id_chu_so_huu:  req.params.id
      }
    });
    return {
      pages: Math.ceil(postNum/postPerPage),
      offset: (postPerPage*currentPage)-postPerPage,
      limit: postPerPage,
      postNum: postNum
    }
  } catch (e) {
    console.log(e);
  }
}

//ADMIN
exports.calculateAdminPostListPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const postPerPage = 3;
    const postNum = await Phong_tro.count({
    });
    return {
      pages: Math.ceil(postNum/postPerPage),
      offset: (postPerPage*currentPage)-postPerPage,
      limit: postPerPage,
      postNum: postNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateAdminUserListPages = async(req, res) => {
  try {
    const currentPage = Number(req.params.page);
    const userPerPage = 4;
    const userNum = await Nguoi_dung.count({
    });
    return {
      pages: Math.ceil(userNum/userPerPage),
      offset: (userPerPage*currentPage)-userPerPage,
      limit: userPerPage,
      userNum: userNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateAdminReportListPages = async(req, res) => {
  try {
    console.log(req.params.page);
    const currentPage = Number(req.params.page);
    const reportPerPage = 4;
    const reportNum = await Bao_cao.count({
      where:{
        tinh_trang: null
      }
    });
    return {
      pages: Math.ceil(reportNum/reportPerPage),
      offset: (reportPerPage*currentPage)-reportPerPage,
      limit: reportPerPage,
      reportNum: reportNum
    }
  } catch (e) {
    console.log(e);
  }
}

exports.calculateAdminDoneReportListPages = async(req, res) => {
  try {
    //console.log(req.params.page);
    const currentPage = Number(req.params.page);
    const reportPerPage = 4;
    const reportNum = await Bao_cao.count({
      where:{
        tinh_trang: 1
      }
    });
    console.log(reportNum);
    return {
      pages: Math.ceil(reportNum/reportPerPage),
      offset: (reportPerPage*currentPage)-reportPerPage,
      limit: reportPerPage,
      reportNum: reportNum
    }
  } catch (e) {
    console.log(e);
  }
}
