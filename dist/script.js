import * as THREE from "three";
import Typed from "typed.js";
import confetti from "canvas-confetti";

// Happy birthday song state
let audioPlaying = false;
const playIcon = document.getElementById("play-icon");

// Blow listener
let scene;
let audioContext, analyser, microphone;
let isDimming = false; // This will track if the dimming effect has been applied
let lastVolume = 0;

const typed = new Typed("#happy-birthday-text", {
  strings: [
    `Doğum  günün kutlu olsun aşk! <span style="color: red;">&#x2764;</span>`,
  ],
  typeSpeed: 50,
  loop: false,
});

const color1 = new THREE.Color(0xff4500); // Deep orange
const color2 = new THREE.Color(0xffff00); // Bright yellow

function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#333");
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  return { scene, camera, renderer };
}

function createCake(scene) {
  // Base
  const cakeBaseGeometry = new THREE.CylinderGeometry(5.1, 5.1, 0.1, 32);
  const cakeBaseMaterial = new THREE.MeshLambertMaterial({ color: "#53290b" });
  const cakeBase = new THREE.Mesh(cakeBaseGeometry, cakeBaseMaterial);
  cakeBase.position.set(0, -1, 0);
  scene.add(cakeBase);

  // Main part
  const cakeGeometry = new THREE.CylinderGeometry(5, 5, 2, 32);
  const cakeMaterial = new THREE.MeshLambertMaterial({ color: "#8B4513" });
  const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
  scene.add(cake);

  // Top
  const cakeTopGeometry = new THREE.CylinderGeometry(5.1, 5.1, 0.1, 32);
  const cakeTopMaterial = new THREE.MeshLambertMaterial({ color: "#ffffff" });
  const cakeTop = new THREE.Mesh(cakeTopGeometry, cakeTopMaterial);
  cakeTop.position.set(0, 1.1, 0);
  scene.add(cakeTop);
}

function createCandles(scene) {
  const positions = [-2, 0, 2]; // Positions for 3 candles

  positions.forEach((pos) => {
    const candleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    const candleMaterial = new THREE.MeshLambertMaterial({ color: "#FFDAB9" });
    const candle = new THREE.Mesh(candleGeometry, candleMaterial);
    candle.position.set(pos, 2.5, 0);
    scene.add(candle);

    // Wick
    const wickGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 32);
    const wickMaterial = new THREE.MeshLambertMaterial({ color: "#333333" });
    const wick = new THREE.Mesh(wickGeometry, wickMaterial);
    wick.position.set(pos, 2.6, 0);
    scene.add(wick);
  });
}

function createFlames(scene) {
  const positions = [-2, 0, 2]; // Positions for 3 candles
  positions.forEach((pos, index) => {
    const flameGeometry = new THREE.ConeGeometry(0.3, 0.8, 32);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.position.set(pos, 4.1, 0);
    flame.name = "flame" + index; // Naming each flame
    scene.add(flame);

    const flameLight = new THREE.PointLight(0xffa500, 2, 15);
    flameLight.position.set(pos, 4.1, 0);
    flameLight.name = "flameLight" + index; // Naming each light
    scene.add(flameLight);

    animateFlame(flame, flameLight, index);
  });
}

function animateFlame(flame, flameLight, index) {
  let baseScale = 1.5 + Math.random() * 0.2; // Base scale with less randomness

  function animate() {
    requestAnimationFrame(animate);

    // Adjusted flicker effect for more subtle scaling
    let scaleY = baseScale + Math.sin(Date.now() * 0.007 + index) * 0.05; // Reduce the scaling effect
    let scaleXZ = 1 + Math.sin(Date.now() * 0.007 + index) * 0.1; // Keep X and Z scaling for width, more subtle

    flame.scale.set(scaleXZ, scaleY, scaleXZ); // Apply adjusted scaling

    // Continue with color and light flicker effect
    const lerpFactor = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
    const currentColor = color1.clone().lerp(color2, lerpFactor);
    flame.material.color.set(currentColor);
    flameLight.color.set(currentColor);
    flameLight.intensity = 1.5 + Math.random() * 0.5;
  }

  animate();
}

function addToppings(scene, numberOfToppings) {
  const toppingGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.2); // Small, elongated box geometry
  for (let i = 0; i < numberOfToppings; i++) {
    // Random color for each topping
    const toppingMaterial = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff,
    });
    const topping = new THREE.Mesh(toppingGeometry, toppingMaterial);

    // Calculate random angle and height for the toppings
    const angle = Math.random() * Math.PI * 2; // Random angle
    const height = Math.random() * 2 - 1; // Random height within the cake height

    // Convert polar coordinates to Cartesian for positioning
    const x = Math.cos(angle) * 5;
    const z = Math.sin(angle) * 5;
    topping.position.set(x, height, z);

    // Rotate the topping to align with the cake's curvature
    topping.rotation.y = -angle;

    scene.add(topping);
  }
}

function explodeConfettis() {
  confetti({
    spread: 100,
    particleCount: 200,
    origin: { y: 0.6, x: 0.2 },
  });
  confetti({
    spread: 100,
    particleCount: 200,
    origin: { y: 0.6, x: 0.8 },
  });

  setInterval(() => {
    confetti({
      spread: 100,
      particleCount: 200,
      origin: { y: 0.6, x: 0.2 },
    });
    confetti({
      spread: 100,
      particleCount: 200,
      origin: { y: 0.6, x: 0.8 },
    });
  }, 4000);
}

function addPlayListener() {
  const audio = document.getElementById("happy-birthday-audio");

  playIcon.onclick = () => {
    if (audioPlaying) {
    } else {
      audio.play(); // Start playing the audio
      const stopIcon = document.createElement("i");
      stopIcon.className = "ri-stop-fill";
      stopIcon.id = "stop-icon";

      // Add functionality to stop the audio
      stopIcon.onclick = () => {
        audio.pause();
        audio.currentTime = 0;
        audioPlaying = false;

        stopIcon.parentNode.replaceChild(playIcon, stopIcon);
      };

      playIcon.parentNode.replaceChild(stopIcon, playIcon);
      audioPlaying = true;
    }
  };
}

async function setupAudio() {
  if (!navigator.mediaDevices) {
    alert("Your browser does not support audio input");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    microphone = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    microphone.connect(analyser);
  } catch (err) {
    console.error("Error accessing the microphone:", err);
  }
}

function getVolume() {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  return sum / dataArray.length;
}

function monitorAudio(scene) {
  const currentVolume = getVolume();
  const volumeChange = Math.abs(currentVolume - lastVolume);
  if (volumeChange > 20) {
    dimFlames(scene); // Correctly uses the scene parameter
  }
  lastVolume = currentVolume;
  requestAnimationFrame(() => monitorAudio(scene)); // Fix: pass scene to the next call
}

function animateFlamePosition(child, targetY, delayBeforeReturn = 3000) {
  const deltaY = 0.007; // Increment to move per frame, smaller for smoother animation
  const originalY = child.position.y; // Save the original position

  function moveDown() {
    if (child.position.y > targetY) {
      child.position.y -= deltaY;
      requestAnimationFrame(moveDown);
    } else {
      setTimeout(moveUp, delayBeforeReturn); // Wait before moving up
    }
  }

  function moveUp() {
    if (child.position.y < originalY) {
      child.position.y += deltaY;
      requestAnimationFrame(moveUp);
    }
  }

  moveDown(); // Start the downward animation
}

function dimFlames(scene) {
  if (isDimming) return; // Check if the dimming has been applied already
  isDimming = true;

  scene.children.forEach((child) => {
    if (
      child instanceof THREE.PointLight &&
      child.name.startsWith("flameLight")
    ) {
      // Reduce the light intensity
      const dimIntensity = 0; // Ensure intensity doesn't go too low
      child.intensity = dimIntensity;
    }
    if (child instanceof THREE.Mesh && child.name.startsWith("flame")) {
      // Animate the reduction of the flame height
      animateFlamePosition(child, 3.55); // Animate position change
    }
  });

  isDimming = false; // Set the flag to true to prevent further dimming
}

async function setup() {
  const result = setupScene();
  const camera = result.camera;
  const renderer = result.renderer;
  scene = result.scene;
  createCake(scene);
  createCandles(scene);
  createFlames(scene);
  addToppings(scene, 150);
  await setupAudio();
  monitorAudio(scene);

  // General lighting
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight("#fade84"); // Soft white light
  scene.add(ambientLight);

  // Camera position - move it up to look from above
  camera.position.set(0, 8, 15); // Position the camera above the scene
  camera.lookAt(scene.position); // Ensure the camera looks at the center of the scene
  camera.near = 0.1;
  camera.updateProjectionMatrix();

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();

  // Effects
  explodeConfettis();
  addPlayListener();
}

function main() {
  setup();
}

main();
