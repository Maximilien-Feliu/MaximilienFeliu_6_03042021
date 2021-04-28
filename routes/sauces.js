/******************
            router defining sauces routes for the application 
                                                *************************/


const express = require('express'); 
const router = express.Router();                                    // create a router to handle routes

const auth = require('../middleware/auth');                         // import the authentification's token configuration from the folder 'middleware'
const regExp = require('../middleware/regExp');                     // import regExp
const multer = require('../middleware/multer-config');              // import the multer configuration from the folder 'middleware'
const saucesCtrl = require('../controllers/sauces');                // import the sauces functions

/*****  define the specific router parameters  *****/ 
router.post('/', auth, multer, saucesCtrl.createSauces);
router.put('/:id', auth, regExp.sauces, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);

module.exports = router;                                             // export the router