type AnimationJob = {start: number, duration: number, callback: (progress: number) => void};

class Animator {
	private jobs: AnimationJob[] = [];

	addJob(duration: number, callback: (progress: number) => void) {
		this.jobs.push({start: NaN, duration, callback});
	}

	animate(time: number): void {
		let hasBadTime = false;
		this.jobs = this.jobs.filter((job) => {
			let {start, duration, callback} = job;
			if (Number.isNaN(start)) {
				start = time;
				hasBadTime = true;
			}
			callback(Math.min(duration, time - start) / duration);
			return time - start < duration;
		});
		if (hasBadTime) {
			this.jobs = this.jobs.map(({start, duration, callback}) => {
				return {start: Number.isNaN(start) ? time : start, duration, callback}
			});
		}
	}

	cancelAnimations() {
		this.jobs = [];
	}
}

export const animator = new Animator();