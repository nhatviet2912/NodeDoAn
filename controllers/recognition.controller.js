const req = require('express/lib/request');
const fs = require('fs');
const XLSX = require('xlsx');
const recognitionService = require('../services/recognition/recognition.service.js');
const { formatDate } = require('../utils/helper.js');


const recognitionController = {
    getAll: async(req, res)  => {
        try {
            const data = await recognitionService.getAll();
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

    create: async(req, res) => {
        try {
            const { RecognitionCode } = req.body;

            const isExist = await recognitionService.exitCode(RecognitionCode);

            if (isExist) return res.status(400).json({message: "Số quyết định đã tồn tại!", error: 1}) 
            const data = await recognitionService.create(req.body);
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

};

module.exports = recognitionController;