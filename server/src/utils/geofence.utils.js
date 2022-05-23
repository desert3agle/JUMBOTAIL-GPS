
const PI = Math.PI;

const toRadians = (degrees) => {
    return degrees * Math.PI / 180
}
const tanLatGC = (lat1,  lat2, lng2, lng3) => {
    return (Math.tan(lat1) * Math.sin(lng2 - lng3) + Math.tan(lat2) * Math.sin(lng3)) / Math.sin(lng2);
}

const wrap = (n, min, max) => {
    return (n>=min && n<max)? n : (((n-min)%(max-min))+min);
}

const mercatorLatRhumb = ( lat1, lat2, lng2, lng3) => {
    return ((lat1) * (lng2 - lng3) + (lat2) * lng3) / lng2;
}
const intersects = (lat1, lat2, lng2, lat3, lng3, geodesic) => {
    if ((lng3 >= 0 && lng3 >= lng2) || (lng3 < 0 && lng3 < lng2)) {
        return false;
    }
    if (lat3 <= -PI / 2) {
        return false;
    }
    if (lat1 <= -PI / 2 || lat2 <= -PI / 2 || lat1 >= PI / 2 || lat2 >= PI / 2) {
        return false;
    }
    if (lng2 <= -PI) {
        return false;
    }  
    linearLat = (lat1 * (lng2 - lng3) + lat2 * lng3) / lng2;
    if (lat1 >= 0 && lat2 >= 0 && lat3 < linearLat) {
        return false;
    }
    if (lat1 <= 0 && lat2 <= 0 && lat3 >= linearLat) {
        return true;
    }
    if (lat3 >= PI / 2) {
        return true;
    }
    return geodesic ? Math.tan(lat3) >= tanLatGC(lat1, lat2, lng2, lng3) : (lat3) >= mercatorLatRhumb(lat1, lat2, lng2, lng3);
}

exports.containsLocation = (latitude, longitude, polygon) => {
    let size = polygon.length;
    if(size === 0) return false;

    let lat3 = toRadians(latitude);
    let lng3 = toRadians(longitude);

    let prev = polygon[size - 1];

    let lat1 = toRadians(prev[1]); // latitude
    let lng1 = toRadians(prev[0]); // longitude

    let nIntersect = 0;

    for(let i = 0; i < polygon.length; i++){
        let dLng3 = wrap(lng3 - lng1, -PI, PI);
        if (lat3 == lat1 && dLng3 == 0) {
            return true;
        }
        let lat2 = toRadians(polygon[i][1]) // latitude
        let lng2 = toRadians(polygon[i][0]) // longitude
        if (intersects(lat1, lat2, wrap(lng2 - lng1, -PI, PI), lat3, dLng3, true)) {
            ++nIntersect;
        }
        lat1 = lat2;
        lng1 = lng2;
    }
    return (nIntersect & 1) != 0;
}

