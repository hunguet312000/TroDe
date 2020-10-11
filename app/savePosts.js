const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})


exports.savePosts = async(req, res) => {
    try {

        const { input_login, password } = req.body;
        console.log(req.body);
        console.log("Test " + input_login + " " + password);
        db.query('SELECT * FROM nguoi_dung WHERE email = "' + input_login + '" OR ten_nguoi_dung = "' + input_login + '"', async(error, results) => {
            console.log(!(results.length > 0) || !(await bcrypt.compare(password, results[0].mat_khau)));
            if (!(results.length > 0) || !(await bcrypt.compare(password, results[0].mat_khau))) {
                res.status(401).render('login', {
                    message: 'email or password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("the token is: " + token);
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                console.log("Dang nhap thanh cong");
                res.status(200).redirect('/home');

            }
        })
    } catch (error) { console.log(error) }
}
