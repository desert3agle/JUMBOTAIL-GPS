import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeckGL, { MapView } from 'deck.gl';
import { EditableGeoJsonLayer, DrawLineStringMode, EditMode } from 'nebula.gl';
import { EditingMode, DrawPolygonMode } from "react-map-gl-draw";
import { StaticMap, _MapContext as MapContext } from 'react-map-gl';
import { withRouter } from 'react-router-dom';

const myFeatureCollection = {
    type: 'FeatureCollection',
    features: [
        /* insert features here */
    ]
};

const selectedFeatureIndexes = [];

class GeoRoute extends Component {
    constructor(props) {
        super(props);
        let assets;
        for (let i = 0; i < props.assets.assets.length; i++) {
            if (props.assets.assets[i]._id === this.props.match.params.id) {
                assets = props.assets.assets[i]
                break;
            }
        }
        this.state = {
            data: {
                type: "FeatureCollection",
                features: (assets["georoute"] ? [{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: assets.georoute.coordinates
                    }
                }] : [])
            },
            myMode: (assets["georoute"] ? EditingMode : DrawLineStringMode),
            viewport: {
                longitude: assets.location.coordinates[0],
                latitude: assets.location.coordinates[1],
                zoom: 16,
                pitch: 0,
                bearing: 0
            }
        };
        this.deleteAppear = this.deleteAppear.bind(this);
    }
    deleteAppear(e) {
        this.props.deleteRoute(this.props.match.params.id);
        this.setState({
            data: myFeatureCollection,
            myMode: DrawLineStringMode
        })
    }
    render() {
        if (this.props.user.userLoading) {
            return (<div />);
        }
        if (this.props.user.userFailed === true || this.props.user.user === null) {
            this.props.history.push("/login")
            return (<div />);
        }
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
                    const data = {
                        georoute: {
                            type: "LineString",
                            coordinates: updatedData.features[0].geometry.coordinates
                        }
                    }
                    this.props.updateRoute(data, this.props.match.params.id);
                }
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
                                onClick={this.deleteAppear}
                            >Delete GeoRoute</Button>
                        </Stack>
                    )
                }
            </DeckGL>
        );
    }
}

export default withRouter(GeoRoute);