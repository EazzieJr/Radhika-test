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
		this.camera = this.experience.camera.instance

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder('Fawn')
		}

		this.walkSpeed = -1;
		this.cameraAngles = {
			walk: { x: 4, y: 1, z: 3 },
			jump: { x: -2.5, y: 2, z: 8 },
			swim: { x: 0, y: -1, z: 9 },
			sit: { x: 1.5, y: 0.5, z: 8.5 },
			stand: { x: -1.5, y: 0.5, z: 8.5 },
			run: { x: 3.5, y: 1, z: 9.5 },
			lying: { x: 1, y: -0.5, z: 8 },
			attack: { x: -3, y: 1, z: 8 },
			idle: { x: 0, y: 0, z: 10 },
		}

		// Setup
		this.resource = this.resources.items.model

		this.setModel()
		this.setAnimation()
	}

	async setModel() {
		console.log(this.resource);
		this.model = this.resource.scene
		this.model.scale.set(1, 1, 1)
		this.model.position.set(-1, 0, 0)
		this.model.rotation.set(0, - Math.PI * 0.5, Math.PI)
		this.scene.add(this.model)

		this.modelMaterials = []

		if (this.debugFolder) {
			this.debugFolder.add(this.model.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('rotationX')
			this.debugFolder.add(this.model.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('rotationY')
			this.debugFolder.add(this.model.rotation, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('rotationZ')
			this.debugFolder.add(this.model.position, 'x').min(-Math.PI).max(Math.PI).step(0.01).name('positionX')
			this.debugFolder.add(this.model.position, 'y').min(-Math.PI).max(Math.PI).step(0.01).name('positionY')
			this.debugFolder.add(this.model.position, 'z').min(-Math.PI).max(Math.PI).step(0.01).name('positionZ')
		}

		await this.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				console.log(child);
				child.material.transparent = true
				child.material.opacity = 0
				this.modelMaterials.push(child.material)
			}
		})

		this.intiAnimation()
	}

	intiAnimation() {
		gsap.to(this.modelMaterials, {
			opacity: 1,
			duration: 2.5,
			delay: 2,
			onStart: () => {
				this.walkIntoView()
			}
		})
	}

	walkIntoView() {
		this.direction = new THREE.Vector3();

		gsap.to(this.model.position, {
			x: 0,
			duration: 3,
			ease: "none",
			onComplete: () => {
				this.animation.play('idle')

				gsap.to('.Loader span div', {
					opacity: 0,
					duration: 1,
					delay: 1,
					ease: 'bounce.out',
					stagger: {
						from: 'random',
						amount: 0.5,
					},
					onComplete: () => {
						gsap.set('.Sections', {
							opacity: 1,
						})

						setTimeout(() => {
							this.setScrollAnimation()
						}, 1000)
					}
				})

				gsap.to('.Loader p', {
					opacity: 0,
					duration: 1,
					delay: 1,
				})
			}
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

	setScrollAnimation() {
		this.section = document.querySelectorAll('section')

		this.section.forEach((section, index) => {
			const title = section.querySelectorAll('h2 div')
			const desc = section.querySelectorAll('p div')

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: 'top 1%',
					end: 'bottom 1%',
					markers: true,
					onEnter: () => {
						tl.restart(true)
					},
					onEnterBack: () => {
						tl.restart(true)
					},
					onLeave: () => {
						this.resetTextAnims(title, desc)
					},
					onLeaveBack: () => {
						this.resetTextAnims(title, desc)
					}
				},

			})

			tl.to(title, {
				opacity: 1,
				duration: 1,
				ease: 'bounce.in',
				delay: 1,
				stagger: {
					from: 'random',
					amount: 0.5,
				},
			})

			tl.to(desc, {
				opacity: 1,
				duration: 1,
				ease: 'bounce.in',
				delay: 1,
				stagger: {
					from: 'random',
					amount: 0.5,
				},
			}, 0)

			const id = section.getAttribute('id')
			const camTarget = this.cameraAngles[id] || this.cameraAngles.idle

			gsap.to(this.camera.position, {
				scrollTrigger: {
					trigger: section,
					start: 'top 1%',
					end: 'bottom 1%',
					scrub: true,
					markers: true,
					pin: section,
					pinSpacing: false,
					onEnter: () => {
						this.animation.play(id)
					},
					onEnterBack: () => {
						this.animation.play(id)
					}
				},
				x: camTarget.x,
				y: camTarget.y,
				z: camTarget.z
			})
		})
	}

	resetTextAnims(title, desc) {
		gsap.to(title, {
			opacity: 0,
			duration: 1,
			ease: 'bounce.out',
			stagger: {
				from: 'random',
				amount: 0.5,
			},
		})

		gsap.to(desc, {
			opacity: 0,
			duration: 1,
			ease: 'bounce.out',
			stagger: {
				from: 'random',
				amount: 0.5,
			},
		})
	}



	update() {
		this.animation.mixer.update(this.time.delta / 1000)
	}
}
