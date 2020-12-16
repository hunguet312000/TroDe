const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();
const url = require("url");
const Sequelize = require("sequelize");
const keywords_dict = require("../public/js/keywords_dict.js");
const { sequelizeInit, Nguoi_dung, Phong_tro, Hinh_anh, Tien_ich, Binh_luan, Danh_sach_yeu_thich, Lich_hen } = require("../config/sequelize");
const Op = require('sequelize').Op
const bookingManage = require("./bookingManage");
const paginate = require("./paginate");
const userProfileManage = require("./userProfileManage");

exports.savePosts = async(req, res) => {
    //console.log(req.body);
    if (req.isAuthenticated()) {
      try {
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
            khong_hut_thuoc: req.body.khong_hut_thuoc,
            khong_thu_cung: req.body.khong_thu_cung,
            quy_dinh_khac: req.body.quy_dinh_khac,
            thong_tin_khac: req.body.thong_tin_khac,
            nguoi_lon: req.body.nguoi_lon,
            tre_em: req.body.tre_em,
            tre_nho: req.body.tre_nho,
            tong_so_nguoi: parseInt(req.body.tong_so_nguoi),
            gia_phong: parseInt(req.body.gia_phong.replace(/,/g, '')),
            thoi_gian_dang: new Date(),
            path_anh_noi_bat: insert_hinh_anh_values[0].path_anh,
            luot_thich : 0,
            luot_binh_luan : 0,
            luot_xem : 0
        }

        var tiennghi = {
            wifi: req.body.wifi,
            internet: req.body.internet,
            dieu_hoa: req.body.dieu_hoa,
            tv: req.body.tv,
            quat: req.body.quat,
            nong_lanh: req.body.nong_lanh,
            may_giat: req.body.may_giat,
            tu_lanh: req.body.tu_lanh,
            gia_phoi_quan_ao: req.body.gia_phoi_quan_ao,
            cua_so: req.body.cua_so,
            ban_cong: req.body.ban_cong,
            tu_quan_ao: req.body.tu_quan_ao,
            coi_bao_chay: req.body.coi_bao_chay,
            binh_chua_chay: req.body.binh_chua_chay,
            thang_may: req.body.thang_may,
            thang_bo: req.body.thang_bo,
            cho_do_rac: req.body.cho_do_rac,
            cho_de_xe: req.body.cho_de_xe,
        };
        //console.log(req.user)

            const phong_tro = await Phong_tro.create(phongtro);
            tiennghi.id_phong_tro = phong_tro.id_phong_tro;
            const tien_ich = await Tien_ich.create(tiennghi);
            insert_hinh_anh_values = insert_hinh_anh_values.slice(1, insert_hinh_anh_values.length);
            insert_hinh_anh_values.forEach(function(value) {
                    value.id_phong_tro = phong_tro.id_phong_tro
                })
                //console.log(insert_hinh_anh_values);
            const hinh_anh = await Hinh_anh.bulkCreate(insert_hinh_anh_values);
            res.redirect("/");
        } catch (err) {
            console.log(err);
        }
    } else { res.redirect('/login') }
}

exports.filterListPostByType = async(req, res) => {
    res.redirect(url.format({
        pathname: req.url,
        query: req.body,
    }))
}
exports.filterListPostByNumOfPeopleOrPrice = async(req, res) => {
    console.log("OLALA: " + req.url);
    res.redirect(url.format({
        pathname: req.url,
        query: req.body,
    }))
}
exports.filterListPostBySearch = async(req, res) => {
    req.query.order = req.body.sort;
    res.redirect(url.format({
        pathname : req.url.split("?")[0],
        query: req.query
    }))
}

exports.displayListPost = async(req, res) => {
    const rType = req.params.type;
    const current = req.params.page;
    try {
        let type = ""
        let district = "";
        let area = []
        let order;
        if (JSON.stringify(req.query) == "{}") {
            order = ["id_phong_tro", "DESC"]
        } else if (Object.values(req.query)[0] == "PRICE-ESC") {
            order = ["gia_phong"]
        } else if (Object.values(req.query)[0] == "PRICE-DESC") {
            order = ["gia_phong", "DESC"]
        } else if(Object.values(req.query)[0] == "LIKE") {
            order = ["luot_thich", "DESC"]
        } else if(Object.values(req.query)[0] == "VIEW") {
            order = ["luot_xem", "DESC"]
        } else if (Object.values(req.query)[0] == "COMMENT") {
            order = ["luot_binh_luan", "DESC"]
        }
        switch (rType) {
            case "phong_tro":
                type = "Phòng trọ";
                break;
            case "chung_cu":
                type = "Chung cư";
                break;
            case "quan_cau_giay":
                district = "Quận Cầu Giấy";
                break;
            case "quan_ba_dinh":
                district = "Quận Ba Đình";
                break;
            case "quan_bac_tu_liem":
                district = "Quận Bắc Từ Liêm";
                break;
            case "quan_dong_da":
                district = "Quận Đống Đa";
                break;
            case "quan_hai_ba_trung":
                district = "Quận Hai Bà Trưng";
                break;
            case "quan_ha_dong":
                district = "Quận Hà Đông";
                break;
            case "quan_hoang_mai":
                district = "Quận Hoàng Mai";
                break;
            case "quan_hoan_kiem":
                district = "Quận Hoàn Kiếm";
                break;
            case "quan_long_bien":
                district = "Quận Long Biên";
                break;
            case "quan_nam_tu_liem":
                district = "Quận Nam Từ Liêm";
                break;
            case "quan_tay_ho":
                district = "Quận Tây Hồ";
                break;
            case "quan_thanh_xuan":
                district = "Quận Thanh Xuân";
                break;
            case "KV_bach_kinh_xay":
                area = ["Quận Hai Bà Trưng"];
                break;
            case "KV_DH_quoc_gia_HN":
                area = ["Quận Cầu Giấy", "Quận Đống Đa"];
                break;
            case "KV_HV_tai_chinh":
                area = ["Quận Cầu Giấy", "Quận Bắc Từ Liêm"];
                break;
            case "KV_HV_BC_VT":
                area = ["Quận Hà Đông", 'Quận Thanh Xuân'];
                break;
            case "KV_DH_Y_HN":
                area = ["Quận Đống Đa", "Quận Hai Bà Trưng"];
                break;
            case "KV_DH_nong_nghiep":
                area = ["Quận Long Biên"];
                break;
            default:
                type = ""
                district = "";
                area = [""];
        }
        const bookedUserList = await bookingManage.getBookedUser();
        const calculatePagniate = await paginate.calculateRoomsPages(req, res, type, district, area);

        const phong_tro = await Phong_tro.findAll({
            offset: calculatePagniate.offset,
            limit: calculatePagniate.limit,
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
            }],
            order: [
                order
            ]
        });
        //console.log(rType);
        res.render("rooms", {
            user: req.user,
            userData: phong_tro,
            type: "/rooms/" + rType,
            login: req.isAuthenticated(),
            bookedUserList: bookedUserList,
            pages: calculatePagniate.pages,
            current:  req.params.page,
            page : "/" + req.params.page + "/",
            roomsNum: calculatePagniate.roomsNum
        })
    } catch (err) {
        console.log(err);
    }
}

exports.displayPostByNumOfPeopleOrPrice = async(req, res) => {
     try {
        let type = (req.params.type == "phong_tro") ? "Phòng trọ" : "Chung cư";
        let tong_so_nguoi = "";
        let gia_tien = [undefined, undefined]
        let quan_huyen = ""
        let order;
        if (JSON.stringify(req.query) == "{}") {
            order = ["id_phong_tro", "DESC"]
        } else if (Object.values(req.query)[0] == "PRICE-ESC") {
            order = ["gia_phong"]
        } else if (Object.values(req.query)[0] == "PRICE-DESC") {
            order = ["gia_phong", "DESC"]
        } else if(Object.values(req.query)[0] == "LIKE") {
            order = ["luot_thich", "DESC"]
        } else if(Object.values(req.query)[0] == "VIEW") {
            order = ["luot_xem", "DESC"]
        } else if (Object.values(req.query)[0] == "COMMENT") {
            order = ["luot_binh_luan", "DESC"]
        }
        switch (req.params.option) {
            case "1_nguoi":
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
            case "gia_re":
                gia_tien = (req.params.type == "phong_tro") ? [1000000, 4000000] : [2000000, 4000000];
                break;
            case "gia_trung":
                gia_tien = (req.params.type == "phong_tro") ? [4000000, 6000000] : [4000000, 7000000];
                break;
            case "quan_cau_giay":
                quan_huyen = "Quận Cầu Giấy";
                break;
            case "quan_ba_dinh":
                quan_huyen = "Quận Ba Đình";
                break;
            case "quan_bac_tu_liem":
                quan_huyen = "Quận Bắc Từ Liêm";
                break;
            case "quan_dong_da":
                quan_huyen = "Quận Đống Đa";
                break;
            case "quan_hai_ba_trung":
                quan_huyen = "Quận Hai Bà Trưng";
                break;
            case "quan_ha_dong":
                quan_huyen = "Quận Hà Đông";
                break;
            case "quan_hoang_mai":
                quan_huyen = "Quận Hoàng Mai";
                break;
            case "quan_hoan_kiem":
                quan_huyen = "Quận Hoàn Kiếm";
                break;
            case "quan_long_bien":
                quan_huyen = "Quận Long Biên";
                break;
            case "quan_nam_tu_liem":
                quan_huyen = "Quận Nam Từ Liêm";
                break;
            case "quan_tay_ho":
                quan_huyen = "Quận Tây Hồ";
                break;
            case "quan_thanh_xuan":
                quan_huyen = "Quận Thanh Xuân";
                break;
            default:
                tong_so_nguoi = ""
                gia_tien = [undefined, undefined]
                quan_huyen = ""
        }
        const calculatePagniate = await paginate.calculateRoomsByPeopleOrPricePages(req, res, type, tong_so_nguoi, gia_tien, quan_huyen);
        //console.log(type + " " + tong_so_nguoi);
        const phong_tro = await Phong_tro.findAll({
            offset: calculatePagniate.offset,
            limit: calculatePagniate.limit,
            where: {
                [Op.and] : [
                    {phan_loai : type},
                    {[Op.or] : [
                        {tong_so_nguoi : tong_so_nguoi},
                        {gia_phong : {[Op.between] : [gia_tien[0], gia_tien[1]]}},
                        {quan_huyen : quan_huyen}
                    ]}
                ]
            },
            include: [{
                model: Nguoi_dung,
                required: true
            }],
            order: [
                order
            ]
        });
        console.log(phong_tro)
        //console.log(req.params.type + "/" + req.params.option);
        res.render("rooms", {
          user: req.user,
          login: req.isAuthenticated(),
          userData: phong_tro,
          type: "/rooms/" + req.params.type + "/" + req.params.option,
          pages: calculatePagniate.pages,
          current: req.params.page,
          page : "/" + req.params.page + "/",
          roomsNum: calculatePagniate.roomsNum
        });
    } catch (err) {
        console.log(err);
    }
}

exports.displayUserListPost = async(req, res) => {
    if (req.isAuthenticated()) {
      const calculatePagniate = await paginate.calculateListHostPages(req,res);
        try {
            const phong_tro = await Phong_tro.findAll({
                offset: calculatePagniate.offset,
                limit: calculatePagniate.limit,
                where: {
                    id_chu_so_huu: req.user.id_nguoi_dung
                },
                order: [
                    ["id_phong_tro", "DESC"]
                ]
            });
            //console.log("alo")
            res.render('user-list-host', {
              user: req.user,
              userData: phong_tro,
              pages: calculatePagniate.pages,
              current: req.params.page,
              postNum: calculatePagniate.postNum,
              type: "/list-host",
              });
        } catch (err) {
            console.log(err);
        }
    } else { res.redirect("/login") }
}

exports.displayPostProfile = async(req, res) => {
    try {
        const phong_tro = await Phong_tro.findAll({
            where: {
                id_phong_tro: req.params.id
            },
            include: [{
                model: Nguoi_dung,
                required: true
            }],
        });
        const hinh_anh = await Hinh_anh.findAll({
            where: {
                id_phong_tro: req.params.id
            },
        });
        const tien_ich = await Tien_ich.findAll({
            where: {
                id_phong_tro: req.params.id
            },
        });
        const binh_luan = await Binh_luan.findAll({
            include: Nguoi_dung,
            where: {
                id_phong_tro: req.params.id
            }
        });
        const updateNumviewPage = await Phong_tro.increment("luot_xem", {where : {id_phong_tro : req.params.id}})
        console.log(binh_luan)
        let userData = {};
        userData.binh_luan = [];
        const present_date = new Date();
        for (let b of binh_luan) {
            //console.log(JSON.stringify(present_date + " " +b.dataValues.createdAt, null, 2));
            const timeDiff = Math.round((present_date.getTime() - b.dataValues.createdAt.getTime()) / (1000 * 3600));
            userData.binh_luan.push({
                id_nguoi_binh_luan: b.dataValues.nguoi_dung.dataValues.id_nguoi_dung,
                ten_nguoi_binh_luan: b.dataValues.nguoi_dung.dataValues.ten_nguoi_dung,
                id_phong_tro: b.dataValues.id_phong_tro,
                avatar_path : b.dataValues.nguoi_dung.dataValues.avatar_path,
                id_binh_luan: b.dataValues.id_binh_luan,
                noi_dung: b.dataValues.noi_dung,
                rating: b.dataValues.rating,
                hinh_anh: b.dataValues.hinh_anh,
                thoi_gian_dang: timeDiff,
                lan_cuoi_chinh_sua: b.dataValues.updatedAt
            });
        }
        console.log(userData.binh_luan)
        userData.phong_tro = phong_tro;
        userData.tien_ich = tien_ich;
        userData.hinh_anh = hinh_anh;
        const bookedUserList = await bookingManage.getBookedUser();
        let isInWishList = null;
        if(req.isAuthenticated()){
          isInWishList = await userProfileManage.isInWishList(req.params.id, req.session.passport.user.id_nguoi_dung);
        }
        // if (req.isAuthenticated()) {
        //     res.render("user-room", { user: req.user, userData: userData });
        // } else { res.render("guest-room", { user: "", userData: userData }); };
        res.render("room", {
          user: req.user,
          userData: userData,
          login: req.isAuthenticated(),
          bookedUserList: bookedUserList,
          isInWishList: isInWishList,
        })
    } catch (err) {
        console.log(err);
    }
}

exports.saveComment = async(req, res) => {
    const binh_luan_moi = {
        rating: req.body.rating,
        noi_dung: req.body.nd_binh_luan,
        id_phong_tro: req.body.id_phong_tro,
        id_nguoi_binh_luan: req.session.passport.user.id_nguoi_dung,
    }
    try {
        const binh_luan = await Binh_luan.create(binh_luan_moi);
        const updateCommentNum = await Phong_tro.increment("luot_binh_luan", {where : {id_phong_tro : req.body.id_phong_tro}})
        const danh_gia_phong_tro = await Binh_luan.findOne({
            where: { id_phong_tro : req.body.id_phong_tro },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'danh_gia'],
            ],
            raw: true,
            group: ['id_phong_tro'],
        })
        const updateAvgRate = Phong_tro.update(
        { danh_gia : parseFloat(danh_gia_phong_tro.danh_gia).toFixed(1)},
        { where: {id_phong_tro : req.body.id_phong_tro }})
        res.redirect("/room/" + req.body.id_phong_tro);
    } catch (err) {
        console.log(err);
    }
}

exports.saveFavPost = async(req, res) => {
    const id_phong_tro = req.body.addFav_id_phong_tro;
    const id_nguoi_dung = req.body.addFav_id_nguoi_dung;
    try {
        const addFav = await Danh_sach_yeu_thich.create({
            id_phong_tro: id_phong_tro,
            id_nguoi_dung: id_nguoi_dung
        })
        const updateLikeNum = await Phong_tro.increment("luot_thich", { where : {id_phong_tro :req.body.addFav_id_nguoi_dung}})
        res.redirect("/room/" + id_phong_tro);
    } catch (err) {
        //console.log("loi me r");
        res.redirect("/room/" + id_phong_tro);
    }
}

exports.getPostInfo = async(id) => {
    try {
        const phong_tro = await Phong_tro.findAll({
            include: [
              {
                  model: Tien_ich,
                  required: true
              },
              {
                  model: Hinh_anh,
                  required: true
              },
            ],
            where: {
                id_phong_tro: id
            }
        });
        //console.log("ALO: " + JSON.stringify(phong_tro,null,4));
        return phong_tro;
    } catch (err) {
        console.log(err);
    }
}

exports.deletePost = async(req, res) => {
    console.log(req.body);
    try {
        const phong_tro = await Phong_tro.destroy({
            where: {
                id_phong_tro: req.params.id
            }
        });
        visitCounter.clearLog("/room/" + req.url.slice(req.url.length - 1));
        res.redirect("/list-host/1");
    } catch (err) {
        console.log(err);
    }
}

exports.search = async(req, res) => {
    //console.log(req.body)
    req.body.order = "";
    //console.log(req.body.search);
    let search = req.body.search.toLowerCase(); //search value
    search = search.replace(/\s\s+/g, ' '); //delete multiple spaces
    search = keywords_dict.convertStr(search);
    res.redirect("/search/" + search + "/1");
}

exports.displayListPostBySearch = async(req, res) => { // search by phan_loai, quan_huyen, tong_songuoi, phuong_xa, cao cap, re, gia re
    try {
        //console.log(req.query);
        //console.log(req.params.keyword);
        if(req.params.keyword != "") {
            const url = req.url;
            // let search = req.query.search.toLowerCase(); //search value
            // search = search.replace(/\s\s+/g, ' '); //delete multiple spaces
            search = keywords_dict.convertStr(req.params.keyword);
            //console.log(search);
            const result = {
                'phan_loai': "",
                'quan_huyen': "",
                'phuong_xa': "",
                'tong_so_nguoi': "",
                'gia_phong': [0, 999999999]
            }

            var phan_loai_keyword;
            var quan_huyen_keyword;
            var phuong_xa_keyword;
            var gia_phong_keyword;
            //get keywordd phan loai
            keywords_dict.keywords_dict.phan_loai.forEach(function(phan_loai) {
                    phan_loai_keyword = new RegExp(keywords_dict.convertStr(phan_loai), "i");
                    if (search.match(phan_loai_keyword)) {
                        result.phan_loai = phan_loai;
                        return true;
                    }
                })
                //get keyword quan huyen phuong xa
            Object.keys(keywords_dict.keywords_dict.quan_huyen_phuong_xa).forEach(quan_huyen => {
                quan_huyen_keyword = new RegExp(keywords_dict.convertStr(quan_huyen), "i");
                if (search.match(quan_huyen_keyword)) { result.quan_huyen = quan_huyen };
                keywords_dict.keywords_dict.quan_huyen_phuong_xa[quan_huyen].forEach(function(phuong_xa) {
                    phuong_xa_keyword = new RegExp(keywords_dict.convertStr(phuong_xa), "i");
                    if (search.match(phuong_xa_keyword)) { result.phuong_xa = phuong_xa }
                })
            })


            //get keyword gia phong
            Object.keys(keywords_dict.keywords_dict.gia_tien).forEach(gia => {
                gia_phong_keyword = new RegExp(keywords_dict.convertStr(gia), "i");
                if (search.match(gia_phong_keyword)) {

                    result.gia_phong[0] = keywords_dict.keywords_dict.gia_tien[gia][0];
                    result.gia_phong[1] = keywords_dict.keywords_dict.gia_tien[gia][1];
                    //console.log(keywords_dict.keywords_dict.gia_tien[gia])
                }
            })

            // get keyword tong_so_nguoi
            var reg1 = /[+-]?\d+(?:\.\d+)?/g; //get number
            var reg2;
            if (search.match(reg1)) {
                reg2 = new RegExp(search.match(reg1)[0] + " nguoi", "i")
                if (search.match(reg2)) {
                    result.tong_so_nguoi = search.match(reg2)[0].match(reg1)[0];
                }
            }

            //check having keyword -> no result
            if (JSON.stringify(result) == JSON.stringify({
                    'phan_loai': "",
                    'quan_huyen': "",
                    'phuong_xa': "",
                    'tong_so_nguoi': "",
                    'gia_phong': [0, 999999999]
                })) {
                result.phan_loai = null,
                    result.quan_huyen = null,
                    result.phuong_xa = null,
                    result.tong_so_nguoi = null,
                    result.gia_phong = [null, null]
            }
            //console.log(result);

            //filter order esc/desc,...
            //console.log(req.query)
            let order = ["id_phong_tro", "DESC"];
            if (req.query.order == "PRICE-ESC") {
                order = ["gia_phong"]
            } else if (req.query.order == "PRICE-DESC") {
                order = ["gia_phong", "DESC"]
            } else if(req.query.order == "LIKE") {
                order = ["luot_thich", "DESC"]
            } else if(req.query.order == "VIEW") {
                order = ["luot_xem", "DESC"]
            } else if (req.query.order == "COMMENT") {
                order = ["luot_binh_luan", "DESC"]
            }
            const calculatePagniate = await paginate.calculateSearchPages(req, res, result);
            let phong_tro = await Phong_tro.findAll({
                    offset: calculatePagniate.offset,
                    limit: calculatePagniate.limit,
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
                    },
                    order: [order]
                })
                //console.log();
                let newUrl;
                let criteria='';
                let tmp = url.indexOf("?");
                if(tmp != -1){
                  newUrl = url.substr(0,tmp-2);
                  criteria = url.substr(tmp, url.length);
                }else{
                  newUrl = url.substr(0,url.length-2)
                }
                console.log(criteria);
                console.log("New url: " + newUrl);
                //console.log(url.substr(0,url.length-2));
            res.render("rooms", {
                user: req.user,
                login: req.isAuthenticated(),
                userData: phong_tro,
                type: newUrl,
                pages: calculatePagniate.pages,
                current: req.params.page,
                page : req.params.page,
                criteria: criteria,
                roomsNum: calculatePagniate.roomsNum,
            });
        } else {res.redirect("/")}

    } catch (err) {
        console.log(err);
    }
}
