import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { logOut } from '../../../actions/authActions';
import logo from '../../imgs/Afrodite logo.png';
import { ReactComponent as Arrow } from '../../svg/Arrow.svg';
import '../auth/AuthForm.scss'
import SecondStep from './secondStep/SecondStep';

class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.allowedYear = (new Date().getFullYear() - 18);
        // this.monthes = ["Junuary", "February", "March", "April", "May", "June", "July",
        //     "August", "September", "October", "November", "December"];
        this.monthes = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень",
            "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
        this.state = {
            month: 'Junuary',
            year: this.allowedYear,
            dayArray: this.makeArray(1, 31),
            isMan: true,
            hasErrors: false,
            photoClicked: false,
            files: []
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
                <select className={`date_select ${(meta.visited && meta.touched && meta.error) ? 'error' : ''}`} id="day_picker" {...input} name="day">
                    {children}
                </select>
            </div>)
    }

    renderMonthOptions = ({ input, label, meta, children }) => {

        const labelClass = `field ${(meta.visited && meta.touched && meta.error)  ? 'error' : ''}`;
        return (
            <div className={labelClass}>
                <select {...input} id="month" className={`date_select ${(meta.visited && meta.touched && meta.error) ? 'error' : ''}`} onChange={(e) => {
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

                <select {...input} className={`date_select ${(meta.visited && meta.touched && meta.error ) ? 'error' : ''}`} onChange={(e) => {
                    input.onChange(e);
                    this.setState({ year: e.target.value, dayArray: this.makeArray(1, this.getMaxDays(this.state.month, e.target.value)) })
                }}>
                    {children}
                </select>
            </div>
        )

    }


    renderError = ({error, touched}) => {
        console.log(error);
        if(touched && error) {
            return (<div className="form_error_container">
                <div className="form_error">{error}</div>
            </div>);
        }
        if(this.state.hasErrors && error) {
            return (<div className="form_error_container">
                <div className="form_error">{error}</div>
            </div>);
        }
    };

    renderInput = ({ input, label, meta, placeholder, type }) => { // formProps
        const labelClass = `input_field ${((meta.touched && meta.error)) ? 'error' : ''}`;
        return (
            <div className="input_justifier">
                <label className={`input_label ${((meta.touched && meta.error)) ? 'error' : ''}`} >{label}</label>
                <input className={labelClass}  type={'text'} {...input} autoComplete='none' autoCorrect="none" spellCheck="none" placeholder={placeholder} />
                {this.renderError(meta)}
            </div>
        );
    };


    renderRadioButton = ({ input, label, meta, checked, onclk }) => {
        return (
            <div className='input_justifier'>
                <div className="radio_button_justifier">
                    <div onClick={onclk}>
                        <div className={`radio_input ${checked ? 'active' : ''}`}  >
                            {label}
                            <input {...input} type="radio" name="gender" value="male" checked={checked} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
 
    renderPhotoPicker = ({ input, label, meta }) => {
        const labelClass = `field ${(meta.touched && meta.error && meta.pristine) ? 'error' : ''}`;
        return (
            <div className={labelClass}>
                <label>{label}</label>
                <input {...input} accept='.jpg, .png, .jpeg' type="file" />
                {this.renderError(meta)}
            </div>
        );
    }



    onSubmit = formValues => {
        this.setState({photoClicked: true})
        this.props.onSubmit({...formValues, gender: this.state.isMan ? 'male' : 'female', photos: this.state.files});
    };

    renderSteps = () => {
        const { invalid } = this.props;
        if (this.props.step === 1) {
            return (
                <>
                <Link onClick={this.props.logOut} to="/"><img className="login_logo" src={logo} alt="logo"/> </Link>
                <Field name="name" component={this.renderInput} label="Ім'я" placeholder="Введіть ім'я" />
                    <label className="input_label" >Дата народження</label>
                    <div className="date_picker">
                        <div className="date_picker_justifier">
                            <Field name="day" component={this.renderDayOptions} label="Enter your birthday">
                                <option value="" selected disabled hidden>День</option>
                                {this.state.dayArray.map(value => <option key={value} value={value}>{value}</option>)}
                            </Field>
                            <Arrow className="date_picker_arrow_google" />
                        </div>
                        <div className="date_picker_justifier_month">
                            <Field name="month" component={this.renderMonthOptions} label="Enter month">
                                <option value="" selected disabled hidden>Місяць</option>
                                {this.monthes.map((value, index) => <option key={value} value={index + 1}>{value}</option>)}
                            </Field>
                            <Arrow className="date_picker_arrow_google" />
                        </div>
                        <div className="date_picker_justifier">
                            <Field name="year" component={this.renderYearOptions} label="Enter year" >
                                <option value="" selected disabled hidden>Рік</option>
                                {Array.from({ length: (new Date().getFullYear() - 1960 - 18) }, (_, i) => i + 1960).sort((a, b) => b - a)
                                    .map(value => <option key={value} value={value}>{value}</option>)}
                            </Field>
                            <Arrow className="date_picker_arrow_google" />
                        </div>
                    </div>
                    <Field name="city" component={this.renderInput} label="Місцезнаходження" placeholder="Введіть ваш населений пункт" />
                    <div className="input_justifier">
                        <label className="input_label">Стать</label>
                        <div className="radio_button_justifier">
                            <Field name="gender" component={this.renderRadioButton} onclk={() => this.setState({isMan: true})} label="Чоловік" type="radio" value="male" checked={this.state.isMan}/>
                            <Field name="gender" component={this.renderRadioButton} onclk={() => this.setState({isMan: false})} label="Жінка" type="radio" value="female" checked={!this.state.isMan}/>
                        </div>
                    </div>
                    <button type="button" onClick={() => {
                        if(this.props.invalid) {
                            this.setState({hasErrors: true})
                        }
                        else {
                            this.props.changeStep(2);
                        }

                    } } className="registration_button second_step_button">Наступний крок</button>
                </>
            )
        }
        if (this.props.step === 2) {
            return (
                <>
                    <Link onClick={this.props.logOut} to="/"><img className="login_logo" src={logo} alt="logo"/> </Link>
                    <SecondStep photoClicked={this.state.photoClicked} setPhotoClicked={() => this.setState({photoClicked: true})} files={this.state.files} setFiles={(files) => {this.setState({files: files})}}/>
                    <div className='register_form_second_step_buttons'>
                    <button style={{
                        background: '#ff7819'
                    }} className="sized_button second_step_button" type="button" onClick={() => this.props.changeStep(1)}>Назад</button>
                    <button style={{
                            background: '#ff7819'
                        }} className="sized_button second_step_button" type="submit" disabled={this.props.invalid || this.state.files.length==0} >Створити аккаунт</button>
                    </div>
                   
                </>
            )
        }
    }

    render() {
        return (
            <form  onSubmit={this.props.handleSubmit(this.onSubmit)} className="auth_form">
                {this.renderSteps()}
            </form>
        );
    }
}

const validate = (formValues) => {
    const errors = {};
    if (!formValues.day ) {
        errors.day = 'Будь-ласка введіть день'
    }
    if (!formValues.month) {
        errors.month = 'Будь-ласка введіть місяць'
    }
    if (!formValues.year) {
        errors.year = 'Будь-ласка введіть рік'
    }
    if (!formValues.name) {
        errors.name = "Будь-ласка введіть ім'я"
    }
    if (!formValues.city) {
        errors.city = "Будь-ласка введіть місто"
    }
    if(!formValues.about) {
        errors.about = 'Будь-ласка опишіть себе'
    }
    return errors
}


const mapStateToProps = (state, ownProps) => {
    return {    
        changeStep: ownProps.changeStep
    }
}

const ConnectedForm = connect(mapStateToProps, {logOut})(RegisterForm)

export default reduxForm({
    form: 'registerFormGoogle',
    enableReinitialize: true,
    validate
})(ConnectedForm);