const connection = require('../../db.js');

const salaryService = {

    get: async(body) => {
        try {
            const { Month, Year } = body;
            var query = `SELECT s.Month, s.Year, s.NetSalary, s.DayWork, s.SalaryDay, e.EmployeeName
                        FROM salary as s inner join employees as e on s.Employee_id = e.Id
                        WHERE s.Month = '${Month}' AND s.Year = '${Year}';`;
            const [rows] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getAll: async() => {
        try {
            var query = `SELECT s.Month, s.Year, s.NetSalary, s.DayWork, s.SalaryDay, e.EmployeeName
                        FROM salary as s inner join employees as e on s.Employee_id = e.Id;`
            const [rows] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    create: async(body) => {
        try {
            const { Month, NetSalary, EmployeeId, Year, DayWork, SalaryDay } = body;
            const query = `INSERT INTO salary (Month, NetSalary, Employee_id, Year, DayWork, SalaryDay) 
                            VALUES ('${Month}', '${NetSalary}', '${EmployeeId}', '${Year}', '${DayWork}', '${SalaryDay}');`
            return await (await connection).execute(query);
        } catch (error) {
            throw error;
        }
    },

    import: async(data) => {  
        const successData = [];
        const failureData = [];

        for (let i = 0; i < data.length; i++) {
            const { Id, Month, NetSalary, Employee_id, Year, DayWork, SalaryDay } = data[i];

            const checkQuery = `SELECT * FROM salary WHERE Id = '${Id}'`;
            const [existingRows] = await (await connection).query(checkQuery);
            if(existingRows.length === 0) {
                const query = `INSERT INTO salary (Id, Month, NetSalary, Employee_id, Year, DayWork, SalaryDay) VALUES 
                                ('${Id}', '${Month}', '${NetSalary}', '${Employee_id}', '${Year}', '${DayWork}', '${SalaryDay}')`;

                try {
                    const [rows] = await (await connection).execute(query);

                    if (rows.affectedRows) {
                        successData.push(data[i]);
                    } else {
                        failureData.push(data[i]);
                    }
                } catch (error) {
                    console.log(error);
                    failureData.push(data[i]);
                }
            }else {

                failureData.push(data[i]);
            }
        }

        return { successData, failureData };
    }
}

module.exports = salaryService;