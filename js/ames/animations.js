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
	keyframes = [0, 60, 300, 550, 680];
	frames = 600;
	paths = [];
	states = [];

	constructor() {
		// Set key & add to ames animations
		this.key = AMES_Animation.count.toString();
		ames.animations[this.key] = this;
		console.log(ames.animations);
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

		// Loop / extend can be done with deep copies
		let pathFive = path.clone({ insert: false });

		// Path properties goe in path (includes scale / rotation / position)
		this.paths[0] = path;
		this.paths[1] = pathTwo;
		this.paths[2] = pathThree;
		this.paths[3] = pathFour;
		this.paths[4] = pathFive;

		// Style properties go in state
		this.states[0] = {fillColor: 'blue'};
		this.states[1] = {fillColor: 'pink'};
		this.states[2] = {fillColor: 'green'};
		this.states[3] = {fillColor: 'orange'}
		this.states[4] = {fillColor: 'lightblue'};

		// inserting a keyframe requires...
		// keyframe, path, state
	}

	animate(t) {
		// Calculate animation state given system time
		// Fast-forward through tweens (not visible) to reach desired start state
		// Start animating from desired start state
		// First call to recursive async function to generate tweens
		this.animate_helper(this.paths[0], 0);
	}

	animate_helper = async function(path, flipbook_idx) {
		if (flipbook_idx >= this.states.length-1) return;
		console.log('flipbook_idx', flipbook_idx+1);

		let pathTo = this.paths[flipbook_idx + 1];
		let pathFrom = path.clone({ insert: false });

		let state = this.states[flipbook_idx + 1];
		let duration = (this.keyframes[flipbook_idx + 1] - this.keyframes[flipbook_idx])/ames.fps * 1000;
		pathTo.visible = false;
		// state.opacity = 0;

		let tw = path.tween(state, duration);
		this.add_pause_handling(tw, flipbook_idx);
		tw.onUpdate = function(event) {
		    path.interpolate(pathFrom, pathTo, event.factor)
		};

		// Need to pass the new path that is drawn on the screen
		let nextPath = await tw;
		this.animate_helper(nextPath, flipbook_idx + 1);

	}


	add_pause_handling(tw, flipbook_idx) {
		// On pause event capture current tween & store next flipbook_idx
		this.nxt_flipbook_idx = flipbook_idx;
		this.curr_tw = tw;
	}

	update_name(new_name) {
		this.name = new_name;
		// Add / update layers_view display
	}
}
