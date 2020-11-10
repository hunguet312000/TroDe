const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const async = require('async')
require('dotenv').config();

exports.savePosts = async(req, res) => {
    console.log(req.body);
    console.log(req.user);
    const uploader = async(path) => await cloudinary.uploads(path, 'Image');
    let insert_hinh_anh_values = []
    let files = req.files;
    for (const file of files) {
        const {
            path
        } = file
        const newPath = await uploader(path)
        insert_hinh_anh_values.push(Object.values(newPath));
        //fs.unlinkSync(path);
    }
    dbConnection = mysql.createConnection(dbconfig);
    dbConnection.connect(function(err) {
        if (err) throw err;

        var querySearch = "SELECT * from nguoi_dung WHERE ten_nguoi_dung = ?";
        dbConnection.query(querySearch, [req.user.ten_nguoi_dung], function(err, rows) {
            if (err) throw err;
            let phongtro = {
                id_chu_so_huu: rows[0].id_nguoi_dung,
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
            }

            let tiennghi ={
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
            var insertQuery = "INSERT INTO phong_tro set ?";
            dbConnection.query(insertQuery, phongtro, function(err, result) {
                if (err) throw err;
                for (let i of insert_hinh_anh_values) {
                    i = i.push(result.insertId);
                }

                tiennghi.id_phong_tro = result.insertId;
                dbConnection.query("INSERT INTO tien_ich_tien_nghi set ?",tiennghi, function(err, result) {
                      if (err) throw err;
                      console.log("insert tiennghi success!")
                  });

                dbConnection.query("INSERT INTO hinh_anh (path_anh, id_anh, id_phong_tro) values ?", [insert_hinh_anh_values], function(err, rows) {
                    if (err) throw err;
                    console.log("insert success!")
                    res.redirect('/');
                });
            });

            // dbConnection.query("SELECT id_phong_tro FROM phong_tro WHERE id_chu_so_huu = ?",[req.user.id_nguoi_dung], function(err, rows) {
            //   if (err) throw err;
            //   dbConnection.query("INSERT INTO tien_ich_tien_nghi set ?",tiennghi, function(err, result) {
            //       console.log(rows);
            //       tiennghi.insert(rows.id_phong_tro);
            //       if (err) throw err;
            //       console.log("insert tiennghi success!")
            //   });
            // });
        })
    });
}

exports.displayListPost = async(req, res) => {
    dbConnection = mysql.createConnection(dbconfig);
    dbConnection.connect(function(err) {
        if (err) throw err;
        let phan_loai;
        if(req.params.type == "phong_tro") {phan_loai = "Phòng trọ"}
        else if(req.params.type == "chung_cu") {phan_loai = "Chung cư"}
        let queryValue = 'SELECT * from phong_tro' +
            ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
            ' inner join hinh_anh on phong_tro.id_phong_tro = hinh_anh.id_phong_tro' +
            ' WHERE phong_tro.phan_loai = ?'
            ' order by phong_tro.id_phong_tro desc';
        dbConnection.query(queryValue, [phan_loai], function(err, rows) {
            if (err) throw err;
            let obj = rows.reduce((res, curr) => {
                if (res[curr.id_phong_tro])
                    res[curr.id_phong_tro].push(curr);
                else
                    Object.assign(res, {
                        [curr.id_phong_tro]: [curr] });
                return res;
            }, {});
            let dataDisplay = []
            for (let i of Object.values(obj).reverse()) {
                dataDisplay.push(i[0]);
            }

            if (req.isAuthenticated()) {
                res.render("user-product-grid", { user: req.user, userData : dataDisplay});
            } else { res.render("guest-product-grid", {userData:dataDisplay}); }
        })
    })
}

exports.displayUserListPost = async(req, res) => {
    if (req.isAuthenticated()) {
        dbConnection = mysql.createConnection(dbconfig);
        dbConnection.connect(function(err) {
            if (err) throw err;
            let queryValue = 'SELECT phong_tro.gia_phong, phong_tro.tong_so_nguoi, phong_tro.gia_phong, phong_tro.thanh_pho, phong_tro.quan_huyen, phong_tro.phuong_xa, nguoi_dung.ten_nguoi_dung, phong_tro.dien_tich, phong_tro.hinh_thuc_thue nguoi_dung,phong_tro.phan_loai, phong_tro.thoi_gian_dang, nguoi_dung.ten_nguoi_dung, phong_tro.dia_chi_cu_the, hinh_anh.path_anh, phong_tro.id_phong_tro from phong_tro' +
                ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
                ' inner join hinh_anh on phong_tro.id_phong_tro = hinh_anh.id_phong_tro' +
                ' WHERE nguoi_dung.ten_nguoi_dung = ?'
                dbConnection.query(queryValue,[req.user.ten_nguoi_dung], function(err, rows) {
                if (err) throw err;
                let obj = rows.reduce((res, curr) => {
                    if (res[curr.id_phong_tro])
                        res[curr.id_phong_tro].push(curr);
                    else
                        Object.assign(res, {
                            [curr.id_phong_tro]: [curr] });
                    return res;
                }, {});
                let dataDisplay = []
                for (let i of Object.values(obj).reverse()) {
                    dataDisplay.push(i[0]);
                }
                res.render('user-list-host', { user: req.user, userData:dataDisplay });
            })
        })
    } else { res.redirect('/login') }
}

exports.displayPostProfile = async(req, res) => {
    var connection = mysql.createConnection(dbconfig);
    let query1 = 'SELECT * from phong_tro' +
            ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
            ' WHERE phong_tro.id_phong_tro = ?'
    var query2 = "SELECT hinh_anh.path_anh from hinh_anh " +
            " INNER JOIN phong_tro ON phong_tro.id_phong_tro = hinh_anh.id_phong_tro " +
            " WHERE phong_tro.id_phong_tro = ?"
    var query3 = "SELECT * from tien_ich_tien_nghi Where id_phong_tro = ?"
    var return_data = {};

    async.parallel([
       function(parallel_done) {
           connection.query(query1, [req.params.id], function(err, results) {
               if (err) return parallel_done(err);
               return_data.phong_tro = results;
               parallel_done();
           });
       },
       function(parallel_done) {
           connection.query(query2, [req.params.id], function(err, results) {
               if (err) return parallel_done(err);
               return_data.path_anh = results;
               parallel_done();
           });
       },
       function(parallel_done) {
           connection.query(query3, [req.params.id], function(err, results) {
               if (err) return parallel_done(err);
               return_data.tien_ich_tien_nghi = results;
               parallel_done();
           });
       }
    ], function(err) {
         if (err) console.log(err);
         connection.end();
         if (req.isAuthenticated()) {
            res.render("user-room", { user: req.user, userData : return_data});
        } else {   res.render("guest-room", {userData : return_data}); };
    });
    
}