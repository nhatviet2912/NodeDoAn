var express = require('express');
var router = express.Router();
const contractController = require('../controllers/contract.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');

router.get('/', contractController.getAll);
router.get('/getById/:id', contractController.getById);
router.get('/getPageData', contractController.getAllPageData);
router.get('/exitcode/:code', contractController.exitCode);
router.post('/create', contractController.create);
router.put('/update/:id', contractController.update);
router.delete('/delete/:id', contractController.delete);
router.post('/search', contractController.search);
router.post('/import', uploadService.fileUploadMiddleware, contractController.import);
router.get('/export', contractController.export);

module.exports = router;