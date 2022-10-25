import React from 'react';
import gid from '../../../animations/Afrodite loading anim.gif'
import './LoadingStep.scss';

const LoadingStep = () => {
    return (<div className='loading_step_container'>
              <img className='loading_step_gif' src={gid}/>  
              <span className='loading_step_text'> Шукаємо співрозмовника...</span>
            </div>)
}

export default LoadingStep;