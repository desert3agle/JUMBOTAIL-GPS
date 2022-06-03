import * as  ActionTypes from './ActionTypes';
import { baseUrl, userUrl } from "./baseUrl";
//Get the memes
export const getAssets = () => (dispatch) => {
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
    fetch(baseUrl + "/list" + str, {
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
        .then(assets => {
            if (assets.length === 0) {
                return dispatch(oneAssetsFailed("Empty Array"));
            }
            else {
                return dispatch(addOneAssets(assets));
            }
        })
        .catch(err => dispatch(oneAssetsFailed(err.message)));
};

export const findOneAsset = (id) => (dispatch) => {
    fetch(baseUrl + `/${id}`, {
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
        .then(assets => dispatch(addOneAsset(assets)))
        .catch(err => dispatch(oneAssetFailed(err.message)));
}

export const getPastRoute = (id) => (dispatch) => {
    dispatch(loadingPastRoute());
    fetch(baseUrl + `/${id}` + "/track", {
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

export const updateFence = (fence, id) => (dispatch) => {
    fetch(baseUrl + `/${id}` + "/geofence", {
        method: 'PATCH',
        body: JSON.stringify(fence),
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
                return Promise.reject(response);
            }
        })
        .then(response => response.json())
        .then(response => {
            return dispatch(successMessage(response.message));
        })
        .catch(response => {
            response.json().then(msg => {
                return dispatch(messageFailed(msg.message));
            })
        })
}

export const deleteFence = (id) => (dispatch) => {
    fetch(baseUrl + `/${id}` + "/geofence/remove", {
        method: 'PATCH',
        credentials: "include"
    })
        .then(response => response.json())
        .then(response => {
            return dispatch(successMessage(response.message));
        });
}

export const updateRoute = (fence, id) => (dispatch) => {
    fetch(baseUrl + `/${id}` + "/georoute", {
        method: 'PATCH',
        body: JSON.stringify(fence),
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
                return Promise.reject(response);
            }
        })
        .then(response => response.json())
        .then(response => {
            return dispatch(successMessage(response.message));
        })
        .catch(response => {
            response.json().then(msg => {
                return dispatch(messageFailed(msg.message));
            })
        })
}

export const deleteRoute = (id) => (dispatch) => {
    fetch(baseUrl + `/${id}` + "/georoute/remove", {
        method: 'PATCH',
        credentials: "include"
    })
        .then(response => response.json())
        .then(response => {
            return dispatch(successMessage(response.message));
        });
}

export const sendFence = (data) => (dispatch) => {
    dispatch(dataLoading());
    return dispatch(fenceData(data));
}

export const sendRoute = (data) => (dispatch) => {
    dispatch(dataLoading());
    return dispatch(routeData(data));
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
export const loadingPastRoute = () => ({
    type: ActionTypes.PAST_ROUTE_LD,
})
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
export const successMessage = (message) => ({
    type: ActionTypes.MSG_AC,
    payload: message
});
export const messageFailed = (message) => ({
    type: ActionTypes.MSG_WA,
    payload: message
});
export const fenceData = (data) => ({
    type: ActionTypes.FENCE_DATA,
    payload: data
});
export const routeData = (data) => ({
    type: ActionTypes.ROUTE_DATA,
    payload: data
});
export const dataLoading = () => ({
    type: ActionTypes.DATA_LD
});
export const addOneAsset = (asset) => ({
    type: ActionTypes.ADD_ONE_ASSET,
    payload: asset
});
export const oneAssetFailed = (errMess) => ({
    type: ActionTypes.ONE_ASSET_FAILED,
    payload: errMess
});
