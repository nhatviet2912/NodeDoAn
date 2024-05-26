var express = require('express');
var router = express.Router();
const workController = require('../controllers/work.controller');

router.get('/', workController.getAll);
router.get('/getById/:id', workController.getById);
router.get('/exitcode/:code', workController.exitCode);
router.post('/create', workController.create);
router.put('/update/:id', workController.update);
router.delete('/delete/:id', workController.delete);
router.put('/check/:id/:status', workController.check);
router.get('/getDetail/:id', workController.getDetail);


module.exports = router;