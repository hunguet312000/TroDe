const async = require('async')
require('dotenv').config();
const { QueryTypes } = require('sequelize');
const url = require("url")
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, sequelize} = require("../config/sequelize");
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
                })
            }
            //console.log(nguoi_dung)
            res.render("admin-control-user", {
              username: req.user.ten_nguoi_dung,
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

exports.searchUser = async(req, res) => {
    res.redirect(url.format({
        pathname: req.url,
        query: req.body,
    }))
}