// ----------------------------------------------------------------------------
// transformation.js
// Author: Sonia Hashim
//
// Description: Implementation of the Transformation Function primitive in AMES
//	- A mapping function that defines how input artwork drives the spatial,
//    stylistic or geometric transformation of a specific property of
//    target artwork across time or space. Inputs and targets can be single
//	  artworks or collections.
//
//  - i.e. The transformation can specify...
// 		(1) The way iterative duplication is controlled for a specific property
//		(2) The transformation of a property across time (position, scale, etc)
//
// - Significant evaluation points can be selected on a transformation
//   such that when the transformation fulfills that state a constraint is
//   satisfied that can be used to trigger another transformation
//
// - The input artwork can consist of a collection where each artwork in the
//   collection is interpreted according the function defining the transformation
//
// - Likewise, the target artwork itself can be a collection
//
// - Supported transformations / property mappings include...
//   	motion paths
//		rotation
//		scale
//		position
//		color: hue
//		color: saturation
//		color: brightness
//		color: alpha
//		instantiation / duplication count
//		number of sides
//		transformation speed
//
//	- The Transformation Space is a representation of the mapping that determines
//	  how input artwork to a Transformation Function is interpreted
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'

export class AMES_Transformation {
	target; 				// artwork or collection of artwork impacted
	input;					// artwork or collection driving the transformation
	mapping;				// transformation function (e.g. translation or scale vs index)
	transformation_space;   // coord space used to interpret the input artwork
	page;					// TBD the location of the artwork

	// supported transformations
	mappings = ["motion path"];
	MOTION_PATH = 0;

	// TF space
	tf_space_absolute = true;
	tf_space_path_nsegments; 	// The number of frames used to interpret the path
	tf_space_path_length_relative_scale	// Scale factor using average length
	tf_space_speed; 		// How speed is represented (constant, linear, xaxis, yaxis, map)
	SPEED_CONSTANT = 0;
	SPEED_LINEAR = 1;
	SPEED_XAXIS = 2;
	SPEED_YAXIS = 3;
	SPEED_MAP = 4;

	// opt
	loop = true;
	LOOP_INFINITY = -1;
	loop_max_count = 10;
	playback_triggers;		// pointers to the cues that trigger this transformation
	transformed_space;		// projection of transformation space onto the target artwork
	playback_cues;			// points that are cues that trigger other transformations
	start_state_idx = 0;

	constructor(opt) {
		this.name = "Transformation " + AMES_Transformation.count;
		opt = opt || {};
		if (opt.input) this.set_input(opt.input);
		if (opt.target) this.set_target(opt.target);
		this.set_mapping(opt.mapping);

	}

	// set_input_artwork
	// ------------------------------------------------------------------------
	// Modifies the input artwork, setting or unsetting it accordingly
	//
	// @param: input - artwork or collection that represents transformation
	// or null
	set_input(input) {
		this.input = input;

		if (input.is_collection) this.update_count(input);
		else this.n_input = 1;

		this.tf_space_speed = this.SPEED_CONSTANT;
		// # of segments in the path,
		// i.e. if speed is 1, # of frames at frame rate to traverse transform
		this.tf_space_path_nsegments = 50;
		let path_length;
		if (input.is_artwork) path_length = this.input.poly.length;
		if (input.is_collection) {
			let total_length = 0;
			for (let idx = 0; idx < this.n_input; idx++) {
				total_length += this.input.shapes[idx].poly.length;
			}
			path_length = total_length/this.n_input;
		}
		this.tf_space_path_length_relative_scale = this.tf_space_path_nsegments / path_length;

		if (this.target && this.input) this.transform();
	}

	// set_target_artwork
	// ------------------------------------------------------------------------
	// Modifies the target artwork that the transformation affects
	//
	// @param: target - target artwork or collection to be impacted
	// or null
	set_target(target) {
		this.target = target;

		if (target.is_collection) this.update_count(target);
		else this.n_target = 1;

		if (this.target && this.input) this.transform();
	}

	// update_count
	// ------------------------------------------------------------------------
	// Updates the count of items to in the input or target to match the count
	// of the given collection if that collection is the input or target
	//
	// @param: the collection with the updated count
	update_count(collection) {
		if (this.input == collection) this.n_input = collection.count;
		if (this.target == collection) this.n_target = collection.count;
	}

	// set_property_mapping
	// ------------------------------------------------------------------------
	//
    // @param: mapping - defines the mapping function used to interpret the
	// transformation
	//
	set_mapping(mapping) {
		if (!mapping) this.mapping = this.MOTION_PATH;

		for (let x in this.mappings) {
			if (this.mappings[x] == mapping) this.mapping = x;
		}

		if (this.mapping == this.MOTION_PATH) this.is_playable = true;
	}

	// transform
	// ------------------------------------------------------------------------
	// Plays the transformation function if it represents an animation;
	// otherwise it applies the transformation function to the objects
	// properties
	//
	transform() {
		console.log("transform");
		if (this.is_playable) this.play();
	}

	// play
	// ------------------------------------------------------------------------
	// @description: If the transformation function represents an animation,
	// this plays the animation
	//
	// Note: the playback point also triggers this function
	play() {
		console.log("play");
		let state_idx = 0;
		this.loop_count = [];

		for (let idx = 0; idx < this.n_target; idx++) {
			let a;
			if (this.target.is_artwork) a = this.target.poly;
			if (this.target.is_collection) a = this.target.shapes[idx].poly;
			// TBD can also use vertices!

			this.loop_count[idx] = 1;
			// Jump target to match transformation input start values
			if (this.tf_space_absolute) {
				let sv = this.get_absolute_start_value(idx);
				console.log(sv);
				this.jump_start_value_to(a, sv);
			}

			this.play_helper(state_idx, a, idx);
		}
	}

	play_helper = async function(state_idx, a, a_idx) {
		// Base case with support for looping
		if (state_idx == this.tf_space_path_nsegments) {
			if (this.loop && (this.loop_max_count == this.LOOP_INFINITY || this.loop_count[a_idx] < this.loop_max_count)) {
				state_idx = 0;
				if (this.loop_max_count != this.LOOP_INFINITY) {
					this.loop_count[a_idx] += 1;
				}
			} else {
				return;
			}
		}

		let DELTA = 0; let DURATION = 1;
		let update = this.get_transform_artwork_at_state(state_idx, a_idx);

		let d = update[DELTA];
		let t = update[DURATION];

		if (ames.use_fps) {
			this.tween(a, d);
		} else { // SMOOTHING
			let nframes = Math.ceil(t / (1000/60));
			this.tween(a, d, nframes);

			let t_frame = 1000/60;
			for (let n = 1;  n < nframes; n++) {
				setTimeout(() => {
					this.tween(a, d, nframes);
				}, n*t_frame);
			}
		}

		setTimeout(() => {
			this.play_helper(state_idx + 1, a, a_idx);
		}, t);
	}

	tween(a, d, f) {
		if (!f) f = 1;
		if (this.mapping == this.MOTION_PATH)
			a.position = new Point(a.position.x + d.x/f, a.position.y + d.y/f);
	}

	jump_start_value_to(a, sv) {
		if (this.mapping == this.MOTION_PATH)
			a.position = new Point(sv.x, sv.y);
	}

	// Assump a_target is always a shape
	get_transform_artwork_at_state(state_idx, a_idx) {
		let i = state_idx;
		let nxt_i = state_idx + 1;

		let d; let dx; let dy;
		let delta;

		if (this.input.is_shape) {
			d = this.get_delta_from_state(i, nxt_i);
			delta = d;
		}

		if (this.input.is_collection) {
			d = []; let x = []; let y = [];
			for (let in_idx = 0; in_idx < this.n_input; in_idx++) {
				d[in_idx] = this.get_delta_from_state(i, nxt_i, in_idx);
			}

			x = d.map((m) => m.x);
			y = d.map((m) => m.y);
			d = d.map((m) => Math.sqrt(m.x*m.x + m.y*m.y));

			dx = utils.interpolate_fast(x, a_idx);
			dy = utils.interpolate_fast(y, a_idx);
			d = utils.interpolate_fast(d, a_idx);


			if (this.mapping == this.MOTION_PATH) {
				delta = {"x": dx, "y": dy};
			} else {
				delta = d;
			}
		}

		// TBD How is time represented? Assumes 1 fps / segment
		let speed_factor = 1;
		let duration = (1000/ames.fps) * speed_factor;
		if (this.tf_space_speed == this.SPEED_CONSTANT) duration = duration;
		if (this.tf_space_speed == this.SPEED_LINEAR) duration *= Math.abs(d)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_XAXIS) duration *= Math.abs(dx)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_YAXIS) duration *= Math.abs(dy)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_MAP) {} // TBD
		if (duration == 0) duration = .001;

		return [delta, duration];
	}

	get_delta_from_state(i, nxt_i, in_idx) {
		let transformation_artwork;

		if (this.input.is_artwork) transformation_artwork = this.input.poly;
		if (this.input.is_collection) transformation_artwork = this.input.shapes[in_idx].poly;

		let l = transformation_artwork.length;
		let prev_s = transformation_artwork.getPointAt(i*l/this.tf_space_path_nsegments);
		let nxt_s = transformation_artwork.getPointAt(nxt_i*l/this.tf_space_path_nsegments);

		return nxt_s.subtract(prev_s);
	}

	get_absolute_start_value(a_idx) {
		let p; let x; let y;
		let start;

		if (this.input.is_shape) {
			p = this.input.poly.getPointAt(0);
			x = p.x; y = p.y; p = Math.Sqrt(x*x + y*y)
		}

		if (this.input.is_collection) {
			p = [];
			for (let in_idx = 0; in_idx < this.n_input; in_idx++) {
				let transformation_artwork = this.input.shapes[in_idx].poly;
				p[in_idx] = transformation_artwork.getPointAt(0);
			}
			x = p.map((p) => p.x);
			y = p.map((p) => p.y);
			p = p.map((p) => Math.sqrt(p.x*p.x + p.y*p.y))

			x = utils.interpolate_fast(x, a_idx);
			y = utils.interpolate_fast(y, a_idx);
			p = utils.interpolate_fast(p, a_idx);
		}

		if (this.mapping == this.MOTION_PATH) {
			start = {"x": x, "y": y}
		} else {
			start = p;
		}

		return start;
	}
}

export class Transformation_Space {

}
