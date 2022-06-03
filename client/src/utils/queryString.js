const queryString = (typeID, dateOne, dateTwo, getOneAsset) => {
    let str = "?";
    if (typeID !== null) {
        str += "assetType=";
        str += typeID;
        str += "&";
    }
    if (dateOne !== null) {
        str += "startTime=";
        str += new Date(dateOne).toISOString();
        str += "&";
    }
    if (dateTwo !== null) {
        str += "endTime=";
        str += new Date(dateTwo).toISOString();
        str += "&";
    }
    str = str.slice(0, str.length - 1);
    getOneAsset(str);
}

export default queryString;