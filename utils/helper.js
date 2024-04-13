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


module.exports = { formatDate };