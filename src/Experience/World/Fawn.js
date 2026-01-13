import * as THREE from 'three'
import Experience from "../Experience";
import { gsap } from 'gsap'

export default class Fawn {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.time = this.experience.time
		this.debug = this.experience.debug

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('Fawn')
		}

		this.walkSpeed = -1;

		// Setup
		this.resource = this.resources.items.model

		this.setModel()
		this.setAnimation()
	}

	setModel() {
		console.log(this.resource);
		this.model = this.resource.scene
		this.model.scale.set(1, 1, 1)
		this.model.position.set(-2, 0, 0)
		this.model.rotation.set(0, - Math.PI * 0.5, Math.PI)
		this.scene.add(this.model)

		this.walkIntoView()

		if (this.debugFolder) {
			this.debugFolder.add(this.model.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotationX')
			this.debugFolder.add(this.model.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotationY')
			this.debugFolder.add(this.model.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('rotationZ')
			this.debugFolder.add(this.model.position, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('positionX')
			this.debugFolder.add(this.model.position, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('positionY')
			this.debugFolder.add(this.model.position, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('positionZ')
		}

		this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				console.log(child);
				child.material.transparent = true
				child.material.opacity = 0

				gsap.to(child.material, {
					opacity: 1,
					duration: 2,
				})
			}
		})
	}

	walkIntoView() {
		this.direction = new THREE.Vector3();

		console.log(this.model.getWorldDirection(this.direction));

		gsap.to(this.model.position, {
			x: 0,
			duration: 5,
			ease: "none" // "none" is best for walking to keep the pace steady
		})
	}

	setAnimation() {
		this.animation = {}
		this.animation.mixer = new THREE.AnimationMixer(this.model)
		this.animation.actions = {}
		this.actions = ['walk', 'swim', 'stand', 'sit', 'run', 'lying', 'jump', 'idle', 'attack']

		this.actions.forEach((action, index) => {
			this.animation.actions[action] = this.animation.mixer.clipAction(this.resource.animations[index])
		})

		this.animation.actions.current = this.animation.actions.walk
		this.animation.actions.current.play()

		this.animation.play = (name) => {
			const newAction = this.animation.actions[name]
			const oldAction = this.animation.actions.current

			newAction.reset()
			newAction.play()
			newAction.crossFadeFrom(oldAction, 1)

			this.animation.actions.current = newAction
		}

		if (this.debug.active) {
			const debugObject = {
				playWalk: () => { this.animation.play('walk') },
				playSwim: () => { this.animation.play('swim') },
				playStand: () => { this.animation.play('stand') },
				playSit: () => { this.animation.play('sit') },
				playRun: () => { this.animation.play('run') },
				playLying: () => { this.animation.play('lying') },
				playJump: () => { this.animation.play('jump') },
				playIdle: () => { this.animation.play('idle') },
				playAttack: () => { this.animation.play('attack') },
			}

			this.debugFolder.add(debugObject, 'playWalk').name('playWalk')
			this.debugFolder.add(debugObject, 'playSwim').name('playSwim')
			this.debugFolder.add(debugObject, 'playStand').name('playStand')
			this.debugFolder.add(debugObject, 'playSit').name('playSit')
			this.debugFolder.add(debugObject, 'playRun').name('playRun')
			this.debugFolder.add(debugObject, 'playLying').name('playLying')
			this.debugFolder.add(debugObject, 'playJump').name('playJump')
			this.debugFolder.add(debugObject, 'playIdle').name('playIdle')
			this.debugFolder.add(debugObject, 'playAttack').name('playAttack')
		}
	}

	update() {
		this.animation.mixer.update(this.time.delta / 1000)
	}
}