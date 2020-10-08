const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('../cloud/database');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const db = database.db;

exports.login = async (req, res) => {
    try {
        const {input_login, password} = req.body;
        console.log(req.body);
        db.query('SELECT * FROM nguoi_dung WHERE email = "' + input_login + '" OR ten_nguoi_dung = "' + input_login + '"', async(error, results) => {
            console.log(!(results.length > 0) || !(await bcrypt.compare(password, results[0].mat_khau)));
            if(!(results.length > 0) || !(await bcrypt.compare(password, results[0].mat_khau))) {
                res.status(401).render('login', {
                    message : 'email or password is incorrect'
                })
            } else {
                const id = results[0].id;
                const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                    expiresIn : process.env.JWT_EXPIRES_IN
                });
                console.log("the token is: " + token);
                const cookieOptions = {
                    expires : new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true,
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/home');
            }
        })
    } catch (error) {console.log(error)}
}

exports.urlencodedParser = urlencodedParser;
exports.validateSignup = [
    check('username', 'user name must contain at least 6 characters')
        .exists()
        .isLength({ min: 6 }),
    check('email', 'invalid email')
        .isEmail(),
    check('password', 'password must contain at least 8').isLength({min:6}).isNumeric()
];
exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        //return res.status(422).json({errors : errors.array()});
        const alert = errors.array()
        res.render('signup', {message : "",
            alert
        })
    } else{
    console.log(req.body);
    const {username, email, password, confirmPass} = req.body;
    db.query('SELECT email FROM nguoi_dung WHERE email = ? OR ten_nguoi_dung = ?', [email, username], async  (error, results) => {
        if(error) {conslole.log(error);}
        if(results.length > 0) {
            return res.render('signup', {
                message: 'email or user name is already in use'
            })
        } else if(password !== confirmPass) {
            return res.render('signup', {
                message : 'password do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        db.query('INSERT INTO nguoi_dung SET ?', {ten_nguoi_dung: username, email: email, mat_khau: hashedPassword}, (error, results) => {
            if(error) {console.log(error);}
            else {
                console.log(results);
                return res.render('signup', {
                    message : 'user registered'
                });
            }
        })
    })}
}