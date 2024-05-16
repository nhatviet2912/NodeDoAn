var express = require('express');
var router = express.Router();

const benefitController = require('../controllers/benefit.controller');


router.get('/', benefitController.getAll);
router.post('/create', benefitController.create);
router.get('/getById/:id', benefitController.getById);
// router.put('/update/:id', benefitController.updatePosition);
// router.delete('/delete/:id', benefitController.deletePosition);
// router.post('/search', benefitController.searchPosition);
// router.post('/import', uploadService.fileUploadMiddleware, benefitController.importposition);
// router.get('/export', benefitController.exportposition);

module.exports = router;
