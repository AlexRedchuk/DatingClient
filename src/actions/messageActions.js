import datingBase from "../APIs/datingBase"
import { getUser } from "./authActions";
import { dislike } from "./likeActions";
import { GET_CONVERSATIONS, GET_UNREADMESSAGESCOUNT, GET_CONVERSATIONUSER, GET_MESSAGES, SET_ACTIVECONVERSATION, SEND_ARRIVAL_MESSAGE, SET_ANON_LOBBY, SET_ANON_CONVERSATION, SET_IN_ANON_SEARCH } from './types';

export const getConversations = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/conversations/get');
        dispatch({
            type: GET_CONVERSATIONS,
            payload: res.data
        })
    }
}

export const getUnreadMessageCount = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get('/api/messages/countUnread')
        dispatch({
            type: GET_UNREADMESSAGESCOUNT,
            payload: res.data
        })
    }
}

export const getConversationUser = (id) => {
    return async (dispatch, getState) => {
        const user = await datingBase.get(`/api/users/${id}`)
        dispatch({
            type: GET_CONVERSATIONUSER,
            payload: user.data
        })
    }
}

//[userId, getState().auth.userId].every(i => el.members.includes(i))
export const setActiveConversationByUserId = (userId) => {
    return (dispatch, getState) => {
        const conversations = getState().messages.conversations;
        const arr = [userId, getState().auth.userId];
        const conversation = conversations.find(el => arr.every(i => el.members.includes(i)))
        dispatch(setActiveConversation(conversation ? conversation : {}))
    }
}

export const setActiveConversation = (conv) => {
    return {
        type: SET_ACTIVECONVERSATION,
        payload: conv
    }
}

export const getMessages = (convId) => {
    return async (dispatch, getState) => {
        const messages = await datingBase.get(`/api/messages/byConversation/${convId}`);
        dispatch({
            type: GET_MESSAGES,
            payload: messages.data
        })
        dispatch(getUnreadMessageCount());
    }
}

export const sendMessage = (message) => {
    return async (dispatch, getState) => {
        await datingBase.post('/api/messages', message)
        const recieverId = getState().messages.activeConversation.members.find(el => el !== getState().auth.userId);
        const user = getState().auth.user;
        getState().auth.socket.emit("sendMessage", { recieverId, userId: user._id, userInfo: {userName: user.name, userPhoto: user.photos[0]}, text: message.text, conversationId: message.conversationId})
        dispatch(getMessages(getState().messages.activeConversation._id))
    }
}

export const sendAnonMessage = (message) => {
    return async (dispatch, getState) => {
        await datingBase.post('/api/messages', message)
        const recieverId = getState().messages.anonConversation.members.find(el => el !== getState().auth.userId);
        const user = getState().auth.user;
        getState().auth.socket.emit("sendAnonMessage", { recieverId, userId: user._id, userInfo: {userName: 'Анонімний чат', userPhoto: 'anon', text: message.text, conversationId: message.conversationId}});
        dispatch(getMessages(getState().messages.anonConversation._id))
    }
}

export const sendArrivalMessage = (message) => {
    return async (dispatch, getState) => {
        if(getState().messages.activeConversation._id === message.conversationId) {
            dispatch({
                type: SEND_ARRIVAL_MESSAGE,
                payload: message
            })
        }
    }
}

export const setAnonLobby = (users) => {
    return {
        type: SET_ANON_LOBBY,
        payload: users
    }
}

export const setAnonConversation = (data) => {
    return {
        type: SET_ANON_CONVERSATION,
        payload: data
    }
}



export const createAnonChat = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/conversations/createAnon/${id}`);
        dispatch({
            type: SET_ANON_CONVERSATION,
            payload: res.data
        })
        return res;
    }
}

export const getAnonChat = (id) => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/conversations/getById/${id}`);
        dispatch({
            type: SET_ANON_CONVERSATION,
            payload: res.data
        })
    }
}

export const getCurrentUserAnonChat = () => {
    return async (dispatch, getState) => {
        const res = await datingBase.get(`/api/conversations/findAnonByUserId`);
        dispatch({
            type: SET_ANON_CONVERSATION,
            payload: res.data
        })
        return res.data;
    }
}

export const deleteAnonById = (id, userId) => {
    return async (dispatch, getState) => {
        await datingBase.post(`/api/conversations/deleteById`, {
            conversationId: id,
            deleteId: userId
        });
        dispatch({
            type: SET_ANON_CONVERSATION,
            payload: {}
        })
        await dispatch(dislike(userId));
        await dispatch(getUser())
    }
}




export const setInAnonSearch = (bool) => {
    return {
        type: SET_IN_ANON_SEARCH,
        payload: bool
    }
}

