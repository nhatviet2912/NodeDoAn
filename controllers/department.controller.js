const departmentService = require('../services/department.service');

const departmentController = {
    getAllDepartments: async(req, res)  => {
        try {
            const data = await departmentService.getAllDepartments();
            console.log(data);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    getByIdDepartment: async(req, res) => {
        try {
            const departmentId = req.params.id;
            const data = await departmentService.getByIdDepartments(departmentId) ;

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy tên phòng ban!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    createdDepartment: async(req, res) => {
        try {
            const { Id } = req.body;

            const isExist = await departmentService.getByIdDepartments(Id);

            if (isExist) return res.status(400).json({message: "DepartmentId đã tồn tại!", error: 1}) 
            const data = await departmentService.createDepartment(req.body);
            return res.status(201).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    updateDepartment: async (req, res) => {
        try {
            const { id } = req.params;
            let data = null;
            const result = await departmentService.getByIdDepartments(id);
         
            if(result != null) {
                data = await departmentService.updateDeparment(result.Id, req.body);
            }
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy phòng ban có id:${id}`,
                    error: 1,
                    data
                })
            }
            
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }

    },

    deleteDepartment: async (req, res) => {
        try{
            const { id } = req.params;
            const data = await departmentService.deleteDeparment(id);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy phòng ban!',
                    error: 1,
                    data
                })
            }
        } catch(error){
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
        
    },
};

module.exports = departmentController;