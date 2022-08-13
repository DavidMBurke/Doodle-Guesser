import React, { useEffect, useRef, useState } from "react";

export default function Canvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const width = 280;
  const height = 280;

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width;
    canvas.style.height = height;

    const context = canvas.getContext("2d");
    context.scale(1, 1);
    context.lineCap = "butt";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;
    clearCanvas(contextRef.current);
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    mapPixels(contextRef.current);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <canvas
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      id="learningCanvas"
      ref={canvasRef}
    />
  );
}

function drawPixel(color, canvas, x, y) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, 1, 1);
}

function clearCanvas(canvas) {
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel("white", canvas, i, j);
    }
  }
}

function mapPixels(canvas) {
  let drawingData = [];
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let pixelSum = 0;
      let pixelData = canvas.getImageData(j * 10, i * 10, 10, 10);
      pixelData.data.map(value => pixelSum += value)
      drawingData.push(Math.floor(pixelSum/400))
    }
  }
  console.log(drawingData);
}

// ACTIVATE THIS TO TEST DATA DRAWINGS ARE IMPORTING CORRECTLY
// for (let n = 0; n < 100; n++) {
//   let o = n * imgSize;
//   for (let i = 0; i < 28; i++) {
//     for (let j = 0; j < 28; j++) {
//       let val = 255 - mushroomData.bytes[o];
//       let x = 1 + i + (n % 10) * 28;
//       let y = 1 + j + Math.floor(n / 10) * 28;
//       drawPixel(`rgb(${val}, ${val}, ${val})`, contextRef.current, y, x);
//       o++;
//     }
//   }
// }
