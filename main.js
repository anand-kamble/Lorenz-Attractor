/* Import module required for controls. */
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

/**
 * Lorenz Attractor class
 * It implemets the methods required for simulation of the attractor.
 *
 * @class Lorenz Attractor
 * @author Anand Kamble <anandmk837@gmail.com>
 * @version 1.0.0
 *
 */
class LorenzAttractor {
  /* Declaring private fields of the class */
  #RHO;
  #SIGMA;
  #BETA;
  constructor(
    /** @type {number}*/ initialX,
    /** @type {number}*/ initialY,
    /** @type {number}*/ initialZ,
    /** @type {number}*/ dt
  ) {
    /* 
      The constants σ, ρ, and β are system parameters proportional to the Prandtl number, Rayleigh number, 
      and certain physical dimensions of the two-dimensional fluid layer.
      */
    this.#RHO = 28;
    this.#SIGMA = 10;
    this.#BETA = 8 / 3;

    /* 
      x is proportional to the rate of convection, 
      y to the horizontal temperature variation, 
      and z to the vertical temperature variation 
      */
    this.x = initialX || 0;
    this.y = initialY || 0;
    this.z = initialZ || 0;

    /* 
    Initial values of x,y,z required for reset.
    */
    this.initialX = initialX;
    this.initialY = initialY;
    this.initialZ = initialZ;

    /* 
      Time step
      */
    this.dt = dt || 1;

    /* 
      Array holding calculated values.
      */
    this.vectors = [[initialX, initialY, initialZ]];

    /* 
      Time passed in the simulation.
      */
    this.time = 0;
  }

  /**
   * Defining the properties of the object which will be returned by following function.
   * @typedef {Object} Point
   * @property {number} x - The X Coordinate
   * @property {number} y - The Y Coordinate
   * @property {number} y - The Z Coordinate
   */
  /** 
  Function which calculates the next values of x,y,z 
  Refer to https://en.wikipedia.org/wiki/Lorenz_system 
  for more information.

  @returns {Point}
  */
  next() {
    let x = this.vectors[this.vectors.length - 1][0];
    let y = this.vectors[this.vectors.length - 1][1];
    let z = this.vectors[this.vectors.length - 1][2];

    const newVector = {
      dxdt: this.#SIGMA * (y - x) * this.dt,
      dydt: (x * (this.#RHO - z) - y) * this.dt,
      dzdt: (x * y - this.#BETA * z) * this.dt,
    };

    this.vectors.push([
      newVector.dxdt + x,
      newVector.dydt + y,
      newVector.dzdt + z,
    ]);
    this.time = this.time + this.step;
    return {
      x: newVector.dxdt + x,
      y: newVector.dydt + y,
      z: newVector.dzdt + z,
    };
  }

  /* 
  Function to reset the attractor to its initial position.
  */
  reset() {
    this.vectors = [];
    this.time = 0;
    this.x = this.initialX;
    this.y = this.initialY;
    this.z = this.initialZ;
  }
}

/* 
Function for rendering of the attractor.
*/
const init = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  /**
   * Setting up the mouse controls
   * with the auto rotation of camera.
   */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.update();
  controls.target.z = 25;
  camera.position.z = 75;

  /** 
  * This function generate a sphere at the given point.
  @returns {void}
  */
  const createPoint = (
    /** @type {number}*/ x,
    /** @type {number}*/ y,
    /** @type {number}*/ z
  ) => {
    const geometry = new THREE.SphereGeometry(0.1, 3, 2);
    const material = new THREE.MeshBasicMaterial({ color: `rgb(3, 252, 240)` });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    scene.add(sphere);
  };

  /**
   * Initial Parameters for the Lorenz Attractor class.
   */
  const parameters = {
    timeStep: 0.01,
    initialX: 0,
    initialY: 1,
    initialZ: 1.05,
  };

  /**
   * Creating an instance of the Lorenz Attractor class.
   */
  const attractor = new LorenzAttractor(
    parameters.initialX,
    parameters.initialY,
    parameters.initialZ,
    parameters.timeStep
  );

  /** 
  Simulation function which generates the next point of the attractor.
  @returns {void}
  */
  const simulate = () => {
    const newPoint = attractor.next();
    createPoint(newPoint.x, newPoint.y, newPoint.z);
  };

  /**
   * Running the simulate function at every millisecond.
   */
  const TimeInterval = 1;
  setInterval(() => {
    simulate();
  }, TimeInterval);

  /** 
  * Animate functions which renders a new frame every time
  * called by requestAnimationFrame.
  @returns {void}
  */
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  };
  animate();

  /**
   * Handle the resizing of the window by updating the renderer and camera.
   */
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize, false);
};

window.onload = () => {
  if (THREE) {
    init();
  }
};
