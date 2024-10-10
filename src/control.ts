import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DefaultViewPart } from './view_part/default_view_part'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'
import * as TWEEN from '@tweenjs/tween.js';
import EventEmitter from 'events';

const css3d_support: boolean = false


export class Control extends EventEmitter{
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  css3d_renderer?: CSS3DRenderer

  camera: THREE.PerspectiveCamera
  controls: OrbitControls

  view_part: DefaultViewPart

  is_control_started: boolean = false

  constructor() {
    super()
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x666666)
    this.scene.fog = new THREE.Fog(new THREE.Color(0x666666), 1000, 50000)


    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    // this.renderer.setClearColor("#ffffff")
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: for softer shadows

    if(css3d_support) {
      this.css3d_renderer = new CSS3DRenderer
      this.css3d_renderer.setSize(window.innerWidth, window.innerHeight)
      this.css3d_renderer.domElement.style.position = 'absolute'
      this.css3d_renderer.domElement.style.top = '0px'
      this.css3d_renderer.domElement.style.pointerEvents = 'none'
      this.css3d_renderer.domElement.style.zIndex = '1'
      this.css3d_renderer.domElement.style.background = 'none'
    }

    document.getElementById('container')!.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.x = 0
    this.camera.position.y = 10
    this.camera.position.z = 70

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true // Add smooth damping effect
    this.controls.dampingFactor = 0.05

    this.controls.maxPolarAngle = Math.PI / 2 - 0.1 ;
    this.controls.addEventListener('start', () => {
      // stopCameraAnimation();
      this.is_control_started = true
      this.emit('dragstart')
    });
    this.controls.addEventListener('end', () => {
      // stopCameraAnimation();
      this.is_control_started = false
      this.emit('dragend')
    });

    this.view_part = new DefaultViewPart(this)
    this.view_part.init()
  }

  render() {
    if(this.css3d_renderer)
      this.css3d_renderer.render(this.scene, this.camera)

    this.renderer.render(this.scene, this.camera)
  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('container')!.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.render()
    }, false)

    window.addEventListener('keydown', (event) => {
      this.view_part.onkeydown(event)
    }, false)
  }

  update(): void {
    if(!this.is_control_started) TWEEN.update()
    this.controls?.update()
    this.view_part.update()
    this.render()
  }
}
