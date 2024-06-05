var express = require('express');
var router = express.Router();
const attendanceController = require('../controllers/attendances.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');


router.get('/', attendanceController.getAll);
router.post('/get', attendanceController.get);
router.post('/getwithmonth', attendanceController.getWithMonth);
router.post('/import', uploadService.fileUploadMiddleware, attendanceController.import);
router.get('/export/:Year/:Month/:Day/:DepartmentId', attendanceController.export);
router.get('/exportMonth/:Year/:Month/:DepartmentId', attendanceController.exportMonth);
router.post('/exportExcelMonth/:Month', attendanceController.exportExcelMonth);
router.post('/updateDetailRow', attendanceController.updateDetailRow);
router.post('/create', attendanceController.post);
router.post('/detailRole/', attendanceController.getDetailRole);


module.exports = router;