"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FileUpload } from "../file-upload";
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Server name is required",
  }),
  // imageUrl: z.string().min(1, {
  //   message: 'Server image is required',
  // }),
});

type ServerDetailsType = {
  serverId: string;
  imageUrl: string;
};

export const EditServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "editServer";
  const { server } = data;

  const [serverDetails, setserverDetails] = useState<ServerDetailsType | null>(
    null,
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      // imageUrl: '',
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      // form.setValue ('imageUrl', server.imageUrl)
      setserverDetails({
        serverId: server.id,
        imageUrl: server.imageUrl,
      });
    }
  }, [server, form]);

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

      const fileType = file.name.split(".").pop();

      const concatenatedValues = {
        ...values,
        ...{ fileType: fileType },
      };

      const response = await axios.patch(
        `/api/servers/${server?.id}`,
        concatenatedValues,
      );
      console.log("api/server response: ", response.data);
      if (response.status !== 200) {
        return;
      }
      // const imageUrl = `${values.name}/serverImage/${uuidv4()}`;
      const serverId = response.data.id;
      const imageUrl = response.data.imageUrl;
      console.log(fileType);
      const res = await axios.post("/api/aws/putImagePresignedUrl", {
        serverId: serverId,
        imageUrl: imageUrl,
        fileType: fileType,
      });

      if (res.status !== 200) {
        return;
      }

      const options = {
        headers: {
          "Content-Type": file.type,
        },
      };

      await axios.put(res.data.putObjectPreSignedUrl, file, options);

      // const concatenatedValues = {
      //   ...values,
      //   ...{ imageUrl: `${imageUrl}.${fileType}` },
      // };

      // await axios.post('/api/servers', concatenatedValues);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
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
                {serverDetails ? (
                  <FileUpload
                    serverDetails={serverDetails}
                    onChange={onFileUpload}
                  />
                ) : (
                  <FileUpload onChange={onFileUpload} />
                )}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading} type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
