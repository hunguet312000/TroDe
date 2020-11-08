const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
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
                tong_so_nguoi:req.body.tong_so_nguoi,
                gia_phong: req.body.gia_phong,
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

exports.displayPostHome = async(req, res) => {
    dbConnection = mysql.createConnection(dbconfig);
    dbConnection.connect(function(err) {
        if (err) throw err;
        let queryValue = 'SELECT phong_tro.gia_phong, phong_tro.thoi_gian_dang, nguoi_dung.ten_nguoi_dung, phong_tro.dia_chi_cu_the, hinh_anh.path_anh, phong_tro.id_phong_tro from phong_tro' +
            ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
            ' inner join hinh_anh on phong_tro.id_phong_tro = hinh_anh.id_phong_tro' +
            ' order by phong_tro.id_phong_tro desc';
        dbConnection.query(queryValue, function(err, rows) {
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
            //console.log(dataDisplay);
            if (req.isAuthenticated()) {
                res.render("user-home", { username: req.user.ten_nguoi_dung, userData: dataDisplay });
            } else { res.render('guest-home', { userData: dataDisplay }) }
        })
    })
}

// dbConnection.connect(function (err) {
//   if(err) throw err;
//   let queryValue = 'SELECT phong_tro.gia_phong, phong_tro.dia_chi, hinh_anh.path_anh, phong_tro.id_phong_tro from phong_tro' +
//                       ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
//                       ' inner join hinh_anh on phong_tro.id_phong_tro = hinh_anh.id_phong_tro' +
//                       ' where ten_nguoi_dung = ?' +
//                       ' order by phong_tro.id_phong_tro ';
//   dbConnection.query(queryValue, [req.user.ten_nguoi_dung], function (err, rows) {
//     if(err) throw err;
//     let obj = rows.reduce((res, curr) =>
//     {
//         if (res[curr.id_phong_tro])
//             res[curr.id_phong_tro].push(curr);
//         else
//             Object.assign(res, {[curr.id_phong_tro]: [curr]});
//
//         return res;
//     }, {});
//     for(let i of Object.values(obj)){
//       dataDisplay.push(i[0]);
//     }
//     res.render("user-home", {username : req.user.ten_nguoi_dung, userData:dataDisplay});
//   })
// });
