import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Handle file upload logic here
        const file = acceptedFiles?.[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxSize: 20 * 1024 * 1024, // 20 MB
    });

    const file = acceptedFiles?.[0] || null;


    const formatSize = (size: number): string => {
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };


    return (
        <div className='w-full gradient-border cursor-pointer'>
            <div className="" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload icon" />
                    </div>

                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className='size-10' />
                            <div className="">
                                <div className="flex flex-col gap-2">
                                    <p className='text-gray-700 font-medium truncate max-w-sm'>{file.name}</p>
                                    <p className='text-gray-500 text-sm'>{formatSize(file.size)}</p>
                                </div>
                            </div>
                            <button type='button' className='p-2 cursor-pointer' onClick={()=> onFileSelect?.(null)}>
                                <img src="/icons/cross.svg" alt="remove" className='w-4 h-4' />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
                            <p className="text-lg text-gray-500">
                                <span className='font-semibold pr-2'>Click to upload</span>
                                Or drag and drop your file here
                            </p>
                            <p className='text-lg text-gray-500'>PDF (max 20 PDF)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader