import React, { useRef, useEffect, useState } from 'react';
import { mat4 } from 'gl-matrix';
import ZoomableImage from './Zoom';

// Vertex shader
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
    v_texCoord = a_position * 0.5 + 0.5;
  }
`;

// Fragment shader for contrast stretching
const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;
  uniform float u_brightness; // Add brightness uniform
  uniform float u_exposure; // Add exposure uniform
  uniform float u_contrast; // Add contrast uniform

  void main() {
    vec2 flippedTexCoord = vec2(v_texCoord.x, 1.0 - v_texCoord.y); // Flip horizontally
    vec4 color = texture2D(u_image, flippedTexCoord);
    // Adjust the contrast
    color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
    // Adjust the brightness
    color.rgb += u_brightness;
    // Adjust the exposure
    color.rgb *= u_exposure;
    gl_FragColor = color;
  }
`;

// Helper function to create a shader program
function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null | undefined {
  const program = gl.createProgram();
  if (program) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
  }
}

// Helper function to compile a shader
function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null | undefined {
  const shader = gl.createShader(type);
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
}

interface WebglEditorProps {
  imageUrl: string;
  brightness?: number;
  exposure?: number;
  contrastValue?: number;
  removeImage: () => void;
}

const WebglEditor = ({
  imageUrl,
  brightness = 0,
  exposure = 1,
  contrastValue = 1,
  removeImage,
}: WebglEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageDataURL, setImageDataURL] = useState("");
  const [downloadResolution, setDownloadResolution] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;
    gl.useProgram(program);

    // Create a buffer for the position of the rectangle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    const imageLocation = gl.getUniformLocation(program, 'u_image');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'u_projection_matrix');

    // Create a buffer for the texture coordinates
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    const texCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);


    // Create a texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters for the texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Get uniform locations for brightness, exposure and contrast
    const brightnessLocation = gl.getUniformLocation(program, 'u_brightness');
    const exposureLocation = gl.getUniformLocation(program, 'u_exposure');
    const contrastLocation = gl.getUniformLocation(program, 'u_contrast');
    // Load and update the image
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Set the texture and attributes
      gl.uniform1i(imageLocation, 0);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(texCoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      // Set the brightness, exposure, and contrast uniforms
      gl.uniform1f(brightnessLocation, brightness);
      gl.uniform1f(exposureLocation, exposure);
      gl.uniform1f(contrastLocation, contrastValue);

      // Draw the rectangle
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Create a downscaled canvas for downloading
      const downloadCanvas = document.createElement('canvas');
      const downloadContext = downloadCanvas.getContext('2d');
      if (!downloadContext) return;
      downloadCanvas.width = canvas.width / downloadResolution;
      downloadCanvas.height = canvas.height / downloadResolution;
      downloadContext.drawImage(canvas, 0, 0, downloadCanvas.width, downloadCanvas.height);

      // Convert the downscaled canvas to a data URL
      const dataURL = downloadCanvas.toDataURL("image/jpeg");

      // Set the data URL in the state variable
      setImageDataURL(dataURL);
    };
  }, [imageUrl, downloadResolution]);

  const downloadImage = () => {
    if (imageDataURL) {
      const url = imageDataURL;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'downloaded_image.png'; // Set the default name for the downloaded image
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url); // Clean up the URL
      document.body.removeChild(a);
    }
  }

  return (
    <>
      <div className='pt-2.5'>
        {imageDataURL && <ZoomableImage imageUrl={imageDataURL} />}
      </div>

      <div className="flex pt-2.5 justify-between">
        <div>
          <div className="text-right">
            <button 
            onClick={removeImage} 
            type="button" 
            className="h-12 mb-0 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Remove Image
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="inline-block relative w-64">
            <select
              onChange={(e) => {
                setDownloadResolution(Number(e.target.value))
              }}
              value={downloadResolution}
              className="h-[48px] block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value={1}>Normal Resolution</option>
              <option value={2}>Less Resolution</option>
              <option value={3}>Very Less Resolution</option>
            </select>
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-2.5"
            onClick={downloadImage}
          >
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
            <span>Download</span>
          </button>
        </div>
      </div>
      <div className="h-[20px] w-[20px] invisible overflow-hidden">
        <canvas ref={canvasRef}></canvas>
      </div>
    </>
  )
};

export default WebglEditor;
