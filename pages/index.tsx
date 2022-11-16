import React, { useEffect, useRef } from 'react';
import { mat4, vec3 } from 'gl-matrix';
import Space from '../src/space';
import { NextPage } from 'next';
import styles from './index.module.css';

const MAX_FPS = 60;

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMouseClickRef = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lastMouseClickRef.current = [canvas.width / 2, canvas.height / 2];
    const gl = canvas!.getContext('webgl2');

    if (!gl) {
      throw new Error('WebGL 2 not supported');
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    const space = new Space(gl, 200000);

    let lastTime = 0;

    function draw(time: number) {
      if (!gl) return;

      const deltaTime = time - lastTime;
      if (deltaTime < 1000 / MAX_FPS) {
        // requestAnimationFrame(draw);
        // return;
      }

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      space.step(1 / 60, lastMouseClickRef.current);
      space.render();

      lastTime = time;

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onClick={e => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = rect.height - (e.clientY - rect.top);
          lastMouseClickRef.current = [x, y];
        }}
      />
    </div>
  );
};

export default Home;
