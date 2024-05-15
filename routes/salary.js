var express = require('express');
var router = express.Router();
const salaryController = require('../controllers/salary.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');


router.post('/get', salaryController.get);
router.post('/create', salaryController.create);
router.post('/updateStatus', salaryController.updateStatus);
router.post('/updateStatusMany', salaryController.updateStatusMany);
router.post('/import', uploadService.fileUploadMiddleware, salaryController.import);
router.get('/export', salaryController.export);

module.exports = router;