const async = require('async')
require('dotenv').config();
const { QueryTypes } = require('sequelize');
const url = require("url")
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Quan_tri_vien, sequelize} = require("../config/sequelize");
const Op = require('Sequelize').Op
const paginate = require("./paginate");

exports.displayListUser = async(req, res) =>{
    if (req.isAuthenticated()) {
        const calculatePagniate = await paginate.calculateAdminUserListPages(req, res);
        try{
            let nguoi_dung;
            if(JSON.stringify(req.query) == "{}"){
                nguoi_dung = await Nguoi_dung.findAll({
                    offset: calculatePagniate.offset,
                    limit: calculatePagniate.limit,
                    order: [
                        ["id_nguoi_dung", "DESC"]
                    ]
                });
            } else {
                const searchUserValue = req.query.user;
                nguoi_dung = await Nguoi_dung.findAll({
                    offset: calculatePagniate.offset,
                    limit: calculatePagniate.limit,
                    where: {[Op.or] : [
                        {ten_nguoi_dung : {[Op.like] : "%" + searchUserValue + "%"}},
                        {ho_va_ten : {[Op.like] : "%" + searchUserValue + "%"}}
                    ]}
                });
            }
            let tmp = [];
            for(nguoi of nguoi_dung){
              const postNum = await Phong_tro.count({
                  offset: calculatePagniate.offset,
                  limit: calculatePagniate.limit,
                  where: {
                    id_chu_so_huu: nguoi.dataValues.id_nguoi_dung
                  },
                  order: [
                      ["id_chu_so_huu", "DESC"]
                  ]
              });
              tmp.push(
                {
                id_nguoi_dung: nguoi.dataValues.id_nguoi_dung,
                postNum: postNum
                }
              );
            }
            // console.log(tmp);
            //console.log(postNum);
            res.render("admin-control-user", {
              user: req.user,
              userData : nguoi_dung,
              type: "/admin-control-user",
              pages: calculatePagniate.pages,
              current: req.params.page,
              userNum: calculatePagniate.userNum,
              postNum: tmp
            });
        }catch(err) {
            console.log(err)
        }
    } else {
          res.redirect('/admin-login');
    }
}
exports.adminDeleteUser = async(req, res) =>{
  try {
      const deletedUserNum = await Quan_tri_vien.increment(
        { nguoi_dung_da_xoa: 1 },
        {where:{
            id_quan_tri_vien: req.user.id_quan_tri_vien
          }
        }
      );
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

exports.searchUser = async(req, res) => {
    res.redirect(url.format({
        pathname: req.url,
        query: req.body,
    }))
}
