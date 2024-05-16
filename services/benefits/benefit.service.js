var connection = require('../../db.js');

const benefitService = {
    getAll: async () => {
        try {
            var query = `Select d.DepartmentName, p.PositionName, e.EmployeeName, b.BenefitCode,
                        b.BenefitType, b.StartDate, b.EndDate, b.Description, b.Id
                        from benefits as b inner join employees as e on b.Employee_id = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        ORDER BY b.ID desc`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
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
            const query = `INSERT INTO benefits (BenefitCode, BenefitType, Description, Employee_id, StartDate, EndDate) VALUES 
                            ( '${BenefitCode}', '${BenefitType}', '${Description}', '${Employee_id}', '${StartDate}', '${EndDate}')`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

    update: async(id, body) => {
        try{
            const { PositionCode, PositionName, Descriptions, Department_id} = body;
            const query = `UPDATE positions SET 
                            PositionCode = '${PositionCode}', 
                            PositionName = '${PositionName}', 
                            Descriptions = '${Descriptions}',
                            Department_id = '${Department_id}'
                            WHERE Id = '${id}'`;
                            console.log(query);
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },
    
    delete: async(id) => {
        try{
            const query = `DELETE FROM positions Where Id = '${id}'`;
            return await (await connection).execute(query);
        } catch(error) {
            throw error;
        }
    },

    searchPosition: async(keyWord) => {
        console.log(keyWord);
        try {
            const query = `SELECT p.Id, p.PositionCode, p.PositionName, p.Descriptions, p.Department_id, d.DepartmentName
                            FROM positions as p
                            INNER JOIN departments as d ON p.Department_id = d.ID WHERE 
                            p.PositionCode LIKE '%${keyWord}%' OR 
                            p.PositionName LIKE '%${keyWord}%' OR 
                            d.DepartmentName LIKE '%${keyWord}%'`;
            const [rows, fields] = await (await connection).execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    importPosition: async(data) => {  
        const successData = [];
        const failureData = [];

        for (let i = 0; i < data.length; i++) {
            const { Id, PositionCode, PositionName, Description, Department_id } = data[i];

            const checkQuery = `SELECT * FROM positions WHERE PositionCode = '${PositionCode}'`;
            const [existingRows] = await (await connection).query(checkQuery);
            if(existingRows.length === 0) {
                const query = `INSERT INTO positions (Id, PositionCode, PositionName, Descriptions, Department_id) VALUES 
                                ('${Id}', '${PositionCode}', '${PositionName}', '${Description}', '${Department_id}')`;

                try {
                    const [rows, fields] = await (await connection).execute(query);

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


module.exports = benefitService;
