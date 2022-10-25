import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { ReactComponent as Arrow } from '../../../svg/Arrow.svg';
import { ReactComponent as Cross} from '../../../svg/Cross.svg';
import { ReactComponent as Edit} from '../../../svg/Edit.svg';
import { ReactComponent as Save} from '../../../svg/Save.svg';
import './MainSettingsForm.scss';


class MainSettingsForm extends Component {
    

    constructor(props) {
        super(props);
        this.allowedYear = (new Date().getFullYear() - 18);
        // this.monthes = ["Junuary", "February", "March", "April", "May", "June", "July",
        //     "August", "September", "October", "November", "December"];
        this.monthes = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень",
            "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
        this.state = {
            month: this.monthes[props.initialValues.month],
            year: props.initialValues.year,
            dayArray: this.makeArray(1, this.getMaxDays(props.initialValues.month + '')),
            isMan: true,
            isInEditMode: false
        }
    }
    makeArray = (start, end) => {
        return Array.from({ length: end }, (_, i) => i + 1)
    }

    getMaxDays(month, year) {
        if (month === '1') {
            return 31
        }
        if (month === '2' && parseInt(year) % 4 !== 0) {
            return 28
        }
        if (month === '2' && parseInt(year) % 4 === 0) {
            return 29
        }
        if (month === '3') {
            return 31
        }
        if (month === '4') {
            return 30
        }
        if (month === '5') {
            return 31
        }
        if (month === '6') {
            return 30
        }
        if (month === '7') {
            return 31
        }
        if (month === '8') {
            return 31
        }
        if (month === '9') {
            return 30
        }
        if (month === '10') {
            return 31
        }
        if (month === '11') {
            return 30
        }
        if (month === '12') {
            return 31
        }
        return 0
    }

    renderDayOptions = ({ input, label, meta, children }) => {
        const labelClass = `field ${(meta.visited && meta.touched && meta.error)  ? 'error' : ''}`;
        return (
            <div className={labelClass}>
                <select disabled={!this.state.isInEditMode} style={{paddingLeft: 15, width: 35}} className={`date_select ${(meta.visited && meta.touched && meta.error) ? 'error' : ''}`  + (this.state.isInEditMode ? 'settings_active' : '')} id="day_picker" {...input} name="day">
                    {children}
                </select>
            </div>)
    }

    renderMonthOptions = ({ input, label, meta, children }) => {

        const labelClass = `field ${(meta.visited && meta.touched && meta.error)  ? 'error' : ''}`;
        return (
            <div className={labelClass}>
                <select disabled={!this.state.isInEditMode} {...input} className={`date_select ${(meta.visited && meta.touched && meta.error) ? 'error' : '' + (this.state.isInEditMode ? 'settings_active' : '')}`} onChange={(e) => {
                    input.onChange(e);
                    this.setState({ month: e.target.value, dayArray: this.makeArray(1, this.getMaxDays(e.target.value, this.state.year)) })
                }} name="month">
                    {children}
                </select>
            </div>
        )
    }

    renderYearOptions = ({ input, label, meta, children }) => {
        const labelClass = `field ${(meta.visited && meta.touched && meta.error)  ? 'error' : ''}`;
        return (
            <div className={labelClass}>

                <select disabled={!this.state.isInEditMode} {...input} className={`date_select ${(meta.visited && meta.touched && meta.error ) ? 'error' : '' + (this.state.isInEditMode ? 'settings_active' : '')}` } onChange={(e) => {
                    input.onChange(e);
                    this.setState({ year: e.target.value, dayArray: this.makeArray(1, this.getMaxDays(this.state.month, e.target.value)) })
                }}>
                    {children}
                </select>
            </div>
        )

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
                <input className={labelClass + " " + (!isDis ? 'settings_active' : '')} placeholder={placeholder} type={'text'} {...input} disabled={isDis} autoComplete='off'  />
                {this.renderError(meta)}
        </div>
        );
    };

    renderAreaInput = ({ input, label, meta, placeholder,  isDis}) => { // formProps
        const labelClass = `input_settings_field settings_area_field ${(meta.touched && meta.error) ? 'error' : ''}`;
        return (
            <div className="input_justifier">
                <textarea className={labelClass + " " + (!isDis ? 'settings_active' : '')} placeholder={placeholder} type={'text'} {...input} disabled={isDis} autoComplete='off'  />
                {this.renderError(meta)}
        </div>
        );
    };


    renderMainInfoButton = () => {
        if(this.state.isInEditMode) {
            return (<div className='settings_button_justifier'>
                    <button disabled={this.props.invalid|| this.props.submitting || this.props.pristine} type='submit' className='settings_main_info_edit_button'>
                        <div className='settings_main_info_edit_button_icon'><Save /></div> 
                        <span className='settings_main_info_edit_button_text'>Зберегти</span>
                    </button>
                    <button className='settings_cross_btn'><Cross onClick={() => {
                        this.setState({isInEditMode: false});
                        this.props.reset();
                }} className='cross_settings_svg'/></button>
                    </div>
                    )
        }
        return (<button onClick={() => {
            this.props.setResMessage('');
            this.setState({isInEditMode: true});
        }} className='settings_main_info_edit_button'>
                    <div className='settings_main_info_edit_button_icon'><Edit /></div> 
                    <span className='settings_main_info_edit_button_text'>Редагувати</span>
                </button>
                )
    }

    onSubmit = (formValues) => {
       
        this.props.onSubmit(formValues);
        this.setState({isInEditMode: false})
    };

    render() {
        if(!this.props.initialValues)
            return <div>Loading...</div>

        return (
        <div className='settings_info'>
            <form className="settingsForm" onSubmit={this.props.handleSubmit(this.onSubmit)}>
            <div className='settings_main_info_title'>
                <span className='setting_main_info_title_text'>Основна інформація</span>
                {this.renderMainInfoButton()}
            </div>
            {!!this.props.resMessage ? (
                    <div className='settings_password_error'>
                        {this.props.resMessage}
                    </div>
                ) : <></>}
            <div className='settings_main_info_inputs'>
                <div className='settings_info_col'>
                    <span className='settings_info_name_title'>Ім'я</span>
                    <span className='settings_info_name_title'>Дата народження</span>
                    <span className='settings_info_name_title'>Стать</span>
                    <span className='settings_info_name_title'>Про мене</span>
                </div>
                
                <div className='settings_info_col'>
                <div className="settingsForm" >
                <Field isDis={!this.state.isInEditMode}  name="name" component={this.renderInput}/>
                    <div className={"settings_date_picker" + " " + (this.state.isInEditMode ? 'settings_active' : '')}>
                            <div className="settings_date_picker_justifier">
                                <Field  name="day" component={this.renderDayOptions} label="Enter your birthday">
                                    <option  selected disabled hidden>День</option>
                                    {this.state.dayArray.map(value => <option key={value} value={value}>{value}</option>)}
                                </Field>
                                <Arrow className={`settings_date_picker_arrow` + " " + (this.state.isInEditMode ? 'settings_active' : '')} />
                            </div>
                            <div className="settings_date_picker_justifier_month">
                                <Field name="month" component={this.renderMonthOptions} label="Enter month">
                                    <option selected disabled hidden >Місяць</option>
                                    {this.monthes.map((value, index) => <option key={value} value={index + 1}>{value}</option>)}
                                </Field>
                                <Arrow className={`settings_date_picker_arrow` + " " + (this.state.isInEditMode ? 'settings_active' : '')} />
                            </div>
                            <div className="settings_date_picker_justifier" style={{paddingLeft: 15}}>
                                <Field name="year" component={this.renderYearOptions} label="Enter year" >
                                    <option selected disabled hidden>Рік</option>
                                    {Array.from({ length: (new Date().getFullYear() - 1960 - 18) }, (_, i) => i + 1960).sort((a, b) => b - a)
                                        .map(value => <option key={value} value={value}>{value}</option>)}
                                </Field>
                                <Arrow className={`settings_date_picker_arrow` + " " + (this.state.isInEditMode ? 'settings_active' : '')} />
                            </div>
                        </div>
                    <span className='settings_info_name_title'>{this.props.gender === 'male' ? 'Чоловіча' : 'Жіноча'}</span>
                    <Field isDis={!this.state.isInEditMode}  name="about" component={this.renderAreaInput}/>
                </div>
                </div>
            </div>
            </form>
            <div className='settings_line'></div>
        </div>
           
        );
    }
}

const validate = (formValues) => {
    const errors = {};
    if(!formValues.name) {
        errors.name = "Будь-ласка введіть ім'я"
    }
    if(!formValues.dateOfBirth) {
        errors.dateOfBirth = 'Будь-ласка введіть дату народження'
    }
    if(!formValues.about) {
        errors.about = 'Будь-ласка введіть  дані про себе'
    }
    return errors
}

export default reduxForm({
    form: 'mainSettingsForm',
    enableReinitialize : true,
    validate
})(MainSettingsForm);