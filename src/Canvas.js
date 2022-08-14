import React, { useEffect, useRef, useState } from "react";

export default function Canvas(params) {
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
    context.lineWidth = 12;
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
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    params.setDrawingData(mapPixels(contextRef.current));
  };

  return (
    <div>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        id="learningCanvas"
        ref={canvasRef}
      />
      <button onClick={() => clearCanvas(contextRef.current)}>
        {" "}
        Clear drawing
      </button>
      <button
        onClick={() => sampleDrawings(params.training, contextRef.current)}
      >
        {" "}
        Sample Drawings
      </button>
      <button
        onClick={() => {
          singleDrawing(
            params.training[Math.floor(Math.random() * params.training.length)],
            contextRef.current
          );
          params.setDrawingData(mapPixels(contextRef.current));
        }}
      >
        {" "}
        Random Drawing
      </button>
      <button
        onClick={() => {
          let drawing = mapPixels(contextRef.current);
          singleDrawing(drawing, contextRef.current);
          params.setDrawingData(mapPixels(contextRef.current));
        }}
      >
        {" "}
        Draw this Drawing
      </button>
    </div>
  );
}

function drawPixel(color, canvas, x, y, size) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, size, size);
}

function clearCanvas(canvas) {
  for (let i = 0; i < 280; i++) {
    for (let j = 0; j < 280; j++) {
      drawPixel("white", canvas, i, j, 1);
    }
  }
}

function mapPixels(canvas) {
  let pixelSums = [];
  let drawingData = [];
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let pixelSum = 0;
      let pixelData = canvas.getImageData(j * 10, i * 10, 10, 10);
      for (let m = 0; m < pixelData.data.length; m++) {
        pixelSum += pixelData.data[m];
      }
      pixelSum -= 25500;
      pixelSums.push(pixelSum);
      let val = 255 - pixelSum / 300;
      drawingData.push(val);
    }
  }
  return drawingData;
}

const singleDrawing = (img, canvas) => {
  if (!img.length) {
    console.log("no data loaded!");
    return;
  }
  let o = 0;
  for (let i = 0; i < 28; i++) {
    for (let j = 0; j < 28; j++) {
      let val = 255 - img[o];
      let y = i * 10;
      let x = j * 10;
      drawPixel(`rgb(${val},${val},${val})`, canvas, x, y, 10);
      o++;
    }
  }
};

const sampleDrawings = (data, canvas) => {
  if (!data.length) {
    console.log("no data loaded!");
    return;
  }
  for (let n = 0; n < 100; n++) {
    let o = 0;
    for (let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        let val = 255 - data[n][o];
        let y = i + (n / 10) * 28;
        let x = j + (n % 10) * 28;
        drawPixel(`rgb(${val},${val},${val})`, canvas, x, y, 1);
        o++;
      }
    }
  }
};
