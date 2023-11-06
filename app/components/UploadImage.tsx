import React, { useEffect, useRef, useState } from 'react';

interface UploadImageProps {
  onImageUpload: (imageUrl: File) => void;
  isImageReset: boolean;
}

const UploadImage = ({ onImageUpload, isImageReset }: UploadImageProps): JSX.Element => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const checkImageSize = (image: HTMLImageElement) => {
    if (image.naturalWidth > 4096 || image.naturalHeight > 4096) {
      setError("Image dimensions exceeded 4096x4096. Please upload image with lower resolution");
      return false;
    }
    return true;
  };

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setError("");

      const selectedImage = event.target.files[0];

      const img = new Image();
      img.src = URL.createObjectURL(selectedImage);

      img.onload = () => {
        if (checkImageSize(img)) {
          onImageUpload(selectedImage);
        } else {
          // Reset the input value to clear the selected files
          if (inputRef?.current) {
            (inputRef.current as HTMLInputElement).value = '';
          }
        }
      };
    }
  }

  useEffect(() => {
    if (isImageReset && inputRef?.current) {
      (inputRef.current as HTMLInputElement).value = '';
    }
  }, [isImageReset])

  return (
    <div>
      <div
        className='max-w-full h-[300px] flex items-center justify-center flex-col'
      >
        <div className='w-[450px]'>
          <input
            ref={inputRef}
            type="file"
            name="myImage"
            accept="image/png, image/jpg"
            onChange={onFileUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
          />
        </div>
        {error && (
          <div className="pt-4 flex items-center justify-center">
            <p className="w-72 text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadImage;
