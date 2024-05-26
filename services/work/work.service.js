const { lightFormat } = require('date-fns/fp/lightFormat');
var connection = require('../../db.js');

const workService = {
    getAll: async () => {
        try {
            var query = `SELECT w.Id, w.WorkCode, w.StartDate, w.StartEnd, w.Reason, w.Status, w.Address,
                        e.EmployeeCode, e.EmployeeName, p.PositionName
                        FROM work as w inner join employees as e
                        on w.Work_Employee = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        order by Id desc`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getDetail: async (Id) => {
        try {
            var query = `SELECT w.Id, w.WorkCode, w.StartDate, w.StartEnd, w.Reason, w.Status, w.Address,
                        e.EmployeeCode, e.EmployeeName, p.PositionName
                        FROM work as w inner join employees as e
                        on w.Work_Employee = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        where w.Work_Employee = '${Id}'
                        order by Id desc`;
                        console.log(query);
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    getById: async (departmentId) => {
        try{
            const query = 'SELECT * FROM work WHERE Id = ?';
            const values = [departmentId];

            const [rows, fields] = await (await connection).execute(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (workCode) => {
        try{
            const query = `SELECT * FROM work WHERE WorkCode = '${workCode}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },

    create: async (body) => {
        try{
            const { StartDate, StartEnd, Address, Reason, Work_Employee, WorkCode } = body;
            const query = `INSERT INTO work 
            (StartDate, StartEnd, Address, Reason, Status, Work_Employee, WorkCode) 
            VALUES ( '${StartDate}', '${StartEnd}', '${Address}', 
            '${Reason}', 0, '${Work_Employee}', '${WorkCode}')`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

    update: async(id, body) => {
        try{
            const { StartDate, StartEnd, Address, Reason, Status, Work_Employee, WorkCode } = body;
            const query = `UPDATE work SET 
                            StartDate = '${StartDate}', 
                            StartEnd = '${StartEnd}', 
                            Address = '${Address}',
                            Reason = '${Reason}',
                            Status = '${Status}',
                            Work_Employee = '${Work_Employee}',
                            WorkCode = '${WorkCode}'
                            WHERE Id = '${id}'`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },
    
    delete: async(id) => {
        try{
            const query = `DELETE FROM work Where Id = '${id}'`;
            return await (await connection).execute(query);
        } catch(error) {
            throw error;
        }
    },

    check: async(id, status) => {
        try{
            const query = `UPDATE work set Status = '${status}' WHERE Id = '${id}'`;
            console.log(query);
            return await (await connection).execute(query);
        } catch(error) {
            throw error;
        }
    },
}

module.exports = workService;