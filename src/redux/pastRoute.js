import * as ActionTypes from './ActionTypes';

export const PastRoute = (state = {
    errMess: null,
    pastRoute: null
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PAST_ROUTE:
            return { ...state, errMess: null, pastRoute: action.payload };
        case ActionTypes.PAST_ROUTE_FAILED:
            return { ...state, errMess: action.payload };
        case ActionTypes.PAST_ROUTE_LD:
            return { ...state, errMess: "loading", pastRoute: [] };
        default:
            return state;
    }
}