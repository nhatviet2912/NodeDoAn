var express = require('express');
var router = express.Router();

const recognitionController = require('../controllers/recognition.controller');


router.get('/', recognitionController.getAll);
router.post('/create', recognitionController.create);
// router.get('/getById/:id', recognitionController.getById);
// router.put('/update/:id', recognitionController.update);
// router.delete('/delete/:id', recognitionController.delete);
// router.post('/search', recognitionController.searchPosition);
// router.post('/import', uploadService.fileUploadMiddleware, recognitionController.importposition);
// router.get('/export', recognitionController.exportposition);

module.exports = router;
