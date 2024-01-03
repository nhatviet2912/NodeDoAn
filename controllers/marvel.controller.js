const marvelService = require('../services/marvel/marvel.service');

const marvelController = {

    getAllPageData: async(req, res) => {
        try {
            const pageSize = parseInt(req.query.pagesize) || 10;
            const pageIndex = parseInt(req.query.pageindex) || 1;
      
            const data = await marvelService.getAllPageData(pageSize, pageIndex);
            const total = await marvelService.getTotal();
      
            if (data.length > 0) {
                res.status(200).json({
                    message: 'success',
                    error: 0,
                    data: {
                        pageSize,
                        pageIndex,
                        data,
                        total
                    },
                });
            } else {
                res.status(200).json({
                    message: 'Danh sách sách rỗng!',
                    error: 1,
                    data: {
                        pageSize,
                        pageIndex,
                        data,
                        total
                    },
                });
            }
        } catch (error) {
            res.status(500).json({
              message: `Có lỗi xảy ra! ${error.message}`,
              error: 1,
            });
        }
    },

    created: async(req, res) => {
        try {
            const { MarvelCode, Year, Month } = req.body;
            const DayWorkMonth = demSoNgayLamViec(Month, Year);

            req.body.DayWorkMonth = DayWorkMonth;
            const data = await marvelService.create(req.body);
            return res.status(201).json({
                message: 'success',
                error: 0,
                data
            })
        } catch (error) {
            res.status(400).json({
                message: `Có lỗi xảy ra! ${error.message}`,
                error: 1,
            })
        }
    },
}


function demSoNgayLamViec(month, year) {
    let dem = 0;
    // Start from the first day of the given month
    let dt = new Date(year, month - 1, 1);

    // Continue iterating until the month changes
    while (dt.getMonth() === month - 1) {
        // Check if the current day is not Sunday (0 corresponds to Sunday)
        if (dt.getDay() !== 0) {
            dem = dem + 1;
        }

        // Move to the next day
        dt.setDate(dt.getDate() + 1);
    }

    return dem;
}

module.exports = marvelController;