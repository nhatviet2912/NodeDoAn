const fileUpload = require('express-fileupload');

const uploadOptions = {
    useTempFiles: true,
    tempFileDir: '/tmp/'
};

const handleFileUpload = async (req, res, next) => {
    try {
        const excel = req.files.file;

        if (excel.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            fs.unlinkSync(excel.tempFilePath)
            return res.status(400).json({ msg: 'File is invalid' })
        }

        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    fileUploadMiddleware: fileUpload(uploadOptions),
    handleFileUpload,
};