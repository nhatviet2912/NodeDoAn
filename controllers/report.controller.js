const reportService = require('../services/report/report.service.js');

const reportController = {
    getTotalEmployee: async(req, res)  => {
        try {
            const result = await reportService.getTotalEmployee();
            if (result) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: result.TotalEmployee
                })
            } else {
                return res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    getTotalDepartment: async(req, res) => {
        try {
            const data = await reportService.getTotalDepartment();
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: data.TotalDepartment
                });
            } else {
                return res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data
                });
            }
        } catch (error) {
            return res.status(500).json({
              message: `Có lỗi xảy ra! ${error.message}`,
              error: 1,
            });
        }
    },

    getTotalEmployeeOut: async (req, res) => {
        try {
            const data = await reportService.getTotalEmployeeOut();
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: data.TotalEmployeeOut
                });
            } else {
                return res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
              });
        }
    }
};

module.exports = reportController;