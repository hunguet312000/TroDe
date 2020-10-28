const mysql = require('mysql');
const dbconfig = require('../config/database');
const bcrypt = require('bcrypt');

exports.updateInfo = (newInfo, oldInfo) => {
  const username = newInfo.username;
  const email = newInfo.email;
  const phone = newInfo.phone;
  const dob = newInfo.DOB;
  const sex = newInfo.sex;
  const dbConnection = mysql.createConnection(dbconfig);
  const id_nguoi_dung = oldInfo.id_nguoi_dung;
  dbConnection.connect((error) => {
      if (error) {
        console.log(error)
      }else{
        const insertQuery = "UPDATE nguoi_dung SET ten_nguoi_dung=?, email=?, sdt=?, gioi_tinh=?, ngay_sinh=? WHERE id_nguoi_dung=?";
        dbConnection.query(insertQuery,[username, email, phone, sex, dob, id_nguoi_dung],function(err, rows) {
          if(err){
            console.log(err);
          }
        });
        dbConnection.end()
      }
  });
}

exports.changePassword = (newInfo, oldInfo) => {
  const id_nguoi_dung = oldInfo.id_nguoi_dung;
  const oldPass = oldInfo.mat_khau;
  const typedOldPass = newInfo.oldPass;
  const newPass = newInfo.newPass;
  const renewPass = newInfo.reNewPass;
  const newHashPass = bcrypt.hashSync(newPass, 10);
  const dbConnection = mysql.createConnection(dbconfig);

  dbConnection.connect((error) => {
      if (error) {
        console.log(error)
      }else{
        const insertQuery = "UPDATE nguoi_dung SET mat_khau=? WHERE id_nguoi_dung=?";
        dbConnection.query(insertQuery,[ newHashPass, id_nguoi_dung],function(err, rows) {
          if(err){
            console.log(err);
          }
        });
        dbConnection.end()
      }
  });
}
