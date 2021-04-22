// ----------------------------------------------------------------------------
// animations.js
// Author: Sonia Hashim
//
// Description: AMES animations representations
// ----------------------------------------------------------------------------

export class AMES_Animation {
	static count = 0;
	key;
	name;
	keyframes = [0, 1, 2, 3];
	frames = 600;
	paths = [];
	states = [];

	constructor() {
		// Set key & add to ames animations
		this.key = AMES_Animation.count.toString();
		ames.animations[this.key] = this;
		AMES_Animation.count += 1;
		// Update name & add to layers view
		this.update_name('animation ' + this.key);

		// Test example
		let path = new Path.Ellipse({
		    fillColor: 'blue',
		    center: view.center,
			size: [500, 100]
		});


		let pathTwo = new Path.Ellipse({
		    position: view.center,
		    size: [300, 700],
		    insert: false,
		});

		let pathThree = new Path.Ellipse({
		    position: view.center,
		    size: [50, 400],
		    insert: false,
		});

		let pathFour = new Path.Ellipse({
		    position: view.center,
		    size: [500, 200],
		    insert: false,
		});

		// Path properties goe in path
		this.paths[0] = path;
		this.paths[1] = pathTwo;
		this.paths[2] = pathThree;
		this.paths[3] = pathFour;

		// Style properties go in state
		this.states[0] = {fillColor: 'blue'},
		this.states[1] = {fillColor: 'pink'};
		this.states[2] = {fillColor: 'green'};
		this.states[3] = {fillColor: 'orange'}
	}

	animate() {
		this.animate_helper(this.paths[0], 0);
	}

	animate_helper = async function(path, flipbook_idx) {
		if (flipbook_idx >= this.states.length-1) return;
		console.log('flipbook_idx', flipbook_idx+1);

		let pathTo = this.paths[flipbook_idx + 1];
		let pathFrom = path.clone({ insert: false });

		let state = this.states[flipbook_idx + 1];
		let duration = 2000;

		let tw = path.tween(state, duration);
		tw.onUpdate = function(event) {
		    path.interpolate(pathFrom, pathTo, event.factor)
		};

		// Need to pass the new path that is drawn on the screen
		let nextPath = await tw;
		this.animate_helper(nextPath, flipbook_idx + 1);

	}

	update_name(new_name) {
		this.name = new_name;
		// Add / update layers_view
	}
}
