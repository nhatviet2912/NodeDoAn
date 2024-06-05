var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login.controller');


router.post('/login', loginController.Login);
router.get('/getAll', loginController.getAll);
router.delete('/delete/:id', loginController.delete);
router.put('/updateManager/:id/:role', loginController.updateManager);



module.exports = router;