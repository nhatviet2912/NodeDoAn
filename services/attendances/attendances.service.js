var connection = require('../../db.js');

const attendancesService = {
    getAll: async (currentWeekRange) => {
        try {
            var query = `SELECT a.Attendances, a.Day, a.Month, a.Year, a.Status, e.EmployeeName, 
                        e.EmployeeCode, p.PositionName, d.DepartmentName
                        FROM attendances as a
                        inner join employees as e on a.EmployeeId = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        WHERE a.Day >= '${currentWeekRange.startDay}' and a.Day <= '${currentWeekRange.endDay}'
                            and a.Month >= '${currentWeekRange.startMonth}' and a.Month <= '${currentWeekRange.endMonth}'
                            and a.Year >= '${currentWeekRange.startYear}' and a.Year <= '${currentWeekRange.endYear}'`;
            console.log(query);
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    get: async(body) => {
        try {
            const { Day, Month, Year } = body;

            var query = `SELECT
                        MAX(a.AttendanceId) AS AttendanceId,
                        MAX(a.Day) AS Day,
                        a.Month,
                        a.Year,
                        MAX(a.Absent) AS Absent,
                        e.Id AS EmployeeId,
                        e.EmployeeCode,
                        e.EmployeeName,
                        e.Email,
                        p.PositionName,
                        COUNT(CASE WHEN a.Absent = 1 THEN 1 ELSE NULL END) AS AbsentCount
                    FROM
                        attendances AS a
                    INNER JOIN
                        employees AS e ON a.EmployeeId = e.Id
                    INNER JOIN
                        positions AS p ON e.Position_id = p.Id
                    WHERE
                        (${Day ? `a.Day = '${Day}'` : '1'}) AND
                        (${Month ? `a.Month = '${Month}'` : '1'}) AND 
                        (${Year ? `a.Year = '${Year}'` : '1'})
                    GROUP BY
                        e.Id, e.EmployeeCode, e.EmployeeName, e.Email, p.PositionName, a.Month`;
            const [rows] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getWithMonth: async(Year, Month) => {
        try {
            var query = `SELECT a.Attendances, a.Day, a.Month, a.Year, a.Status, e.EmployeeName, 
                        e.EmployeeCode, p.PositionName, d.DepartmentName, e.Id,
                        (SELECT COUNT(*) 
                        FROM attendances AS a2 
                        WHERE a2.EmployeeId = e.Id AND a2.Month = a.Month AND a2.Year = a.Year AND a2.Status = '0') AS WorkDays
                FROM attendances AS a
                INNER JOIN employees AS e ON a.EmployeeId = e.Id
                INNER JOIN positions AS p ON e.Position_id = p.Id
                INNER JOIN departments AS d ON p.Department_id = d.Id
                WHERE a.Month = '${Month}' AND a.Year = '${Year}'`;
            const [rows] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try{
            const { Absent , EmployeeId, Day, Month, Year} = body;
            var query = `INSERT INTO attendances(Day, Absent, EmployeeId, Month, Year) VALUES ('${Day}', '${Absent}', '${EmployeeId}', '${Month}','${Year}')`;
            return await (await connection).execute(query);
        }catch{
            throw error;
        }
    },

    update: async(id, body) => {
        try {
            const { Absent } = body;
            var query = `Update attendances SET Absent = '${Absent}
                        Where AttendanceId = '${id};`
            return await (await connection).query(query);

        } catch (error) {
            
        }
    },

    exit: async(body) => {
        try {
            const { Day, Month, Year, EmployeeId } = body;
            var query = `select * from attendances where Day = '${Day}' and Month = '${Month}' and Year= '${Year}' and EmployeeId = '${EmployeeId}'`;
            const [rows] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    import: async (data) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const insertData = [];
        const deleteData = [];
    
        for (let i = 0; i < data.length; i++) {
            const workingDays = Object.entries(data[i])
                .slice(3)
                .map(([key, value]) => ({ [key]: value }));

            if (workingDays.length === 0 || workingDays.length > 7) {
                return {
                    message: 'Import file không thành công! Vui lòng kiểm tra lại',
                    error: 1,
                };
            }
        
            var query = `SELECT e.Id from employees as e where e.EmployeeCode = '${data[i]['Mã Nhân Viên']}'`;
            const [rows, fields] = await (await connection).query(query);
            const employeeId = rows[0].Id;
            
            for(const item of workingDays){
                let status = 0;
                const dayName = Object.keys(item)[0];
                const attendance = item[dayName];

                if (attendance !== 'x' && attendance !== 'o') {
                    return {
                        message: 'Vui lòng nhập x hoặc o khi chấm công',
                        error: 1,
                    };
                }

                if (attendance === 'o') {
                    status = 1;
                }

                const insideParentheses = dayName.split('(')[1].split(')')[0];

                const [day, month] = insideParentheses.split('/').map(item => parseInt(item.trim()));
                
                const checkQuery = `SELECT * FROM attendances 
                                    WHERE EmployeeId = '${employeeId}' 
                                    and Day = '${day}'
                                    and Month = '${month}'
                                    and Year = '${currentYear}'`;
                const [existingRows] = await (await connection).query(checkQuery);
                if(existingRows.length === 0){
                    insertData.push([employeeId, day, month, currentYear, status]);
                }
                else{
                    existingRows.forEach(row => {
                        deleteData.push(row.Attendances);
                    });
                    insertData.push([employeeId, day, month, currentYear, status]);
                }
            }

        }
        if(deleteData.length > 0){
            try {
                const deleteQuery = `DELETE FROM attendances WHERE Attendances IN (?)`;
                await (await connection).query(deleteQuery, [deleteData]);
            } catch (error) {
                throw error;
            }
        }

        if(insertData.length > 0){
            try {
                const insertQuery = `INSERT INTO attendances (EmployeeId, Day, Month, Year, Status) VALUES ?`;
                await (await connection).query(insertQuery, [insertData]);
            } catch (error) {
                throw error;
            }
        }
        return {
            message: 'Thành công',
            error: 0,
        };
    },
}

module.exports = attendancesService;