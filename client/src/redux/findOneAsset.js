import * as ActionTypes from './ActionTypes';

export const FindOneAsset = (state = {
    errMess: null,
    oneAsset: null
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ONE_ASSET:
            return { ...state, errMess: null, oneAsset: action.payload };
        case ActionTypes.ONE_ASSET_FAILED:
            return { ...state, errMess: action.payload, oneAsset: null };
        default:
            return state;
    }
}