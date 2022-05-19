import * as React from 'react';
import ReactMapGL, { StaticMap, Marker, Popup } from 'react-map-gl';
import { useState } from 'react';
import { Room } from '@material-ui/icons';
import DeckGL from 'deck.gl';
import { _MapContext as MapContext } from 'react-map-gl';
import { PathLayer } from "@deck.gl/layers";
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';

const data = [{
    name: "random-name",
    color: [101, 147, 245],
    path: [
        [-74.00578, 40.713067],
        [-74.004577, 40.712425],
        [-74.003626, 40.713650],
        [-74.002666, 40.714243],
        [-74.002136, 40.715177],
        [-73.998493, 40.713452],
        [-73.997981, 40.713673],
        [-73.997586, 40.713448],
        [-73.99256, 40.713863]]
}
]
function Dash() {
    const layer = [
        new PathLayer({
            id: "path-layer",
            data,
            getWidth: data => 7,
            getColor: data => data.color,
            widthMinPixels: 7
        })
    ]
    var len = data[0].path.length;
    const [viewport, setViewport] = useState({
        longitude: data[0].path[len - 1][0],
        latitude: data[0].path[len - 1][1],
        zoom: 16
    });
    const [currShown, setCurrShown] = useState(null);
    return (
        <div>
            <DeckGL ContextProvider={MapContext.Provider} initialViewState={{ ...viewport }} controller={true}
                style={{ width: "100vw", height: "100vh" }}
            >
                <ReactMapGL
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                />
                <Marker longitude={viewport.longitude} latitude={viewport.latitude} anchor="top"
                    onClick={() => { setCurrShown([viewport.longitude, viewport.latitude]) }}
                >
                    <Room style={
                        {
                            fontSize: 40,
                            cursor: "pointer"
                        }
                    } />
                </Marker>
                {
                    currShown !== null && (
                        <Popup longitude={currShown[0]} latitude={currShown[1]}
                            anchor="left" closeOnClick={false} onClose={() => { setCurrShown(null) }}>
                            <p>{currShown[0]}</p>
                            <p>{currShown[1]}</p>
                            <Button variant="contained" onClick={e => window.location.href = "/track"}>Track</Button>
                        </Popup>
                    )
                }
                <div>

                </div>
            </DeckGL>
        </div>
    );
}


export default Dash;
