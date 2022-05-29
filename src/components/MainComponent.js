import React, { Component } from 'react';
import HeaderComponent from "./HeaderComponent";
import App from "./MapComponent";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import {
    getAssets, getOneAsset, getPastRoute, loginUser, logoutUser, registerUser, userExist,
    updateFence, updateRoute, deleteFence, deleteRoute, sendFence, sendRoute, findOneAsset
} from "../redux/ActionCreators";
import { connect } from "react-redux";
import ColumnGroupingTable from './AboutComponent';
import Dash from "./DashboardComponent";
import SignInSide from './LoginComponent';
import SignUpSide from './RegisterComponent';
import Fence from './FenceComponent';
import GeoRoute from './RouteComponent';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { io } from "socket.io-client";

//mapping the state from combine reducers
const mapStateToProps = state => {
    return {
        assets: state.assets,
        oneAsset: state.oneAsset,
        pastRoute: state.pastRoute,
        user: state.user,
        geometryMessage: state.geometryMessage,
        routeFenceData: state.routeFenceData,
        findOneAsset: state.findOneAsset
    }
}
//dispatch comments from ActionCreators
const mapDispatchToProps = (dispatch) => ({
    getAssets: () => dispatch(getAssets()),
    getOneAsset: (str) => dispatch(getOneAsset(str)),
    getPastRoute: (id) => dispatch(getPastRoute(id)),
    loginUser: (params) => dispatch(loginUser(params)),
    registerUser: (params) => dispatch(registerUser(params)),
    logoutUser: () => dispatch(logoutUser()),
    userExist: () => dispatch(userExist()),
    updateFence: (fence, id) => dispatch(updateFence(fence, id)),
    updateRoute: (route, id) => dispatch(updateRoute(route, id)),
    deleteFence: (id) => dispatch(deleteFence(id)),
    deleteRoute: (id) => dispatch(deleteRoute(id)),
    sendFence: (data) => dispatch(sendFence(data)),
    sendRoute: (data) => dispatch(sendRoute(data)),
    findOneAssetFnc: (id) => dispatch(findOneAsset(id))
});
class Main extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.userExist();
        this.state = {
            didAssetUpdate: false
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user) {
            if (this.props.user.user !== null) {
                this.props.getAssets();
            }
        }
        if (prevProps.user.errMess === "loading" && (prevProps.user.errMess !== this.props.user.errMess)) {
            if (this.props.user.userFailed === true) {
                toast.error(this.props.user.errMess);
            }
            else {
                toast.success(this.props.user.errMess);
            }
        }
        if (prevProps.geometryMessage !== this.props.geometryMessage) {
            this.props.getAssets();
            if (this.props.geometryMessage.error === false) {
                toast.success(this.props.geometryMessage.message);
            }
            else {
                toast.error(this.props.geometryMessage.message);
            }
        }
    }
    componentWillMount() {
        console.log("willmount");
        const socket = io("http://localhost:8080", {
            // transports: ['websocket'],
            withCredentials: true
        });
        socket.on("upatedAsset", (data) => {
            toast.success(`${data.name} of type ${data.assetType} is updated`);
            this.props.getAssets();
            this.props.getPastRoute(data._id);
        });
        socket.on("addedAsset", (data) => {
            toast.success(`${data.name} of type ${data.assetType} is added`);
            this.props.getAssets();
        });
        socket.on("geofenceAnomaly", (data) => {
            toast.error(`${data.description} for ${data.assetName}`);
        });
        socket.on("georouteAnomaly", (data) => {
            toast.error(`${data.description} for ${data.assetName}`);
        });
    }
    render() {
        // console.log(this.props.assets)
        // console.log(this.props.pastRoute)
        // console.log(this.props.user);
        // console.log(this.props.findOneAsset);
        const DashPage = () => {
            return (<Dash assets={this.props.assets} getAssets={this.props.getAssets}
                oneAsset={this.props.oneAsset} getOneAsset={this.props.getOneAsset}
                getPastRoute={this.props.getPastRoute} user={this.props.user} sendFence={this.props.sendFence} sendRoute={this.props.sendRoute} />)
        };
        const AppPage = () => {
            return (<App getPastRoute={this.props.getPastRoute} assets={this.props.assets} pastRoute={this.props.pastRoute} user={this.props.user} />)
        };
        return (
            <div>
                <HeaderComponent user={this.props.user} logoutUser={this.props.logoutUser} />
                <Switch>
                    <Route path="/login" component={() => <SignInSide user={this.props.user} loginUser={this.props.loginUser} getAssets={this.props.getAssets} />} />
                    <Route path="/register" component={() => <SignUpSide registerUser={this.props.registerUser} user={this.props.user} />} />
                    <Route exact path="/dash" component={DashPage} />
                    <Route path="/track/:id" component={AppPage} />
                    <Route path="/about" component={() => <ColumnGroupingTable assets={this.props.assets} user={this.props.user} />} />
                    <Route path="/fence/:id" component={() => <Fence updateFence={this.props.updateFence} deleteFence={this.props.deleteFence}
                        user={this.props.user} assets={this.props.assets} />} />
                    <Route path="/route/:id" component={() => <GeoRoute updateRoute={this.props.updateRoute} deleteRoute={this.props.deleteRoute} assets={this.props.assets} user={this.props.user} />} />
                    <Redirect to={"/dash"} />
                </Switch>
                <ToastContainer />
            </div>
        );
    }
}
//for connecting the dispatch functions and state from combine reducers with state
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));