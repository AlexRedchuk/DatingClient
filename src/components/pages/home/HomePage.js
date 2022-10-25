import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, NavLink, Navigate, Routes, useMatch, Route, useLocation } from 'react-router-dom';
import { getUser, logOut, setOnlineUsers, setSocket } from '../../../actions/authActions';
import { checkIfLiked, getPotentials, getSymphaties, setIfLiked } from '../../../actions/likeActions';
import logo from '../../imgs/Afrodite logo (2).png'
import line from '../../imgs/Line.png'
import { io } from 'socket.io-client';
import { ReactComponent as Planet } from '../../svg/Planet icon.svg';
import { ReactComponent as Message } from '../../svg/Message icon MK_2.svg';
import { ReactComponent as Heart } from '../../svg/Heart.svg';
import { ReactComponent as Symph } from '../../svg/Mutch.svg';
import { ReactComponent as Anon } from '../../svg/Anonym chat MK1.svg';
import _ from 'lodash';
import './HomePage.css'
import LeftMenu from '../LeftMenu/LeftMenu';
import { getConversations, setAnonConversation, getUnreadMessageCount, setActiveConversation, setAnonLobby, getAnonChat, getCurrentUserAnonChat, setInAnonSearch } from '../../../actions/messageActions';
import Popup from '../popup/Popup';


const HomePage = ({ getSymphaties, getPotentials, symphaties, potentials, 
    getUser, user, unreadMessages, getUnreadMessageCount, getConversations, setSocket,
    socket, setOnlineUsers, children, activeConv, setAnonLobby,  getAnonChat,
    getCurrentUserAnonChat, setAnonConversation, anonConv, setInAnonSearch, checkIfLiked }) => {
    const location = useLocation();
    const [leftMenuFlag, setLeftMenuFlag] = useState(false);
    const [popupInfo, setPopupInfo] = useState({});
    const [popupFlag, setPopupFlag] = useState(false);
    useEffect(() => {
        async function getSymph() {
            await getUser()
            await getSymphaties();
            await getPotentials();
            await getUnreadMessageCount();
            await getConversations();
            
            const ios = await io("ws://localhost:8900")
            setSocket(ios)
        }
        getSymph();
    }, [getSymphaties, getPotentials, getUser, getUnreadMessageCount, getConversations, setSocket, anonConv])

    useEffect(() => {
        async function func() {
            const chat = await getCurrentUserAnonChat();
            if(!_.isEmpty(chat)) {
                await checkIfLiked(chat.members)
            }
        }
        func();
    }, []);

    useEffect(() => {
        socket?.emit("addUser", user._id)
        socket?.on("getUsers", users => {
            setOnlineUsers(users);
        })
        socket?.on("getAnonPool", users => {
            setAnonLobby(users);
        })

        socket?.on('youWereSkipped', async () => {
            await getUser();
            setAnonConversation({});
            //if(window.location.pathname !== '/anounimus') {
                setPopupInfo({
                    photo: 'anon',
                    theme: 'Анонімний чат',
                    message: 'Ваш співрозмовник закінчив розмову'
                });
                setPopupFlag(true);
                setInAnonSearch(false);
                setTimeout(() => setPopupFlag(false), 5000)
        })

        socket?.on('youWereLiked', async () => {
            
            await getUser();
            await getSymphaties();
            await getPotentials();
            const chat = await getCurrentUserAnonChat();
            if(!_.isEmpty(chat)) {
                setPopupInfo({
                    photo: 'anon',
                    theme: 'Анонімний чат',
                    message: 'Ваш співрозмовник вподобав вас'
                });
                setPopupFlag(true);
                setInAnonSearch(false);
                setTimeout(() => setPopupFlag(false), 5000)
            }
        })

        socket?.on('getAnonChat', async data => {
            await getAnonChat(data.conversationId);
            if(window.location.pathname !== '/anounimus') {
                setPopupInfo({
                    photo: 'anon',
                    theme: 'Анонімний чат',
                    message: 'Вашого співрозмовника в анонімному чаті знайдено'
                });
                setPopupFlag(true);
                setTimeout(() => setPopupFlag(false), 5000)
            }
          
        })
        socket?.on("getSymphaty", async data => {
            setPopupInfo(data);
            setPopupFlag(true);
            setIfLiked(false);
            await getSymphaties();
            await getConversations();
            setTimeout(() => setPopupFlag(false), 5000);
        })
        socket?.on("youAreBlocked", async data => {
            setPopupInfo(data);
            setPopupFlag(true);
            await getSymphaties();
            await getConversations();
            await setActiveConversation({});
            setTimeout(() => setPopupFlag(false), 5000);
        })
        socket?.on("getAnonMessage", data => {
            if(!_.isEmpty(anonConv)) {
                if(window.location.pathname !== '/anounimus') {
                    setPopupInfo({
                        photo: data.userInfo.userPhoto,
                        theme: data.userInfo.userName,
                        message: data.userInfo.text
                    });
                    setPopupFlag(true);
                    setTimeout(() => setPopupFlag(false), 5000)
                }
            }
        })
        socket?.on("getMessage", data => {
            if(!_.isEmpty(activeConv)) {
                if(window.location.pathname == '/conversations' && activeConv._id == data.conversationId) {
                    setPopupFlag(false);
                }
            }
            else {
                setPopupInfo({
                    photo: data.userInfo.userPhoto,
                    theme: data.userInfo.userName,
                    message: data.text
                });
                setPopupFlag(true);
                setTimeout(() => setPopupFlag(false), 5000)
            }
        })
    }, [socket, location, activeConv, symphaties, user, anonConv]);
    if (_.isEmpty(user)) {
        return <div>Loading...</div>
    }

    const renderLeftMenu = () => {
        if(leftMenuFlag) {
            return <LeftMenu onLinkClick={() => setLeftMenuFlag(false)} unmount={leftMenuFlag}/>
        }
        else {
            return <></>
        }
    }

    const renderMessageStatus = (flag) => {
        if(flag) {
            return <div className="msg_status"></div>
        }
        else return <></>
    }

    const renderBlur = () => {
        if(leftMenuFlag) {
            return <div className="blured_background"></div>
        }
        else {
            return <></>
        }
    }

    if(_.isEmpty(user)) {
        return <div>Loading</div>
    }
    
// {renderLeftMenu()}
    return (
        <>
            <Popup data={popupInfo} closePopup={() => setPopupFlag(false)} flag={popupFlag}/>
            {renderLeftMenu()}
        <div className="main_home_container" onMouseEnter={() => setLeftMenuFlag(false)}>
            {renderBlur()}
            
            <div className="home_container">
            
                <nav onMouseEnter={() => setLeftMenuFlag(true)} >
                    <Link className="home_logo" to={`/home`}><img className="logo" src={logo} alt="no foto" /></Link>
                    <img className="home_logo_line" src={line} alt="line" />
                    <div  >
                        <img className="home_profile_avatar" src={user?.photos[0]} alt="avatar" />
                        
                    </div>
                    <img className="home_logo_line" src={line} alt="line" />
                    <NavLink activeClassName="active" exact to={`/home`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Planet className="home_menu_item_svg"/>
                        </div>
                    </NavLink>
                    <NavLink to={`/conversations`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Message className="home_menu_item_svg"/>
                            {renderMessageStatus(unreadMessages !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`/symphaties`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Symph className="home_menu_item_svg"/>
                            {renderMessageStatus(symphaties.length !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`/potentials`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Heart id="heart" className="home_menu_item_svg"/>
                            {renderMessageStatus(potentials.length !== 0)}
                        </div>
                    </NavLink>
                    <NavLink to={`/anounimus`} className="home_menu_item">
                        <div className="home_svg_justifier">
                            <Anon  className="home_menu_item_svg"/>
                        </div>
                    </NavLink>       
                </nav>
                {children}
            </div>
        </div>
        </>)
}

const mapStateToProps = (state) => {
    return {
        symphaties: state.like.symphaties,
        potentials: state.like.potentials,
        user: state.auth.user,
        socket: state.auth.socket,
        unreadMessages: state.messages.unReadMessageCount,
        activeConv: state.messages.activeConversation,
        anonConv: state.messages.anonConversation
    }
}

export default connect(mapStateToProps, { logOut, getSymphaties, getPotentials, 
    getUser, getUnreadMessageCount, getConversations, setSocket, setOnlineUsers, 
    setActiveConversation, setAnonLobby, getAnonChat, getCurrentUserAnonChat, setAnonConversation,
    setInAnonSearch, checkIfLiked })(HomePage);