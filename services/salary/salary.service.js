const connection = require('../../db.js');

const salaryService = {

    get: async(body) => {
        try {
            const { Month, Year } = body;
            var query = `SELECT s.Id, s.Month, s.Year, s.NetSalary, s.DayWork, s.SalaryDay, e.EmployeeName,
                        e.EmployeeCode, p.PositionName, d.DepartmentName, c.SalaryBasic, s.Status,
                        ((c.SalaryBasic * c.SalaryCoefficient) * b.Percent / 100) as Amount, 
                        e.Email, e.Id as EmployeeId, c.SalaryCoefficient, r.Amount as AmountRecognition
                        FROM salary as s inner join employees as e on s.Employee_id = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        inner join contracts as c on c.Contract_Employee_id = e.Id
                        inner join benefits as b on b.Employee_id = e.Id
                        left join recognition as r on r.Recognition_employee = e.Id
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

    create: async(salaryData) => {
        try {
            let listIdDelete = []
            for (const item of salaryData) {
                var query = `Select s.Id from salary as s
                            where s.Employee_id = '${item.EmployeeId}' and s.Month = '${item.Month}' and s.Year = '${item.Year}'`;
                const [rows, fields] = await (await connection).query(query);
                rows.forEach(row => {
                    listIdDelete.push(row.Id);
                });
            }
            if (listIdDelete.length > 0) {
                var deleteQuery = `DELETE FROM salary as s where s.Id IN (?)`;
                await (await connection).query(deleteQuery, [listIdDelete]);
            }
            const values = salaryData.map(item => [item.EmployeeId, item.DayWork, item.Month, item.Year, item.SalaryDay, item.NetSalary, 0]);
            const insertQuery = `INSERT INTO salary (Employee_id, DayWork, Month, Year, SalaryDay, NetSalary, Status)
                    VALUES ?`;

            return await (await connection).query(insertQuery, [values]);
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (Id) => {
        try {
            var query = `Update salary as s set s.Status="1" where s.Id= ${Id}`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    updateStatusMany: async (ids) => {
        try {
            var query = `Update salary SET Status = '1' 
                        WHERE Id IN (${ids.map(id => `'${id}'`).join(',')})`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    getTotal: async () => {
        try{
            const today = new Date();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            var query = `SELECT SUM(NetSalary) AS TotalNetSalary
                FROM salary
                WHERE Month = '${month}' AND Year = '${year}'`;
            const [rows] = await (await connection).query(query);
            return rows[0];
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = salaryService;