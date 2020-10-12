const express = require('express');
const router = express.Router();
const cloudinary = require('../cloud/cloudinary');
const upload = require('../cloud/multer')
const fs = require('fs');
const { Router } = require('express');


router.get("/login", function(req, res) {
    res.render("user-login", { message: "" })
});

router.get("/signup", function(req, res) {
    res.render("user-signup", { message: '' })
});

router.get("/forget-password", function(req, res) {
    res.render("user-forget-password", { message: '' })
});

router.get("/verification", function(req, res) {
    res.render("user-verification", { message: '' })
});

router.get("/verification-email", function(req, res) {
    res.render("user-verification-email", { message: '' })
});

router.get("/reset-password", function(req, res) {
    res.render("user-reset-password", { message: '' })
});

router.get("/content", function(req, res) {
    res.render("content")
});


router.get('/profile', function(req, res) {
    res.render('user-profile');
})

router.get('/profile-info', function(req, res) {
    res.render('user-profile-info');
})

router.get('/profile-edit', function(req, res) {
    res.render('user-profile-edit');
})

router.get('/profile-change-password', function(req, res) {
    res.render('user-profile-change-password');
})

router.get('/post', function(req, res) {
    res.render('user-post')
})

router.post('/post', upload.array('photo'), async(req, res) => {
    const uploader = async(path) => await cloudinary.uploads(path, 'Image');
    const urls = []
    console.log(req.body);
    console.log(req.files);
    files = req.files;
    for (const file of files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath);
        console.log(newPath);
        fs.unlinkSync(path);
    }

    res.send({
        message: 'image uploaded!',
        data: urls
    })
})

router.get("", function(req, res) {
    res.render("home");
});

router.get("/home", function(req, res) {
    res.render("home");
});

router.get("/home-user", function(req, res) {
    res.render("user-home");
});


module.exports = router;