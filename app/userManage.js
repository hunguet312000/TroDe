const async = require('async')
require('dotenv').config();
const { QueryTypes } = require('sequelize');
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, sequelize} = require("../config/sequelize");
const Op = require('Sequelize').Op

exports.displayListUser = async(req, res) =>{
    if (req.isAuthenticated()) {

        try{
            const queryValue = "SELECT *, count(id_phong_tro) as so_bai_dang  FROM nguoi_dung" +
                                " left outer join phong_tro on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung" +
                                " group by nguoi_dung.id_nguoi_dung" +
                                " order by nguoi_dung.id_nguoi_dung desc";
            const nguoi_dung = await sequelize.query(queryValue, { type: QueryTypes.SELECT });
            res.render("admin-control-user", { username: req.user.ten_nguoi_dung, userData : nguoi_dung });
        }catch(err) {
            console.log(err)
        }
    } else {
          res.redirect('/login');
    }
}