import React from 'react';
import { ReactComponent as Cross} from '../../svg/Cross.svg';
import { ReactComponent as AnonIcon} from '../../svg/Anonym 2.svg';
import './Popup.scss'
import _ from 'lodash';

const Popup = ({data, closePopup, flag}) => {
    const {photo, theme, message} = data;
    if(_.isEmpty(data)) {
        return <></>
    }

    const renderPhoto = () => {
        if(photo === 'anon') {
            return (
                <div className='popup_anounimus_icon'>
                    <AnonIcon />
                </div>
            )
        }
        else {
            return <img src={photo} alt={theme} className='popup_inner_photo'/>
        }
    }

    return (<div  className={`popup_container${!flag ? ' popup_hide' : ''}`}>
        <div className='popup_inner_content'>
            {renderPhoto()}
            <div className='popup_inner_text'>
                <span className='popup_theme'>{theme}</span>
                <span className='popup_text'>{message}</span>
            </div>
        </div>
        <Cross onClick={() => closePopup()} className='popup_close_btn' />
    </div>)
}

export default Popup;