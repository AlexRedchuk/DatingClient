import React, { useEffect, useState } from 'react';
import line from '../../imgs/Line Long light.png';
import { ReactComponent as More } from '../../svg/more.svg';
import { ReactComponent as AnonIcon } from '../../svg/Anonym 2.svg';
import { ReactComponent as Heart } from '../../svg/Heart.svg';
import { ReactComponent as Cross } from '../../svg/Cross.svg';
import { ReactComponent as Arrow } from '../../svg/Arrow MK2.svg';
import { ReactComponent as HeartFilled } from '../../svg/Heart_MK2.svg';
import { connect } from 'react-redux';
import './AnounimusMessanger.scss';
import SearchStep from './searchStep/SearchStep';
import LoadingStep from './loadingStep/LoadingStep';
import ChatStep from './chatStep/ChatStep';
import _ from 'lodash';
import { deleteAnonById, setAnonLobby, createAnonChat, getConversations, setInAnonSearch, setAnonConversation } from '../../../actions/messageActions';
import { likeAnonUser, setIfLiked, getSymphaties, setMatchedUser } from '../../../actions/likeActions';
import Match from '../match/Match';

const AnounimusMessanger = ({socket, user, anonLobby, anonConversation, 
    deleteAnonById, setAnonLobby, createAnonChat, inAnonSearch, setInAnonSearch, likeAnonUser, potentials, setIfLiked, isAnonLiked ,
    matchedUser, setMatchedUser, getConversations, getSymphaties, setAnonConversation}) => {

    const [uWereLiked, setuWereLiked] = useState(false);

    const [isMatched, setIsMatched] = useState({});

    useEffect(() => {
        if (!_.isEmpty(anonConversation)) {
            setuWereLiked(!!potentials?.find(el => el._id == anonConversation?.members.find(el => el != user._id)))
        }

    }, [potentials, anonConversation])

    const renderStep = () => {
        if (!_.isEmpty(anonConversation)) {
            return <ChatStep />
        }
        if(!inAnonSearch) {
            return <SearchStep onClk={async () => {
                setInAnonSearch(true);
                const other = anonLobby.find(el => el.gender !== user.gender);
                if(other) {
                    const isSkipped = !!user.skippedPool.find(el => el === other.id);
                    // console.log(other.id);
                    // console.log(user.skippedPool);
                    if(!isSkipped){
                        socket?.emit("leaveFromAnonPool", other.id);
                        setAnonLobby(anonLobby.filter(el => el !== other));
                        const res = await createAnonChat(other.id);
                        socket?.emit("createdAnonChat", {recieverId: other.id, conversationId: res.data._id} )
                        
                    }
                    else {
                        socket?.emit('addToAnonPool', { id: user._id, gender: user.gender});
                    }
                    
                } 
                else {
                    socket?.emit('addToAnonPool', { id: user._id, gender: user.gender});
                }
                
            }} />
        }
        else if (inAnonSearch) {
            return <LoadingStep />
        }
    }

    const crossBtnClick = async () => {
        if(!_.isEmpty(anonConversation)) {
            const otherId = anonConversation.members.find(el => el != user._id);
            await deleteAnonById(anonConversation._id, otherId);  
            socket?.emit("anonSkip", otherId);
            setInAnonSearch(false);
        }
        else {
            socket?.emit("leaveFromAnonPool", user._id);
            setInAnonSearch(false);
        }
    }

    const nextBtnClick = async () => {
        if(!_.isEmpty(anonConversation)) {
            const otherId = anonConversation.members.find(el => el != user._id);
            await deleteAnonById(anonConversation._id, otherId);
            socket?.emit("anonSkip", otherId);
            const other = anonLobby.find(el => el.gender !== user.gender);
            if(other) {
                const isSkipped = !!user.skippedPool.find(el => el === other.id);
                // console.log(other.id);
                // console.log(user.skippedPool);
                if(!isSkipped){
                    socket?.emit("leaveFromAnonPool", other.id);
                    setAnonLobby(anonLobby.filter(el => el !== other));
                    const res = await createAnonChat(other.id);
                    socket?.emit("createdAnonChat", {recieverId: other.id, conversationId: res.data._id} )
                    
                }
                else {
                    socket?.emit('addToAnonPool', { id: user._id, gender: user.gender});
                    setInAnonSearch(true);
                }
                
            } 
            else {
                socket?.emit('addToAnonPool', { id: user._id, gender: user.gender});
                setInAnonSearch(true);
            }
            
        }
    }

    const likeButtonClick = async () => {
       
        if(!_.isEmpty(anonConversation)) { {
            const alreadyLiked = potentials?.find(el => el.id1 === user._id);
            if(!alreadyLiked) {
                const otherId = anonConversation.members.find(el => el != user._id);
                const res = await likeAnonUser(otherId);
                setIfLiked(true);
                socket?.emit("anonLike", otherId);
                setInAnonSearch(false);
                console.log(res.data);
                if (res.data.message === "It's a match!") {
                    setAnonConversation({});
                    socket?.emit('newSymphaty', { recieverId: otherId, 
                        photo: user.photos[0], 
                        theme: 'Нова симпатія',
                        message: `Схоже, що ${user.name} вподоба${user.gender === 'male' ? 'в' : 'ла'} тебе`   
                    })
                    setIsMatched(true);
                    setMatchedUser(res.data.matchedUser);
                    setIfLiked(false);
                    await getConversations();
                    await getSymphaties();
                    setTimeout(() => {
                    setMatchedUser({});
                        setIsMatched(false);
                    }, 500000)
                }
            }
        }
    }  
     
    }

    return (
        <>
            <Match onClk={() => {
                setIsMatched(false);
                setTimeout(() => setMatchedUser({}), 1000)
            } } matchedUser={matchedUser} user={user} isVisible={isMatched}/>
             <div className={`anounimus_chat_container${!_.isEmpty(anonConversation) ? ' chat_step' : ''}`}>
              <div className='anounimus_chat_box'>
                <div className="user_info_block">
                    <div className="user_info_justify">
                        <div className='anounimus_icon'>
                            <AnonIcon />
                        </div>
                        <div className="user_info">
                            <div className="anounimus_name_block">
                                <div className="anounimus_name">Чат для сором'язливих</div>
                            </div>

                        </div>
                    </div>
                    <More  className="anounimus_more_button" />
                </div>
                <img className="long_line" src={line} alt="line" />
                <div className='anounimus_chat_inner_content'>
                    {renderStep()}
                </div>
              </div>
              <div className='anounimus_chat_btns_container'>
                <div className='anounimus_chat_like_indicator'>
                    {!uWereLiked ? (<Heart/>) : (<HeartFilled />)}
                    
                </div>
                <div className='anounimus_chat_control_btns'>
                    <Cross onClick={crossBtnClick} className={`anounimus_chat_control_btn${inAnonSearch ? ' active_chat_cross' : ''}`}/>
                    <HeartFilled onClick={likeButtonClick} className={`anounimus_chat_control_btn${isAnonLiked ? ' heart_disabled' : ''}`}/>
                    <Arrow onClick={nextBtnClick} id='anounimus_chat_arrow_left' className='anounimus_chat_control_btn'/>
                </div>
              </div>
            </div>
            </>)
}

const mapStateToProps = (state) => {
    return { 
        socket: state.auth.socket,
        user: state.auth.user,
        anonLobby: state.messages.anonLobby,
        anonConversation: state.messages.anonConversation,
        inAnonSearch: state.messages.inAnonSearch,
        potentials: state.like.potentials,
        isAnonLiked: state.like.isAnonLiked,
        matchedUser: state.like.matchedUser
    }
}

export default connect(mapStateToProps, { deleteAnonById, setAnonLobby, createAnonChat, setInAnonSearch, 
    likeAnonUser, setIfLiked, setMatchedUser, getConversations, getSymphaties, setAnonConversation })(AnounimusMessanger);