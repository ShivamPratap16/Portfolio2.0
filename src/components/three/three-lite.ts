// Only the pieces of three.js the particle scene uses, so the bundler can
// tree-shake the rest instead of shipping the whole library.
export {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DataTexture,
  FloatType,
  MathUtils,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
