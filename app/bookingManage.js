const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const paginate = require("./paginate");

exports.booking = async(req, res) => {
    //console.log(req.body);
    const bookerName = req.body.bookerName;
    const bookerPhone = req.body.phone;
    const bookerEmail = req.body.email;
    const bookerId = req.body.bookerId;
    const phongTroId = req.body.phongTroId;
    const bookDate = req.body.bookDate;
    try {
        const lichHen = await Lich_hen.create({
            id_nguoi_hen: bookerId,
            id_phong_tro: phongTroId,
            thoi_gian: bookDate
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'trodehn@gmail.com',
                pass: 'trode10000'
            }
        });

        const mailOptions = {
            from: 'trodehn@gmail.com',
            to: bookerEmail,
            subject: 'Thư xác nhận lịch hẹn của TroDe',
            html: "<p>Bạn đã đặt lịch lúc " + bookDate + " với chủ nhà. " +
                "Cuộc hẹn này đang đợi phê duyệt. Nếu đặt lịch thành công, chúng tôi sẽ thông báo cho bạn</p>"
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.render("user-confirm-checkout", { user: req.session.passport.user });
    } catch (err) {
        console.log(err);
    }
}

exports.bookedList = async(req, res) => {
    if (req.isAuthenticated()) {
        const user = req.session.passport.user;
        const calculatePaginate = await paginate.calculateBookedPages(req, res);
        const bookedList = await Lich_hen.findAll({
            offset: calculatePaginate.offset,
            limit: calculatePaginate.limit,
            where: {
              [Op.and]: [
                {id_nguoi_hen: user.id_nguoi_dung},
                {tinh_trang: null}
              ]
            },
            include: [
              {
                model: Phong_tro,
                required: true,
                include: {model: Nguoi_dung, required: true}
              }
            ],
            order: [
              ["id_buoi_hen", "DESC"]
            ]
        });
        //console.log(bookedList[0].dataValues.phong_tro.dataValues.nguoi_dung.sdt);
        res.render("user-booked-list", {
            user: user,
            bookedList: bookedList,
            pages: calculatePaginate.pages,
            bookedNum: calculatePaginate.bookedNum,
            current: req.params.page,
            type: '/booked-list'
        });
    } else {
        res.redirect('/login');
    }
}

exports.bookedListStatus = async(req, res) => {
  var tinh_trang;
  if(req.params.status === "accepted"){
    tinh_trang = 1
  }else{
    tinh_trang = 0
  }
  //console.log(req.params.status);
  const user = req.session.passport.user;
  const calculatePaginate = await paginate.calculateBookedStatusPages(req, res, tinh_trang);
  try {
      const bookedList = await Lich_hen.findAll({
          offset: calculatePaginate.offset,
          limit: calculatePaginate.limit,
          include: {
              model: Phong_tro,
              required: true,
              include: {model: Nguoi_dung, required: true}
          },
          where:{
            [Op.and]: [
              {id_nguoi_hen: user.id_nguoi_dung},
              {tinh_trang: tinh_trang}
            ]
          },
          order: [
            ["id_buoi_hen", "DESC"]
          ]
      });
      //console.log(bookedList);
      if (tinh_trang === 1){
        res.render("user-booked-list-accepted", {
          user: req.session.passport.user,
          bookedList: bookedList,
          pages: calculatePaginate.pages,
          bookedStatusNum: calculatePaginate.bookedStatusNum,
          current: req.params.page,
          type: '/booked-list/accepted'
        })
      }else{
        res.render("user-booked-list-denied", {
          user: req.session.passport.user,
          bookedList: bookedList,
          pages: calculatePaginate.pages,
          bookedStatusNum: calculatePaginate.bookedStatusNum,
          current: req.params.page,
          type: '/booked-list/denied'
        })
      }
  } catch (e) {
      console.log(e);
  }
}

exports.awaitBooking = async(req, res) => {
    if (req.isAuthenticated()) {
        const user = req.session.passport.user;
        const calculatePaginate = await paginate.calculateBookingPages(req, res);
        try {
            const awaitList = await Lich_hen.findAll({
                offset: calculatePaginate.offset,
                limit: calculatePaginate.limit,
                include: [
                  {
                    model: Phong_tro,
                    required: true,
                    where: {
                        id_chu_so_huu: {
                            [Op.like]: user.id_nguoi_dung
                        }
                    }
                  },
                  {
                    model: Nguoi_dung,
                    required: true,
                  }
              ],
                where: {
                    tinh_trang: null
                }
            });
            //console.log(awaitList[0].dataValues.nguoi_dung.sdt);
            res.render("user-await-bookings", {
                user: user,
                awaitList: awaitList,
                pages: calculatePaginate.pages,
                bookingNum: calculatePaginate.bookingNum,
                current: req.params.page,
                type: '/await-bookings'
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.redirect('/login')
    }
}

exports.awaitBookingStatus = async(req, res) => {
  let tinh_trang;
  if(req.params.status === "accepted"){
    tinh_trang = 1
  }else{
    tinh_trang = 0
  }
  const calculatePaginate = await paginate.calculateBookingStatusPages(req, res, tinh_trang);
  try {
      const bookingList = await Lich_hen.findAll({
          offset: calculatePaginate.offset,
          limit: calculatePaginate.limit,
          include: [
            {
              model: Phong_tro,
              required: true,
              where: {
                  id_chu_so_huu: {
                      [Op.like]:  req.session.passport.user.id_nguoi_dung
                  }
              }
            },
            {
              model: Nguoi_dung,
              required: true,
            }
          ],
          where: {
              tinh_trang: tinh_trang
          }
      });
      if (tinh_trang === 1){
        res.render("user-await-bookings-accepted", {
          user: req.session.passport.user,
          bookingList: bookingList,
          pages: calculatePaginate.pages,
          bookingNum: calculatePaginate.bookingNum,
          current: req.params.page,
          type: '/await-bookings/accepted'
        })
      }else{
        res.render("user-await-bookings-denied", {
          user: req.session.passport.user,
          bookingList: bookingList,
          pages: calculatePaginate.pages,
          bookingNum: calculatePaginate.bookingNum,
          current: req.params.page,
          type: '/await-bookings/denied'
        })
      }
  } catch (e) {
      console.log(e);
  }
}

exports.bookingResponse = async(req, res) => {
    const id_buoi_hen = req.params.id;
    const response = req.params.response;
    var temp;
    if (response === 'accept') {
        temp = 1;
    } else {
        temp = 0;
    }
    try {
        const buoi_hen = await Lich_hen.update({ tinh_trang: temp }, {
            where: {
                id_buoi_hen: id_buoi_hen
            }
        })
        res.redirect('/await-bookings/1')
    } catch (err) {
        console.log(err);
    }
}

exports.checkBookStatus = async(id_buoi_hen) => {
    try {
        const book = await Lich_hen.findAll({
            where: {
                id_buoi_hen: id_buoi_hen
            }
        });
        return true;
    } catch (e) {
        return false;
    }
}

exports.getBookedUser = async() => {
    try {
        const bookedList = await Lich_hen.findAll({
            include: {
                model: Phong_tro,
                required: true,
            },
            where: {
                tinh_trang: 1
            }
        });
        var bookedUserIdList = []
        for (b of bookedList) {
            bookedUserIdList.push({
                id_nguoi_hen: b.dataValues.id_nguoi_hen,
                id_phong_tro: b.dataValues.id_phong_tro
            });
        }
        //console.log(bookedUserIdList);
        return bookedUserIdList;
    } catch (e) {
        console.log(e);
    }
}
