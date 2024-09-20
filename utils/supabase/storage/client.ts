import { createClient } from "@/utils/supabase/client";
import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}avatar_url.${fileExtension}`;

  console.log(`Preparing to upload image: ${fileName} to bucket: ${bucket} in folder: ${folder}`);

  try {
    file = await imageCompression(file, {
      maxSizeMB: 0.5,
    });
    console.log(`Image compressed: ${fileName}`);
  } catch (error) {
    console.error("Image compression error:", error);
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload(path, file, { upsert: true });

  if (error) {
    console.error("Upload error:", error.message);
    return { imageUrl: "", error: error.message };
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;
  console.log(`Image uploaded successfully: ${imageUrl}`);

  return { imageUrl, error: "" };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  console.log(`Preparing to delete image from bucket: ${bucket}, path: ${path}`);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  if (error) {
    console.error("Delete error:", error.message);
  } else {
    console.log(`Image deleted successfully: ${imageUrl}`);
  }

  return { data, error: error?.message };
};