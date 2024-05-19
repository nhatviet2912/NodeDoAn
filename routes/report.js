var express = require('express');
var router = express.Router();

const reportController = require('../controllers/report.controller');

router.get('/getTotalEmployee', reportController.getTotalEmployee);
router.get('/getTotalDepartment', reportController.getTotalDepartment);
router.get('/getTotalEmployeeOut', reportController.getTotalEmployeeOut);


module.exports = router;