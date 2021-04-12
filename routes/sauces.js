const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.get('/', saucesCtrl.getAllSauces);
router.get('/:id');

module.exports = router;