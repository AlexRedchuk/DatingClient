import React from 'react';
import { ReactComponent as AnonIcon } from '../../../svg/Anonym 2.svg';
import './SearchStep.scss';

const SearchStep = ({onClk}) => {
    return (<div className='search_step_container'>
                <div className='search_step_anon_icon'><AnonIcon /></div>  
                <span className='search_step_theme'>Анонімний чат</span>
                <span className='search_step_text'>Це місце, де ти можеш познайомитись зі своєю другою половинкою,
                                                    без фотографій та будь-якої іншої інформації
                                                     </span>
                <div onClick={onClk} className='search_step_btn'>Почати пошук</div>
            </div>)
}

export default SearchStep;
