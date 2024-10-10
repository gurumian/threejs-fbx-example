import * as THREE from 'three'
import { ViewPart } from "./view_part";
import { Control } from '../control';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Light } from './widget/light';
import { Human } from './widget/human';

export class DefaultViewPart extends ViewPart {
  
  loading_mamanger: THREE.LoadingManager
  loader: FBXLoader | undefined
  
  light?: Light
  human?: Human

  constructor(public control: Control) {  
    super(control)
    this.loading_mamanger = new THREE.LoadingManager()
    this.light = new Light(control.scene)
  }

  async init(): Promise<void> {
    this.human = new Human(this.loading_mamanger, this.control.scene)
    await this.human.load()
    return super.init()
  }

  
  dispose(): void {
    if(this.light) this.light.dispose()
    super.dispose()
  }

  update(): void {
    if(this.human) this.human.update()

    super.update()
  }

  onkeydown(event: KeyboardEvent) {
    if (event.code === 'Space') {
    }

    // jump forward
    if (event.key === 'n' || event.key === 'N') {
    }
  }
}
