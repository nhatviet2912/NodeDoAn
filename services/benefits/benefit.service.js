var connection = require('../../db.js');

const benefitService = {
    getAll: async () => {
        try {
            var query = `Select d.DepartmentName, p.PositionName, e.EmployeeName, b.BenefitCode,
                        b.BenefitType, b.StartDate, b.EndDate, b.Description, b.Id, b.Percent,
                        c.SalaryBasic, 
                        ((c.SalaryBasic * c.SalaryCoefficient) * b.Percent / 100) AS SoTienPhaiDong,
                        c.SalaryCoefficient
                        from benefits as b inner join employees as e on b.Employee_id = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        inner join contracts as c on c.Contract_Employee_id = e.Id
                        ORDER BY b.ID desc`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getAmountPay: async (Id) => {
        try {
            var query = `select b.Percent, c.SalaryBasic, ((c.SalaryBasic * c.SalaryCoefficient) * b.Percent / 100) as Amount
                        from benefits as b 
                        left join employees as e on b.Employee_id = e.Id
                        left join contracts as c on c.Contract_Employee_id = e.Id
                        where e.Id = '${Id}'`;
            const [rows, fields] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getById: async (Id) => {
        try{
            const query = 'SELECT * FROM benefits WHERE Id = ?';
            const values = [Id];

            const [rows, fields] = await (await connection).execute(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (BenefitCode) => {
        try{
            const query = `SELECT * FROM benefits WHERE BenefitCode = '${BenefitCode}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try{
            const { BenefitCode, BenefitType, Description, Employee_id, StartDate, EndDate } = body;
            const query = `INSERT INTO benefits (BenefitCode, BenefitType, Description, Employee_id, StartDate, EndDate, Percent) VALUES 
                            ( '${BenefitCode}', '${BenefitType}', '${Description}', '${Employee_id}', '${StartDate}', '${EndDate}', 10.5)`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

    update: async(id, body) => {
        try{
            const { BenefitCode, Employee_id, BenefitType, StartDate, EndDate, Description} = body;
            const query = `UPDATE benefits SET 
                            BenefitCode = '${BenefitCode}', 
                            Employee_id = '${Employee_id}', 
                            BenefitType = '${BenefitType}',
                            StartDate = '${StartDate}',
                            EndDate = '${EndDate}',
                            Description = '${Description}'
                            WHERE Id = '${id}'`;
                            console.log(query);
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },
    
    delete: async(id) => {
        try{
            const query = `DELETE FROM benefits Where Id = '${id}'`;
            return await (await connection).execute(query);
        } catch(error) {
            throw error;
        }
    },
}


module.exports = benefitService;
