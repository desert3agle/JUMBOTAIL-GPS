import { WebMercatorViewport } from 'deck.gl';

const applyToArray = (func, array) => func.apply(Math, array)

export const getBoundsForPoints = (points) => {
    // Calculate corner values of bounds
    const pointsLong = points.map(point => point[0])
    const pointsLat = points.map(point => point[1])
    const cornersLongLat = [
        [applyToArray(Math.min, pointsLong), applyToArray(Math.min, pointsLat)],
        [applyToArray(Math.max, pointsLong), applyToArray(Math.max, pointsLat)]
    ]
    // Use WebMercatorViewport to get center longitude/latitude and zoom
    const viewport = new WebMercatorViewport({ width: 800, height: 600 })
        .fitBounds(cornersLongLat, { padding: 200 }) // Can also use option: offset: [0, -100]
    const { longitude, latitude, zoom } = viewport
    return { longitude, latitude, zoom }
}

export const getPoints = (assets) => {
    let coordinates = [];
    assets.map((ele) => {
        coordinates.push(ele.location.coordinates);
    });
    return coordinates;
}