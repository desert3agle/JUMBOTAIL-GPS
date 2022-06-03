import * as ActionTypes from './ActionTypes';

export const User = (state = {
    errMess: null,
    userLoading: true,
    user: null,
    userFailed: false
}, action) => {
    switch (action.type) {
        case ActionTypes.USER_AC:
            return { ...state, errMess: "You have successfully logged in", userLoading: false, user: action.payload.user, userFailed: false };
        case ActionTypes.USER_WA:
            return { ...state, errMess: action.payload, userLoading: false, user: null, userFailed: true };
        case ActionTypes.USER_RM:
            return { ...state, errMess: "You have successfully logged out", userLoading: false, user: null, userFailed: false };
        case ActionTypes.USER_LD:
            return { ...state, errMess: "loading", userLoading: true, user: null, userFailed: false };
        default:
            return state;
    }
}