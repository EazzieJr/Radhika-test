import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';
import Fox from './Fox';
import Fawn from './Fawn';

export default class world {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources


		this.resources.on('ready', () => {
			// Setup
			// this.floor = new Floor()
			// this.fox = new Fox()
			this.fawn = new Fawn()
			// this.environment = new Environment()
		})
	}

	update() {
		if (this.fawn) {
			this.fawn.update()
		}
	}
}