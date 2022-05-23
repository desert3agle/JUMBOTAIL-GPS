import * as  ActionTypes from './ActionTypes';
import { baseUrl } from "./baseUrl";

//Get the memes
export const getAssets = () => (dispatch) => {
    fetch(baseUrl + "/list")
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => response.json())
        .then(assets => dispatch(addAssets(assets)))
        .catch(err => dispatch(assetsFailed(err.message)));
};

//Get the memes
export const getOneAsset = (str) => (dispatch) => {
    console.log(baseUrl + "/list" + str);
    fetch(baseUrl + "/list" + str)
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => response.json())
        .then(assets => dispatch(addOneAssets(assets)))
        .catch(err => dispatch(oneAssetsFailed(err.message)));
};

export const getPastRoute = (id) => (dispatch) => {
    fetch(baseUrl + `/${id}` + "/track")
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        })
        .then(response => response.json())
        .then(assets => dispatch(addPastRoute(assets)))
        .catch(err => dispatch(pastRouteFailed(err.message)));
};


export const assetsFailed = (errMess) => ({
    type: ActionTypes.ASSETS_FAILED,
    payload: errMess
});
export const addAssets = (assets) => ({
    type: ActionTypes.ADD_ASSETS,
    payload: assets
});
export const oneAssetsFailed = (errMess) => ({
    type: ActionTypes.ONE_ASSETS_FAILED,
    payload: errMess
});
export const addOneAssets = (assets) => ({
    type: ActionTypes.ADD_ONE_ASSETS,
    payload: assets
});
export const addPastRoute = (assets) => ({
    type: ActionTypes.ADD_PAST_ROUTE,
    payload: assets
});
export const pastRouteFailed = (errMess) => ({
    type: ActionTypes.PAST_ROUTE_FAILED,
    payload: errMess
});
