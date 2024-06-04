const salaryService = require('../services/salary/salary.service');
const sendMailService = require('../services/sendMail/index.js');

const sendMailController = {
    sendMail: async(req, res) => {
        try {
            const data = await sendMailService.send(req.body);
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
}

module.exports = sendMailController;