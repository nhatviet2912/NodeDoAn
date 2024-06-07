var connection = require('../../db.js');

const recognitionService = {
    getAll: async () => {
        try {
            var query = `Select d.DepartmentName, p.PositionName, e.EmployeeName, 
                        r.RecognitionCode, r.Date, r.Amount, r.Descriptions
                        from recognition as r 
                        inner join employees as e on r.Recognition_employee = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        ORDER BY r.Id desc`;
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
                        inner join employees as e on b.Employee_id = e.Id
                        inner join contracts as c on c.Contract_Employee_id = e.Id
                        where e.Id = '${Id}'`;
            const [rows, fields] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getById: async (Id) => {
        try{
            const query = 'SELECT * FROM recognition WHERE Id = ?';
            const values = [Id];

            const [rows, fields] = await (await connection).execute(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getAmountRecognition: async (EmployeeId, Month, Year) => {
        try{
            const query = `SELECT Amount FROM recognition 
                        WHERE Recognition_employee = '${EmployeeId}' and YEAR(Date) = '${Year}' 
                        and Month(Date) = '${Month}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (RecognitionCode) => {
        try{
            const query = `SELECT * FROM recognition WHERE RecognitionCode = '${RecognitionCode}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try{
            const { Recognition_employee, Descriptions, Date, Amount, RecognitionCode } = body;
            const query = `INSERT INTO recognition (RecognitionCode, Descriptions, 
            Recognition_employee, Date, Amount) VALUES 
                            ('${RecognitionCode}', 
                            '${Descriptions}', '${Recognition_employee}', 
                            '${Date}', '${Amount}')`;
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


module.exports = recognitionService;
