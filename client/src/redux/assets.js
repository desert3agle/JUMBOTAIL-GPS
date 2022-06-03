import * as ActionTypes from './ActionTypes';

export const Assets = (state = {
    errMess: null,
    assets: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_ASSETS:
            return { ...state, errMess: null, assets: action.payload };
        case ActionTypes.ASSETS_FAILED:
            return { ...state, errMess: action.payload };
        default:
            return state;
    }
}