var express = require('express');
var router = express.Router();

const marvelDetailController = require('../controllers/marvelDetails.controller');

router.post('/create', marvelDetailController.create);


module.exports = router;