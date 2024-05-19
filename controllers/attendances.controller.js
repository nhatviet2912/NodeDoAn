const attendancesService = require('../services/attendances/attendances.service');
const employeeService = require('../services/employee/employee.service');

const fs = require('fs');
const XLSX = require('xlsx');
const uploadService = require('../services/uploadfile/uploadfile.service');
const req = require('express/lib/request');
const moment = require('moment');
// const req = require('express/lib/request');
const { log } = require('console');


const attendanceController = {
    getAll: async(req, res)  => {
        try {
            const currentWeekRange = getCurrentWeekRange();
            const rows = await attendancesService.getAll(currentWeekRange);
            const employees = {};
            rows.forEach(item => {
                const {
                    Attendances,
                    Day,
                    Month,
                    Year,
                    Status,
                    EmployeeName,
                    EmployeeCode,
                    PositionName,
                    DepartmentName
                } = item;
            
                if (!employees[EmployeeCode]) {
                    employees[EmployeeCode] = {
                        EmployeeName,
                        EmployeeCode,
                        PositionName,
                        DepartmentName,
                        attendances: []
                    };
                }
            
                employees[EmployeeCode].attendances.push({
                    Attendances,
                    Day,
                    Month,
                    Year,
                    Status
                });
              });
            
            const data = Object.values(employees);

            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data
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

    get: async(req, res) => {
        try {
            const data = await attendancesService.get(req.body);
            console.log(data);
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

    getWithMonth: async(req,res) => {
        try {
            const { Year, Month } = req.body;
            const data = await attendancesService.getWithMonth(Year, Month);
            let processedData = {};

            data.forEach(item => {
                if (!processedData[item.EmployeeCode]) {
                    processedData[item.EmployeeCode] = {
                        EmployeeId: item.Id,
                        EmployeeName: item.EmployeeName,
                        EmployeeCode: item.EmployeeCode,
                        PositionName: item.PositionName,
                        DepartmentName: item.DepartmentName,
                        WorkDays: item.WorkDays,
                        attendances: []
                    };
                }
            
                let attendanceInfo = {
                    Attendances: item.Attendances,
                    Day: item.Day,
                    Month: item.Month,
                    Year: item.Year,
                    Status: item.Status
                };
            
                processedData[item.EmployeeCode].attendances.push(attendanceInfo);
            });
            
            processedData = Object.values(processedData);
            
            if (data) {
                return res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: processedData
                })
            } else {
                return res.status(200).json({
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


    import: async(req, res) => {
        try {
            const excel = req.files.file;
            await uploadService.handleFileUpload(req, res, async () => {
                const workbook = XLSX.readFile(excel.tempFilePath);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                
                const duplicateEmployeeIds = findDuplicates(data, 'Mã Nhân Viên');
                if (duplicateEmployeeIds.length > 0) {
                    res.status(400).json({
                        message: "Có lỗi dữ liệu trùng lặp",
                        error: 1,
                        data: null
                    })
                }
                const result = await attendancesService.import(data);
    
                fs.unlinkSync(excel.tempFilePath);
                if (result.error === 0) {
                    return res.status(200).json({
                        message: 'Thành công',
                        error: 0,
                        data: result
                    })
                } else {
                    return res.status(400).json({
                        message: result.message,
                        error: result.error,
                        data: null
                    })
                }
            });
        } catch (error) {
            return res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },

    export: async (req, res) => {
        try {
            const { Year, Month, Day, DepartmentId } = req.params;

            const week = getWeekDays(Year, Month, Day);

            const data = await employeeService.getEmployeeDeparment(0,DepartmentId);

            const heading = [week];
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.sheet_add_aoa(worksheet, heading);

            // Đặt độ rộng cho mỗi cột
            const columnWidths = week.map((day, index) => ({
                wch: index === 2 ? 25 : 15
            }));
            worksheet['!cols'] = columnWidths;

            
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            res.attachment('ChamCongTemplate.xlsx');
            return res.send(buffer);

        } catch (error) {
            return res.status(500).json({message: "Xuất File không thành công!", error: 1});
        }
    },
}

module.exports = attendanceController;

function getWeekDays(year, month, day) {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const startDate = new Date(year, month - 1, day);
    const ngayThu2Thu6 = ['Mã Nhân Viên', 'Tên Nhân Viên', 'Phòng ban'];

    for (let i = 1; i <= 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i - startDate.getDay());
        const thu = days[date.getDay()];
        const ngayThang = `${date.getDate()}/${date.getMonth() + 1}`;
        ngayThu2Thu6.push(`${thu} (${ngayThang})`);
    }

    return ngayThu2Thu6;
}

function getCurrentWeekRange() {
    const currentDate = new Date();

    // Tìm ngày đầu tiên của tuần (thứ 2)
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
    
    // Tìm ngày cuối cùng của tuần (Chủ nhật)
    const lastDayOfWeek = new Date(currentDate);
    lastDayOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay()));
    
    // Tách ngày, tháng và năm ra từ startDate và endDate
    const startDay = firstDayOfWeek.getDate();
    const startMonth = firstDayOfWeek.getMonth() + 1;
    const startYear = firstDayOfWeek.getFullYear();
    
    const endDay = lastDayOfWeek.getDate();
    const endMonth = lastDayOfWeek.getMonth() + 1;
    const endYear = lastDayOfWeek.getFullYear();

    return {
        startDay,
        startMonth,
        startYear,
        endDay,
        endMonth,
        endYear
    };
}

const findDuplicates = (arr, key) => {
    const counts = arr.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  
    return Object.keys(counts).filter((key) => counts[key] > 1);
};
