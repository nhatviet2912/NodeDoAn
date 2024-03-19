var connection = require('../../db.js');


const departmentService = {
    getAllDepartments: async () => {
        try {
            var query = 'SELECT * FROM departments order by Id desc';
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }

    },

    getAllPageData: async(pageSize, pageIndex) => {
        const offset = (pageIndex - 1) * pageSize;
        const query = `SELECT * FROM departments
                        ORDER BY departments.Id DESC
                        LIMIT ${pageSize} OFFSET ${offset}`;
        const [rows] = await (await connection).query(query);

        return rows;
    },

    getTotal: async() => {
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM departments`;
        const [countRows] = await (await connection).query(totalCountQuery);
        const totalCount = countRows[0].totalCount;
        return totalCount;
    },

    getByIdDepartments: async (departmentId) => {
        try{
            const query = 'SELECT * FROM departments WHERE Id = ?';
            const values = [departmentId];

            const [rows, fields] = await (await connection).execute(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (departmentCode) => {
        try{
            console.log(departmentCode);
            const query = `SELECT * FROM departments WHERE DepartmentCode = '${departmentCode}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },

    createDepartment: async (body) => {
        try{
            const { DepartmentCode, DepartmentName, Descriptions} = body;
            const query = `INSERT INTO Departments (DepartmentCode, DepartmentName, Descriptions) VALUES ( '${DepartmentCode}', '${DepartmentName}', '${Descriptions}')`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

    updateDeparment: async(id, body) => {
        try{
            const { DepartmentCode, DepartmentName, Descriptions} = body;
            const query = `UPDATE Departments SET 
                            DepartmentCode = '${DepartmentCode}', 
                            DepartmentName = '${DepartmentName}', 
                            Descriptions = '${Descriptions}' 
                            WHERE ID = '${id}'`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },
    
    deleteDeparment: async(id) => {
        try{
            const query = `DELETE FROM Departments Where Id = '${id}'`;
            return await (await connection).execute(query);
        } catch(error) {
            throw error;
        }
    },

    searchDepartment: async(keyWord) => {
        try {
            const query = `SELECT * FROM Departments WHERE DepartmentCode LIKE '%${keyWord}%' OR DepartmentName LIKE '%${keyWord}%'`;
            const [rows, fields] = await (await connection).execute(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    importDepartment: async(data) => {  
        const successData = [];
        const failureData = [];

        for (let i = 0; i < data.length; i++) {
            const { Id, DepartmentCode, DepartmentName, Description } = data[i];

            const checkQuery = `SELECT * FROM departments WHERE DepartmentCode = '${DepartmentCode}'`;
            const [existingRows] = await (await connection).query(checkQuery);
            if(existingRows.length === 0) {
                const query = `INSERT INTO departments (Id, DepartmentCode, DepartmentName, Descriptions) VALUES ('${Id}','${DepartmentCode}', '${DepartmentName}', '${Description}')`;

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

module.exports = departmentService;