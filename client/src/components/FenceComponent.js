import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl';
import { EditableGeoJsonLayer, DrawLineStringMode, EditMode } from 'nebula.gl';
import { EditingMode, DrawPolygonMode } from "react-map-gl-draw";
import { StaticMap, _MapContext as MapContext, Marker, NavigationControl } from 'react-map-gl';
import { Room } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { getBoundsForPoints } from "../utils/portSetter";
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const myFeatureCollection = {
    type: 'FeatureCollection',
    features: [
        /* insert features here */
    ]
};
const setInit = {
    longitude: -74.1,
    latitude: 40.7,
    zoom: 14,
    pitch: 0,
    bearing: 0,
    transitionDuration: 2000,
    transitionInterpolator: new FlyToInterpolator()
};
const selectedFeatureIndexes = [];

class Fence extends Component {
    constructor(props) {
        super(props)
        let assets = null;
        for (let i = 0; i < props.assets.assets.length; i++) {
            if (props.assets.assets[i]._id === this.props.match.params.id) {
                assets = props.assets.assets[i]
                break;
            }
        }
        let bounds = {
            longitude: 80,
            latitude: 20,
            zoom: 16
        }
        let points = assets === null ? [] : [assets.location.coordinates];
        if (assets !== null && assets["geofence"]) {
            for (let i = 0; i < assets.geofence.coordinates.length; i++) {
                points.push(assets.geofence.coordinates[i]);
            }
        }
        if (points.length > 0) {
            bounds = getBoundsForPoints(points);
        }
        this.state = {
            data: {
                type: "FeatureCollection",
                features: (assets !== null && assets["geofence"] ? [{
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [assets.geofence.coordinates]
                    }
                }] : [])
            },
            myMode: (assets !== null && assets["geofence"] ? EditingMode : DrawPolygonMode),
            viewport: {
                ...bounds,
                pitch: 0,
                bearing: 0
            },
            coordinates: {
                longitude: (assets !== null ? assets.location.coordinates[0] : 80),
                latitude: (assets !== null ? assets.location.coordinates[1] : 20),
            }
        };
        this.deleteAppear = this.deleteAppear.bind(this);
    }
    deleteAppear(e) {
        this.props.deleteFence(this.props.match.params.id);
        this.setState({
            data: myFeatureCollection,
            myMode: DrawPolygonMode
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
                        geofence: {
                            type: "Polygon",
                            coordinates: updatedData.features[0].geometry.coordinates[0]
                        }
                    }
                    this.props.updateFence(data, this.props.match.params.id);
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
                    mapboxApiAccessToken="pk.eyJ1Ijoia2VsdmluMDE3OSIsImEiOiJjbDNidTR6ejMwYjY4M2pxbnl3NHY0cnVmIn0.MpsIYRNO774eeAdhSACtsw"
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                />
                <div style={{ position: "absolute", right: 50, top: 90, zIndex: 1 }}>
                    <NavigationControl />
                </div>
                <Marker longitude={this.state.coordinates.longitude} latitude={this.state.coordinates.latitude} anchor="left"
                >
                    <Room style={
                        {
                            fontSize: 40,
                            cursor: "pointer"
                        }
                    } />
                </Marker>
                <Stack spacing={1} sx={{ mt: 10, ml: 1, mr: 1 }} direction={{ xs: "column", sm: "row", md: "row" }}>
                    <Button variant="contained" onClick={e => this.props.history.push("/dashboard")}>Go Back To Dashboard</Button>
                    {
                        this.state.data.features.length === 1 && (
                            <Button variant="contained" color="error"
                                onClick={this.deleteAppear}
                            >Delete GeoFence</Button>
                        )
                    }
                </Stack>
            </DeckGL>
        );
    }
}

export default withRouter(Fence);