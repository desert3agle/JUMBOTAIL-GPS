import * as ActionTypes from './ActionTypes';

export const OneAsset = (state = {
    errMess: null,
    oneAsset: [],
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ONE_ASSETS:
            return { ...state, errMess: null, oneAsset: action.payload };
        case ActionTypes.ONE_ASSETS_FAILED:
            return { ...state, errMess: action.payload, oneAsset: [] };
        default:
            return state;
    }
}