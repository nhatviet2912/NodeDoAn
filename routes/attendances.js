var express = require('express');
var router = express.Router();
const attendanceController = require('../controllers/attendances.controller');
const attendancesService = require('../services/attendances/attendances.service');

router.get('/', attendanceController.getAll);
router.post('/get', attendanceController.get);
router.post('/getwithmonth', attendanceController.getWithMonth);
router.post('/create', attendanceController.create);

module.exports = router;