import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeckGL, { MapView } from 'deck.gl';
import { EditableGeoJsonLayer, DrawLineStringMode, EditMode } from 'nebula.gl';
import { EditingMode, DrawPolygonMode } from "react-map-gl-draw";
import { StaticMap, _MapContext as MapContext } from 'react-map-gl';

const myFeatureCollection = {
    type: 'FeatureCollection',
    features: [
        /* insert features here */
    ]
};

const selectedFeatureIndexes = [];

class GeoRoute extends Component {
    state = {
        data: myFeatureCollection,
        myMode: DrawLineStringMode,
        viewport: {
            longitude: 80.94870109683097,
            latitude: 26.85188859998891,
            zoom: 14,
            pitch: 0,
            bearing: 0
        }
    };

    render() {
        const layer = new EditableGeoJsonLayer({
            id: 'geojson-layer',
            data: this.state.data,
            mode: this.state.myMode,
            selectedFeatureIndexes,

            onEdit: ({ updatedData }) => {
                this.setState({
                    data: updatedData,
                });
                if (this.state.data.features.length === 1) {
                    this.setState({
                        myMode: EditingMode
                    });
                }
                console.log(this.state.data)
            }
        });

        return (
            <DeckGL initialViewState={this.state.viewport} ContextProvider={MapContext.Provider} layers={[layer]}
                style={{ width: "100vw", height: "100vh" }}
                views={
                    new MapView({
                        id: "basemap",
                        controller: {
                            doubleClickZoom: false
                        }
                    })
                } >
                <StaticMap
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                />
                {
                    this.state.data.features.length === 1 && (
                        <Stack spacing={2} sx={{ mt: 10, ml: 1 }} direction="row">
                            <Button variant="contained" color="error"
                                onClick={(e) => {
                                    this.setState({
                                        data: myFeatureCollection,
                                        myMode: DrawLineStringMode
                                    })
                                }}
                            >Delete GeoRoute</Button>
                        </Stack>
                    )
                }
            </DeckGL>
        );
    }
}

export default GeoRoute;