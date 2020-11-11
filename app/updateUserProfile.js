const mysql = require('mysql');
const dbconfig = require('../config/database');
const bcrypt = require('bcrypt');
const {sequelizeInit, Nguoi_dung} = require("../config/sequelize");

exports.updateInfo = async (newInfo, oldInfo) => {
  const username = newInfo.username;
  const email = newInfo.email;
  const phone = newInfo.phone;
  const dob = newInfo.DOB;
  const sex = newInfo.sex;
  const id_nguoi_dung = oldInfo.id_nguoi_dung;

  try{
    const nguoi_dung = await Nguoi_dung.update(
      {
      ten_nguoi_dung: username,
      email: email,
      sdt: phone,
      gioi_tinh: sex,
      ngay_sinh: dob
      },{
        where: { id_nguoi_dung: id_nguoi_dung} // we search for this user // if it doesn't exist, we create it with this additional data
      });
  }catch(err){
    console.log(err);
  }
  // const dbConnection = mysql.createConnection(dbconfig);
  // dbConnection.connect((error) => {
  //     if (error) {
  //       console.log(error)
  //     }else{
  //       const insertQuery = "UPDATE nguoi_dung SET ten_nguoi_dung=?, email=?, sdt=?, gioi_tinh=?, ngay_sinh=? WHERE id_nguoi_dung=?";
  //       dbConnection.query(insertQuery,[username, email, phone, sex, dob, id_nguoi_dung],function(err, rows) {
  //         if(err){
  //           console.log(err);
  //         }
  //       });
  //       dbConnection.end()
  //     }
  // });
}

exports.changePassword = async (newInfo, oldInfo) => {
  const id_nguoi_dung = oldInfo.id_nguoi_dung;
  const oldPass = oldInfo.mat_khau;
  const typedOldPass = newInfo.oldPass;
  const newPass = newInfo.newPass;
  const renewPass = newInfo.reNewPass;
  const newHashPass = bcrypt.hashSync(newPass, 10);

  try{
    const nguoi_dung = await Nguoi_dung.update(
      {
        mat_khau: newHashPass
      },{
        where: { id_nguoi_dung: id_nguoi_dung} // we search for this user // if it doesn't exist, we create it with this additional data
      });
  }catch(err){
    console.log(err);
  }

  // const dbConnection = mysql.createConnection(dbconfig);
  // dbConnection.connect((error) => {
  //     if (error) {
  //       console.log(error)
  //     }else{
  //       const insertQuery = "UPDATE nguoi_dung SET mat_khau=? WHERE id_nguoi_dung=?";
  //       dbConnection.query(insertQuery,[ newHashPass, id_nguoi_dung],function(err, rows) {
  //         if(err){
  //           console.log(err);
  //         }
  //       });
  //       dbConnection.end()
  //     }
  // });
}
