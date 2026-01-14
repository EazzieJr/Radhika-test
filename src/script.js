import Experience from "./Experience/Experience"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger, SplitText)

const lenis = new Lenis({
	// duration: 1, autoRaf: true,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
	lenis.raf(time * 1000)
})

const canvas = document.querySelector('canvas.webgl')
const exp = new Experience(canvas)

const loaderHead = document.querySelector('.Loader span')
const loaderDesc = document.querySelector('.Loader p')

const splitLoader = new SplitText([loaderHead, loaderDesc], {
	type: "chars", onSplit: (self) => {
		gsap.set(self.chars, { opacity: 0 })
		gsap.set('.Loader', { opacity: 1 })
} })

gsap.to(splitLoader.chars, {
	opacity: 1,
	delay: 1,
	duration: 1,
	ease: 'bounce.in',
	stagger: {
		from: 'random',
		amount: 0.5,
	},
})


const sections = document.querySelectorAll('section')

sections.forEach((section) => {
	const title = section.querySelector('h2')
	const desc = section.querySelector('p')
	const splitTitle = new SplitText(title, {
		type: "chars", onSplit: (self) => {
			gsap.set(self.chars, { opacity: 0 })
		}
	})
	const splitDesc = new SplitText(desc, {
		type: "chars", onSplit: (self) => {
			gsap.set(self.chars, { opacity: 0 })
		}
	})
})