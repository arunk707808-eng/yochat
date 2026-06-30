import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier"

export const uploadImage = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "chat-images",
      },
      (error: any, result: any) => {
        if (error) return reject(error);

        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};