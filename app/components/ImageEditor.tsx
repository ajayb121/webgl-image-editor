"use client" // Client Component

import { useState } from "react";
import 'gl-matrix';
import WebglEditor from "./WebglEditor";
import UploadImage from "./UploadImage";

const ImageEditor: React.FC = () => {
  // State to manage the selected image and various style settings
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [brightnesValue, setBrightnessValue] = useState("0");
  const [exposureValue, setExposureValue] = useState("100");
  const [contrastValue, setContrastValue] = useState("100");
  const [isImageReset, setIsImageReset] = useState(false);
  
  // Callback function to handle image upload
  const onImageUpload = (image: File) => {
    setSelectedImage(image);
  }

  // Function to restore default style values
  const restoreDefaultValues = () => {
    setBrightnessValue("0");
    setExposureValue("100");
    setContrastValue("100");
  }

  return (
    <div>
      {!selectedImage ? (
        // Display the UploadImage component when no image is selected
        <UploadImage onImageUpload={onImageUpload} isImageReset={isImageReset} />
      ) : (
        // Display image editing controls when an image is selected
        <div>
          <div className="flex gap-6">
            <div className="w-72 pt-12">
              <label htmlFor="brightness-range" className="block mb-2 text-sm font-medium text-slate-50">{`Brightness range: ${brightnesValue}`}</label>
              <input min="-100" max="100" id="brightness-range" type="range" value={brightnesValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                setBrightnessValue(e.target.value);
              }}></input>

              <label htmlFor="exposure-range" className="mt-6 block mb-2 text-sm font-medium text-slate-50">{`Exposure range: ${Number(exposureValue) - 100}`}</label>
              <input min="0" max="300" id="exposure-range" type="range" value={exposureValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                setExposureValue(e.target.value);
              }}></input>

              <label htmlFor="contrast-range" className="mt-6 block mb-2 text-sm font-medium text-slate-50">{`Contrast range: ${Number(contrastValue) - 100}`}</label>
              <input min="0" max="200" id="contrast-range" type="range" value={contrastValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                setContrastValue(e.target.value);
              }}></input>
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mt-16"
                onClick={restoreDefaultValues}>
                Restore Default Styles
              </button>
            </div>
            <div>
              <WebglEditor
                imageUrl={URL.createObjectURL(selectedImage)}
                brightness={Number(brightnesValue) / 100}
                exposure={parseFloat(exposureValue) / 100}
                contrastValue={parseFloat(contrastValue) / 100}
                removeImage={() => {
                  // Remove the selected image and reset the style settings
                  setSelectedImage(null);
                  setIsImageReset(true);
                  restoreDefaultValues();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
