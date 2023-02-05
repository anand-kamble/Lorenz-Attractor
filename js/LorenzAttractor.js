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
    /**
     * The constants σ, ρ, and β are system parameters proportional to the Prandtl number, Rayleigh number,
     * and certain physical dimensions of the two-dimensional fluid layer.
     */
    this.#RHO = 28;
    this.#SIGMA = 10;
    this.#BETA = 8 / 3;

    /**
     * x is proportional to the rate of convection,
     * y to the horizontal temperature variation,
     * and z to the vertical temperature variation
     */
    this.x = initialX || 0;
    this.y = initialY || 0;
    this.z = initialZ || 0;

    /**
     * Initial values of x,y,z required for reset.
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
   * @property {number} z - The Z Coordinate
   */
  /** 
   * Function which calculates the next values of x,y,z 
   * Refer to https://en.wikipedia.org/wiki/Lorenz_system for more information.
   *   
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
    this.time = this.time + this.dt;
    return {
      x: newVector.dxdt + x,
      y: newVector.dydt + y,
      z: newVector.dzdt + z,
    };
  }

  /**
   * Function to reset the attractor to its initial position.
   */
  reset() {
    this.vectors = [];
    this.time = 0;
    this.x = this.initialX;
    this.y = this.initialY;
    this.z = this.initialZ;
  }
}
