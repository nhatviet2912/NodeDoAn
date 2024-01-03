const connection = require('../../db.js');

const marvelDetailsService = {

    create: async (body) => {
        try {
            body.forEach(async (element) => {
                var query = `INSERT INTO marveldetail 
                (D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, MarvelDetail_Employee, MarvelCode_Marvel)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                // const result = await (await connection).query(query, [
                //     element.kycongchitiet.D1, element.kycongchitiet.D2, element.kycongchitiet.D3, element.kycongchitiet.D4, element.kycongchitiet.D5,
                //     element.kycongchitiet.D6, element.kycongchitiet.D7, element.kycongchitiet.D8, element.kycongchitiet.D9, element.kycongchitiet.D10,
                //     element.kycongchitiet.D11, element.kycongchitiet.D12, element.kycongchitiet.D13, element.kycongchitiet.D14, element.kycongchitiet.D15,
                //     element.kycongchitiet.D16, element.kycongchitiet.D17, element.kycongchitiet.D18, element.kycongchitiet.D19, element.kycongchitiet.D20,
                //     element.kycongchitiet.D21, element.kycongchitiet.D22, element.kycongchitiet.D23, element.kycongchitiet.D24, element.kycongchitiet.D25,
                //     element.kycongchitiet.D26, element.kycongchitiet.D27, element.kycongchitiet.D28, element.kycongchitiet.D29, element.kycongchitiet.D30,
                //     element.kycongchitiet.D31,  element.item.Id, element.kycongchitiet.MarvelCode
                // ]);
            });
        } catch (error) {
            throw error;
        }
    },
}

module.exports = marvelDetailsService;