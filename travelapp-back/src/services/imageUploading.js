const multer = require('multer');

// Set up storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public');
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Use the storage
const upload = multer({ storage: storage });

// In your controller
module.exports = upload
