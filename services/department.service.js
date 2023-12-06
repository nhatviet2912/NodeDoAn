var connection = require('../db.js');


const departmentService = {
    getAllDepartments: async () => {
        try {
            var query = 'SELECT * FROM departments';
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }

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

    createDepartment: async (body) => {
        try{
            const { Id, DepartmentCode, DepartmentName, Descriptions} = body;
            const query = `INSERT INTO Departments (Id, DepartmentCode, DepartmentName, Descriptions) VALUES ('${Id}', '${DepartmentCode}', '${DepartmentName}', '${Descriptions}')`;
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

        }
    },

}

module.exports = departmentService;