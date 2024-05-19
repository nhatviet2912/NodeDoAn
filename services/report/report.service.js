var connection = require('../../db.js');


const reportService = {

    getTotalEmployee: async() => {
        try {
            var query = `select count(*) as TotalEmployee from employees `;
            const [rows] =  await (await connection).query(query);
            return rows[0];
            
        } catch (error) {
            throw error;
        }
    },

    getTotalDepartment: async () => {
        try {
            var query = `select count(*) as TotalDepartment from departments`;
            const [rows, fields] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    getTotalEmployeeOut: async () => {
        try {
            var query = `select count(*) as TotalEmployeeOut from employees where Status = 1`;
            const [rows] = await (await connection).query(query);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = reportService;