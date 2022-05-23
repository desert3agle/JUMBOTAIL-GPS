import * as ActionTypes from './ActionTypes';

export const PastRoute = (state = {
    errMess: "loading",
    pastRoute: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PAST_ROUTE:
            return { ...state, errMess: null, pastRoute: action.payload };
        case ActionTypes.PAST_ROUTE_FAILED:
            return { ...state, errMess: action.payload };
        default:
            return state;
    }
}