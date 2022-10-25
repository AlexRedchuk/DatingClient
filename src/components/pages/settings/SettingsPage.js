import React, { useState } from 'react';
import { connect } from 'react-redux';
import { editMainInfo, editPassword } from '../../../actions/authActions';
import MainSettingsForm from './mainSettingsForm/MainSettingsForm';
import ProfileSettingsForm from './profileSettingsForm/ProfileSettingsForm';
import _ from 'lodash';
import './SettingsPage.scss';

const SettingsPage = ({user, editMainInfo, editPassword}) => {

    const [resMessage, setResMessage] = useState('');
    const [resMainInfoMessage, setResMainInfoMessage] = useState('');

    const onMainInfoSumbit = async (formValues) => {
        const dateOfBirth = `${formValues['year']}-${formValues['month']}-${(+formValues['day'] < 10) ? "0" + formValues['day'] : formValues['day']}`;
        formValues.dateOfBirth = dateOfBirth;
        const res = await editMainInfo(formValues);
        setResMainInfoMessage(res);
    }

    const onProfileInfoSubmit = async (formValues) => {
       const res = await editPassword(formValues);
       setResMessage(res ? res : 'Пароль успішно змінено');
    }

    const dateOfBirth = new Date(user.dateOfBirth);
    const initValues = {
        'name': user.name,
        'about': user.about,
        'day': +dateOfBirth.getDate(),
        'month': +dateOfBirth.getMonth() + 1,
        'year': dateOfBirth.getFullYear()
    }

    return (<div className='settings_main__container'>
        <div className='settings_title'><span className='settings_title_text'>Налаштування</span></div>
        <MainSettingsForm onSubmit={onMainInfoSumbit} initialValues={initValues} resMessage={resMainInfoMessage} gender={user.gender} setResMessage={setResMainInfoMessage} />
        {!!user.googleId ? <></> : <ProfileSettingsForm onSubmit={onProfileInfoSubmit} resMessage={resMessage} setResMessage={setResMessage} email={user.email} />}
    </div>)
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

export default connect(mapStateToProps, { editMainInfo, editPassword })(SettingsPage);