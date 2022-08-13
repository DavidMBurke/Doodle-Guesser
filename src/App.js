import "./Style.css";
import React, { useState } from "react";
import mushroom1000 from "./doodles/mushroom10000.bin";
import helicopter1000 from "./doodles/helicopter10000.bin";
import octopus1000 from "./doodles/octopus10000.bin";
import penguin1000 from "./doodles/penguin10000.bin";
import snail1000 from "./doodles/snail10000.bin";
import NeuralNetwork from "./neuralNet";
import Canvas from "./Canvas";

const MUSHROOM = 0;
const HELICOPTER = 1;
const OCTOPUS = 2;
const PENGUIN = 3;
const SNAIL = 4;

const imgSize = 784;
const imgsPerSet = 10000;

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
let training = [];
let testing = [];
nn = new NeuralNetwork(784, 32, 5);

function App() {
  const [drawingData, setDrawingData] = useState([]);

  return (
    <div className="App">
      <button
        onClick={() => {
          if (training.length) {return};
          prepareData(mushrooms, mushroomData, MUSHROOM);
          prepareData(helicopters, helicopterData, HELICOPTER);
          prepareData(octopuses, octopusData, OCTOPUS);
          prepareData(penguins, penguinData, PENGUIN);
          prepareData(snails, snailData, SNAIL);
          console.log("Training data loaded!");
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
          console.log("Trained for a generation!");
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
      <button
        onClick={() => {
          guess(drawingData);
        }}
      >
        Guess
      </button>
      <Canvas id="Canvas" setDrawingData={setDrawingData} training={training}/>
    </div>
  );
}

function trainingGeneration(training) {
  if (training.length === 0) {
    console.log("No training data!");
    return;
  }
  shuffle(training);
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = data.map((x) => x / 255);
    let label = training[i].label;
    let targets = [0, 0, 0, 0, 0];
    targets[label] = 1;
    nn.train(inputs, targets);
    if ((i + 1) % 400 === 0) {
      console.log(((i + 1) / training.length) * 100 + " percent trained");
    }
  }
}

function guess(drawingData) {
  if (drawingData.length === 0) {
    console.log("You haven't drawn anything!");
    return false;
  }
  let guess = nn.predict(drawingData);
  let m = Math.max(...guess);
  let classification = guess.indexOf(m);
  switch (classification) {
    case (0): console.log("Mushroom");
    break;
    case (1): console.log("Helicopter");
    break;
    case (2): console.log("Octopus");
    break;
    case (3): console.log("Penguin");
    break;
    case (4): console.log("Snail");
    break;
    default: console.log("Switch broke!")
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
