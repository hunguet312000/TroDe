const express = require('express');
const router = express.Router();
const cloudinary = require('../cloud/cloudinary');
const upload = require('../cloud/multer')
const fs = require('fs');
const { Router } = require('express');
const jwt = require('jsonwebtoken');

router.get("/", function(req, res) {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
      const userId = decoded.id;
      if(err){
        console.log(err);
      }else{
        res.render("loginedHome/" + userId)
      }
    });
    res.render("home");
});

router.get("/home", function(req, res) {
    res.render("home");
});

router.get("/login", function(req, res) {
    res.render("login", { message: "" })
});

router.get("/signup", function(req, res) {
    res.render("signup", {message : ""})
});

router.get("/content", function(req, res) {
    res.render("content")
});

router.get('/profile', function(req, res) {
    res.render('profile');
})

router.get('/loginedHome/:id/post', function(req, res) {
  const userId = req.params.id;
    res.render('post',{
      userId: userId
    })
})

router.get("/loginedHome/:id", function(req, res){
  const userId = req.params.id;
    res.render("loginedHome",{
      userId: userId
    })
});

router.post('/post/:id', upload.array('photo'), async(req, res) => {
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
    res.redirect("/")
    res.send({
        message: 'image uploaded!',
        data: urls
    })
})


router.get("/home-user", function(req, res) {
    res.render("home-user");
});


module.exports = router;
