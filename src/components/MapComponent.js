import * as React from 'react';
import ReactMapGL, { StaticMap, Marker, Popup } from 'react-map-gl';
import { useState, useEffect } from 'react';
import { Room } from '@material-ui/icons';
import DeckGL from 'deck.gl';
import { _MapContext as MapContext } from 'react-map-gl';
import { PathLayer } from "@deck.gl/layers";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import { getBoundsForPoints, getPoints } from "../utils/portSetter";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const createData = (name, routes) => {
    const color = [101, 147, 245];
    const data = [{
        name: name,
        color: color,
        path: (routes === null ? [] : routes.map(ele => ele.coordinates))
    }]
    return data;
}
const getName = (assets, pastRoute) => {
    if (pastRoute === null || pastRoute.length === 0) {
        return null;
    }
    else {
        for (let i = 0; i < assets.length; i++) {
            if (assets[i].route[assets[i].route.length - 1]._id === pastRoute[pastRoute.length - 1]._id) {
                return assets[i].name;
            }
        }
    }
    return "Name";
}
function App(props) {
    const history = useHistory();
    const params = useParams();
    const [pastRoute, setPastRoute] = useState(props.pastRoute.pastRoute);
    const [assets, setAssets] = useState(props.assets.assets);
    const data = createData("path-layer", pastRoute);
    const name = getName(assets, pastRoute);
    const layer = [
        new PathLayer({
            id: "path-layer",
            data,
            getWidth: data => 7,
            getColor: data => data.color,
            widthMinPixels: 7
        })
    ];
    const [viewport, setViewport] = useState(() => {
        let bounds = {
            latitude: null,
            longitude: null,
            zoom: null
        }
        if (pastRoute === null || pastRoute.length === 0) {
            const coordinates = getPoints(assets);
            if (assets.length !== 0) {
                bounds = getBoundsForPoints(coordinates);
            }
        }
        else {
            const coordinates = pastRoute.map(ele => ele.coordinates);
            bounds = getBoundsForPoints(coordinates);
        }
        return {
            ...bounds,
            bearing: 0,
            pitch: 0
        }
    });
    const [currShown, setCurrShown] = useState(null);
    useEffect(() => {
        if (props.pastRoute.errMess === null && props.pastRoute.pastRoute === null) {
            props.getPastRoute(params.id);
        }
    }, [assets])
    useEffect(() => {
        if (pastRoute !== null && pastRoute.length === 0 && props.pastRoute.errMess === null) {
            toast.warn("There are no routes in the past 24 hours!")
        }
    }, [pastRoute]);

    if (props.user.userLoading || props.pastRoute.errMess !== null) {
        return (<div />);
    }
    if (props.user.userFailed === true || props.user.user === null) {
        history.push("/login")
        return (<div />);
    }
    return (
        <div>
            <DeckGL ContextProvider={MapContext.Provider} initialViewState={{ ...viewport }} controller={true}
                style={{ width: "100vw", height: "100vh" }} layers={layer}
            >
                <ReactMapGL
                    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                />
                {
                    data[0].path.map((ele, index) => (
                        <React.Fragment key={index}>
                            <Marker longitude={ele[0]} latitude={ele[1]} anchor="top"
                                onClick={() => { setCurrShown(ele) }}
                            >
                                <Room style={
                                    {
                                        fontSize: 40,
                                        cursor: "pointer"
                                    }
                                } />
                            </Marker>
                            {
                                currShown === ele && (
                                    <Popup longitude={currShown[0]} latitude={currShown[1]}
                                        anchor="left" closeOnClick={false} onClose={() => { setCurrShown(null) }}>
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image="/static/images/cards/contemplative-reptile.jpg"
                                                alt="green iguana"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    latitude={currShown[1]}
                                                    <br></br>
                                                    longitude={currShown[0]}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Popup>
                                )
                            }
                        </React.Fragment>
                    ))
                }
                <div>
                    <Stack spacing={2} direction="row" style={{ paddingTop: "100px", paddingLeft: "10px" }}>
                        <Button variant="contained" onClick={e => history.push("/dashboard")}>Go Back To Dashboard</Button>
                    </Stack>
                </div>
            </DeckGL>
        </div>
    );
}


export default App;
