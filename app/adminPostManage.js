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
const paginate = require("./paginate");
const userProfileManage = require("./userProfileManage");

exports.displayAllPostForAdmin = async(req, res) => {
  console.log(req.params.page);
    if (req.isAuthenticated()) {
        try {
            const calculatePagniate = await paginate.calculateAdminPostListPages(req, res);
            const phong_tro = await Phong_tro.findAll({
                offset: calculatePagniate.offset,
                limit: calculatePagniate.limit,
                include: [{
                    model: Binh_luan,
                    required: false //left join
                }],
                group: ['Phong_tro.id_phong_tro'],
                raw: true,
                order: [
                    ["id_phong_tro", "DESC"]
                ]
            });
            //console.log(phong_tro)
            res.render("admin-control-post", {
              user: req.user,
              userData: phong_tro,
              type: "/admin-control-post",
              pages: calculatePagniate.pages,
              current: req.params.page,
              postNum: calculatePagniate.postNum
            });
        } catch (err) {
            console.log(err)
        }
    } else {
        res.redirect('/login');
    }
}

exports.adminDeletePost = async (req, res) =>{
  try {
      console.log(req.params.id);
      const deletedPost = await Phong_tro.destroy({
        where: {
          id_phong_tro: req.params.id
        }
      });
      res.redirect(req.get('referer'));
  } catch (e) {
    console.log(e);
  }
}
