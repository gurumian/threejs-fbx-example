import * as THREE from 'three'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";


const params = {
  asset: 'mixamo'
}

export class Human {
  loader: FBXLoader | undefined
  object: THREE.Object3D | undefined
  mixer: THREE.AnimationMixer | undefined
  clock = new THREE.Clock()

  constructor(private loading_manager: THREE.LoadingManager, private scene: THREE.Scene) {
  }

  load(): Promise<void> { 
    return new Promise((res, rej) => {
      setTimeout(() => {
        this.loader = new FBXLoader( this.loading_manager )
        this.loadAsset(params.asset)
        res()
      })
    })
  }

  loadAsset(asset: string) {
    if(!this.loader) return
    const model_path = `models/${asset}.fbx`
    this.loader.load( model_path, ( group ) => this.onload(group))
  }

  onload(group: THREE.Group) {
    console.log(group)
    // remove if already exist
    if ( this.object ) {
      this.object.traverse((child: any) => {
        if ( child.material ) {

          const materials = Array.isArray( child.material ) ? child.material : [ child.material ];
          materials.forEach( (material: any) => {

            if ( material.map ) material.map.dispose();
            material.dispose();

          } );

        }

        if ( child.geometry ) child.geometry.dispose();
      })
      this.scene.remove( this.object )
    }

    this.mixer = undefined

    this.object = group
    if ( this.object.animations && this.object.animations.length ) {
      this.mixer = new THREE.AnimationMixer( this.object )

      const action = this.mixer.clipAction( this.object.animations[ 0 ] )
      action.play()
    }

    this.object.traverse((child: any) => {
      console.log(child)
      if ( child.isMesh ) {

        child.castShadow = true;
        child.receiveShadow = true;

        if(this.object) this.scene.add( this.object );
      }
    })
  }

  update() {
    const delta = this.clock.getDelta()
    if ( this.mixer ) this.mixer.update( delta )
  }
}