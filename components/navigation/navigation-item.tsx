'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ActionTooltip } from '../action-tooltip';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();

  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const getImage = async (imageUrl: string) => {
      const res = await axios.post('/api/aws/getImagePresignedUrl', {
        imageUrl: imageUrl,
      });
      if (res.status === 200) {
        setImageSrc(res.data.getObjectPreSignedUrl);
        console.log('res data: ', res.data.getObjectPreSignedUrl);
      }
    };
    getImage(imageUrl);
  }, [imageUrl]);

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button onClick={onClick} className='group relative flex items-center'>
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image fill src={imageSrc} alt='Channel' />
        </div>
      </button>
    </ActionTooltip>
  );
};
