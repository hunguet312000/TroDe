const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dbconfig = require('./database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook");
const {sequelizeInit, Nguoi_dung, Quan_tri_vien} = require("./sequelize");

//const dbConnection = mysql.createConnection(dbconfig);
// dbConnection.connect((error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log("Connected to MySql!")
//       dbConnection.end();
//     }
// });
exports.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next(null,true);
  }
  res.redirect("/");
}
module.exports = async function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
      passport.serializeUser((user, done)=>{
           done(null, user);
       });

       passport.deserializeUser ((user, done)=>{
           done(null, user);
       });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup',new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, username, password, done) {
            console.log(req.body);
            const email = req.body.email;
            //const sex = req.body.sex;
            //const dob = req.body.DOB;
            const phone = req.body.phone;
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            try{
              const nguoi_dung = await Nguoi_dung.findOrCreate({
              where: { email: email}, // we search for this user
              defaults: {
                ten_nguoi_dung: username,
                email: email,
                mat_khau: bcrypt.hashSync(password, 10),
                //gioi_tinh: sex,
                //ngay_sinh: dob,
                sdt: phone
              } // if it doesn't exist, we create it with this additional data
              });
              //console.log(nguoi_dung[1]);
              if(!nguoi_dung[1]){
                return done(null, false, req.flash('signupMessage', 'Tài khoản đã tồn tại.'));
              }
                nguoi_dung[0].dataValues.role = null;
                return done(null, nguoi_dung[0].dataValues);
            }catch(err){
              console.log(err);
                return done(null, false, req.flash('signupMessage', 'Vui lòng nhập email hợp lệ.'));
            }
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login',new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, username, password, done) { // callback with email and password from our form
            try{
              var nguoi_dung ;
              if(username.includes("@")){
                nguoi_dung = await Nguoi_dung.findAll({
                where: { email: username}, // we search for this user
                });
                  //console.log(nguoi_dung[0]);
              }else{
                nguoi_dung = await Nguoi_dung.findAll({
                where: { ten_nguoi_dung: username}, // we search for this user
                });
                  //console.log(nguoi_dung[0]);
              }
              if(nguoi_dung[0]){
                if (!bcrypt.compareSync(password, nguoi_dung[0].dataValues.mat_khau)){
                    return done(null, false, req.flash('loginMessage', 'Sai mật khẩu.'));
                }else{
                  const isAdmin = await Quan_tri_vien.findAll({
                    where:{
                      id_nguoi_dung: nguoi_dung[0].dataValues.id_nguoi_dung
                    }
                  });
                  //console.log(isAdmin);
                  if(isAdmin[0]){
                    nguoi_dung[0].dataValues.role = 1;
                  }else{
                    nguoi_dung[0].dataValues.role = null;
                  }
                  return done(null, nguoi_dung[0].dataValues);
                }
              }else{
                return done(null, false, req.flash('loginMessage', 'Tài khoản không tồn tại.'));
              }
            }catch(err){
              console.log(err);
            }
        })
    );


    //LOGIN FOR ADMIN
    passport.use('admin-local-login',new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        async function(req, username, password, done) { // callback with email and password from our form
            try{
              var quan_tri ;
              if(username.includes("@")){
                quan_tri = await Nguoi_dung.findAll({
                where: { email: username}, // we search for this user
                });
                  //console.log(quan_tri[0]);
              }else{
                quan_tri = await Nguoi_dung.findAll({
                where: { ten_nguoi_dung: username}, // we search for this user
                });
                  //console.log(quan_tri[0]);
              }
              //console.log(quan_tri[0]);
              if(quan_tri[0]){
                if (!bcrypt.compareSync(password, quan_tri[0].dataValues.mat_khau)){
                    return done(null, false, req.flash('loginMessage', 'Sai mật khẩu.'));
                }else{
                  const isAdmin = await Quan_tri_vien.findAll({
                    where:{
                      id_nguoi_dung: quan_tri[0].dataValues.id_nguoi_dung
                    }
                  });
                  //console.log(isAdmin);
                  if(isAdmin[0]){
                    quan_tri[0].dataValues.role = 1;
                  }else{
                    quan_tri[0].dataValues.role = null;
                  }
                  //console.log(quan_tri[0].dataValues);
                  return done(null, quan_tri[0].dataValues);
                }
              }else{
                return done(null, false, req.flash('loginMessage', 'Bạn không phải quản trị viên.'));
              }
            }catch(err){
              console.log(err);
            }
        })
    );


    // =========================================================================
    // LOGIN WITH GOOGLE=============================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/user-home",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
      },
      async function(req, accessToken, refreshToken, profile, cb) {
        const google_id = profile.id;
        const ho_va_ten = profile.name.givenName + profile.name.familyName;
        const email = profile.emails[0].value;

        try{
          const nguoi_dung = await Nguoi_dung.findOrCreate({
          where: { email: email}, // we search for this user
          defaults: {
            ten_nguoi_dung: google_id,
            email: email,
            mat_khau: " ",
            ho_va_ten: ho_va_ten
          } // if it doesn't exist, we create it with this additional data
          });
          const isAdmin = await Quan_tri_vien.findAll({
            where:{
              id_nguoi_dung: nguoi_dung[0].dataValues.id_nguoi_dung
            }
          });
          //console.log(isAdmin);
          if(isAdmin[0]){
            nguoi_dung[0].dataValues.role = 1;
          }else{
            nguoi_dung[0].dataValues.role = null;
          }
          return cb(null, nguoi_dung[0].dataValues);
        }catch(err){
          console.log(err);
          return cb(null, null);
        }
      }
    ));

    // =========================================================================
    // LOGIN WITH FACEBOOK=============================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/user-home",
      profileFields: ['id', 'displayName', 'email']
    },
      async function(accessToken, refreshToken, profile, cb) {
        const facebook_id = profile.id;
        const ho_va_ten = profile.displayName;
        const email = profile.emails[0].value;

        try {
          const nUser = await Nguoi_dung.findOrCreate({
            where: { ten_nguoi_dung: facebook_id}, // we search for this user
            defaults: {
              ten_nguoi_dung: facebook_id,
              email: email,
              mat_khau: " ",
              ho_va_ten: profile.displayName
            }
          });
          const isAdmin = await Quan_tri_vien.findAll({
            where:{
              id_nguoi_dung: nUser[0].dataValues.id_nguoi_dung
            }
          });
          //console.log(isAdmin);
          if(isAdmin[0]){
            nUser[0].dataValues.role = 1;
          }else{
            nUser[0].dataValues.role = null;
          }
          return cb(null, nUser[0].dataValues);
        } catch (err) {
            return cb(null,null)
        }
      }
    ));

};
