import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { _calculateAge } from '../../helpers/calculateAge';
import { ReactComponent as Verified } from '../../svg/Verified.svg';
import { ReactComponent as Cross} from '../../svg/Cross.svg';
import { ReactComponent as Arrow } from '../../svg/Arrow.svg';
import { ReactComponent as Settings } from '../../svg/Settings.svg';
import { ReactComponent as Message } from '../../svg/Message icon MK_2.svg';
import { getCurrentProfile } from '../../../actions/likeActions';
import { setActiveConversationByUserId } from '../../../actions/messageActions';
import './ProfilePage.scss';
import { Link, useParams } from 'react-router-dom';

const ProfilePage = ({user, getCurrentProfile, profileUserId, setActiveConversationByUserId}) => {

    const [carouselMode, setCarouselMode] = useState(false);
    const [currentPhotoNumber, setCurrentPhotoNumber] = useState(1);
    const params = useParams();
    
    useEffect(() => {
        getCurrentProfile(params.id)
    },[params])

    const leftSlide = () => {
        setCurrentPhotoNumber((currentPhotoNumber>1) ? currentPhotoNumber-1 : user.photos.length);
        // this.setState({sliderCounter: (this.state.sliderCounter > 1) ? this.state.sliderCounter-1 : this.props.user.photos.length})
    }

    const rightSlide = () => {
        setCurrentPhotoNumber(currentPhotoNumber < user.photos.length ? currentPhotoNumber+1 : 1)
        // this.setState({sliderCounter: (this.state.sliderCounter < this.props.user.photos.length) ? this.state.sliderCounter+1 : 1})
    }

    const renderCarousel = () => {
        if(carouselMode) {
            return (<div className='profile_carousel_container'>
                        <div onClick={leftSlide} className="carousel_slide_button carousel_left"><Arrow className="slide_svg_right"/></div>
                        <div onClick={rightSlide}className="carousel_slide_button carousel_right"><Arrow className="slide_svg_left"/></div>
                        <div onClick={() => setCarouselMode(false)} className='profile_cross_btn'>
                            <Cross/>
                        </div>
                        <div className='profile_carousel_photo_container'>
                            <img className='profile_carousel_photo' alt="img" src={user.photos[currentPhotoNumber-1]}/>
                        </div>
                        <div className={`profile_carousel_bottom_photos`}>
                            {user.photos.filter(el => el !== user.photos[currentPhotoNumber-1]).map((photo, i) => {
                                return (<div onClick={() => setCurrentPhotoNumber((currentPhotoNumber + i)%user.photos.length + 1)} className='profile_bottom_img_container'>
                                            <img onClick={() => setCarouselMode(true)} className='profile_bottom_img' alt="img" src={user.photos[(currentPhotoNumber+i)%user.photos.length]} />
                                        </div>)
                            })}
                            </div>
                    </div>)
        }
        return <></>;
    }

    if(!user) {
        return <div>Loading</div>
    }

    return (<>
    {renderCarousel()}
    <div  className="profile_container">
    { (profileUserId === user._id) ? 
                        (<Link to='/settings' className='profile_interaction_button'>
                                <Settings className='profile_interaction_button_blue' />
                            </Link>) : (<Link onClick={() => setActiveConversationByUserId(user._id)} to='/conversations' className='profile_interaction_button'>
                                <Message />
                            </Link>) }
        <div onClick={() => setCarouselMode(true)} className='profile_main_img_container'>
            <img className='profile_main_img' alt="img" src={user.photos[currentPhotoNumber-1]}></img>
        </div>
        <div className='profile_side_img_container' style={{
            backgroundImage: `url(${user.photos[(currentPhotoNumber === user.photos.length) ? 0 : currentPhotoNumber]})`,
            backgroundSize: 'cover'
        }}>
            <div className='profile_blured'>
                <div className="profile_info">
                        <div className="profile_name">
                            <div>{user.name}, {_calculateAge(new Date(user.dateOfBirth))}</div>
                            <Verified className="profile_verified"/>
                        </div>
                        <div className="profile_info_label"> Особиста інформація:</div>
                        <div className="profile_about">
                            <div className="profile_about_label">
                                Про мене:
                            </div>
                            <span className="profile_about_text">
                                {user.about}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className={`profile_bottom_photos ${carouselMode ? 'carousel_mode' : ''}`}>
                            {user.photos.filter((el) => el !== user.photos[currentPhotoNumber-1]).filter((el,i) => i < 4).map((photo, i) => {
                                if(i==3) {
                                    return <div onClick={() => setCarouselMode(true)} className='profile_bottom_img_container'>
                                            <div className='carousel_blured'><span>Та ще +{user.photos.length - 4}</span></div>
                                            <img className='profile_bottom_img' alt="img" src={user.photos[(currentPhotoNumber+i)%user.photos.length]} />
                                            </div>
                                }
                                return (<div className='profile_bottom_img_container'>
                                            <img onClick={() => setCarouselMode(true)} className='profile_bottom_img' alt="img" src={user.photos[(currentPhotoNumber+i)%user.photos.length]} />
                                        </div>)
                            })}
                            
                        </div>
                    </div>
                   
                </div>
                
        </div>
    </div></>)

}

const mapStateToProps = (state) => {
    return {
        user: state.like.currentProfile,
        profileUserId: state.auth.user._id
    }
}
export default connect(mapStateToProps, { getCurrentProfile, setActiveConversationByUserId })(ProfilePage);
