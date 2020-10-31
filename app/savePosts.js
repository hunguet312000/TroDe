const cloudinary = require('../config/cloudinary');
const mysql = require('mysql');
const dbconfig = require('../config/database');
require('dotenv').config();
exports.savePosts = async(req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'Image');
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
      dbConnection.query(querySearch, [req.user.ten_nguoi_dung], function (err, rows) {
        if(err) throw err;
        const price = req.body.price;
        const status = 1;
        const address = req.body.addressCity + " " + req.body.district + " " + req.body.sub_district + " " + req.body.privateAddress;
        const des = req.body.postTitle + " " + req.body.acreageRoom + "m2";
        const id_user = rows[0].id_nguoi_dung;
        var insertQuery = "INSERT INTO phong_tro(gia_phong, tinh_trang, dia_chi, mo_ta, id_chu_so_huu) values (?, ?, ?, ?, ?)";
        dbConnection.query(insertQuery, [price, status, address, des, id_user], function (err, result) {
          if (err) throw err;
          for(let i of insert_hinh_anh_values) {
            i = i.push(result.insertId);
          }
          dbConnection.query("INSERT INTO hinh_anh (path_anh, id_anh, id_phong_tro) values ?", [insert_hinh_anh_values], function (err, rows) {
            if(err) throw err;
            console.log("insert success!")
          })
        });
      })
    });
    res.redirect('/');
}

exports.displayPostHome = async(req, res) => {
  var dataDisplay = [];
  dbConnection = mysql.createConnection(dbconfig);
  dbConnection.connect(function (err) {
    if(err) throw err;
    let queryValue = 'SELECT phong_tro.gia_phong, phong_tro.dia_chi, hinh_anh.path_anh, phong_tro.id_phong_tro from phong_tro' +
                        ' inner join nguoi_dung on phong_tro.id_chu_so_huu = nguoi_dung.id_nguoi_dung' +
                        ' inner join hinh_anh on phong_tro.id_phong_tro = hinh_anh.id_phong_tro' +
                        ' order by phong_tro.id_phong_tro ';
    dbConnection.query(queryValue, function (err, rows) {
      if(err) throw err;
      let obj = rows.reduce((res, curr) =>
      {
          if (res[curr.id_phong_tro])
              res[curr.id_phong_tro].push(curr);
          else
              Object.assign(res, {[curr.id_phong_tro]: [curr]});

          return res;
      }, {});
      for(let i of Object.values(obj)){
        dataDisplay.push(i[0]);
      }
    })
  });

  if(req.isAuthenticated()) {
    res.render("user-home", {username : req.user.ten_nguoi_dung, userData:dataDisplay});
  }else {
    res.render("home", {userData: dataDisplay});
  }
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
