import React from 'react';
import { connect } from 'react-redux';
import { dislike, getLover, like, setMatchedUser } from '../../../actions/likeActions';
import { getSymphaties } from '../../../actions/likeActions';
import { ReactComponent as Cross } from '../../svg/Cross.svg';
import { ReactComponent as Heart } from '../../svg/Heart_MK2.svg';
import { ReactComponent as Verified } from '../../svg/Verified.svg';
import { ReactComponent as Arrow } from '../../svg/Arrow.svg';
import { _calculateAge } from '../../helpers/calculateAge';
import _ from 'lodash';
import './UserCard.css'
import Match from '../match/Match';
import { getConversations } from '../../../actions/messageActions';

class UserCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isSkippedMatch: false,
            sliderCounter: 1,
            isMatched: false
        }
    }

    componentDidMount() {
        this.props.getLover();     
        
    }

     
    renderPhotos = () => {
        const {user} = this.props
        if(user.photos) {
           return user.photos.map( (photo, index) => {
                return (<div key={index} >
                    <img className="user_card_photo"  src={photo} alt="err"/>
                </div>)
            })
        }
        return <div> No Photos</div>
    }

    onLike = async (id) => {
        const res = await this.props.like(id);
        this.setState({sliderCounter: 1});
        if(res.data.message === "It's a match!") {
            this.props.socket?.emit('newSymphaty', { recieverId: res.data.matchedUser._id, 
                                                    photo: this.props.selfUser.photos[0], 
                                                    theme: 'Нова симпатія',
                                                    message: `Схоже, що ${this.props.selfUser.name} вподоба${this.props.selfUser.gender === 'male' ? 'в' : 'ла'} тебе`   
                                                })
                                                this.setState({isMatched: true})
            this.props.setMatchedUser(res.data.matchedUser);
            await this.props.getConversations();
            await this.props.getSymphaties();
            setTimeout(() => {
                this.props.setMatchedUser({});
                this.setState({isMatched: false})
            }, 500000)
        }
    }

    onDislike = async (id) => {
        const res = await this.props.dislike(id)
        this.setState({sliderCounter: 1});
        if(res.data.message === "Skipped match") {
            this.setState({isSkippedMatch: true})
            setTimeout(() => {
                this.setState({isSkippedMatch: false})
            }, 1000)
        }
    }

    leftSlide = () => {
        this.setState({sliderCounter: (this.state.sliderCounter > 1) ? this.state.sliderCounter-1 : this.props.user.photos.length})
    }

    rightSlide = () => {
        this.setState({sliderCounter: (this.state.sliderCounter < this.props.user.photos.length) ? this.state.sliderCounter+1 : 1})
    }

    
    render() {
        const {user, selfUser} = this.props;
        if(this.state.isSkippedMatch) {
            return <div className="user_card_loading">
            <span>Пропущено симпатію</span>
        </div>
        }
        if(!user) {
            return (<>
                <Match onClk={() => {
                    this.setState({isMatched: false})
                    setTimeout(() => this.props.setMatchedUser({}), 1000)
                } } matchedUser={this.props.matchedUser} user={selfUser} isVisible={this.state.isMatched}/>
                <div className="user_card_loading">
                    <span>Loading your new friend...</span>
                </div>
            </>
            )
        }

       
        
        return(
            <>
                <Match onClk={() => {
                    this.setState({isMatched: false})
                    setTimeout(() => this.props.setMatchedUser({}), 1000)
                } } matchedUser={this.props.matchedUser} user={selfUser} isVisible={this.state.isMatched}/>
            <div  className="meetings_container">
                <div className="photo_justifier">
                    <img className="user_card_photo"  src={user.photos[this.state.sliderCounter-1]} alt="err"/>
                    <div className="buttons_container">
                        <div onClick={() => this.onDislike(user._id)} className="deside_button">
                            <Cross id="cross" className="devide_svg"/>
                        </div>
                        <div onClick={() => this.onLike(user._id)} className="deside_button">
                            <Heart id="like_heart" className="devide_svg"/>
                        </div>
                    </div>
                    <div className="photo_counter">{this.state.sliderCounter}/{user.photos.length}</div>
                    <div onClick={this.leftSlide} className="slide_button left"><Arrow className="slide_svg_right"/></div>
                    <div onClick={this.rightSlide}className="slide_button right"><Arrow className="slide_svg_left"/></div>
                </div>
                <div className="user_card_info">
                    <div className="user_card_name">
                        <div>{user.name}, {_calculateAge(new Date(user.dateOfBirth))}</div>
                        <Verified className="user_card_verified"/>
                    </div>
                    <div className="user_card_info_label"> Особиста інформація:</div>
                    <div className="user_card_about">
                        <div className="user_card_about_label">
                            Про мене:
                        </div>
                        <span className="user_card_about_text">
                            {user.about}
                        </span>
                    </div>
                </div>
            </div>
            </>
        )
    }


   
}

const mapStateToProps = (state) => {
    return {
        user: state.like.datingUser,
        selfUser: state.auth.user,
        socket: state.auth.socket,
        matchedUser: state.like.matchedUser
    }
}


export default connect(mapStateToProps, {getLover, like, dislike, getConversations, getSymphaties, setMatchedUser })(UserCard);