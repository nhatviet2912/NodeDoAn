var express = require('express');
var router = express.Router();

const positionController = require('../controllers/position.controller');
const uploadService = require('../services/uploadfile/uploadfile.service');

router.get('/', positionController.getAllPositions);
router.get('/getPageData', positionController.getAllPageData);
router.get('/getById/:id', positionController.getByIdPosition);
router.get('/exitcode/:code', positionController.exitCode);
router.post('/create', positionController.createdPosition);
router.put('/update/:id', positionController.updatePosition);
router.delete('/delete/:id', positionController.deletePosition);
router.post('/search', positionController.searchPosition);
router.post('/import', uploadService.fileUploadMiddleware, positionController.importposition);
router.get('/export', positionController.exportposition);


module.exports = router;
