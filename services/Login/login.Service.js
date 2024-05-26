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
    }
}

module.exports = departmentService;