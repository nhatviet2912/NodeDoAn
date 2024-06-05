var connection = require('../../db.js');


const departmentService = {
    login: async (data) => {
        let { Acc, Pass, Type } = data;
        try {
            var query = `Select ug.Id, ug.UserName, u.Account, u.Password, e.EmployeeName, 
                        e.Id as EmployeeId, e.EmployeeCode from
                        user as u inner join user_group as ug on u.Id_User = ug.Id
                        inner join employees as e on u.Employee_Id_User = e.Id
                        where u.Account = '${Acc}' and u.Password = '${Pass}' and ug.Id = '${Type}';`
            const [rows, fields] = await (await connection).execute(query);
            return rows[0];
        } catch (error) {
            throw error
        }
    },

    get: async () => {
        try {
            var query = `Select ug.Id, ug.UserName, u.Account, u.Password, e.EmployeeName, 
                        e.Id as EmployeeId, e.EmployeeCode, e.EmployeeName, e.Email, 
                        p.PositionName, d.DepartmentName, u.Status, u.Id as IdUser
                        from user as u 
                        inner join user_group as ug on u.Id_User = ug.Id
                        inner join employees as e on u.Employee_Id_User = e.Id
                        inner join positions as p on e.Position_id = p.Id
                        inner join departments as d on p.Department_id = d.Id
                        where u.Delete_Flag = 0`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            
        }
    },

    delete: async (Id) => {
        try {
            var query = `Update user set Delete_Flag = '1' 
                        where Id = '${Id}'`;
                        console.log(query);
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            
        }
    },

    updateManager: async (Id, Role) => {
        try {
            var query = `Update user set Id_User = '${Role}' 
                        where Id = '${Id}'`;
                        console.log(query);
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            
        }
    }


}

module.exports = departmentService;