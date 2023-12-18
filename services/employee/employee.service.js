var connection = require('../../db.js');

const employeeService = {
    getAll: async () => {
        try {
            var query = `SELECT e.Id, e.EmployeeCode, e.EmployeeName, e.DateOfBirth, e.Gender, e.Email, e.PhoneNumber, 
                        e.Address, e.Position_id, p.PositionName
                        FROM employees as e inner join positions as p on e.Position_id = p.Id`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getById: async (Id) => {
        try {
            var query = `SELECT e.Id, e.EmployeeCode, e.EmployeeName, e.DateOfBirth, e.Gender, e.Email, e.PhoneNumber, 
                        e.Address, e.Position_id, p.PositionName
                        FROM employees as e inner join positions as p on e.Position_id = p.Id
                        Where e.Id = ${Id}`;
            const [rows, fields] =  await (await connection).query(query);
            return rows[0];
            
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (code) => {
        try {
            var query = `SELECT * from employees where EmployeeCode = '${code}'`;
            const [rows] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try {
            const { EmployeeCode, EmployeeName, DateOfBirth, Gender, Email, PhoneNumber, Address, Position_id} = body;
            var query = `INSERT INTO employees (EmployeeCode, EmployeeName, DateOfBirth, Gender, Email, PhoneNumber, Address, Position_id)
                        VALUES ('${EmployeeCode}', '${EmployeeName}', '${DateOfBirth}', '${Gender}', '${Email}', '${PhoneNumber}', '${Address}', '${Position_id}')`;
            console.log(query);
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    update: async(id, body) => {
        try {
            const { EmployeeCode, EmployeeName, DateOfBirth, Gender, Email, PhoneNumber, Address, Position_id} = body;
            var query = `UPDATE employees SET EmployeeCode = '${EmployeeCode}', 
                                            EmployeeName = '${EmployeeName},
                                            DateOfBirth = '${DateOfBirth}',
                                            Gender = '${Gender}',
                                            PhoneNumber = '${PhoneNumber},
                                            Address = '${Address}',
                                            Position_id = '${Position_id}
                                            Where Id = '${id}'`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    delete: async(id) => {
        try {
            var query = `Delete from employees where Id = ${id}`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    search: async(keyword) => {
        try {
            var query = `SELECT e.Id, e.EmployeeCode, e.EmployeeName, e.DateOfBirth, e.Gender, e.Email, e.PhoneNumber, 
                        e.Address, e.Position_id, p.PositionName
                        FROM employees as e inner join positions as p on e.Position_id = p.Id
                        Where e.EmployeeCode LIKE '%${keyword}%' OR
                            e.EmployeeName LIKE '%${keyword}%' OR
                            e.DateOfBirth LIKE '%${keyword}%' OR
                            e.Gender LIKE '%${keyword}%' OR
                            e.PhoneNumber LIKE '%${keyword}%'OR
                            e.Address LIKE '%${keyword}%' OR
                            p.PositionName LIKE '%${keyword}%'`;
            const [rows] =  await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    import: async(data) => {  
        const successData = [];
        const failureData = [];

        for (let i = 0; i < data.length; i++) {
            const { Id,  EmployeeCode, EmployeeName, DateOfBirth, Gender, Email, PhoneNumber, Address, Position_id } = data[i];

            const checkQuery = `SELECT * FROM employees WHERE EmployeeCode = '${EmployeeCode}'`;
            const [existingRows] = await (await connection).query(checkQuery);
            if(existingRows.length === 0) {
                const formattedDateOfBirth = convertExcelDate(DateOfBirth);
                console.log(formattedDateOfBirth);

                var query = `INSERT INTO employees (Id, EmployeeCode, EmployeeName, DateOfBirth, Gender, Email, PhoneNumber, Address, Position_id) 
                            values ('${Id}','${EmployeeCode}', '${EmployeeName}', '${formattedDateOfBirth}', '${Gender}', '${Email}', '${PhoneNumber}', '${Address}', '${Position_id}')`;

                console.log(query);
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
    },


};

function convertExcelDate(excelDate) {
    const excelEpoch = new Date('1899-12-30T00:00:00.000Z').getTime();
    const millisecondsSinceEpoch = excelEpoch + excelDate * 24 * 60 * 60 * 1000;
    const jsDate = new Date(millisecondsSinceEpoch);
  
    // Format the date as "YYYY/MM/DD"
    const formattedDate = jsDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  
    return formattedDate;
}

module.exports = employeeService;