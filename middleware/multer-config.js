const multer = require('multer'); // import multer - handle files sent by requests

const MIME_TYPES = {              // dictionary to define files format and generate files extensions
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
};

/*****  save on the disk  *****/
const storage = multer.diskStorage({ 
    destination: (req, file, callback) => {                                     // set the saving destination 
        callback(null, 'images');                                               // null = no errors ; 2nd parameter set the destination folder 
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];      // replace the white spaces by underscores and delete the first extension
        const extension = MIME_TYPES[file.mimetype];                            // dictionary element corresponding to the sent file mime type
        callback(null, name + Date.now() + '.' + extension);                    // create the final filename with a timestamp to be unique
    }
});

module.exports = multer({ storage }).single('image');                           // export the multer, '.single()' means that it's a unique file which is an image