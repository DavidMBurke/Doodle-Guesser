import "./Style.css";
import React, { useState } from "react";
import mushroomImport from "./doodles/mushroom10000.bin";
import helicopterImport from "./doodles/helicopter10000.bin";
import octopusImport from "./doodles/octopus10000.bin";
import penguinImport from "./doodles/penguin10000.bin";
import snailImport from "./doodles/snail10000.bin";
import bicycleImport from "./doodles/bicycle10000.bin";
import clockImport from "./doodles/clock10000.bin";
import guitarImport from "./doodles/guitar10000.bin";
import ladderImport from "./doodles/ladder10000.bin";
import sailboatImport from "./doodles/sailboat10000.bin";

import NeuralNetwork from "./neuralNet";
import Canvas from "./Canvas";

const MUSHROOM = 0;
const HELICOPTER = 1;
const OCTOPUS = 2;
const PENGUIN = 3;
const SNAIL = 4;
const BICYCLE = 5;
const CLOCK = 6;
const GUITAR = 7;
const LADDER = 8;
const SAILBOAT = 9;

const imgSize = 784;
const imgsPerSet = 10000;

let mushroomData;
let helicopterData;
let octopusData;
let penguinData;
let snailData;
let bicycleData;
let clockData;
let guitarData;
let ladderData;
let sailboatData;

mushroomData = loadBytes(mushroomImport);
helicopterData = loadBytes(helicopterImport);
octopusData = loadBytes(octopusImport);
penguinData = loadBytes(penguinImport);
snailData = loadBytes(snailImport);
bicycleData = loadBytes(bicycleImport);
clockData = loadBytes(clockImport);
guitarData = loadBytes(guitarImport);
ladderData = loadBytes(ladderImport);
sailboatData = loadBytes(sailboatImport);

let mushrooms = {};
let helicopters = {};
let octopuses = {};
let penguins = {};
let snails = {};
let bicycles = {};
let clocks = {};
let guitars = {};
let ladders = {};
let sailboats = {};

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
bicycles.training = [];
bicycles.testing = [];
clocks.training = [];
clocks.testing = [];
guitars.training = [];
guitars.testing = [];
ladders.training = [];
ladders.testing = [];
sailboats.training = [];
sailboats.testing = [];

let training = [];
let testing = [];
nn = new NeuralNetwork(784, 32, 10);

function App() {
  const [drawingData, setDrawingData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [guessOutput, setGuessOutput] = useState(null);
  const [consoleOut, setConsoleOut] = useState(null);

  return (
    <div className="App">
      {!dataLoaded ? (
        <button
          onClick={() => {
            if (training.length) {
              return;
            }
            prepareData(mushrooms, mushroomData, MUSHROOM);
            prepareData(helicopters, helicopterData, HELICOPTER);
            prepareData(octopuses, octopusData, OCTOPUS);
            prepareData(penguins, penguinData, PENGUIN);
            prepareData(snails, snailData, SNAIL);
            prepareData(bicycles, bicycleData, BICYCLE);
            prepareData(clocks, clockData, CLOCK);
            prepareData(guitars, guitarData, GUITAR);
            prepareData(ladders, ladderData, LADDER);
            prepareData(sailboats, sailboatData, SAILBOAT);

            console.log("Training data loaded!");
            setConsoleOut("Training data loaded!");
            training = training.concat(mushrooms.training);
            training = training.concat(penguins.training);
            training = training.concat(octopuses.training);
            training = training.concat(snails.training);
            training = training.concat(helicopters.training);
            training = training.concat(bicycles.training);
            training = training.concat(clocks.training);
            training = training.concat(guitars.training);
            training = training.concat(ladders.training);
            training = training.concat(sailboats.training);

            shuffle(training);
            testing = testing.concat(mushrooms.testing);
            testing = testing.concat(penguins.testing);
            testing = testing.concat(octopuses.testing);
            testing = testing.concat(snails.testing);
            testing = testing.concat(helicopters.testing);
            testing = testing.concat(bicycles.testing);
            testing = testing.concat(clocks.testing);
            testing = testing.concat(guitars.testing);
            testing = testing.concat(ladders.testing);
            testing = testing.concat(sailboats.testing);

            setDataLoaded(true);
          }}
        >
          Prepare Data
        </button>
      ) : (
        <div>
          <button
            onClick={() => {
              trainingGeneration(training, setConsoleOut);
              console.log("Trained for a generation!");
              setConsoleOut("Trained for a generation!");
            }}
          >
            Train for One Generation
          </button>
          <button
            onClick={() => {
              testAll(testing, setConsoleOut);
            }}
          >
            Test
          </button>
          <button
            onClick={() => {
              guess(drawingData, setGuessOutput);
            }}
          >
            Guess
          </button>{" "}
        </div>
      )}
      <Canvas
        id="Canvas"
        setDrawingData={setDrawingData}
        setConsoleOut={setConsoleOut}
        training={training}
      />
      <h1>
        {" "}
        {guessOutput ? "Guess: " : ""} {guessOutput}
      </h1>
      <h1> {consoleOut} </h1>
    </div>
  );
}

function trainingGeneration(training, fn) {
  if (training.length === 0) {
    console.log("No training data!");
    fn("No training data!");
    return;
  }
  shuffle(training, fn);
  for (let i = 0; i < training.length; i++) {
    let data = training[i];
    let inputs = data.map((x) => x / 255);
    let label = training[i].label;
    let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    targets[label] = 1;
    nn.train(inputs, targets);
    if ((i + 1) % 400 === 0) {
      console.log(
        (((i + 1) / training.length) * 100).toFixed(1) + " percent trained"
      );
      fn(
        `${(((i + 1) / training.length) * 100).toFixed() + " percent trained"}`
      );
    }
  }
}

function guess(drawingData, fn) {
  if (drawingData.length === 0) {
    console.log("You haven't drawn anything!");
    fn("You haven't drawn anything!");
    return false;
  }
  let guess = nn.predict(drawingData);
  let m = Math.max(...guess);
  let classification = guess.indexOf(m);
  switch (classification) {
    case 0:
      fn("Mushroom");
      break;
    case 1:
      fn("Helicopter");
      break;
    case 2:
      fn("Octopus");
      break;
    case 3:
      fn("Penguin");
      break;
    case 4:
      fn("Snail");
      break;
    case 5:
      fn("Bicycle");
      break;
    case 6:
      fn("Clock");
      break;
    case 7:
      fn("Guitar");
      break;
    case 8:
      fn("Ladder");
      break;
    case 9:
      fn("Sailboat");
      break;
    default:
      fn("Switch broke!");
  }
}

function testAll(testing, fn) {
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
  console.log((percent * 100).toFixed(2) + "% correct");
  fn(`${(percent * 100).toFixed(2) + "% correct"}`);
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
    let threshold = Math.floor(0.9 * imgsPerSet);
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
