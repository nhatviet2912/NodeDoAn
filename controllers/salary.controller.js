const salaryService = require('../services/salary/salary.service');
const contractService = require('../services/contract/contract.service');
const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');
const benefitService = require('../services/benefits/benefit.service');

const salaryController = {

    get: async(req, res) => {
        try {
            const data = await salaryService.get(req.body);
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
            // lương ngày = (lương cơ bản * hệ số luong) / số ngày đi làm trong tháng
            // lương thực lãnh = lương ngày * số ngày đi làm - Tiền bảo hiểm
            const salaryData = [];
            for (const item of req.body) {
                const isExist = await contractService.getSalary(item.EmployeeId);
                const AmountEmployee = await benefitService.getAmountPay(item.EmployeeId);

                const Amount = AmountEmployee?.Amount ?? 0;
                let partAmount = parseInt(Amount.toFixed(0));
                const { SalaryBasic, SalaryCoefficient } = isExist;

                let SalaryDays = item.WorkDays !== 0 ? (SalaryBasic * SalaryCoefficient) / item.TotalDay : 0;
                let NetSalary = SalaryDays * item.WorkDays - (partAmount == null ? 0 : partAmount);
                salaryData.push({
                    EmployeeId: item.EmployeeId,
                    DayWork: item.WorkDays,
                    Month: item.Month,
                    Year: item.Year,
                    SalaryDay: SalaryDays,
                    NetSalary: NetSalary
                })
            }
            const data = await salaryService.create(salaryData);
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

    updateStatus: async(req, res) => {
        try {
            const { Id } = req.body;
            const data = await salaryService.updateStatus(Id);
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

    updateStatusMany: async(req, res) => {
        try {
            const data = await salaryService.updateStatusMany(req.body);
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

    import: async(req, res) => {
        try {
            const excel = req.files.file;
            await uploadService.handleFileUpload(req, res, async () => {
                const workbook = XLSX.readFile(excel.tempFilePath);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
                const result = await salaryService.import(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result) {
                    res.status(200).json({
                        message: 'success',
                        error: 0,
                        data: result
                    })
                } else {
                    res.status(200).json({
                        message: 'Không tìm thấy bảng lương!',
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
            const data = await salaryService.getAll();
            const heading = [['Id', 'Month', 'NetSalary', 'Employee_id', 'Year', 'DayWork', 'SalaryDay']];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'salary');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer'});
            res.attachment('salary.xlsx')
            return res.send(buffer);

        } catch (error) {
            
        }
    },
}

module.exports = salaryController;