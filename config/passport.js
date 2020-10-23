const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const dbconfig = require('./database');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

//const dbConnection = mysql.createConnection(dbconfig);
// dbConnection.connect((error) => {
//     if (error) {
//       console.log(error)
//     } else {
//       console.log("Connected to MySql!")
//       dbConnection.end();
//     }
// });

module.exports = function(passport) {

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
            emailField: 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            const email = req.body.email;
            const sex = req.body.sex;
            const dob = req.body.DOB;
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            dbConnection = mysql.createConnection(dbconfig);
            dbConnection.connect();
            dbConnection.query("SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        email: email,
                        password: bcrypt.hashSync(password, 10),  // use the generateHash function in our user model
                        sex: sex,
                        dob: dob
                    };

                    var insertQuery = "INSERT INTO nguoi_dung ( ten_nguoi_dung, email, mat_khau, gioi_tinh, ngay_sinh ) values (?,?,?,?,?)";
                    dbConnection = mysql.createConnection(dbconfig);
                    dbConnection.connect();
                    dbConnection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password, newUserMysql.sex, newUserMysql.dob],function(err, rows) {
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
            idField: 'id',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            dbConnection = mysql.createConnection(dbconfig);
            dbConnection.connect();
            dbConnection.query("SELECT * FROM nguoi_dung WHERE ten_nguoi_dung = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].mat_khau))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
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
                    console.log("Added GG acc to DB");
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

};
