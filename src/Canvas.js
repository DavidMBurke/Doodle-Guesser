import React, { useEffect, useRef } from "react";
export default function Canvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
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
    context.lineWidth = 1;
    contextRef.current = context;

    let i = 0;
    for(let i = 0; i < 28; i++) {
      for (let j = 0; j < 28; j++) {
        let val = this.props.mushroom[i]
        drawPixel(`rgb(${val}, ${val}, ${val})`, contextRef.current, i, j)
      }
    }


  }, []);

  return (
      <canvas id="learningCanvas"  ref={canvasRef} />
      )

}

function drawPixel(color, canvas, x, y) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, 10, 10);
}

