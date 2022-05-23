import React, { Component } from 'react';
import HeaderComponent from "./HeaderComponent";
import App from "./MapComponent";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { getAssets, getOneAsset, getPastRoute } from "../redux/ActionCreators";
import { connect } from "react-redux";
import ColumnGroupingTable from './AboutComponent';
import Dash from "./DashboardComponent";
import SignInSide from './LoginComponent';
import SignUpSide from './RegisterComponent';

//mapping the state from combine reducers
const mapStateToProps = state => {
    return {
        assets: state.assets,
        oneAsset: state.oneAsset,
        pastRoute: state.pastRoute
    }
}
//dispatch comments from ActionCreators
const mapDispatchToProps = (dispatch) => ({
    getAssets: () => dispatch(getAssets()),
    getOneAsset: (str) => dispatch(getOneAsset(str)),
    getPastRoute: (id) => dispatch(getPastRoute(id))
});
class Main extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.getAssets();
    }
    render() {
        console.log(this.props.assets)
        console.log(this.props.pastRoute)
        const DashPage = () => {
            return (<Dash assets={this.props.assets} getAssets={this.props.getAssets}
                oneAsset={this.props.oneAsset} getOneAsset={this.props.getOneAsset}
                getPastRoute={this.props.getPastRoute} />)
        };
        const AppPage = () => {
            return (<App assets={this.props.assets} pastRoute={this.props.pastRoute} />)
        };
        return (
            <div>
                <HeaderComponent />
                <Switch>
                    <Route path="/login" component={SignInSide} />
                    <Route path="/register" component={SignUpSide} />
                    <Route exact path="/dash" component={DashPage} />
                    <Route exact path="/track" component={AppPage} />
                    <Route exact path="/about" component={() => <ColumnGroupingTable assets={this.props.assets} />} />
                    <Redirect to={"/dash"} />
                </Switch>
            </div>
        );
    }
}
//for connecting the dispatch functions and state from combine reducers with state
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));