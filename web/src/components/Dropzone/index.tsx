import React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import './styles.css';
import { FiUpload } from 'react-icons/fi';

interface Props {
    onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0]; //vai receebr um unico arquvio

        const fileUrl = URL.createObjectURL(file); //criando uma URL para o arquivo

        setSelectedFileUrl(fileUrl); //passando a url do arquivo para armazenamento
        onFileUploaded(file); //

    }, [onFileUploaded]);

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: 'image/*'
    })

    return (
        <div className='dropzone' {...getRootProps()}>
            <input {...getInputProps()} accept='image/*' />
                
            {
                selectedFileUrl 
                ? <img src={selectedFileUrl} alt='Estabelecimento' /> 
                : (
                    <p>
                        <FiUpload />
                        Imagem do Estabelecimento
                    </p>
                )
            }
        </div>
    )
}

export default Dropzone;