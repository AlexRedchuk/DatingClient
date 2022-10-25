import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { ReactComponent as Cross} from '../../../svg/Cross.svg';
import { ReactComponent as Edit} from '../../../svg/Edit.svg';
import { ReactComponent as Save} from '../../../svg/Save.svg';
import '../mainSettingsForm/MainSettingsForm.scss';


class ProfileSettingsForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isInEditMode: false
        }
    }
  


    renderError = ({error, touched}) => {
        if(touched && error) {
            return (<div className="settings_form_error_container">
                <div className="form_error">{error}</div>
            </div>);
        }
    };

    renderInput = ({ input, label, meta, placeholder,  isDis}) => { // formProps
        const labelClass = `input_settings_field ${(meta.touched && meta.error) ? 'error' : ''}`;
        return (
            <div className="input_justifier">
                <input className={labelClass + " " + (!isDis ? 'settings_active' : '')} placeholder={placeholder} type={'password'} {...input} disabled={isDis} autoComplete='off'  />
                {this.renderError(meta)}
        </div>
        );
    };

    renderProfileInfoButton = () => {
        if(this.state.isInEditMode) {
            return (<div className='settings_button_justifier'>
                     <button type='submit' disabled={this.props.invalid|| this.props.submitting || this.props.pristine} className='settings_main_info_edit_button'>
                        <div className='settings_main_info_edit_button_icon'><Save /></div> 
                        <span className='settings_main_info_edit_button_text'>Зберегти</span>
                    </button>
                    <button className='settings_cross_btn'><Cross onClick={() => {
                        this.setState({isInEditMode: false});
                        this.props.reset();
                    }} className='cross_settings_svg'/></button>
                    </div>)
        }
        return (
                <button onClick={() => {
                    this.setState({isInEditMode: true});
                    this.props.setResMessage('');
                }} className='settings_main_info_edit_button'>
                    <div className='settings_main_info_edit_button_icon'><Edit /></div> 
                    <span className='settings_main_info_edit_button_text'>Редагувати</span>
                </button>
                )
    }

    renderProfileFields = () => {
        if(this.state.isInEditMode) {
            return (<>
                    <span className='settings_info_name_title'>Старий пароль</span>
                    <span className='settings_info_name_title'>Новий пароль</span>
                    </>)
        }
        return (<span className='settings_info_name_title'>Пароль</span>)
    }

    onSubmit = formValues => {
        this.props.reset();
        this.setState({isInEditMode: false})
        this.props.onSubmit(formValues);
    };

    render() {
        const data = {
            name: 'Олександр'
        }
        return (
            <div className='settings_info'>
                <form autoComplete="off" autoCorrect="off" spellCheck="off" className="settingsForm" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            
                <div className='settings_profile_info_title'>
                    <span className='setting_main_info_title_text'>Дані входу</span>
                    {this.renderProfileInfoButton()}
                </div>
                <div className={`settings_profile_info_inputs` + " " + (this.state.isInEditMode ? "settings_edititng_mode" : '')}>
                    <div className='settings_info_col'>
                        <span className='settings_info_name_title'>Емейл</span>
                        {this.renderProfileFields()} 
                    </div>
                    <div className='settings_info_col'>
                    <div className="settingsForm">
                        <span className='settings_info_name_title'>{this.props.email}</span>
                        {this.state.isInEditMode ? (
                            <>
                                <Field isDis={!this.state.isInEditMode}  name="oldPass" component={this.renderInput}/>
                                <Field isDis={!this.state.isInEditMode}  name="newPass" component={this.renderInput} />
                            </>
                        ):  <span className='settings_info_name_title'>********</span> }
                        
                    </div>
                    </div>
                </div>
                {!!this.props.resMessage ? (
                    <div className='settings_password_error'>
                        Error
                    </div>
                ) : <></>}
                
                <div className='settings_line'></div>
                </form>
            </div>
            
        );
    }
}

const validate = (formValues) => {
    const errors = {};
    if(!formValues.oldPass) {
        errors.oldPass = "Будь-ласка введіть старий пароль"
    }
    if(!formValues.newPass) {
        errors.newPass = 'Будь-ласка введіть новий пароль';
    }
    else if(formValues.newPass?.length < 6) {
        errors.newPass = 'Занадто короткий пароль';
    }
    return errors
}

export default reduxForm({
    form: 'profileSettingsForm',
    enableReinitialize : true,
    validate
})(ProfileSettingsForm);