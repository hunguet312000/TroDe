const express = require('express');
const authenticationController = require('../controllers/authenticate');
const router = express.Router();
const passport = require('passport')

require('dotenv').config();
require('../controllers/passport-setup');

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
router.get('/google', passport.authenticate('google',{scope : ['profile', 'email']}));
router.get('/google/callback', passport.authenticate('google', {failureRedirect : 'failed'}), function(req, res) {
    res.redirect('/success');
});
router.get('/success', isLoggedIn, function(req, res) {
    res.render('google-profile', {name:req.user.displayName, email:req.user.emails[0].value, pic:req.user.photos[0].value});
})
router.post("/signup",  authenticationController.signup)

router.post("/login", authenticationController.login);

module.exports = router;