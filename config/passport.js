const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dbconfig = require('./database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook");

//const dbConnection = mysql.createConnection(dbconfig);
// dbConnection.connect((error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log("Connected to MySql!")
//       dbConnection.end();
//     }
// });

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
        function(req, username, password, done) {
            const email = req.body.email;
            const sex = req.body.sex;
            const dob = req.body.DOB;
            const phone = req.body.phone;
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            dbConnection = mysql.createConnection(dbconfig);
            dbConnection.connect();
            var queryString = "SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?";
            if(username.includes("@")){
              console.log(username);
              queryString = "SELECT * FROM nguoi_dung WHERE email = ?";
            }
            dbConnection.query("SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length){
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                }else{
                    // if there is no user with that username
                    // create the user
                const newUserMysql = {
                    ten_nguoi_dung: username,
                    email: email,
                    sdt: phone,
                    mat_khau: bcrypt.hashSync(password, 10),  // use the generateHash function in our user model
                    gioi_tinh: sex,
                    ngay_sinh: dob,

                };
                var insertQuery = "INSERT INTO nguoi_dung ( ten_nguoi_dung, email, sdt, mat_khau, gioi_tinh, ngay_sinh ) values ('" + newUserMysql.ten_nguoi_dung + "','" + newUserMysql.email + "','" + newUserMysql.sdt + "','"  + newUserMysql.mat_khau + "','" + newUserMysql.gioi_tinh + "'," + "STR_TO_DATE('" + newUserMysql.ngay_sinh + "', '%m/%d/%Y'))";
                dbConnection = mysql.createConnection(dbconfig);
                dbConnection.connect();
                dbConnection.query(insertQuery,function(err, rows) {
                  if(err){
                    return done(err);
                  }
                  return done(null, newUserMysql);
                });
                dbConnection.end();
              }
            });
            dbConnection.end();
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
        function(req, username, password, done) { // callback with email and password from our form
            dbConnection = mysql.createConnection(dbconfig);
            dbConnection.connect();
            var queryString = "SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?";
            if(username.includes("@")){
              queryString = "SELECT * FROM nguoi_dung WHERE email = ?";
            }
            dbConnection.query(queryString, [username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].mat_khau))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                if (req.body.remember) {
                  req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // Cookie expires after 1 days
                } else {
                  req.session.cookie.expires = false; // Cookie expires at end of session
                }
                return done(null, rows[0]);
            });
            dbConnection.end();
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
      function(req, accessToken, refreshToken, profile, cb) {
        const google_id = profile.id;
        const ho_va_ten = profile.name.givenName + profile.name.familyName;
        const email = profile.emails[0].value;
        // User.findOrCreate({
        //   googleId: profile.id
        // }, function(err, user) {
        //   return cb(err, user);
        // });
        dbConnection = mysql.createConnection(dbconfig);
        dbConnection.connect();
        dbConnection.query("SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?",[google_id], function(err, rows){
            if (err)
                return cb(err);
            if (rows.length) {
                return cb(err, rows[0]);
            }else{
              const newUserMysql = {
                  ten_nguoi_dung: google_id,
                  ho_va_ten: ho_va_ten,
                  mat_khau:" ",
                  email: email
              };
              const insertQuery = "INSERT INTO nguoi_dung ( ten_nguoi_dung, email, mat_khau, ho_va_ten ) values (?,?,?,?)";
              dbConnection = mysql.createConnection(dbconfig);
              dbConnection.connect();
              dbConnection.query(insertQuery,
                [newUserMysql.ten_nguoi_dung, newUserMysql.email, newUserMysql.mat_khau, newUserMysql.ho_va_ten],
                function(err, rows) {
                    return cb(err, rows[0])
              });
              dbConnection.end();
              // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // // if the user is found but the password is wrong
            // if (!bcrypt.compareSync(password, rows[0].mat_khau))
            //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            //return done(null, rows[0]);
        });
        dbConnection.end();
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
      function(accessToken, refreshToken, profile, cb) {
        const facebook_id = profile.id;
        const ho_va_ten = profile.displayName;
        const email = profile.emails[0].value;
        // User.findOrCreate({
        //   googleId: profile.id
        // }, function(err, user) {
        //   return cb(err, user);
        // });
        dbConnection = mysql.createConnection(dbconfig);
        dbConnection.connect();
        dbConnection.query("SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?",[facebook_id], function(err, rows){
            if (err)
                return cb(err);
            if (rows.length) {
                return cb(err, rows[0]);
            }else{
              const newUserMysql = {
                  ten_nguoi_dung: facebook_id,
                  ho_va_ten: ho_va_ten,
                  mat_khau:" ",
                  email: email
              };
              const insertQuery = "INSERT INTO nguoi_dung ( ten_nguoi_dung, email, mat_khau, ho_va_ten ) values (?,?,?,?)";
              dbConnection = mysql.createConnection(dbconfig);
              dbConnection.connect();
              dbConnection.query(insertQuery,
                [newUserMysql.ten_nguoi_dung, newUserMysql.email, newUserMysql.mat_khau, newUserMysql.ho_va_ten],
                function(err, rows) {
                    return cb(err, rows[0])
              });
              dbConnection.end();
              // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // // if the user is found but the password is wrong
            // if (!bcrypt.compareSync(password, rows[0].mat_khau))
            //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            //return done(null, rows[0]);
        });
        dbConnection.end();
      }
    ));

};
