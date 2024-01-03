const marvelDetailsService = require('../services/marvelDetails/marvelDetail.service');
const employeeService = require('../services/employee/employee.service');
const moment = require('moment');
require('moment/locale/vi');


const marvelDetailController = {


    create: async(req, res) => {
        try {
            const { Month, Year, MarvelCode } = req.body;
            let result = [];
            let employee = await employeeService.getAll();
            employee.forEach(item => {
                let listDay = [];
                for (let j = 1; j <= getDayNumber(Number(Month), Number(Year)); j++) {
                    let dt = new Date(Year, Month , j);
                    switch (dt.toLocaleDateString('en-US', { weekday: 'long' })) {
                        case 'Sunday':
                            listDay.push("CN");
                            break;
                        case 'Saturday':
                            listDay.push("T7");
                            break;
                        default:
                            listDay.push("");
                            break;
                    }
                }
                const weekdays = [];
                for (let j = 1; j <= getDayNumber(Number(Month), Number(Year)); j++) {
                    let dt = new Date(Year, Month - 1, j);
                    moment.locale('vi');
                    let weekdayInVietnamese = moment(dt).format('dddd');
                    weekdays.push({ day: j, weekday: weekdayInVietnamese });
                }
    
                switch (listDay.length) {
                    case 28:
                        listDay.push("", "", "");
                        break;
                    case 29:
                        listDay.push("", "");
                        break;
                    case 30:
                        listDay.push("");
                        break;
                }
    
                let kycongchitiet = {
                    D1: listDay[0], D2: listDay[1], D3: listDay[2], D4: listDay[3], D5: listDay[4],
                    D6: listDay[5], D7: listDay[6], D8: listDay[7], D9: listDay[8], D10: listDay[9],
                    D11: listDay[10], D12: listDay[11], D13: listDay[12], D14: listDay[13], D15: listDay[14],
                    D16: listDay[15], D17: listDay[16], D18: listDay[17], D19: listDay[18], D20: listDay[19],
                    D21: listDay[20], D22: listDay[21], D23: listDay[22], D24: listDay[23], D25: listDay[24],
                    D26: listDay[25], D27: listDay[26], D28: listDay[27], D29: listDay[28], D30: listDay[29],
                    D31: listDay[30], MarvelCode: MarvelCode
                };
    
                result.push({ item, kycongchitiet, weekdays });
            });
    
            // var x = await marvelDetailsService.create(result);
            // console.log(result);
            return res.status(200).json(result); // Trả về dữ liệu JSON
        } catch (error) {
            return res.status(500).json({ error: error.message }); // Trả về lỗi nếu có lỗi
        }
    }
}



function getDayNumber(month, year) {
    let daysInMonth;

    switch (month) {
        case 1: // January
        case 3: // March
        case 5: // May
        case 7: // July
        case 8: // August
        case 10: // October
        case 12: // December
            daysInMonth = 31;
            break;

        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
            daysInMonth = 30;
            break;

        case 2: // February
            // Check if it's a leap year
            daysInMonth = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0) ? 29 : 28;
            break;

        default:
            throw new Error('Invalid month');
    }

    return daysInMonth;
}


module.exports = marvelDetailController;