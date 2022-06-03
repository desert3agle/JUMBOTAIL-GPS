import * as ActionTypes from './ActionTypes';

export const GeometryMessage = (state = {
    message: null,
    error: null
}, action) => {
    switch (action.type) {
        case ActionTypes.MSG_AC:
            return { ...state, message: action.payload, error: false };
        case ActionTypes.MSG_WA:
            return { ...state, message: action.payload, error: true };
        default:
            return state;
    }
}