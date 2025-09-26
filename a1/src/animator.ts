type AnimationJob = {start: number, duration: number, callback: (progress: number) => void, easingFunction: EasingFunction};

export type EasingFunction = (t: number) => number;

export const linear: EasingFunction = t => t;
export const flip: EasingFunction = t => 1 - t;
export const easeOut: EasingFunction = t => Math.pow(t, 2);
export const easeIn: EasingFunction = t => flip(easeOut(flip(t)));

class Animator {
	private jobs: AnimationJob[] = [];

	addJob(duration: number, callback: (progress: number) => void, easingFunction: EasingFunction = linear) {
		this.jobs.push({start: NaN, duration, callback, easingFunction});
	}

	animate(time: number): void {
		let hasBadTime = false;

		this.jobs = this.jobs.filter((job) => {
			let {start, duration, callback, easingFunction} = job;

			if (Number.isNaN(start)) {
				start = time;
				hasBadTime = true;
			}

			let elapsed = time - start;
			let done = elapsed >= duration;
			callback(done ? 1 : easingFunction(elapsed / duration));
			return !done;
		});

		if (hasBadTime) {
			this.jobs = this.jobs.map(({start, duration, callback, easingFunction}) => {
				return {start: Number.isNaN(start) ? time : start, duration, callback, easingFunction}
			});
		}
	}

	cancelAnimations() {
		this.jobs = [];
	}
}

export const animator = new Animator();