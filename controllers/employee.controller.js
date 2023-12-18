const employeeService = require('../services/employee/employee.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');
const req = require('express/lib/request');
const { log } = require('console');

const employeeController = {
    getAll: async (req, res) => {
        try {
            const data = await employeeService.getAll();
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

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await employeeService.getById(id);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy nhân viên!',
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
            const code = req.params.code;
            const data = await employeeService.exitCode(code);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy nhân viên!',
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

    create: async(req, res) => {
        try {
            const { EmployeeCode } = req.body;

            const isExist = await employeeService.exitCode(EmployeeCode);

            if (isExist) return res.status(400).json({message: "EmployeeCode đã tồn tại!", error: 1}) 
            const data = await employeeService.create(req.body);
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

    update: async(req, res) => {
        try {
            const { id } = req.params;
            let data = null;
            const result = await employeeService.getById(id);
            if(result != null) {
                data = await employeeService.update(result.Id, req.body);
            }
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy nhân viên có id:${id}`,
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

    delete: async(req, res) => {
        try {
            const { id } = req.params;
            const data = await employeeService.delete(id);
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy nhân viên có id:${id}`,
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
     
    search: async(req, res, next) => {
        try{
            const { KeyWord } = req.body;
            const data = await employeeService.search(KeyWord);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy nhân viên!',
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

    import: async(req, res) => {
        try {
            const excel = req.files.file;
            console.log(excel);
            await uploadService.handleFileUpload(req, res, async () => {
                const workbook = XLSX.readFile(excel.tempFilePath);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                const result = await employeeService.import(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result) {
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        data: result
                    })
                } else {
                    res.status(200).json({
                        message: 'Không tìm thấy nhân viên!',
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

    export: async(req, res) => {
        try {
            const data = await employeeService.getAll();
            const heading = [['ID', 'EmployeeCode', 'EmployeeName', 'DateOfBirth', 'Gender', 'Email', 'PhoneNumber', 'Address', 'Position_id']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'employee');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('employee.xlsx')
            return res.send(buffer);

        } catch (error) {
            
        }
    },
};

module.exports = employeeController;