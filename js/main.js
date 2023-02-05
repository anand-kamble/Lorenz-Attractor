/* Import module required for controls. */
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

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
    /* Using least number of segments for sphere to optimize performance. */
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
