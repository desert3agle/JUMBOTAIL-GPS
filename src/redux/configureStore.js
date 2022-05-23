import { Assets } from './assets';
import { OneAsset } from "./oneAsset"
import { PastRoute } from "./pastRoute"
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import logger from "redux-logger";

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            assets: Assets,
            oneAsset: OneAsset,
            pastRoute: PastRoute
        }),
        //middleware to keep watch at state memes
        applyMiddleware(thunk, logger)
    );
    return store;
}