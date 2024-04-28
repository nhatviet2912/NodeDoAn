const req = require('express/lib/request');
const workService = require('../services/work/work.service');
const { formatDate } = require('../utils/helper.js');

const workController = {
    getAll: async(req, res)  => {
        try {
            const data = await workService.getAll();
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
            const data = await workService.getById(id);
            // data.Gender = data.Gender == 0 ? 'Nữ' : 'Nam';
            data.StartDate = formatDate(data.StartDate);
            data.StartEnd = formatDate(data.StartEnd);
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(404).json({
                    message: 'Không tìm thấy mã công tác!',
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
            const data = await workService.exitCode(code);
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
            const { WorkCode } = req.body;

            const isExist = await workService.exitCode(WorkCode);

            if (isExist) return res.status(400).json({message: "Mã công tác đã tồn tại!", error: 1}) 
            const data = await workService.create(req.body);
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
            const { WorkCode } = req.body;
        
            // Fetch the existing employee
            const existing = await workService.getById(id);
        
            if (existing === null) {
                return res.status(404).json({
                    message: `Không tìm thấy mã công tác có id:${id}`,
                    error: 1,
                    data: null
                });
            }
        
            if (existing.WorkCode !== WorkCode) {
                const isExist = await workService.exitCode(WorkCode);
        
                if (isExist) {
                    return res.status(400).json({ message: "Mã nhân viên đã tồn tại!", error: 1 });
                }
            }
        
            const updated = await workService.update(id, req.body);
        
            return res.status(200).json({
                message: 'success',
                error: 0,
                data: updated
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
            const data = await workService.delete(id);
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
};

module.exports = workController;