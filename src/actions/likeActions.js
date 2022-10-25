import datingBase from "../APIs/datingBase"
import { GET_CONVERSATIONS, GET_CURRENT_PROFILE, GET_LOVER, GET_POTENTIALS, GET_SYMPHATIES, SET_ACTIVECONVERSATION, SET_ANON_LIKED, SET_MATCHED_USER } from "./types";
import _ from "lodash";

export const getLover = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/likes/getDatingUser');
        dispatch({
            type: GET_LOVER,
            payload: res.data
        })
    }
}

export const getCurrentProfile = (id) => {
    return async (dispatch, getState) => {
        const user = await datingBase.get(`/api/users/${id}`)
        dispatch({
            type: GET_CURRENT_PROFILE,
            payload: user.data
        })
    }
}

export const setMatchedUser = (user) => {
    return {
        type: SET_MATCHED_USER,
        payload: user
    }
}

export const blockUser = (data) => {
    return async (dispatch, getState) => {
        const res = await datingBase.post('/api/likes/blockUser', data);
        dispatch({
            type: SET_ACTIVECONVERSATION,
            payload: {}
        })
        dispatch({
            type: GET_CONVERSATIONS,
            payload: res.data
        })
        dispatch(getSymphaties())
    }
}

export const like = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/like/${id}`)
        await dispatch(getLover())
        await dispatch(getPotentials())
        await dispatch(getSymphaties())
        return res;
    }
}

export const likeAnonUser =  (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/likeAnonUser/${id}`)
        await dispatch(getLover())
        await dispatch(getPotentials())
        await dispatch(getSymphaties())
        return res;
    }
}

export const dislike = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/dislike/${id}`)
        await dispatch(getLover())
        await dispatch(getPotentials())
        await dispatch(getSymphaties())
        return res;
    }
}

export const getSymphaties = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/likes/getSymphaties`);
        dispatch({
            type: GET_SYMPHATIES,
            payload: res.data
        })
    }
}

export const getPotentials = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/likes/getPotentials');
        dispatch({
            type: GET_POTENTIALS,
            payload: res.data
        })
    }
}



export const checkIfLiked = (members) => {
    return async (dispatch, getState) => {
        const res = await datingBase.post(`/api/likes/checkIfLiked`, {members});
        dispatch({
            type: SET_ANON_LIKED,
            payload: !_.isEmpty(res.data)
        })
    }
}

export const setIfLiked = (bool) => {
    return {
        type: SET_ANON_LIKED,
        payload: bool
    }
}