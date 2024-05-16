const req = require('express/lib/request');
const fs = require('fs');
const XLSX = require('xlsx');
const benefitService = require('../services/benefits/benefit.service');
const { formatDate } = require('../utils/helper.js');


const benefitController = {
    getAll: async(req, res)  => {
        try {
            const data = await benefitService.getAll();
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


    getById: async(req, res) => {
        try {
            const Id = req.params.id;
            const data = await benefitService.getById(Id);
            var start = formatDate(data.StartDate);
            var end = formatDate(data.EndDate);
            data.StartDate = `${start}`;
            data.EndDate = `${end}`;
            if (data) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            } else {
                res.status(200).json({
                    message: 'Không tìm thấy tên bảo hiểm!',
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

    // exitCode: async(req, res) => {
    //     try {
    //         const positionCode = req.params.code;
    //         const data = await positionService.exitCode(positionCode);
    //         if (data) {
    //             res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data
    //             })
    //         } else {
    //             res.status(200).json({
    //                 message: 'Không tìm thấy tên chức vụ!',
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

    create: async(req, res) => {
        try {
            const { BenefitCode } = req.body;

            const isExist = await benefitService.exitCode(BenefitCode);

            if (isExist) return res.status(400).json({message: "Mã bảo hiểm đã tồn tại!", error: 1}) 
            const data = await benefitService.create(req.body);
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

    // updatePosition: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         let data = null;
    //         const result = await positionService.getByIdPosition(id);
    //         if(result.PositionCode != req.body.PositionCode){
    //             const isExist = await positionService.exitCode(req.body.PositionCode);
    
    //             if (isExist) return res.status(400).json({message: "Mã chức vụ đã tồn tại!", error: 1}) 
    //         }
    //         if(result != null) {
    //             data = await positionService.updatePosition(result.Id, req.body);
    //         }
    //         if (data) {
    //             return res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data
    //             })
    //         } else {
    //             return res.status(404).json({
    //                 message: `Không tìm thấy chức vụ có id:${id}`,
    //                 error: 1,
    //                 data
    //             })
    //         }
            
    //     } catch (error) {
    //         res.status(400).json({
    //             message: `Có lỗi xảy ra! ${error.message}`,
    //             error: 1,
    //         })
    //     }

    // },

    // deletePosition: async (req, res) => {
    //     try{
    //         const { id } = req.params;
    //         const data = await positionService.deletePosition(id);

    //         if (data) {
    //             res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data
    //             })
    //         } else {
    //             res.status(200).json({
    //                 message: 'Không tìm thấy chức vụ!',
    //                 error: 1,
    //                 data
    //             })
    //         }
    //     } catch(error){
    //         res.status(400).json({
    //             message: `Có lỗi xảy ra! ${error.message}`,
    //             error: 1,
    //         })
    //     }
        
    // },

    // searchPosition: async (req, res) => {
    //     try{
    //         const { value } = req.body;
    //         const data = await positionService.searchPosition(value);

    //         if (data) {
    //             res.status(200).json({
    //                 message: 'success',
    //                 error: 0,
    //                 data
    //             })
    //         } else {
    //             res.status(200).json({
    //                 message: 'Không tìm thấy chức vụ!',
    //                 error: 1,
    //                 data
    //             })
    //         }
    //     } catch(error){
    //         res.status(400).json({
    //             message: `Có lỗi xảy ra! ${error.message}`,
    //             error: 1,
    //         })
    //     }
    // },
};

module.exports = benefitController;