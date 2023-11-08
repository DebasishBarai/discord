'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  onChange: (file: File | null) => void;
}
export const FileUpload = ({ onChange }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const [fileType, setFileType] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    onDrop: (files) => {
      const fileTypeValue = files[0]?.name.split('.').pop();

      setFile(files[0]);

      if (
        fileTypeValue === 'jpg' ||
        fileTypeValue === 'jpeg' ||
        fileTypeValue === 'png'
      ) {
        setFileType(fileTypeValue);
        onChange(files[0]);
      } else {
        setFileType(null);
      }
    },
  });
  if (file && fileType) {
    return (
      <div className='relative h-20 w-20'>
        <Image
          fill
          src={URL.createObjectURL(file)}
          alt='uploadImage'
          className='rounded-full'
        />
        <button
          onClick={() => {
            setFile(null);
            onChange(null);
          }}
          className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    );
  }
  return (
    <div>
      <div
        {...getRootProps()}
        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black/50 focus-visible:ring-offset-0 flex flex-col justify-center items-center m-4 p-4'
      >
        <input {...getInputProps()} />
        <UploadCloud className='h-10 w-10 fill-grey-200 stroke-grey-400' />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      {!file && (
        <div className='w-full text-red-900 text-left'>
          Server image is required
        </div>
      )}
    </div>
  );
};
