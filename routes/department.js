var express = require('express');
var router = express.Router();
const departmentController = require('../controllers/department.controller');
// var connection = require('../db.js');


router.get('/', departmentController.getAllDepartments);
router.get('/getById/:id', departmentController.getByIdDepartment);
router.post('/create', departmentController.createdDepartment);
router.put('/update/:id', departmentController.updateDepartment);
router.delete('/delete/:id', departmentController.deleteDepartment);



// router.get('/delete/:id', function (req, res) {
//     var query = 'delete from loai_sp where id = ' + req.params.id + ';';
//     connection.query(query, function (err,result) {
//         if (err) res.status(500).send
//         res.status(200).json(result);
//     })
// });

module.exports = router;