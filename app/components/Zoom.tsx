import React, { useState } from 'react';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid'

interface ZoomableImageProps {
  imageUrl: string;
}

const ZoomableImage = ({ imageUrl }: ZoomableImageProps): JSX.Element => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    if (scale < 2) {
      setScale(scale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  const handlePan = (direction: 'left' | 'right' | 'up' | 'down') => {
    const step = 50; // Adjust the panning step as needed
    setPosition((prevPosition) => {
      if (direction === 'left') {
        return { x: prevPosition.x - step, y: prevPosition.y };
      } else if (direction === 'right') {
        return { x: prevPosition.x + step, y: prevPosition.y };
      } else if (direction === 'up') {
        return { x: prevPosition.x, y: prevPosition.y - step };
      } else if (direction === 'down') {
        return { x: prevPosition.x, y: prevPosition.y + step };
      }
      return prevPosition;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }

  return (
    <div className="w-[700px] border border-gray-300 overflow-hidden">
      <div
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          overflow: "hidden",
        }}
      >
        <img width="100%" height="100%" src={imageUrl} alt="Zoomable" />
      </div>
      <div
        className="bg-gray-300 relative z-10 flex justify-between"
      >
        <div className='pt-2'>
          <button
            onClick={handleZoomIn}
            className="m5 ml-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <MagnifyingGlassPlusIcon height="20px" className="text-white" />
          </button>
          <button
            onClick={handleZoomOut}
            className="m5 ml-0 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <MagnifyingGlassMinusIcon height="20px" className="text-white" />
          </button>
          <button onClick={() => handlePan('left')}
            className="m5 ml-0 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <ChevronLeftIcon height="20px" className="text-white" />
          </button>
          <button onClick={() => handlePan('right')}
            className="m5 ml-0 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <ChevronRightIcon height="20px" className="text-white" />
          </button>
          <button onClick={() => handlePan('up')}
            className="m5 ml-0 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <ChevronUpIcon height="20px" className="text-white" />
          </button>
          <button onClick={() => handlePan('down')}
            className="m5 ml-0 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            <ChevronDownIcon height="20px" className="text-white" />
          </button>
        </div>
        <div className='pt-2'>
          <button onClick={resetZoom}
            className="m5 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Reset Zoom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomableImage;





