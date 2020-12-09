const async = require('async')
require('dotenv').config();
const url = require("url")
const { QueryTypes } = require('sequelize');
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, sequelize} = require("../config/sequelize");
const Op = require('Sequelize').Op

exports.displayListUser = async(req, res) =>{
    if (req.isAuthenticated()) {
        try{
            let nguoi_dung;
            if(JSON.stringify(req.query) == "{}"){
                const queryValue = "SELECT *, count(id_phong_tro) as so_bai_dang  FROM nguoi_dung" +
                                    " left outer join phong_tro on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung" +
                                    " group by nguoi_dung.id_nguoi_dung" +
                                    " order by nguoi_dung.id_nguoi_dung desc";
                nguoi_dung = await sequelize.query(queryValue, { type: QueryTypes.SELECT });
            } else {
                const searchUserValue = req.query.user;
                nguoi_dung = await Nguoi_dung.findAll({
                    where: {[Op.or] : [
                        {ten_nguoi_dung : {[Op.like] : "%" + searchUserValue + "%"}}, 
                        {ho_va_ten : {[Op.like] : "%" + searchUserValue + "%"}}
                    ]}
                })
            }
            res.render("admin-control-user", { username: req.user.ten_nguoi_dung, userData : nguoi_dung });
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
