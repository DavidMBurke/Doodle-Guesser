import "./Style.css";
import React, { useEffect, useRef } from "react";
import mushroom1000 from "./doodles/mushroom1000.bin";
import helicopter1000 from "./doodles/helicopter1000.bin";
import octopus1000 from "./doodles/octopus1000.bin";
import penguin1000 from "./doodles/penguin1000.bin";
import snail1000 from "./doodles/snail1000.bin";
import NeuralNetwork from "./neuralNet";

const MUSHROOM = 0;
const HELICOPTER = 1;
const OCTOPUS = 2;
const PENGUIN = 3;
const SNAIL = 4;

const imgSize = 784;
const imgsPerSet = 1000;

let mushroomData;
let helicopterData;
let octopusData;
let penguinData;
let snailData;

mushroomData = loadBytes(mushroom1000);
helicopterData = loadBytes(helicopter1000);
octopusData = loadBytes(octopus1000);
penguinData = loadBytes(penguin1000);
snailData = loadBytes(snail1000);

let mushrooms = {};
let helicopters = {};
let octopuses = {};
let penguins = {};
let snails = {};
let nn;

mushrooms.training = [];
mushrooms.testing = [];
helicopters.training = [];
helicopters.testing = [];
octopuses.training = [];
octopuses.testing = [];
penguins.training = [];
penguins.testing = [];
snails.training = [];
snails.testing = [];

function App() {
  nn = new NeuralNetwork(784, 32, 5);
  let training = [];
  let testing = [];
  let generations = 0;

  // for (let i = 0; i < 3; i++) {
  //   trainingGeneration(training);
  //   console.log("generation", i + 1);
  //   testAll(testing);
  // }

  return (
    <div className="App">
      <button
        onClick={() => {
          prepareData(mushrooms, mushroomData, MUSHROOM);
          prepareData(helicopters, helicopterData, HELICOPTER);
          prepareData(octopuses, octopusData, OCTOPUS);
          prepareData(penguins, penguinData, PENGUIN);
          prepareData(snails, snailData, SNAIL);
          console.log(mushrooms, helicopters, octopuses, penguins, snails);
          training = training.concat(mushrooms.training);
          training = training.concat(penguins.training);
          training = training.concat(octopuses.training);
          training = training.concat(snails.training);
          training = training.concat(helicopters.training);
          shuffle(training);
          testing = testing.concat(mushrooms.testing);
          testing = testing.concat(penguins.testing);
          testing = testing.concat(octopuses.testing);
          testing = testing.concat(snails.testing);
          testing = testing.concat(helicopters.testing);
        }}
      >
        Prepare Data
      </button>

      <button
        onClick={() => {
          trainingGeneration(training);
          generations++;
          console.log("Trained for " + generations + " generations.")
        }}
      >
        Train for One Generation
      </button>
      <button
        onClick={() => {
          testAll(testing);
        }}
      >
        Test
      </button>
      <Canvas id="Canvas" />
    </div>
  );
}

function Canvas() {
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

    for (let i = 0; i < 280; i++) {
      for (let j = 0; j < 280; j++) {
        drawPixel("white", contextRef.current, i, j);
      }
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

  }, []);
  return <canvas id="learningCanvas" ref={canvasRef} />;
}

function trainingGeneration(training) {
  shuffle(training);
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = data.map((x) => x / 255);
    let label = training[i].label;
    let targets = [0, 0, 0, 0, 0];
    targets[label] = 1;
    nn.train(inputs, targets);
  }
}

function testAll(testing) {
  let correct = 0;
  shuffle(testing);
  for (let i = 0; i < testing.length; i++) {
    let data = testing[i];
    let inputs = data.map((x) => x / 255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);
    let m = Math.max(...guess);
    let classification = guess.indexOf(m);
    if (classification === label) {
      correct++;
    }
  }
  let percent = correct / testing.length;
  console.log(percent + " percent correct");
}

function shuffle(array) {
  var m = array.length,
    t,
    i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function drawPixel(color, canvas, x, y) {
  canvas.fillStyle = color;
  canvas.fillRect(x, y, 1, 1);
}

function loadBytes(file) {
  let data = {};
  const req = new XMLHttpRequest();
  req.open("GET", file, true);
  req.responseType = "arraybuffer";
  req.onload = (event) => {
    const arrayBuffer = req.response;
    if (arrayBuffer) {
      data.bytes = new Uint8Array(arrayBuffer);
    }
  };
  req.send(null);
  return data;
}

const prepareData = (category, data, label) => {
  for (let i = 0; i < imgsPerSet; i++) {
    let offset = i * imgSize;
    let threshold = Math.floor(0.8 * imgsPerSet);
    if (i < threshold) {
      category.training[i] = data.bytes.subarray(offset, offset + imgSize);
      category.training[i].label = label;
    } else {
      category.testing[i - threshold] = data.bytes.subarray(
        offset,
        offset + imgSize
      );
      category.testing[i - threshold].label = label;
    }
  }
};

export default App;
