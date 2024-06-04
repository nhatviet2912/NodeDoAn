function formatDate(data){
    if(data != null){
        const year = data.getFullYear();
        const month = String(data.getMonth() + 1).padStart(2, '0');
        const day = String(data.getDate()).padStart(2, '0');
        var date = `${year}-${month}-${day}`;
        return date;       
    }
    return '';

}

function formatDateDDMMYYYY(value) {
    if (value != null) {
        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return '';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
    return '';
}

function formatVND(number) {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


module.exports = { formatDate, formatDateDDMMYYYY, formatVND };