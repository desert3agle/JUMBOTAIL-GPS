import React, { Component } from "react";
import HeaderComponent from "./HeaderComponent";
import App from "./MapComponent";
import Dash from "./DashboardComponent";
import { Routes, Route, withRouter } from 'react-router-dom';

class Main extends Component {
    render() {
        return (
            <div>
                <HeaderComponent />
                <Routes>
                    <Route exact path="/dashboard" element={<Dash />} />
                    <Route path="/track" element={<App />} />
                    <Route path="*" element={<Dash />} />
                </Routes>
            </div>
        )
    }
}

export default Main;