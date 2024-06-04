const { formatVND } = require('../../utils/helper.js');
var nodemailer = require('nodemailer');
require('dotenv').config()

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
})
const sendMailService = {
    send: async (employees) => {
        const emailPromises = employees.map(async (employee) => {
            employee.NetSalary = formatVND(employee.NetSalary);
            employee.SalaryDay = formatVND(employee.SalaryDay);
            employee.SalaryBasic = formatVND(employee.SalaryBasic);
            employee.Amount = formatVND(employee.Amount);
            const info = await transport.sendMail({
              from: `"Công ty AICADEMY" <${process.env.EMAIL_USERNAME}>`,
              to: employee.Email,
              subject: `Bảng lương tháng ${employee.Month}`,
              text: `Bảng lương tháng ${employee.Month}`,
              html: `
                <!doctype html>
                <html>
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <style>
                  table {
                    font-family: arial, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                  }
        
                  td, th {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                  }
        
                  tr:nth-child(even) {
                    background-color: #dddddd;
                  }
                </style>
                <body style="font-family: sans-serif;">
                  <h1>
                    Bảng công tháng ${employee.Month}
                  </h1>
                  <table>
                    <tr>
                        <th>Tên nhân viên</th>
                        <th>Số ngày làm việc</th>
                        <th>Lương theo ngày</th>
                        <th>Số tiền đóng bảo hiểm</th>
                        <th>Lương cơ bản</th>
                        <th>Lương thực lãnh</th>
                    </tr>
                    <tr>
                        <td>${employee.EmployeeName}</td>
                        <td>${employee.DayWork}</td>
                        <td>${employee.SalaryDay}</td>
                        <td>${employee.Amount}</td>
                        <td>${employee.SalaryBasic}</td>
                        <td>${employee.NetSalary}</td>
                      </tr>   
                  </table>
                </body>
                </html>
              `,
            });
        
            return info;
        });
        return Promise.all(emailPromises);
    },
}

module.exports = sendMailService;