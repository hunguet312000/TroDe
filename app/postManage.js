const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const {sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich} = require("../config/sequelize");
const Op = require('Sequelize').Op
exports.savePosts = async(req, res) => {
    if(req.isAuthenticated()){
        const uploader = async(path) => await cloudinary.uploads(path, 'Image');
        let insert_hinh_anh_values = []
        let files = req.files;
        for (const file of files) {
            const {
                path
            } = file
            const newPath = await uploader(path)
            insert_hinh_anh_values.push(newPath);
            //fs.unlinkSync(path);
        }
        
        let phongtro = {
            id_chu_so_huu: req.user.id_nguoi_dung,
            phan_loai: req.body.phan_loai,
            ten_phong: req.body.ten_phong,
            hinh_thuc_thue: req.body.hinh_thuc_thue,
            phan_loai_khac: req.body.phan_loai_khac,
            thanh_pho: req.body.thanh_pho,
            quan_huyen: req.body.quan_huyen,
            phuong_xa: req.body.phuong_xa,
            dia_chi_cu_the: req.body.dia_chi_cu_the,
            dien_tich: req.body.dien_tich,
            phong_ngu: req.body.phong_ngu,
            phong_tam: req.body.phong_tam,
            phong_khach: req.body.phong_khach,
            phong_bep: req.body.phong_bep,
            khong_lam_on: req.body.khong_lam_on,
            khong_hut_thuoc:req.body.khong_hut_thuoc,
            khong_thu_cung: req.body.khong_thu_cung,
            quy_dinh_khac:req.body.quy_dinh_khac,
            thong_tin_khac: req.body.thong_tin_khac,
            nguoi_lon: req.body.nguoi_lon,
            tre_em: req.body.tre_em,
            tre_nho: req.body.tre_nho,
            tong_so_nguoi:parseInt(req.body.tong_so_nguoi),
            gia_phong: parseInt(req.body.gia_phong),
            thoi_gian_dang: new Date(),
            path_anh_noi_bat : insert_hinh_anh_values[0].path_anh
        }

        var tiennghi ={
            wifi: req.body.wifi,
            internet: req.body.internet,
            dieu_hoa: req.body.dieu_hoa,
            tv: req.body.tv,
            quat: req.body.quat,
            nong_lanh: req.body.nong_lanh,
            may_giat:req.body.may_giat,
            tu_lanh: req.body.tu_lanh,
            gia_phoi_quan_ao: req.body.gia_phoi_quan_ao,
            cua_so: req.body.cua_so,
            ban_cong: req.body.ban_cong,
            tu_quan_ao: req.body.tu_quan_ao,
            coi_bao_chay: req.body.coi_bao_chay,
            binh_chua_chay: req.body.binh_chua_chay,
            thang_may:req.body.thang_may,
            thang_bo: req.body.thang_bo,
            cho_do_rac: req.body.cho_do_rac,
            cho_de_xe: req.body.cho_de_xe,
        };
        console.log(req.user)
        try{
            const phong_tro = await Phong_tro.create(phongtro);
            tiennghi.id_phong_tro = phong_tro.id_phong_tro;
            const tien_ich = await Tien_ich.create(tiennghi);
            insert_hinh_anh_values = insert_hinh_anh_values.slice(1, insert_hinh_anh_values.length);
            insert_hinh_anh_values.forEach(function(value) {
                value.id_phong_tro = phong_tro.id_phong_tro
            })
            console.log(insert_hinh_anh_values);
            const hinh_anh = await Hinh_anh.bulkCreate(insert_hinh_anh_values);
            res.redirect("/");
        }catch(err){
            console.log(err);
        }
    }
    else {res.redirect('/login')}
}

exports.displayListPost = async(req, res) => {
    try {
        let type = ""
        let district = "";
        let area =  []
        switch (req.params.type) {
            case "phong_tro":           type = "Phòng trọ";           break;
            case "chung_cu":            type = "Chung cư";            break;
            case "quan_cau_giay":            district = "Quận Cầu Giấy";       break;
            case "quan_ba_dinh":        district = "Quận Ba Đình";        break;
            case "quan_bac_tu_liem":    district = "Quận Bắc Từ Liêm";    break;
            case "quan_dong_da":        district = "Quận Đống Đa";        break;
            case "quan_hai_ba_trung":   district = "Quận Hai Bà Trưng";   break;
            case "quan_ha_dong":        district = "Quận Hà Đông";        break;
            case "quan_hoang_mai":      district = "Quận Hoàng Mai";      break;
            case "quan_hoan_kiem":      district = "Quận Hoàn Kiếm";      break;
            case "quan_long_bien":      district = "Quận Long Biên";      break;
            case "quan_nam_tu_liem":    district = "Quận Nam Từ Liêm";    break;
            case "quan_tay_ho":         district = "Quận Tây Hồ";         break;
            case "quan_thanh_xuan":     district = "Quận Thanh Xuân";     break;
            case "KV_bach_kinh_xay":    area = ["Quận Hai Bà Trưng"];   break;
            case "KV_DH_quoc_gia_HN":   area = ["Quận Cầu Giấy" , "Quận Đống Đa"];    break;
            case "KV_HV_tai_chinh":     area = ["Quận Cầu Giấy", "Quận Bắc Từ Liêm"]; break;
            case "KV_HV_BC_VT":         area = ["Quận Hà Đông", 'Quận Thanh Xuân'];   break;
            case "KV_DH_Y_HN":          area = ["Quận Đống Đa", "Quận Hai Bà Trưng"]; break;
            case "KV_DH_nong_nghiep":   area = ["Quận Long Biên"];                    break;
            default:
                type = ""
                district = "";
                area = [""];
        }
        console.log(area);
        const phong_tro = await Phong_tro.findAll({
            where : {[Op.or]: [
                {
                    phan_loai: type
                },
                {
                    quan_huyen: district
                },
                {
                    quan_huyen : {
                        [Op.or] : area
                    }
                }
            ]},
            include: [{
                model: Nguoi_dung,
                required: true
            }], 
            order : [["id_phong_tro", "DESC"]]
        });
        if (req.isAuthenticated()) {
               res.render("user-product-grid", { user: req.user, userData : phong_tro});
        } else { res.render("guest-product-grid", {userData:phong_tro}); }
    }catch (err) {
        console.log(err);
    }
}

exports.displayPostByNumOfPeopleOrPrice = async(req, res) => {
    try {
        let type = (req.params.type == "phong_tro") ? "Phòng trọ" : "Chung cư";
        let tong_so_nguoi = "";
        let gia_tien = [undefined, undefined]
        switch(req.params.option){
                case "1_nguoi" :
                    tong_so_nguoi = "1"
                    break;
                case "2_nguoi":
                    tong_so_nguoi = "2";
                    break;
                case "3_nguoi":
                    tong_so_nguoi = "3"
                    break;
                case "4_nguoi":
                    tong_so_nguoi = "4"
                    break
                case "gia_re" :
                    gia_tien = (req.params.type == "phong_tro") ? [1000000, 4000000] : [2000000, 4000000];
                    break;
                case "gia_trung" : 
                    gia_tien = (req.params.type == "phong_tro") ? [4000000, 6000000] : [4000000, 7000000];
                    break;
                default:
                    tong_so_nguoi = ""
                    gia_tien = [undefined, undefined]
            }
            const phong_tro = await Phong_tro.findAll({
            where : {[Op.or]: [
                {
                    phan_loai: type,
                    tong_so_nguoi : tong_so_nguoi
                },
                {
                    phan_loai : type,
                    gia_phong: {[Op.between] : [gia_tien[0], gia_tien[1]]}
                },
                ]},
                include: [{
                    model: Nguoi_dung,
                    required: true
                }], 
                order : [["id_phong_tro", "DESC"]]
            });
            if (req.isAuthenticated()) {
               res.render("user-product-grid", { user: req.user, userData : phong_tro});
            } else { res.render("guest-product-grid", {userData:phong_tro})}
    }catch(err) {
        console.log(err);
    }
}

exports.displayUserListPost = async(req, res) => {
    if(req.isAuthenticated()) {
        try {
            const phong_tro = await Phong_tro.findAll({
                where : {
                    id_chu_so_huu : req.user.id_nguoi_dung
                },
                order : [["id_phong_tro", "DESC"]]
            });
            res.render('user-list-host', { user: req.user, userData:phong_tro });
        }catch(err) {
            console.log(err);
        }
    }
    else {res.redirect("/login")}
}

exports.displayPostProfile = async(req, res) => {
    try{
        const phong_tro = await Phong_tro.findAll({
            where : {
                id_phong_tro : req.params.id
            },
            include: [{
                model: Nguoi_dung,
                required: true
            }], 
        });
        const hinh_anh = await Hinh_anh.findAll({
            where : {
                id_phong_tro : req.params.id
            },
        });
        const tien_ich = await Tien_ich.findAll({
            where : {
                id_phong_tro : req.params.id
            },
        });
        let userData = {};
        userData.phong_tro = phong_tro;
        userData.tien_ich = tien_ich;
        userData.hinh_anh = hinh_anh;
        if (req.isAuthenticated()) {
             res.render("user-room", { user: req.user, userData : userData});
        } else {   res.render("guest-room", {userData : userData}); };
    }catch(err) {
        console.log(err);
    }
}