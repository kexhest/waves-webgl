/*
 * This file is part of the waves-webgl project.
 *
 * (c) Magnus Bergman <hellos@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import createContext from 'gl-context';
import createShader from 'gl-shader';
import createTexture from 'gl-texture2d';
import triangle from 'a-big-triangle';
import now from 'performance-now';

import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

import bg from './bg.jpg';

const canvas = document.createElement('canvas');

let gl = null;
let shader = null;
let texture = null;
let startTime = null;

function render() {
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;

  gl.viewport(0, 0, width, height);

  shader.bind();
  shader.attributes.position.location = 0;
  shader.uniforms.time = (now() - startTime) * 0.001;
  shader.uniforms.texture = texture.bind();
  shader.uniforms.delimiter = 0.24;
  shader.uniforms.resolution = [width, height];

  triangle(gl);
}

const photo = document.createElement('img');
photo.src = bg;
photo.onload = function() {
  startTime = now();

  canvas.width = this.width;
  canvas.height = this.height;

  gl = createContext(canvas, render);
  shader = createShader(gl, vertex, fragment);
  texture = createTexture(gl, photo);

  document.body.appendChild(canvas);
}
