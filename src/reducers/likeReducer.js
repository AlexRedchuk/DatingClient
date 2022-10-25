import { GET_LOVER, GET_POTENTIALS, GET_SYMPHATIES, GET_CURRENT_PROFILE, SET_MATCHED_USER, SET_ANON_LIKED } from "../actions/types"

const INITIAL_STATE = {
    datingUser: null,
    currentProfile: null,
    matchedUser: {},
    symphaties: [],
    potentials: [],
    isAnonLiked: null
}

const poolReducer = (state=INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_LOVER:
            return {...state, datingUser: action.payload};
        case SET_MATCHED_USER: 
            return {...state, matchedUser: action.payload};
        case GET_CURRENT_PROFILE:
            return {...state, currentProfile: action.payload};
        case GET_SYMPHATIES:
            return {...state, symphaties: action.payload};
        case GET_POTENTIALS:
            return {...state, potentials: action.payload};
        case SET_ANON_LIKED:
            return {...state, isAnonLiked: action.payload}
        default:
            return state
    }
}

export default poolReducer;