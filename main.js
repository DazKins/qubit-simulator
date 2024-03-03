import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

let qubitState = [
  [1, 0],
  [0, 0],
];

const matMul = (mat, vec) => [
  complexAdd(complexMul(mat[0][0], vec[0]), complexMul(mat[1][0], vec[1])),
  complexAdd(complexMul(mat[0][1], vec[0]), complexMul(mat[1][1], vec[1])),
];

let complexMul = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
let complexAdd = ([a, b], [c, d]) => [a + c, b + d];

const renderDiv = document.getElementById("render");

const width = 800;
const height = 600;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(width, height);
renderDiv.appendChild(renderer.domElement);

const sphereGeometry = new THREE.SphereGeometry();
const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x555555,
  transparent: true,
  opacity: 0.5,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const pointerGeometry = new THREE.CylinderGeometry(0.025, 0.025, 1);
const pointerMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});
const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
pointer.position.y = 0.5;

const smallSphereGeometry = new THREE.SphereGeometry(0.05);
const smallSphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
});
const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
smallSphere.position.y = 1;

const pivot = new THREE.Group();
pivot.position.set(0, 0, 0);
pivot.add(pointer);
pivot.add(smallSphere);
scene.add(pivot);

const basisSphereGeometry = new THREE.SphereGeometry(0.03);
const basisSphereMaterial = new THREE.MeshBasicMaterial({
  color: 0x555555,
});
const zeroSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
zeroSphere.position.y = 1;
const oneSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
oneSphere.position.y = -1;
const plusSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
plusSphere.position.x = 1;
const negativeSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
negativeSphere.position.x = -1;
const rSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
rSphere.position.z = 1;
const lSphere = new THREE.Mesh(basisSphereGeometry, basisSphereMaterial);
lSphere.position.z = -1;

scene.add(zeroSphere);
scene.add(oneSphere);
scene.add(plusSphere);
scene.add(negativeSphere);
scene.add(rSphere);
scene.add(lSphere);

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xaaaaaa,
  linewidth: 5,
});

const pointsX = [];
pointsX.push(new THREE.Vector3(-1, 0, 0));
pointsX.push(new THREE.Vector3(1, 0, 0));

const pointsY = [];
pointsY.push(new THREE.Vector3(0, -1, 0));
pointsY.push(new THREE.Vector3(0, 1, 0));

const pointsZ = [];
pointsZ.push(new THREE.Vector3(0, 0, -1));
pointsZ.push(new THREE.Vector3(0, 0, 1));

const xAxisGeometry = new THREE.BufferGeometry().setFromPoints(pointsX);
const xAxis = new THREE.Line(xAxisGeometry, lineMaterial);

const yAxisGeometry = new THREE.BufferGeometry().setFromPoints(pointsY);
const yAxis = new THREE.Line(yAxisGeometry, lineMaterial);

const zAxisGeometry = new THREE.BufferGeometry().setFromPoints(pointsZ);
const zAxis = new THREE.Line(zAxisGeometry, lineMaterial);

scene.add(xAxis);
scene.add(yAxis);
scene.add(zAxis);

const zeroDiv = document.createElement("div");
zeroDiv.className = "label";
zeroDiv.textContent = "|0⟩";
zeroDiv.style.backgroundColor = "transparent";

const zeroLabel = new CSS2DObject(zeroDiv);
zeroLabel.position.set(0, 1.1, 0);
scene.add(zeroLabel);

const oneDiv = document.createElement("div");
oneDiv.className = "label";
oneDiv.textContent = "|1⟩";
oneDiv.style.backgroundColor = "transparent";

const oneLabel = new CSS2DObject(oneDiv);
oneLabel.position.set(0, -1.1, 0);
scene.add(oneLabel);

const plusDiv = document.createElement("div");
plusDiv.className = "label";
plusDiv.textContent = "|+⟩";
plusDiv.style.backgroundColor = "transparent";

const plusLabel = new CSS2DObject(plusDiv);
plusLabel.position.set(1.1, 0, 0);
scene.add(plusLabel);

const minusDiv = document.createElement("div");
minusDiv.className = "label";
minusDiv.textContent = "|-⟩";
minusDiv.style.backgroundColor = "transparent";

const minusLabel = new CSS2DObject(minusDiv);
minusLabel.position.set(-1.1, 0, 0);
scene.add(minusLabel);

const rDiv = document.createElement("div");
rDiv.className = "label";
rDiv.textContent = "|R⟩";
rDiv.style.backgroundColor = "transparent";

const rLabel = new CSS2DObject(rDiv);
rLabel.position.set(0, 0, 1.1);
scene.add(rLabel);

const lDiv = document.createElement("div");
lDiv.className = "label";
lDiv.textContent = "|L⟩";
lDiv.style.backgroundColor = "transparent";

const lLabel = new CSS2DObject(lDiv);
lLabel.position.set(0, 0, -1.1);
scene.add(lLabel);

const css2DRenderer = new CSS2DRenderer();
css2DRenderer.setSize(width, height);
css2DRenderer.domElement.style.position = "absolute";
css2DRenderer.domElement.style.top = "0";
css2DRenderer.domElement.style.color = "white";
renderDiv.appendChild(css2DRenderer.domElement);

const controls = new OrbitControls(camera, css2DRenderer.domElement);

camera.position.set(2, 1, 2);

let oldTheta, oldPhi;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  css2DRenderer.render(scene, camera);
  renderer.render(scene, camera);

  let innerQubitState = qubitState;

  let aConj = [innerQubitState[0][0], -innerQubitState[0][1]];
  let aMag = Math.sqrt(innerQubitState[0][0] ** 2 + innerQubitState[0][1] ** 2);

  if (aMag != 0) {
    let fact = [aConj[0] / aMag, aConj[1] / aMag];

    innerQubitState[0] = complexMul(innerQubitState[0], fact);
    innerQubitState[1] = complexMul(innerQubitState[1], fact);
  }

  let [[a, b], [c, d]] = innerQubitState;

  if (a > 1) a = 1;
  if (b > 1) b = 1;

  const theta = 2 * Math.acos(Math.sqrt(a * a + b * b));
  const phi = Math.atan2(a * d - b * c, a * c - b * d);

  if (theta != oldTheta || phi != oldPhi) {
    console.log(`Theta: ${theta}, Phi: ${phi}`);
  }

  oldTheta = theta;
  oldPhi = phi;

  pivot.rotation.z = -theta;
  pivot.rotation.y = -phi;
}
animate();

let gatesDiv, circuitDiv, pointerDiv, qubitStateDiv;
let gateDivs = {};

let gates = {
  i: [
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [1, 0],
    ],
  ],
  x: [
    [
      [0, 0],
      [1, 0],
    ],
    [
      [1, 0],
      [0, 0],
    ],
  ],
  y: [
    [
      [0, 0],
      [0, -1],
    ],
    [
      [0, 1],
      [0, 0],
    ],
  ],
  z: [
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [-1, 0],
    ],
  ],
  h: [
    [
      [1 / Math.sqrt(2), 0],
      [1 / Math.sqrt(2), 0],
    ],
    [
      [1 / Math.sqrt(2), 0],
      [-1 / Math.sqrt(2), 0],
    ],
  ],
  s: [
    [
      [1, 0],
      [0, 0],
    ],
    [
      [0, 0],
      [0, 1],
    ],
  ],
};

const getNumString = (num) => {
  if (num == Math.SQRT1_2) return "1/√2";
  if (num == -Math.SQRT1_2) return "-1/√2";
  if (num == 0.5) return "1/2";
  if (num == -0.5) return "-1/2";
  return `${num}`;
};

const getComplexCoeffString = ([a, b]) => {
  if (a == 0 && b == 0) return "0";
  if (a == 0 && b == 1) return `i`;
  if (a == 0 && b == -1) return `-i`;
  if (a == 1 && b == 0) return "";
  if (a == -1 && b == 0) return "-";
  if (a == 0) return `${getNumString(b)}i`;
  if (b == 0) return `${getNumString(a)}`;
  if (b < 0) return `(${getNumString(a)} - ${getNumString(-b)}i)`;
  return `(${getNumString(a)} + ${getNumString(b)}i)`;
};

const cleanNum = (a) => {
  const nums = [0, 1, -1, Math.SQRT1_2, -Math.SQRT1_2, 0.5, -0.5];

  let result = a;

  nums.forEach((num) => {
    if (Math.abs(a - num) < 0.0001) result = num;
  });

  return result;
};

let refreshQubitState = () => {
  qubitState = [
    [1, 0],
    [0, 0],
  ];

  for (let i = 0; i < pointerIndex; i++) {
    let gate = circuit[i];
    let mat = gates[gate];
    qubitState = matMul(mat, qubitState);
  }

  let qubitStateString;

  qubitState[0] = [cleanNum(qubitState[0][0]), cleanNum(qubitState[0][1])];
  qubitState[1] = [cleanNum(qubitState[1][0]), cleanNum(qubitState[1][1])];

  const a = qubitState[0];
  const b = qubitState[1];
  const aString = getComplexCoeffString(a);
  const bString = getComplexCoeffString(b);

  if (a[0] == 0 && a[1] == 0) qubitStateString = `${bString} |1⟩`;
  else if (b[0] == 0 && b[1] == 0) qubitStateString = `${aString} |0⟩`;
  else qubitStateString = `${aString} |0⟩  +  ${bString} |1⟩`;

  qubitStateDiv.innerHTML = qubitStateString;

  console.log(
    `(${qubitState[0][0]} + ${qubitState[0][1]}i) |0⟩ + (${qubitState[1][0]} + ${qubitState[1][1]}i) |1⟩`
  );

  return qubitState;
};

let circuit = [
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
  "i",
];
let displayCircuit = circuit;
let circuitSize = circuit.length;

let selectedGate, hoveredIndex;

let pointerIndex = 0;

const reloadCircuitDiv = () => {
  displayCircuit.forEach((gate, index) => {
    const div = createGateDiv(gate);
    const childNode = circuitDiv.childNodes[index];

    childNode.innerHTML = div.innerHTML;
    childNode.className = div.className + " inCircuit";
    childNode.id = div.id;
    childNode.style.opacity = 1.0;

    if (index == hoveredIndex) {
      childNode.style.opacity = 0.4;
    }
  });
};

const updateCircuit = () => {
  displayCircuit = [...circuit];

  if (hoveredIndex || hoveredIndex == 0) {
    const currentGate = displayCircuit[hoveredIndex];
    if (currentGate == "i") {
      displayCircuit[hoveredIndex] = selectedGate;
    } else {
      let previousGate = selectedGate;
      for (i = hoveredIndex; i < circuitSize; i++) {
        let tmp = displayCircuit[i];
        displayCircuit[i] = previousGate;
        previousGate = tmp;

        if (previousGate == "i") break;
      }
    }
  }

  reloadCircuitDiv();
};

const onDragStart = (e) => {
  const target = e.target;

  selectedGate = getGate(target);

  if (target.className.includes("inCircuit")) {
    const index = getChildIndex(target);
    circuit[index] = "i";
    updateCircuit();
  } else {
    e.target.style.opacity = "0.4";
  }

  console.log(gateDivs[selectedGate]);

  e.dataTransfer.setDragImage(gateDivs[selectedGate], 0, 0);
};

const onDragEnd = (e) => {
  circuit = [...displayCircuit];
  e.target.style.opacity = "1";
  hoveredIndex = null;
  selectedGate = null;
  updateCircuit();
  refreshQubitState();
};

const onDragOver = (e) => {
  e.preventDefault();

  const target = e.target;

  if (target.parentNode.id != "circuit") {
    return;
  }

  const index = getChildIndex(target);
  hoveredIndex = index;
  updateCircuit();
};

const onDragLeave = (e) => {
  hoveredIndex = null;
  updateCircuit();
};

const createGateDiv = (gate) => {
  let div = document.createElement("div");
  div.id = "gate." + gate;
  div.draggable = true;
  div.className = gate + "gate gate";
  if (gate !== "i") div.innerHTML = gate.toUpperCase();
  div.addEventListener("dragstart", onDragStart);
  div.addEventListener("dragover", onDragOver);
  div.addEventListener("dragleave", onDragLeave);
  div.addEventListener("dragend", onDragEnd);

  return div;
};

const getGate = (div) => {
  return div.id.replace("gate.", "");
};

const getChildIndex = (div) => {
  return Array.prototype.indexOf.call(div.parentNode.childNodes, div);
};

const updatePointerDiv = () => {
  pointerDiv.style.transform = `translate(${pointerIndex * 66 - 2}px, -4px)`;
};

document.addEventListener("DOMContentLoaded", (event) => {
  gatesDiv = document.getElementById("gates");
  circuitDiv = document.getElementById("circuit");
  pointerDiv = document.getElementById("pointer");
  qubitStateDiv = document.getElementById("qubitState");

  Object.keys(gates).forEach((gate) => {
    const div = createGateDiv(gate);
    gateDivs[gate] = div;
    if (gate == "i") return;
    gatesDiv.appendChild(div);
  });

  circuit.forEach((gate) => {
    circuitDiv.appendChild(createGateDiv(gate));
  });

  document.getElementById("resetControl").addEventListener("click", () => {
    circuit = Array(circuitSize).fill("i");
    displayCircuit = circuit;
    pointerIndex = 0;
    reloadCircuitDiv();
    refreshQubitState();
    updatePointerDiv();
  });

  document.getElementById("leftControl").addEventListener("click", () => {
    if (pointerIndex > 0) pointerIndex -= 1;
    updatePointerDiv();
    refreshQubitState();
  });

  document.getElementById("endLeftControl").addEventListener("click", () => {
    pointerIndex = 0;
    updatePointerDiv();
    refreshQubitState();
  });

  document.getElementById("rightControl").addEventListener("click", () => {
    if (pointerIndex < circuitSize) pointerIndex += 1;
    updatePointerDiv();
    refreshQubitState();
  });

  document.getElementById("endRightControl").addEventListener("click", () => {
    pointerIndex = circuitSize;
    updatePointerDiv();
    refreshQubitState();
  });
});
