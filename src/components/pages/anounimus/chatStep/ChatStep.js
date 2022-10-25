import React, { useEffect, useRef } from 'react';
import { ReactComponent as AnonIcon } from '../../../svg/Anonym 2.svg';
import Message from '../../massenger/massage/Message';
import './ChatStep.scss';
import AnounimusMessageForm from './AnounimusMessageForm';
import { connect } from 'react-redux';
import { getMessages, sendAnonMessage} from '../../../../actions/messageActions';

const ChatStep = ({anonConv, messages, getMessages, sendAnonMessage, user}) => {

    const scrollRef = useRef();

    useEffect(() => {
        getMessages(anonConv._id);
    })

    const sendForm = async (formValues) => {
        await sendAnonMessage({
            conversationId: anonConv._id,
            sender: user._id,
            text: formValues.text
        })
    }

    return (
    <>
        <div className='chat_step_container'>
            <div className='chat_step_top_info'>
                <div className='search_step_anon_icon'><AnonIcon /></div> 
                <div className='chat_step_text_container'>
                    <span className='chat_step_theme'>Порада:</span>
                    <span className='chat_step_text'>Постарайся дізнатися більше про співрозмовника: його захоплення, вподобання тощо.
                                                    А також не варто грубіянити.
                                                        </span>
                </div>
                
            </div>
            <div className="messages">
                {messages.map(m => {
                    return (
                            <Message reference={scrollRef}  key={m._id} isOwner={m.sender === user._id} text={m.text} />)

                    
                })}
            </div>
        </div>
        <div className='chat_step_form_container'>
            <AnounimusMessageForm onSubmit={sendForm} />
        </div>
    </>
    )
}

const mapStateToProps = (state) => {
    return {
        anonConv: state.messages.anonConversation,
        messages: state.messages.messages,
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { getMessages, sendAnonMessage })(ChatStep);