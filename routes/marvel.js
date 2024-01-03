var express = require('express');
var router = express.Router();

const marvelController = require('../controllers/marvel.controller');

router.get('/getPageData', marvelController.getAllPageData);
router.post('/create', marvelController.created);


module.exports = router;