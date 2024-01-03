var connection = require('../../db.js');

const attendancesService = {
    getAll: async () => {
        try {
            var query = `SELECT e.Id, e.EmployeeCode, e.EmployeeName, e.Gender, e.Email, p.PositionName, a.Absent
                        FROM attendances as a inner join employees as e on a.Att_Employee_id = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        where p.Id = 17`;
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

    getWithMonth: async(body) => {
        try {
            const { Month, Year } = body;
            var query = `SELECT
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
                        (${Month ? `a.Month = '${Month}'` : '1'}) AND 
                        (${Year ? `a.Year = '${Year}'` : '1'})
                    GROUP BY
                        e.Id, e.EmployeeCode, e.EmployeeName, e.Email, p.PositionName;`
            const [rows] = await (await connection).query(query);
            console.log(rows);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try{
            // console.log(body);
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
    }
}

module.exports = attendancesService;