import './style.css'
import * as THREE from 'three'
import {OrbitControls} from '/node_modules/three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from '/node_modules/three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;


const textureLoader = new THREE.TextureLoader()
textureLoader.load('/images/outer-space-bg.jpeg', texture => {
  scene.background = texture
})

const controls = new OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
// camera.position.set( 0, 20, 100 );
controls.update();

const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

const loader = new FBXLoader()
loader.setPath('3d-models/models/')
loader.load('Erika Archer With Bow Arrow.fbx', (fbx) => {
  fbx.scale.setScalar(0.01)
  fbx.traverse(c => {
    c.castShadow = true
  })
  const anim = new FBXLoader()
  anim.setPath('3d-models/animations/')
  anim.load('Standing Equip Bow.fbx', (anim) => {
    const mixer = new THREE.AnimationMixer(fbx)
    const idle = mixer.clipAction(anim.animations[0])
    idle.play()
  })
  scene.add(fbx)
})




const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update()
}
animate();