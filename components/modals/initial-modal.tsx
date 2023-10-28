'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form } from '../ui/form';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required'
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required'
  })
})



export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false)

  const router = useRouter()
  useEffect(()=>{
    setIsMounted(true)
  },[])

  const form = useForm ({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageurl: '',
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post ('api/servers', values)
      form.reset()
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.log (error)
    }
  }

  if (!isMounted){
    return null
  }

  return (
    <Dialog open>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              Give your server a personality with a name and an image. You can always change it later.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          
        </Form>
      </DialogContent>
    </Dialog>
  )
};
