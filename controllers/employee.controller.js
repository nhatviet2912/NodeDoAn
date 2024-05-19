const employeeService = require('../services/employee/employee.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');
const req = require('express/lib/request');
const { log } = require('console');
const { formatDate, formatDateDDMMYYYY } = require('../utils/helper.js');

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

    getStatus: async (req, res) => {
        try {
            const { status } = req.params;
            const data = await employeeService.getStatus(status);
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

    updateStatus: async(req, res) => {
        try {
            const { id } = req.params;
            const data = await employeeService.updateStatus(id);
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

    getAllPageData: async(req, res) => {
        try {
            const pageSize = parseInt(req.query.pagesize) || 10;
            const pageIndex = parseInt(req.query.pageindex) || 1;
      
            const data = await employeeService.getAllPageData(pageSize, pageIndex);
            const total = await employeeService.getTotal();
      
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

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await employeeService.getById(id);
            data.Gender = data.Gender == 0 ? 'Nữ' : 'Nam';
            var date = formatDate(data.DateOfBirth);
            data.DateOfBirth = `${date}`;
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(404).json({
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
                res.status(404).json({
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

            if (isExist) return res.status(400).json({message: "Mã nhân viên đã tồn tại!", error: 1}) 
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

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { EmployeeCode } = req.body;
        
            // Fetch the existing employee
            const existingEmployee = await employeeService.getById(id);
        
            if (existingEmployee === null) {
                return res.status(404).json({
                    message: `Không tìm thấy nhân viên có id:${id}`,
                    error: 1,
                    data: null
                });
            }
        
            if (existingEmployee.EmployeeCode !== EmployeeCode) {
                const isExist = await employeeService.exitCode(EmployeeCode);
        
                if (isExist) {
                    return res.status(400).json({ message: "Mã nhân viên đã tồn tại!", error: 1 });
                }
            }
        
            const updatedEmployee = await employeeService.update(id, req.body);
        
            return res.status(200).json({
                message: 'success',
                error: 0,
                data: updatedEmployee
            });
        
        } catch (error) {
            return res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            });
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

    deleteMany: async(req, res) => {
        try {
            const data = await employeeService.deleteMany(req.body);
            if (data) {
                return res.status(200).json({
                    message: 'Đã xóa nhân viên thành công!',
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

    updateStatusMany: async(req, res) => {
        try {
            const data = await employeeService.updateStatusMany(req.body);
            if (data) {
                return res.status(200).json({
                    message: 'Đã xóa nhân viên thành công!',
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

    search: async(req, res) => {
        try{
            const { value } = req.body;
            const data = await employeeService.search(value);

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
            if (!data) {
                return res.status(404).send('Employee data not found');
            }

            const formatDataExport = data.map((row) => {
                const { Id, Position_id, Delete_Flag, ...filteredRow } = row;
                filteredRow.Status = filteredRow.Status === 0 ? "Đang làm việc" : "Đã nghỉ việc";
                filteredRow.Gender = filteredRow.Gender === 0 ? "Nữ" : "Nam";
                filteredRow.DateOfBirth = formatDateDDMMYYYY(filteredRow.DateOfBirth);
                return filteredRow;
            });

            const heading = [['Mã Nhân Viên', 'Tên Nhân Viên', 'Ngày Sinh', 'Giới tính', 'Email', 'Số Điện Thoại', 'Địa Chỉ', 'Chức vụ', 'Phòng ban ', 'Trạng thái']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(formatDataExport);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            const columnWidths = [
                { wch: 15 },  // Mã Nhân Viên
                { wch: 20 },  // Tên Nhân Viên
                { wch: 15 },  // Ngày Sinh
                { wch: 10 },  // Giới tính
                { wch: 25 },  // Email
                { wch: 15 },  // Số Điện Thoại
                { wch: 30 },  // Địa Chỉ
                { wch: 20 },  // Chức vụ
                { wch: 20 },  // Phòng ban
                { wch: 15 }   // Trạng thái
            ];
            
            worksheet['!cols'] = columnWidths;

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('DanhSachNhanVien.xlsx')
            return res.send(buffer);

        } catch (error) {
            return res.status(500).json({message: "Xuất File không thành công!", error: 1});
        }
    },
};

module.exports = employeeController;