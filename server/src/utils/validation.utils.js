exports.isIsoDate = (str) => {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    let d = new Date(str); 
    return d.toISOString()===str;
}

exports.isValidMail = (str) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str)){
        return true;
    }
    return false;
}

const validLatLong = (latitude, longitude) => {
    let a = true, b = true;
    if(!(isFinite(latitude) && Math.abs(latitude) <= 90)) a = false;
    if(!(isFinite(longitude) && Math.abs(longitude) <= 180)) b = false;
    return (a && b);
}


exports.isValidGeofence = (geofence) => {
    if(!geofence) return false;

    if(!(geofence.length >= 3)) return false;   

    for(let i = 0; i < geofence.length; i++){       
        if(!(geofence[i].length == 2)) return false;
        
        let latitude = geofence[i][1], longitude = geofence[i][0];
        
        if(!validLatLong(latitude, longitude)) return false;
    }

    return true;
}

exports.isClosed = (poly) => {
    let first = poly[0], last = poly[poly.length - 1];
    if((first[0] == last[0]) && (first[1] == last[1])) return true;
    else return false;
}

exports.isValidGeoroute = (georoute) => {
    if(!georoute) return false;

    if(!(georoute.length >= 2)) return false;   

    for(let i = 0; i < georoute.length; i++){       
        if(!(georoute[i].length == 2)) return false;
        
        let latitude = georoute[i][1], longitude = georoute[i][0];
        
        if(!validLatLong(latitude, longitude)) return false;
    }
    return true;
}


exports.isValidLocation = (location) => {
    if(!location) return false;
    if(!(location.length == 2)) return false;
    
    let latitude = location[1], longitude = location[0];

    if(!validLatLong(latitude, longitude)) return false;

    return true;
}

