import React from 'react';
import logo from '../../imgs/Afrodite logo.png'
import line from '../../imgs/Line 2.png'
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logOut } from '../../../actions/authActions';
import { ReactComponent as Settings } from '../../svg/Settings.svg';
import { ReactComponent as Exit } from '../../svg/Exit.svg';
import { ReactComponent as Planet } from '../../svg/Planet icon.svg';
import { ReactComponent as Message } from '../../svg/Message icon MK_2.svg';
import { ReactComponent as Heart } from '../../svg/Heart.svg';
import { ReactComponent as Symph } from '../../svg/Mutch.svg';
import { ReactComponent as Anon } from '../../svg/Anonym chat MK1.svg';
import './LeftMenu.scss'


const LeftMenu = ({ logOut, symphaties, potentials, user, unreadMessages, onLinkClick}) => {
    return (
            <nav 
            className={`left_menu_nav`}>
                    <Link className="logo" to={``}><img className="logo" src={logo} alt="no foto" /></Link>
                    <img className="logo_line" src={line} alt="line" />
                    <div className="profile_info_leftmenu">
                        <Link onClick={onLinkClick} to={`/profile/${user._id}`}><img className="profile_avatar_img" src={user.photos[0]} alt="avatar" /></Link>
                        <div className="settings_exit">
                            <div className="settings_justifier">
                                <div className="Left_menu_user_name">{user.name}</div>
                                <Exit id="exit" onClick={() => logOut()} className="exit_icon" />
                            </div>
                            <div className="settings_justifier">
                                <Link to="/statistics" className="statistics_label" >Моя статистика</Link>
                                <Link onClick={onLinkClick} id="settings" to={`/settings`}><Settings id="settings" className="settings_icon" /></Link>
                            </div>
                        </div>
                    </div>
                    <img className="logo_line" src={line} alt="line" />
                    <NavLink onClick={onLinkClick} activeClassName="active" exact to={`/home`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Planet className="menu_item_svg"/>
                        </div>
                        <span>Знайомства</span>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`/conversations`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Message className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Повідомлення</span>
                            <div className="left_menu_item_counter">{unreadMessages}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`/symphaties`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Symph className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Симпатії</span>
                            <div className="left_menu_item_counter">{symphaties.length}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`/potentials`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Heart id="heart" className="menu_item_svg"/>
                        </div>
                        <div className="menu_item_justifier">
                            <span>Вподобання</span>
                            <div className="left_menu_item_counter">{potentials.length}</div>
                        </div>
                    </NavLink>
                    <NavLink onClick={onLinkClick} to={`/anounimus`} className="left_menu_item">
                        <div className="svg_justifier">
                            <Anon className="menu_item_svg"/>
                        </div>
                        <span>Анонімний чат</span>
                    </NavLink>
                </nav>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        symphaties: state.like.symphaties,
        potentials: state.like.potentials,
        user: state.auth.user,
        unreadMessages: state.messages.unReadMessageCount,
        onLinkClick: ownProps.onLinkClick
    }
}

export default connect(mapStateToProps, { logOut })(LeftMenu);