const async = require('async')
require('dotenv').config();
const { QueryTypes } = require('sequelize');
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, sequelize} = require("../config/sequelize");
const Op = require('Sequelize').Op
const paginate = require("./paginate");

exports.displayListUser = async(req, res) =>{
    if (req.isAuthenticated()) {
        const calculatePagniate = await paginate.calculateAdminUserListPages(req, res);
        try{
            const nguoi_dung = await Nguoi_dung.findAll({
                offset: calculatePagniate.offset,
                limit: calculatePagniate.limit,
                order: [
                    ["id_nguoi_dung", "DESC"]
                ]
            });
            //console.log(nguoi_dung)
            res.render("admin-control-user", {
              user: req.user,
              userData : nguoi_dung,
              type: "/admin-control-user",
              pages: calculatePagniate.pages,
              current: req.params.page,
              userNum: calculatePagniate.userNum
            });
        }catch(err) {
            console.log(err)
        }
    } else {
          res.redirect('/login');
    }
}

exports.adminDeleteUser = async(req, res) =>{
  try {
      const deletedUser = await Nguoi_dung.destroy({
        where:{
          id_nguoi_dung: req.params.id
        }
      });
      res.redirect(req.get('referer'));
  } catch (e) {
      console.log(e);
  }
}
