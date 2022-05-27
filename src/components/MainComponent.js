import React, { Component } from 'react';
import HeaderComponent from "./HeaderComponent";
import App from "./MapComponent";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { getAssets, getOneAsset, getPastRoute, loginUser, logoutUser, registerUser, userExist } from "../redux/ActionCreators";
import { connect } from "react-redux";
import ColumnGroupingTable from './AboutComponent';
import Dash from "./DashboardComponent";
import SignInSide from './LoginComponent';
import SignUpSide from './RegisterComponent';
import Fence from './FenceComponent';
import GeoRoute from './RouteComponent';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//mapping the state from combine reducers
const mapStateToProps = state => {
    return {
        assets: state.assets,
        oneAsset: state.oneAsset,
        pastRoute: state.pastRoute,
        user: state.user
    }
}
//dispatch comments from ActionCreators
const mapDispatchToProps = (dispatch) => ({
    getAssets: (token) => dispatch(getAssets(token)),
    getOneAsset: (str) => dispatch(getOneAsset(str)),
    getPastRoute: (id) => dispatch(getPastRoute(id)),
    loginUser: (params) => dispatch(loginUser(params)),
    registerUser: (params) => dispatch(registerUser(params)),
    logoutUser: () => dispatch(logoutUser()),
    userExist: () => dispatch(userExist())
});
class Main extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.userExist();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user) {
            if (this.props.user.user !== null) {
                this.props.getAssets(this.props.user.token);
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
    }
    render() {
        console.log(this.props.assets)
        console.log(this.props.pastRoute)
        console.log(this.props.user);
        const DashPage = () => {
            return (<Dash assets={this.props.assets} getAssets={this.props.getAssets}
                oneAsset={this.props.oneAsset} getOneAsset={this.props.getOneAsset}
                getPastRoute={this.props.getPastRoute} user={this.props.user} />)
        };
        const AppPage = () => {
            return (<App assets={this.props.assets} pastRoute={this.props.pastRoute} user={this.props.user} />)
        };
        return (
            <div>
                <HeaderComponent user={this.props.user} logoutUser={this.props.logoutUser} />
                <Switch>
                    <Route path="/login" component={() => <SignInSide user={this.props.user} loginUser={this.props.loginUser} getAssets={this.props.getAssets} />} />
                    <Route path="/register" component={() => <SignUpSide registerUser={this.props.registerUser} user={this.props.user} />} />
                    <Route exact path="/dash" component={DashPage} />
                    <Route exact path="/track" component={AppPage} />
                    <Route exact path="/about" component={() => <ColumnGroupingTable assets={this.props.assets} user={this.props.user} />} />
                    <Route exact path="/fence" component={Fence} />
                    <Route exact path="/route" component={GeoRoute} />
                    <Redirect to={"/dash"} />
                </Switch>
                <ToastContainer />
            </div>
        );
    }
}
//for connecting the dispatch functions and state from combine reducers with state
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));