var express = require('express');
var router = express.Router();
var employeeController = require('../controllers/employee.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');


router.get('/', employeeController.getAll);
router.get('/getById/:id', employeeController.getById);
router.get('/getPageData', employeeController.getAllPageData);
router.get('/exitcode/:code', employeeController.exitCode);
router.post('/create', employeeController.create);
router.put('/update/:id', employeeController.update);
router.delete('/delete/:id', employeeController.delete);
router.post('/search', employeeController.search);
router.post('/import', uploadService.fileUploadMiddleware, employeeController.import);
router.get('/export', employeeController.export);

module.exports = router;