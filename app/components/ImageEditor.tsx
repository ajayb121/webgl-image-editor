"use client" // Client Component

import { useState } from "react";
import 'gl-matrix';
import ContrastStretching from "./ContrastStretching";
import UploadImage from "./UploadImage";

const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [brightnesValue, setBrightnessValue] = useState("0");
  const [exposureValue, setExposureValue] = useState("100");
  const [contrastValue, setContrastValue] = useState("100");
  const [isImageReset, setIsImageReset] = useState(false);
  const onImageUpload = (image: File) => {
    setSelectedImage(image);
  }

  const restoreDefaultValues = () => {
    setBrightnessValue("0");
    setExposureValue("100");
    setContrastValue("100");
  }

  return (
    <div>
      {!selectedImage ? (
        <UploadImage onImageUpload={onImageUpload} isImageReset={isImageReset} />
      ) : (
        <div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ width: "300px", paddingTop: "30px" }}>
              <label htmlFor="brightness-range" className="block mb-2 text-sm font-medium text-slate-50">{`Brightness range: ${brightnesValue}`}</label>
              <input min="-100" max="100" id="brightness-range" type="range" value={brightnesValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                console.log(e.target.value);
                setBrightnessValue(e.target.value);
              }}></input>

              <label htmlFor="exposure-range" className="block mb-2 text-sm font-medium text-slate-50">{`Exposure range: ${Number(exposureValue) - 100}`}</label>
              <input min="0" max="300" id="exposure-range" type="range" value={exposureValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                console.log(e.target.value);
                setExposureValue(e.target.value);
              }}></input>

              <label htmlFor="contrast-range" className="block mb-2 text-sm font-medium text-slate-50">{`Contrast range: ${Number(contrastValue) - 100}`}</label>
              <input min="0" max="200" id="contrast-range" type="range" value={contrastValue} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" onChange={(e) => {
                console.log(e.target.value);
                setContrastValue(e.target.value);
              }}></input>
              <button
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                style={{
                  marginTop: "50px"
                }}
                onClick={restoreDefaultValues}>
                Restore Default Styles
              </button>
            </div>
            <div style={{ minHeight: "400px" }}>
              <ContrastStretching
                imageUrl={URL.createObjectURL(selectedImage)}
                brightness={Number(brightnesValue) / 100}
                exposure={parseFloat(exposureValue) / 100}
                contrastValue={parseFloat(contrastValue) / 100}
                zoomFactor={1.1}
                removeImage={() => {
                  setSelectedImage(null);
                  setIsImageReset(true);
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
