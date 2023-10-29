'use client'

import {FileIcon, X } from 'lucide-react'
import Image from 'next/image'

interface FileUploadProps {
    onChange: (url?: string) => void
    value: string
    endPoint: 'messageFile' | 'serverImage'
}
export const FileUpload = ({
    onChange,
    value,
    endPoint
} : FileUploadProps) => {
    const fileType = value?.split('.').pop()

    if(value && fileType!== 'pdf') {
        return (
            <div className = 'relative h-20 w-20'>
                <Image
                fill
                src = {value}
                alt = 'uploadImage'
                className='rounded-full'
                />
                <button
                onClick={() => onChange('')}
                className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
                type='button'
                >
                    <X className='h-4 w-4' />
                    </button>
                    </div>
        )
    }
    return (
        <div>
            File Upload to be implemented with react dropzone or better
        </div>
    )
}