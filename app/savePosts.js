const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
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
      console.log("Connected!");
      console.log(req.user);
      var querySearch = "SELECT * from nguoi_dung WHERE ten_nguoi_dung = ?";
      dbConnection.query(querySearch, [req.user.ten_nguoi_dung], function (err, rows) {
        console.log(rows[0].id_nguoi_dung);
        var insertQuery = "INSERT INTO phong_tro(gia_phong, tinh_trang, dia_chi, mo_ta, id_chu_so_huu) values (?, ?, ?, ?, ?)";
        dbConnection.query(insertQuery, [req.body.price, 1, req.body.addressCity + req.body.district + req.body.sub_district + req.body.privateAddress, req.body.postTitle + req.body.acreageRoom, rows[0].id_nguoi_dung], function (err, result) {
          if (err) throw err;
          console.log(result.insertId);
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
    res.render("/");
}
