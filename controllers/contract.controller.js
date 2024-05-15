const contractService = require('../services/contract/contract.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');
const req = require('express/lib/request');
const { formatDate } = require('../utils/helper.js');

const contractController = {

    // getSalary: async(req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const data = await contractService.getSalary(id);
    //         if (data) {
    //             res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data
    //             })
    //         } else {
    //             res.status(200).json({
    //                 message: 'Không tìm thấy hợp đồng!',
    //                 error: 1,
    //                 data
    //             })
    //         }
    //     } catch (error) {
    //         res.status(500).json({
    //             message: `Có lỗi xảy ra! ${error.message}`,
    //             error: 1,
    //         })
    //     }
    // },

    getAll: async (req, res) => {
        try {
            const data = await contractService.getAll();
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
      
            const data = await contractService.getAllPageData(pageSize, pageIndex);
            const total = await contractService.getTotal();
      
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
            const data = await contractService.getById(id);
            var dateStart = formatDate(data.ContractStartDate);
            var dateEnd = formatDate(data.ContractEndDate);
            data.ContractStartDate = `${dateStart}`;
            data.ContractEndDate = `${dateEnd}`;
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy hợp đồng!',
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
            const data = await contractService.exitCode(code);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy hợp đồng!',
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
            const { ContractCode } = req.body;

            const isExist = await contractService.exitCode(ContractCode);

            if (isExist) return res.status(400).json({message: "ContractCode đã tồn tại!", error: 1}) 
            const data = await contractService.create(req.body);
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
            const result = await contractService.getById(id);
            if(result != null) {
                data = await contractService.update(result.Id, req.body);
            }
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy hợp đồng có id:${id}`,
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
            const data = await contractService.delete(id);
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy hợp đồng có id:${id}`,
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
            const data = await contractService.search(value);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy hợp đồng!',
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
    
                const result = await contractService.import(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result) {
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        data: result
                    })
                } else {
                    res.status(200).json({
                        message: 'Không tìm thấy hợp đồng!',
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
            const data = await contractService.getAll();
            const heading = [['ID', 'ContractCode', 'ContractName', 'ContractStartDate', 'ContractEndDate', 'ContractTerm', 'SalaryCoefficient', 'SalaryBasic', 'Contract_Employee_id']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'contracts');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('contract.xlsx')
            return res.send(buffer);

        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
}

module.exports = contractController;