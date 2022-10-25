import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { ReactComponent as Send } from '../../../svg/Send icon.svg'

class AnounimusMessageForm extends Component {



    renderInput = ({ input, label, meta}) => { // formProps
        return (
                <input className="chat_step_message_input" autoComplete='off' {...input} />
        );
    };

    onSubmit = formValues => {
        this.props.onSubmit(formValues);
        this.props.reset()
    };

    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Field name="text" component={this.renderInput}></Field>
                <button className="chat_step_send_button"><Send /></button>
            </form>
        );
    }
}

export default reduxForm({
    form: 'anounimusMessageForm',
})(AnounimusMessageForm);