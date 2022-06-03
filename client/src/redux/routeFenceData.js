import * as ActionTypes from './ActionTypes';

export const RouteFenceData = (state = {
    routeData: null,
    fenceData: null,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.ROUTE_DATA:
            return { ...state, routeData: action.payload, fenceData: null, loading: false };
        case ActionTypes.FENCE_DATA:
            return { ...state, fenceData: action.payload, routeData: null, loading: false };
        case ActionTypes.DATA_LD:
            return { ...state, fenceData: null, routeData: true, loading: true };
        default:
            return state;
    }
}