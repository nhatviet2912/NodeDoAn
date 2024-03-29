var connection = require('../../db.js');

const positionService = {
    getAllPosition: async () => {
        try {
            var query = `SELECT p.Id, p.PositionCode, p.PositionName, p.Descriptions, p.Department_id, d.DepartmentName
                        FROM positions as p
                        INNER JOIN departments as d ON p.Department_id = d.ID
                        ORDER BY p.ID desc`;
            const [rows, fields] = await (await connection).query(query);
            return rows;
        } catch (error) {
            throw error;
        }

    },

    getAllPageData: async(pageSize, pageIndex) => {
        const offset = (pageIndex - 1) * pageSize;
        const query = `SELECT p.Id, p.PositionCode, p.PositionName, p.Descriptions, p.Department_id, d.DepartmentName
                        FROM positions as p
                        INNER JOIN departments as d ON p.Department_id = d.ID
                        ORDER BY p.Id DESC
                        LIMIT ${pageSize} OFFSET ${offset}`;
        const [rows] = await (await connection).query(query);

        return rows;
    },

    getTotal: async() => {
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM positions`;
        const [countRows] = await (await connection).query(totalCountQuery);
        const totalCount = countRows[0].totalCount;
        return totalCount;
    },

    getByIdPosition: async (positionId) => {
        try{
            const query = 'SELECT * FROM positions WHERE Id = ?';
            const values = [positionId];

            const [rows, fields] = await (await connection).execute(query, values);
            return rows[0];
        } catch (error) {
            throw error;
        }
    },

    exitCode: async (positionCode) => {
        try{
            console.log(positionCode);
            const query = `SELECT * FROM positions WHERE PositionCode = '${positionCode}'`;

            const [rows, fields] = await (await connection).execute(query);
            return rows[0];

        } catch (error) {
            throw error;
        }
    },

    createPosition: async (body) => {
        try{
            const { PositionCode, PositionName, Descriptions, Department_id} = body;
            const query = `INSERT INTO positions (PositionCode, PositionName, Descriptions, Department_id) VALUES 
                            ( '${PositionCode}', '${PositionName}', '${Descriptions}', '${Department_id}')`;
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

    updatePosition: async(id, body) => {
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
    
    deletePosition: async(id) => {
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


module.exports = positionService;