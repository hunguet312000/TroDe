const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, './img');
    },
    filename : function(req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype ==='image/jpg') {
        cb(null, true);
    }
    else {
        cb({message: 'Unsupported File Format'}, false);
    }
}

const upload = multer({
    storage : storage,
    limits : {fileSize: 2560*1600},
    fileFilter : fileFilter
})

module.exports = upload;
