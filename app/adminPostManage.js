const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen, Quan_tri_vien } = require("../config/sequelize");
const Op = require('sequelize').Op
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
            const admin = await Quan_tri_vien.findAll({
                where:{
                  id_nguoi_dung: req.user.id_nguoi_dung
                },
                include:[
                  {
                    model: Nguoi_dung,
                    require: true
                  }
                ]
            });
            //console.log(phong_tro)
            res.render("admin-control-post", {
              user: admin[0],
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
        res.redirect('/admin-login');
    }
}

exports.adminDeletePost = async (req, res) =>{
  try {
      console.log(req.user.id_nguoi_dung);
      const deletedPostNum = await Quan_tri_vien.increment(
        { bai_dang_da_xoa: 1 },
        {where:{
            id_nguoi_dung: req.user.id_nguoi_dung
          }
        }
      );
      console.log(JSON.stringify(deletedPostNum,null,4));
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
