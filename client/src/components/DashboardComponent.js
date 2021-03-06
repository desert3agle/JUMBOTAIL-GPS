import * as React from 'react';
import { StaticMap, Marker, Popup, NavigationControl } from 'react-map-gl';
import { useState, useEffect } from 'react';
import { Room, LocalShipping, Accessibility } from '@material-ui/icons';
import DeckGL, { FlyToInterpolator, MapView } from 'deck.gl';
import { _MapContext as MapContext } from 'react-map-gl';
import Stack from '@mui/material/Stack';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Box } from "@mui/material";
import useLocalState from "../utils/localState";
import queryString from '../utils/queryString';
import { parseISO } from "date-fns"
import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getBoundsForPoints, getPoints } from "../utils/portSetter";
import { makeStyles } from "@material-ui/core/styles";
import mapboxgl from 'mapbox-gl';
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const useStyles = makeStyles({
    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "blue"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "purple"
        },
        "& .MuiOutlinedInput-input": {
            color: "blue"
        },
        "&:hover .MuiOutlinedInput-input": {
            color: "red"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
            color: "purple"
        },
        "& .MuiInputLabel-outlined": {
            color: "blue"
        },
        "&:hover .MuiInputLabel-outlined": {
            color: "red"
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "purple"
        }
    }
});
const MarkLocation = (assetType) => {
    if (assetType.assetType === "truck") {
        return (
            <LocalShipping style={
                {
                    fontSize: 40,
                    cursor: "pointer"
                }
            } />
        );
    }
    else {
        return (
            <Accessibility style={
                {
                    fontSize: 40,
                    cursor: "pointer"
                }
            } />
        );
    }
}
function Dash(props) {
    const classes = useStyles();
    const hist = useHistory();
    const [options, setOptions] = useLocalState("options", null);
    const [inputOptions, setInputOptions] = useLocalState("inputOptions", '');
    const [singleID, setSingleID] = useLocalState("singleID", null);
    const [inputSingleID, setInputSingleID] = useLocalState("inputSingleID", '');
    const [typeID, setTypeID] = useLocalState("typeID", null);
    const [inputTypeID, setInputTypeID] = useLocalState("inputTypeID", '');
    const [dateOne, setDateOne] = useLocalState("dateOne", new Date('2022-05-01'));
    const [dateTwo, setDateTwo] = useLocalState("dateTwo", null);
    const [assets, setAssets] = useState([...props.assets.assets]);
    const [downDiv, setDownDiv] = useLocalState("downDiv", 0);
    const [populate, setPopulate] = useState(() => {
        if (downDiv === 2) {
            if (props.oneAsset.oneAsset.length === 0) {
                return [];
            }
            else {
                return [...props.oneAsset.oneAsset];
            }
        }
        else if (downDiv === 1 && singleID !== null) {
            let tempAssets = props.assets.assets;
            for (let i = 0; i < tempAssets.length; i++) {
                if (singleID.value === tempAssets[i]._id) {
                    let temp = [];
                    temp.push(tempAssets[i]);
                    return temp;
                }
            }
            return [];
        }
        else {
            return assets;
        }
    });
    const optionsArray = [
        {
            label: "Search by ID",
            value: 1
        },
        {
            label: "Search by Type and Time",
            value: 2
        }
    ];
    const typeArray = ["salesman", "truck"];
    const [viewport, setViewport] = useState(() => {
        let bounds = ({
            latitude: null,
            longitude: null,
            zoom: null
        });
        if (populate.length === 0) {
            let coordinates = getPoints(assets);
            if (assets.length !== 0) {
                bounds = getBoundsForPoints(coordinates);
            }
        }
        else {
            let coordinates = getPoints(populate);
            if (populate.length !== 0) {
                bounds = getBoundsForPoints(coordinates);
            }
        }
        return {
            ...bounds,
            bearing: 0,
            pitch: 0,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator()
        }
    });
    const [currShown, setCurrShown] = useState([viewport.longitude, viewport.latitude]);
    useEffect(() => {
        if (downDiv === 2 && props.oneAsset.oneAsset.length === 0 && props.oneAsset.errMess === null) {
            queryString(typeID, dateOne, dateTwo, props.getOneAsset);
        }
    }, [assets]);
    if (props.user.userLoading) {
        return (<div />);
    }
    if (props.user.userFailed === true || props.user.user === null) {
        hist.push("/login")
        return (<div />);
    }
    if (props.assets.assets.length === 0) {
        return (<div />);
    }
    return (
        <DeckGL ContextProvider={MapContext.Provider} initialViewState={{ ...viewport }} controller={true}
            style={{ width: "100vw", height: "100vh" }}
            onViewStateChange={({ viewState }) => {
                setViewport(viewState);
            }}
        >
            <StaticMap
                mapboxApiAccessToken="pk.eyJ1Ijoia2VsdmluMDE3OSIsImEiOiJjbDNidTR6ejMwYjY4M2pxbnl3NHY0cnVmIn0.MpsIYRNO774eeAdhSACtsw"
                mapStyle="mapbox://styles/mapbox/streets-v9"
            />
            <div style={{ position: "absolute", right: 50, top: 90, zIndex: 1 }}>
                <NavigationControl />
            </div>
            {
                populate.map((ele, index) => (
                    <React.Fragment key={index}>
                        <Marker longitude={ele.location.coordinates[0]} latitude={ele.location.coordinates[1]} anchor="top"
                            onClick={() => {
                                setCurrShown(ele.location.coordinates)
                                setViewport({
                                    longitude: ele.location.coordinates[0],
                                    latitude: ele.location.coordinates[1],
                                    zoom: 16,
                                    bearing: 0,
                                    pitch: 0,
                                    transitionDuration: 2000,
                                    transitionInterpolator: new FlyToInterpolator()
                                })
                            }}
                        >
                            <MarkLocation assetType={ele.assetType} />
                        </Marker>
                        {
                            currShown === ele.location.coordinates && (
                                <Popup longitude={currShown[0]} latitude={currShown[1]}
                                    anchor="right" closeOnClick={true} onClose={() => {
                                        setCurrShown(null);
                                        setViewport(() => {
                                            let bounds = ({
                                                latitude: null,
                                                longitude: null,
                                                zoom: null
                                            });
                                            let coordinates = getPoints(assets);
                                            if (assets.length !== 0) {
                                                bounds = getBoundsForPoints(coordinates);
                                            }
                                            return {
                                                ...bounds,
                                                bearing: 0,
                                                pitch: 0,
                                                transitionDuration: 500,
                                                transitionInterpolator: new FlyToInterpolator()
                                            }
                                        });
                                    }}>
                                    <Card sx={{ maxWidth: 345 }}>
                                        {
                                            ele.assetType === "truck" ? (
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image="/truckImg.jpg"
                                                    alt="green iguana"
                                                />
                                            ) : (
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image="/salesMan.jpg"
                                                    alt="green iguana"
                                                />
                                            )
                                        }
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {ele.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {ele.assetType}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Stack direction={{ xs: "column", sm: "column", md: "row" }}
                                                spacing={1}>
                                                <Button variant="contained" onClick={(event) => {
                                                    props.getPastRoute(ele._id);
                                                    setDownDiv(0);
                                                    setOptions(null);
                                                    setPopulate(assets);
                                                    setSingleID(null);
                                                    setInputSingleID('');
                                                    setTypeID(null);
                                                    setInputTypeID('');
                                                    setDateOne(new Date('2022-05-01'));
                                                    setDateTwo(null);
                                                    hist.push(`/track/${ele._id}`);
                                                }}>Track</Button>
                                                <Button variant="contained" onClick={(event) => {
                                                    props.sendFence(ele);
                                                    setDownDiv(0);
                                                    setOptions(null);
                                                    setPopulate(assets);
                                                    setSingleID(null);
                                                    setInputSingleID('');
                                                    setTypeID(null);
                                                    setInputTypeID('');
                                                    setDateOne(new Date('2022-05-01'));
                                                    setDateTwo(null);
                                                    hist.push(`/fence/${ele._id}`);
                                                }}>Geofence</Button>
                                                <Button variant="contained" onClick={(event) => {
                                                    props.sendRoute(ele);
                                                    setDownDiv(0);
                                                    setOptions(null);
                                                    setPopulate(assets);
                                                    setSingleID(null);
                                                    setInputSingleID('');
                                                    setTypeID(null);
                                                    setInputTypeID('');
                                                    setDateOne(new Date('2022-05-01'));
                                                    setDateTwo(null);
                                                    hist.push(`/route/${ele._id}`);
                                                }}>Georoute</Button>
                                            </Stack>
                                        </CardActions>
                                    </Card>

                                </Popup>
                            )
                        }
                    </React.Fragment>
                ))
            }
            <div>
                <Autocomplete
                    style={{ paddingTop: "100px", paddingLeft: "10px" }}
                    value={options}
                    onChange={(event, newValue) => {
                        setOptions(newValue);
                        if (newValue === null) {
                            setDownDiv(0);
                            setPopulate(assets);
                            setSingleID(null);
                            setInputSingleID('');
                            setTypeID(null);
                            setInputTypeID('');
                            setDateOne(new Date('2022-05-01'));
                            setDateTwo(null);
                            setViewport(() => {
                                let bounds = ({
                                    latitude: null,
                                    longitude: null,
                                    zoom: null
                                });
                                let coordinates = getPoints(assets);
                                if (assets.length !== 0) {
                                    bounds = getBoundsForPoints(coordinates);
                                }
                                return {
                                    ...bounds,
                                    bearing: 0,
                                    pitch: 0,
                                    transitionDuration: 2000,
                                    transitionInterpolator: new FlyToInterpolator()
                                }
                            });
                        }
                        else if (newValue.value === 1) {
                            setTypeID(null);
                            setInputTypeID('');
                            setDateOne(new Date('2022-05-01'));
                            setDateTwo(null);
                            setDownDiv(newValue.value);
                            setPopulate(assets);
                            setViewport(() => {
                                let bounds = ({
                                    latitude: null,
                                    longitude: null,
                                    zoom: null
                                });
                                let coordinates = getPoints(assets);
                                if (assets.length !== 0) {
                                    bounds = getBoundsForPoints(coordinates);
                                }
                                return {
                                    ...bounds,
                                    bearing: 0,
                                    pitch: 0,
                                    transitionDuration: 2000,
                                    transitionInterpolator: new FlyToInterpolator()
                                }
                            });
                        }
                        else {
                            setSingleID(null);
                            setInputSingleID('');
                            setDownDiv(newValue.value);
                            setPopulate(assets);
                            setViewport(() => {
                                let bounds = ({
                                    latitude: null,
                                    longitude: null,
                                    zoom: null
                                });
                                let coordinates = getPoints(assets);
                                if (assets.length !== 0) {
                                    bounds = getBoundsForPoints(coordinates);
                                }
                                return {
                                    ...bounds,
                                    bearing: 0,
                                    pitch: 0,
                                    transitionDuration: 2000,
                                    transitionInterpolator: new FlyToInterpolator()
                                }
                            });
                        }
                    }}
                    inputValue={inputOptions}
                    onInputChange={(event, newInputValue) => {
                        setInputOptions(newInputValue);
                    }}
                    id="controllable-states-options"
                    options={optionsArray}
                    sx={{ width: 250 }}
                    renderInput={(params) => <TextField {...params} className={classes.root} label="Filter Option" />}
                />
                <React.Fragment>
                    {
                        downDiv === 1 && (
                            <Autocomplete
                                color='white'
                                style={{ paddingTop: "10px", paddingLeft: "10px" }}
                                value={singleID}
                                onChange={(event, newValue) => {
                                    setSingleID(newValue);
                                    if (newValue === null) {
                                        setPopulate(assets);
                                        setViewport(() => {
                                            let bounds = ({
                                                latitude: null,
                                                longitude: null,
                                                zoom: null
                                            });
                                            let coordinates = getPoints(assets);
                                            if (assets.length !== 0) {
                                                bounds = getBoundsForPoints(coordinates);
                                            }
                                            return {
                                                ...bounds,
                                                bearing: 0,
                                                pitch: 0,
                                                transitionDuration: 2000,
                                                transitionInterpolator: new FlyToInterpolator()
                                            }
                                        });
                                    }
                                    else {
                                        let tempAssets = props.assets.assets;
                                        for (let i = 0; i < tempAssets.length; i++) {
                                            if (newValue.value === tempAssets[i]._id) {
                                                let temp = [];
                                                temp.push(tempAssets[i]);
                                                setPopulate([...temp]);
                                                setViewport(() => {
                                                    let bounds = ({
                                                        latitude: null,
                                                        longitude: null,
                                                        zoom: null
                                                    });
                                                    let coordinates = getPoints(temp);
                                                    if (temp.length !== 0) {
                                                        bounds = getBoundsForPoints(coordinates);
                                                    }
                                                    return {
                                                        ...bounds,
                                                        bearing: 0,
                                                        pitch: 0,
                                                        transitionDuration: 2000,
                                                        transitionInterpolator: new FlyToInterpolator()
                                                    }
                                                });
                                                break;
                                            }
                                        }
                                    }
                                }}
                                inputValue={inputSingleID}
                                onInputChange={(event, newInputValue) => {
                                    setInputSingleID(newInputValue);
                                }}
                                id="controllable-states-ID"
                                options={assets.map((ele) => {
                                    return {
                                        label: `${ele.name} (${ele._id})`,
                                        value: ele._id
                                    }
                                })}
                                sx={{ width: 250 }}
                                renderInput={(params) => <TextField {...params} className={classes.root} label="Filter By ID" />}
                            />
                        )
                    }
                    {
                        downDiv === 2 && (
                            <React.Fragment>
                                <Autocomplete
                                    style={{ paddingTop: "10px", paddingLeft: "10px" }}
                                    value={typeID}
                                    onChange={(event, newValue) => {
                                        setTypeID(newValue);
                                        queryString(newValue, dateOne, dateTwo, props.getOneAsset);
                                    }}
                                    inputValue={inputTypeID}
                                    onInputChange={(event, newInputValue) => {
                                        setInputTypeID(newInputValue);
                                    }}
                                    id="controllable-states-typeID"
                                    options={typeArray}
                                    sx={{ width: 250 }}
                                    renderInput={(params) => <TextField {...params} className={classes.root} label="Asset Type" />}
                                />
                                <Box width="250px" style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Stack spacing={3}>
                                            <DesktopDatePicker
                                                label="Start Date"
                                                value={dateOne}
                                                minDate={new Date(parseISO('2020-05-15'))}
                                                onChange={(newValue) => {
                                                    setDateOne(newValue);
                                                    queryString(typeID, newValue, dateTwo, props.getOneAsset);
                                                }}
                                                renderInput={(params) => <TextField {...params} className={classes.root} />}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Box>
                                <Box width="250px" style={{ paddingTop: "10px", paddingLeft: "10px" }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Stack spacing={3}>
                                            <DesktopDatePicker
                                                label="End Date"
                                                value={dateTwo}
                                                minDate={parseISO(dateOne)}
                                                onChange={(newValue) => {
                                                    setDateTwo(newValue);
                                                    queryString(typeID, dateOne, newValue, props.getOneAsset);
                                                }}
                                                renderInput={(params) => <TextField {...params} className={classes.root} />}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                </Box>
                            </React.Fragment>
                        )
                    }
                </React.Fragment>
            </div>
        </DeckGL>
    )
}


export default Dash;
