var express = require('express');
var router = express.Router();
const departmentController = require('../controllers/department.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');

router.get('/', departmentController.getAllDepartments);
router.get('/getById/:id', departmentController.getByIdDepartment);
router.get('/exitcode/:code', departmentController.exitCode);
router.post('/create', departmentController.createdDepartment);
router.put('/update/:id', departmentController.updateDepartment);
router.delete('/delete/:id', departmentController.deleteDepartment);
router.post('/search', departmentController.searchDepartment);
router.post('/import', uploadService.fileUploadMiddleware, departmentController.importDepartment);

module.exports = router;