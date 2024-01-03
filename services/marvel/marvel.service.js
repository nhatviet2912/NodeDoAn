const connection = require('../../db.js');


const marvelService = {

    getAllPageData: async(pageSize, pageIndex) => {
        const offset = (pageIndex - 1) * pageSize;
        const query = `SELECT m.Month, m.Year, m.MarvelCode, m.WorkDayInMonth
                        FROM marvel as m
                        LIMIT ${pageSize} OFFSET ${offset}`;
        const [rows] = await (await connection).query(query);

        return rows;
    },

    getTotal: async() => {
        const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM marvel`;
        const [countRows] = await (await connection).query(totalCountQuery);
        const totalCount = countRows[0].totalCount;
        return totalCount;
    },

    create: async (body) => {
        try{
            const {MarvelCode, Month, Year, DayWorkMonth} = body;
            const query = `INSERT INTO marvel (MarvelCode, Month, Year, WorkDayInMonth) VALUES 
                            ( '${MarvelCode}',  '${Month}', '${Year}', '${DayWorkMonth}')`;
            console.log(query);
            return await (await connection).execute(query);

        } catch(error) {
            throw error;
        }
    },

}

module.exports = marvelService;