import * as THREE from 'three'
import Experience from "./Experience";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
	constructor() {
		// Setup
		this.experience = new Experience()
		this.sizes = this.experience.sizes
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.debug = this.experience.debug

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('Camera')
		}

		this.setInstance()
		this.setOrbitControls()
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			35, this.sizes.width / this.sizes.height, 0.1, 1000
		)

		this.instance.position.set(0, 0, 10)

		if (this.debug.active) {
			this.debugFolder.add(this.instance.position, 'x').min(-10).max(10).step(0.01).name('positionX')
			this.debugFolder.add(this.instance.position, 'y').min(-10).max(10).step(0.01).name('positionY')
			this.debugFolder.add(this.instance.position, 'z').min(-10).max(10).step(0.01).name('positionZ')
		}
	}

	setOrbitControls() {
		this.controls = new OrbitControls(this.instance, this.canvas)
		this.controls.enableDamping = true
		this.controls.enableZoom = false
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height
		this.instance.updateProjectionMatrix()
	}

	update() {
		this.controls.update()
	}
}