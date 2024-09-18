'use client'

import { ChangeEvent, useRef, useState, useTransition } from "react";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { uploadImage } from "@/utils/supabase/storage/client";
import { convertBlobUrlToFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export function ImageUpload({ user }: { user: any }) {
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url);
  const [imageUrl, setImageUrl] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
    }
  };

  const handleClickUploadImagesButton = async () => {
    if (!user) {
      toast({
        title: "You need to be logged in to upload image",
        variant: "destructive",
      });
      return;
    }
    if (!imageUrl.length) {
      toast({
        title: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      const imageFile = await convertBlobUrlToFile(imageUrl);
      const { imageUrl: uploadedImageUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "avatar",
        folder: user.id,
      });
      if (error) {
        toast({
          title: error,
          variant: "destructive",
        });
        return;
      }
      if (uploadedImageUrl) {
        setAvatarUrl(uploadedImageUrl);
        await fetch('/api/update-avatar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, avatarUrl: uploadedImageUrl }),
        });
        toast({
          title: "Successfully uploaded image",
          variant: "default",
        });
        setImageUrl("");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-left py-6">
      <span className="text-sm font-medium">Avatar Image</span>
      <div className="ml-1 w-24 h-24 rounded-lg overflow-hidden border-2 border-primary p-0.5">
        <Image 
          src={imageUrl || avatarUrl || '/default-avatar.png'} 
          width={96} 
          height={96} 
          alt="User Avatar" 
          className="object-cover rounded-lg"
        />
      </div>
      <input
        type="file"
        hidden
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />
      <div className="space-y-2">
        <Button
          variant="outline"
          onClick={() => imageInputRef.current?.click()}
          disabled={isPending}
          className="mt-2"
        >
          Select New Image
        </Button>

        {imageUrl && (
          <Button
            onClick={handleClickUploadImagesButton}
            variant="default"
            disabled={isPending}
            className="ml-2"
          >
            {isPending ? "Uploading..." : "Upload Image"}
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-500">
        {!imageUrl && !isPending && "Select a new image to update your avatar."}
        {imageUrl && !isPending && "Click 'Upload Image' to set your new avatar."}
        {isPending && "Uploading your new avatar..."}
      </p>
    </div>
  );
}