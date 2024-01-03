var connection = require('../../db.js');


const contractService = {

    getSalary: async(Id) => {
        try {
            var query = `select c.SalaryBasic, c.SalaryCoefficient, e.Id as EmployeeId
                        from contracts as c inner join employees as e on c.Contract_Employee_id = e.Id
                        Where e.Id = ${Id}`;
            const [rows] =  await (await connection).query(query);
            return rows[0];
            
        } catch (error) {
            throw error;
        }
    },

    getAll: async () => {
        try {
            var query = `SELECT c.Id, c.ContractCode, c.ContractName, c.ContractStartDate, c.ContractEndDate, c.ContractTerm,
                        c.SalaryCoefficient, e.EmployeeName, e.EmployeeCode, c.Contract_Employee_id, c.SalaryBasic
                        FROM contracts as c inner join employees as e on c.Contract_Employee_id = e.Id`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getAllPageData: async(pageSize, pageIndex) => {
        const offset = (pageIndex - 1) * pageSize;
        const query = `SELECT c.Id, c.ContractCode, c.ContractName, c.ContractStartDate, c.ContractEndDate, c.ContractTerm,
                        c.SalaryCoefficient, e.EmployeeName, e.EmployeeCode, c.Contract_Employee_id, c.SalaryBasic
                        FROM contracts as c inner join employees as e on c.Contract_Employee_id = e.Id
                        ORDER BY e.Id DESC
                        LIMIT ${pageSize} OFFSET ${offset}` ;
        const [rows] = await (await connection).query(query);

        return rows;
    },

    getTotal: async() => {
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM contracts`;
        const [countRows] = await (await connection).query(totalCountQuery);
        const totalCount = countRows[0].totalCount;
        return totalCount == 0 ? 1 : totalCount;
    },

    getById: async (Id) => {
        try {
            var query = `SELECT c.ContractCode, c.ContractName, c.ContractStartDate, c.ContractEndDate, c.ContractTerm,
                        c.SalaryCoefficient, e.EmployeeName, e.EmployeeCode, Contract_Employee_id, c.SalaryBasic
                        FROM contracts as c inner join employees as e on c.Contract_Employee_id = e.Id
                        Where c.Id = ${Id}`;
            const [rows] =  await (await connection).query(query);
            return rows[0];
            
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (code) => {
        try {
            var query = `SELECT contracts.Id from contracts where contracts.ContractCode = '${code}'`;
            const [rows] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try {
            const { ContractCode, ContractName, ContractStartDate, ContractEndDate, ContractTerm, SalaryCoefficient, Contract_Employee_id, SalaryBasic} = body;
            var query = `INSERT INTO contracts (ContractCode, ContractName, ContractStartDate, ContractEndDate, ContractTerm, SalaryCoefficient, Contract_Employee_id, SalaryBasic)
                        VALUES ('${ContractCode}', '${ContractName}', '${ContractStartDate}', '${ContractEndDate}', '${ContractTerm}', '${SalaryCoefficient}', '${Contract_Employee_id}', '${SalaryBasic}')`;
            console.log(query);
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    update: async(id, body) => {
        try {
            const { ContractCode, ContractName, ContractStartDate, ContractEndDate, ContractTerm, SalaryCoefficient, Contract_Employee_id, SalaryBasic} = body;
            var query = `UPDATE employees SET ContractCode = '${ContractCode}', 
                                            ContractName = '${ContractName},
                                            ContractStartDate = '${ContractStartDate}',
                                            ContractEndDate = '${ContractEndDate}',
                                            ContractTerm = '${ContractTerm},
                                            SalaryCoefficient = '${SalaryCoefficient}',
                                            Contract_Employee_id = '${Contract_Employee_id},
                                            SalaryBasic = '${SalaryBasic}
                                            Where Id = '${id}'`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    delete: async(id) => {
        try {
            var query = `Delete from contracts where Id = ${id}`;
            return await (await connection).query(query);
        } catch (error) {
            throw error;
        }
    },

    search: async(keyword) => {
        try {
            var query = `SELECT c.ContractCode, c.ContractName, c.ContractStartDate, c.ContractEndDate, c.ContractTerm,
                        c.SalaryCoefficient, e.EmployeeName, e.EmployeeCode, Contract_Employee_id
                        FROM contracts as c inner join employees as e on c.Contract_Employee_id = e.Id
                        Where c.ContractCode LIKE '%${keyword}%' OR
                            e.EmployeeName LIKE '%${keyword}%' OR
                            c.ContractName LIKE '%${keyword}%' OR
                            c.ContractStartDate LIKE '%${keyword}%' OR
                            c.ContractTerm LIKE '%${keyword}%'OR
                            c.SalaryCoefficient LIKE '%${keyword}%' OR
                            e.EmployeeCode LIKE '%${keyword}%'`;
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
            const { Id,  ContractCode, ContractName, ContractStartDate, ContractEndDate, ContractTerm, SalaryCoefficient, Contract_Employee_id } = data[i];

            const checkQuery = `SELECT * FROM contracts WHERE ContractCode = '${ContractCode}'`;
            const [existingRows] = await (await connection).query(checkQuery);
            if(existingRows.length === 0) {
                const formattedContractStart = convertExcelDate(ContractStartDate);
                const formattedContractEnd = convertExcelDate(ContractEndDate);
                console.log(formattedContractStart);

                var query = `INSERT INTO contracts (Id, ContractCode, ContractName, ContractStartDate, ContractEndDate, ContractTerm, SalaryCoefficient, Contract_Employee_id) 
                            values ('${Id}','${ContractCode}', '${ContractName}', '${formattedContractStart}', '${formattedContractEnd}', '${ContractTerm}', '${SalaryCoefficient}', '${Contract_Employee_id}')`;

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
}


function convertExcelDate(excelDate) {
    const excelEpoch = new Date('1899-12-30T00:00:00.000Z').getTime();
    const millisecondsSinceEpoch = excelEpoch + excelDate * 24 * 60 * 60 * 1000;
    const jsDate = new Date(millisecondsSinceEpoch);
  
    // Format the date as "YYYY/MM/DD"
    const formattedDate = jsDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  
    return formattedDate;
}


module.exports = contractService;