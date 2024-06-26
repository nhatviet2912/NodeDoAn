const req = require('express/lib/request');
const departmentService = require('../services/department/department.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');

const departmentController = {
    getAllDepartments: async(req, res)  => {
        try {
            const data = await departmentService.getAllDepartments();
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

    getAllPageData: async(req, res) => {
        try {
            const pageSize = parseInt(req.query.pagesize) || 10;
            const pageIndex = parseInt(req.query.pageindex) || 1;
      
            const data = await departmentService.getAllPageData(pageSize, pageIndex);
            const total = await departmentService.getTotal();
      
            if (data.length > 0) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: {
                        pageSize,
                        pageIndex,
                        data,
                        total
                    },
                });
            } else {
                res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data: {
                        pageSize,
                        pageIndex,
                        data,
                        total
                    },
                });
            }
        } catch (error) {
            res.status(500).json({
              message: `Có lỗi xảy ra! ${error.message}`,
              error: 1,
            });
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

    exitCode: async(req, res) => {
        try {
            const departmentCode = req.params.code;
            const data = await departmentService.exitCode(departmentCode) ;
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
            const { DepartmentCode } = req.body;

            const isExist = await departmentService.exitCode(DepartmentCode);

            if (isExist) return res.status(400).json({message: "Mã phòng ban đã tồn tại!", error: 1}) 
            const data = await departmentService.createDepartment(req.body);
            return res.status(200).json({
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
            if(result.DepartmentCode != req.body.DepartmentCode){
                const isExist = await departmentService.exitCode(req.body.DepartmentCode);
    
                if (isExist) return res.status(400).json({message: "Mã phòng ban đã tồn tại!", error: 1}) 
            }
         
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

    searchDepartment: async (req, res) => {
        try{
            const { value }= req.body;
            const data = await departmentService.searchDepartment(value);

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

    importDepartment: async(req, res) => {
        try {
            const excel = req.files.file;
            await uploadService.handleFileUpload(req, res, async () => {
                const workbook = XLSX.readFile(excel.tempFilePath);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                const result = await departmentService.importDepartment(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result) {
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        data: result
                    })
                } else {
                    res.status(200).json({
                        message: 'Không tìm thấy phòng ban!',
                        error: 1,
                        data: result
                    })
                }
            });
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    exportDepartment: async(req, res) => {
        try {
            const data = await departmentService.getAllDepartments();
            const heading = [['ID', 'DepartmentCode', 'DepartmentName', 'Descriptions']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'department');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('department.xlsx')
            return res.send(buffer);

        } catch (error) {
            
        }
    },
};

module.exports = departmentController;