const req = require('express/lib/request');
const loginService = require('../services/Login/login.Service');

const loginController = {

    Login: async(req, res) => {
        try {
            const data = await loginService.login(req.body);
            if (data !== undefined) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
                })
            }
            return res.status(400).json({
                message: 'Tài khoản hoặc mật khẩu không đúng',
                error: 1,
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

module.exports = loginController;