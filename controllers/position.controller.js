const req = require('express/lib/request');
const positionService = require('../services/position/position.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');

const positionController = {
    getAllPositions: async(req, res)  => {
        try {
            const data = await positionService.getAllPosition();
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
      
            const data = await positionService.getAllPageData(pageSize, pageIndex);
            const total = await positionService.getTotal();
      
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

    getByIdPosition: async(req, res) => {
        try {
            const positionId = req.params.id;
            const data = await positionService.getByIdPosition(positionId);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy tên chức vụ!',
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
            const positionCode = req.params.code;
            const data = await positionService.exitCode(positionCode);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy tên chức vụ!',
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

    createdPosition: async(req, res) => {
        try {
            const { PositionCode } = req.body;
            console.log(req.body);

            const isExist = await positionService.exitCode(PositionCode);

            if (isExist) return res.status(400).json({message: "Mã chức vụ đã tồn tại!", error: 1}) 
            const data = await positionService.createPosition(req.body);
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

    updatePosition: async (req, res) => {
        try {
            const { id } = req.params;
            let data = null;
            const result = await positionService.getByIdPosition(id);
            if(result.PositionCode != req.body.PositionCode){
                const isExist = await positionService.exitCode(req.body.PositionCode);
    
                if (isExist) return res.status(400).json({message: "Mã chức vụ đã tồn tại!", error: 1}) 
            }
            if(result != null) {
                data = await positionService.updatePosition(result.Id, req.body);
            }
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                return res.status(404).json({
                    message: `Không tìm thấy chức vụ có id:${id}`,
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

    deletePosition: async (req, res) => {
        try{
            const { id } = req.params;
            const data = await positionService.deletePosition(id);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy chức vụ!',
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

    searchPosition: async (req, res) => {
        try{
            const { value } = req.body;
            const data = await positionService.searchPosition(value);

            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy chức vụ!',
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

    importposition: async(req, res) => {
        try {
            const excel = req.files.file;
            await uploadService.handleFileUpload(req, res, async () => {
                const workbook = XLSX.readFile(excel.tempFilePath);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                const result = await positionService.importPosition(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result) {
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        data: result
                    })
                } else {
                    res.status(200).json({
                        message: 'Không tìm thấy chức vụ!',
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

    exportposition: async(req, res) => {
        try {
            const data = await positionService.getAllPosition();
            const heading = [['ID', 'PositionCode', 'PositionName', 'Descriptions', 'Department_id']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'position');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('position.xlsx')
            return res.send(buffer);

        } catch (error) {
            
        }
    },
};

module.exports = positionController;