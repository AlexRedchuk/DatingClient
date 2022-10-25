import React, {useState} from 'react';
import { Field, FieldArray } from 'redux-form';
import { useDropzone } from 'react-dropzone';
import { ReactComponent as Cross} from '../../../svg/Cross.svg';
import { ReactComponent as AddPhotos} from '../../../svg/Add photos.svg';
import { ReactComponent as DummyPhotos} from '../../../svg/Add photos 2.svg';
import { FileInput } from '../../../inputs/FIleInput';
import './SecondStep.scss'

const renderDummies = (l) => {
    const arr = [];
    for(let i = 0; i < 3-l; i++) {
        arr[i] = 1;
    }
    return arr;
}


const SecondStep = ({files, setFiles, photoClicked, setPhotoClicked}) => {

    const [dummies, setDummies] = useState(renderDummies(files.length));
    

    const renderError = ({error, touched}) => {
        if(touched && error) {
            return (<div className="form_error_secondstep_container">
                <div className="form_error">{error}</div>
            </div>);
        }
    };

    const renderAreaInput = ({ input, label, meta, placeholder, type }) => { // formProps
        const labelClass = `input_textarea_field ${(meta.touched && meta.error) ? 'error' : ''}`;
        return (
            <div className="input_justifier">
                <textarea className={labelClass} autoComplete='off' placeholder={placeholder} type={'search'} {...input} />
                {renderError(meta)}
            </div>
        );
    };

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
          'image/*': []
        },
        onFileDialogCancel: () => setPhotoClicked(),
        onDrop: acceptedFiles => {
            setFiles([...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })), ...files] );
            setDummies(renderDummies(files.length+1))
        }
      });

    
    return <div className='second_step_container'>
            <div className='second_step_photos_container'>
                {files.map((file, i) => {
                    if(i >= 3) {
                        return;
                    }
                    if(i == 2 && files.length > 3) {
                        return (<div className='second_step_preview_photo_container'>
                                <div className={`second_step_preview_blured second_step_hovered`}>
                                    Та ще {files.length-3}
                                </div>
                                
                            <img src={file.preview} className="second_step_preview_photo"/>
                        </div>) 
                    }
                    return (<div className='second_step_preview_photo_container'>
                                <div className={`second_step_preview_blured`}>
                                    <Cross onClick={() => {
                                        setFiles(files.filter(el => el !== file));
                                        setDummies(renderDummies(files.length - 1))
                                    } }  className={`second_step_preview_cross`}/>
                                </div>
                            <img src={file.preview} className="second_step_preview_photo"/>
                        </div>) 
                })}
                <div {...getRootProps()} className={`photo_container${photoClicked && files.length == 0 ? ' photo_error' : ''}`}>
                    <input {...getInputProps()} />
                    <AddPhotos />
                    {/* <div className='photo_inner_content'>
                        <span className='inner_photo_text'>Перетягніть сюди своє фото</span>
                        <div className='add_photo_icon'></div>
                        <div className='inner_photo_bottom_block'>
                            <input {...getInputProps()}/>
                            <span className='inner_photo_text_bottom'>або натисніть </span>
                            <Field  name={'add'} component={FileInput} label="Choose photos" />
                        </div>
                    </div> */}
                </div>
                {dummies.map( d => {
                    return (<div className='second_step_dummy_container'><DummyPhotos/></div>)
                })}

        </div>
        
        <div className='second_step_about_container'>
            <Field  name={'about'} component={renderAreaInput} placeholder='Розкажіть щось про себе . . .' label="Choose photos" />
        </div>
    </div>
}

export default SecondStep;