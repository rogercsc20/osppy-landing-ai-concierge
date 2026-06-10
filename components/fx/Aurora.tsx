"use client";

import { useEffect, useRef } from "react";

/**
 * Hand-rolled WebGL aurora: a fragment-shader fbm flow field in the brand
 * teals over near-black, no three.js. Renders at capped DPR, pauses when
 * offscreen or the tab is hidden, and draws a single static frame under
 * prefers-reduced-motion.
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.0 + vec2(13.7, 7.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / r;
  vec2 q = vec2(uv.x * r.x / r.y, uv.y);

  float slow = t * 0.04;
  // two advected fbm layers create the flowing curtain
  float n1 = fbm(q * 1.6 + vec2(slow, -slow * 0.6));
  float n2 = fbm(q * 2.4 - vec2(slow * 0.7, slow * 0.4) + n1);
  float flow = fbm(q * 1.2 + vec2(n2, n1) * 1.4);

  // brand teals
  vec3 deep = vec3(0.012, 0.055, 0.055);   // abyss
  vec3 teal = vec3(0.05, 0.50, 0.58);      // turquoise
  vec3 cyan = vec3(0.18, 0.77, 0.85);      // glow
  vec3 ember = vec3(0.85, 0.32, 0.18);     // warm trace

  vec3 col = deep;
  col = mix(col, teal, smoothstep(0.35, 0.85, flow) * 0.55);
  col = mix(col, cyan, smoothstep(0.62, 0.95, n2 * flow) * 0.5);
  col = mix(col, ember, smoothstep(0.78, 0.98, n1 * n2) * 0.18);

  // vertical falloff: brightest in the upper half, fades to canvas below
  float fall = smoothstep(0.0, 0.72, uv.y);
  col *= 0.25 + 0.75 * fall;

  // vignette
  float vig = 1.0 - 0.55 * length(uv - vec2(0.5, 0.62));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function Aurora({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // static CSS gradient fallback stays visible

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "r");
    const uTime = gl.getUniformLocation(prog, "t");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let running = false;
    const start = performance.now();

    const frame = () => {
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running) rafId = requestAnimationFrame(frame);
    };

    const play = () => {
      if (running || reduce) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // one static frame always (covers reduced-motion + first paint)
    gl.uniform1f(uTime, 12.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const io = new IntersectionObserver(([e]) =>
      e.isIntersecting ? play() : pause(),
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default Aurora;
