var express = require('express');
var router = express.Router();
const sendMailController = require('../controllers/sendMail.controller');

router.post('/SendMail', sendMailController.sendMail);


module.exports = router;