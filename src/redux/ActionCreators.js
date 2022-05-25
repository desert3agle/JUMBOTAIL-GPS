import * as  ActionTypes from './ActionTypes';
import { baseUrl, userUrl } from "./baseUrl";
import axios from 'axios';
//Get the memes
axios.defaults.withCredentials = true;
export const getAssets = (token) => (dispatch) => {
    fetch(baseUrl + "/list", {
        credentials: "include"
    })
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

export const registerUser = (params) => (dispatch) => {
    dispatch(userLoading());
    fetch(userUrl + "/signup", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                // var error = new Error('Error ' + response.status + ': ' + response.statusText);
                // error.response = response;
                // throw error;
                return Promise.reject(response);
            }
        },
            error => {
                var errMess = new Error(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(response => {
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", JSON.stringify(response.token));
            return dispatch(addUser(response));
        })
        .catch(response => {
            response.json().then(msg => {
                return dispatch(userFailed(msg.message))
            })
        });
}

export const loginUser = (params) => (dispatch) => {
    dispatch(userLoading());
    fetch(userUrl + "/login", {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    })
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                // var error = new Error('Error ' + response.status + ': ' + response.statusText);
                // console.log(response.json());
                // console.log(error.message);
                // throw error;
                return Promise.reject(response);
            }
        },
            error => {
                var errMess = new Error(error.message);
                // console.log(error.message);
                throw errMess;
            })
        .then(response => response.json())
        .then(response => {
            localStorage.setItem("user", JSON.stringify(response.user));
            localStorage.setItem("token", JSON.stringify(response.token));
            return dispatch(addUser(response));
        })
        .catch(response => {
            response.json().then(msg => {
                return dispatch(userFailed(msg.message))
            })
        });
}

export const userExist = () => (dispatch) => {
    dispatch(userLoading);
    if (localStorage.getItem("user") === null && localStorage.getItem("token") === null) {
        return dispatch(userFailed("User Does not Exist"));
    }
    else {
        const response = {
            user: JSON.parse(localStorage.getItem("user")),
            token: JSON.parse(localStorage.getItem("token"))
        }
        return dispatch(addUser(response));
    }
}

export const logoutUser = () => (dispatch) => {
    dispatch(userLoading());
    fetch(userUrl + "/logout", {
        credentials: "include"
    })
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
        .then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return dispatch(removeUser());
        })
        .catch(err => dispatch(userFailed(err.message)));
}

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
export const addUser = (payload) => ({
    type: ActionTypes.USER_AC,
    payload: payload
});
export const userFailed = (errMess) => ({
    type: ActionTypes.USER_WA,
    payload: errMess
});
export const removeUser = () => ({
    type: ActionTypes.USER_RM,
});
export const userLoading = () => ({
    type: ActionTypes.USER_LD
});
