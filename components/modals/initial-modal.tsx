'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FileUpload } from '../file-upload';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required',
  }),
  // imageUrl: z.string().min(1, {
  //   message: 'Server image is required',
  // }),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      // imageUrl: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [file, setFile] = useState<File | null>(null);

  const onFileUpload = (file: File | null) => {
    setFile(file);
    console.log(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!file) {
        return;
      }
      const imageUrl = `${values.name}/serverImage/${uuidv4()}`;
      const fileType = file.name.split('.').pop();
      console.log(fileType);
      const res = await axios.post('api/aws/putImagePresignedUrl', {
        imageUrl: imageUrl,
        fileType: fileType,
      });

      // console.log(res.data.putObjectPreSignedUrl);
      if (res.status !== 200) {
        return;
      }

      const options = {
        headers: {
          'Content-Type': file.type,
        },
      };

      await axios.put(res.data.putObjectPreSignedUrl, file, options);

      const concatenatedValues = {
        ...values,
        ...{ imageUrl: `${imageUrl}.${fileType}` },
      };

      await axios.post('api/servers', concatenatedValues);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                {/* <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
                <FileUpload onChange={onFileUpload} />
              </div>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='Enter server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading} type='submit'>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
