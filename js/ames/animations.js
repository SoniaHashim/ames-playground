// ----------------------------------------------------------------------------
// animations.js
// Author: Sonia Hashim
//
// Description: AMES animations representations
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'

export class AMES_Animation_Test {
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
		AMES_Animation.count += 1;

		// Test example
		let path = new Path.Ellipse({
		    fillColor: 'blue',
		    center: [300, 40],
			size: [500, 100]
		});


		let pathTwo = new Path.Ellipse({
		    position: [500, 500],
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
		pathFive.position = new Point(100, 100);

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

	animate_helper = async function(path, state_idx) {
		if (state_idx >= this.states.length-1) return;
		console.log('state_idx', state_idx+1);

		let pathTo = this.paths[state_idx + 1];
		let pathFrom = path.clone({ insert: false });

		let state = this.states[state_idx + 1];
		let duration = (this.keyframes[state_idx + 1] - this.keyframes[state_idx])/ames.fps * 1000;
		pathTo.visible = false;
		// state.opacity = 0;

		let tw = path.tween(state, duration);
		// Enable pause handling: on puase event access current tween & store next state index
		this.state_idx = state_idx;
		this.curr_tw = tw;
		tw.onUpdate = function(event) {
		    path.interpolate(pathFrom, pathTo, event.factor)
		};

		// Need to pass the new path that is drawn on the screen
		let nextPath = await tw;
		this.animate_helper(nextPath, state_idx + 1);

	}

	pause() {

	}
}

/* ----------------------------------------------------------------------------
 * AMES_Animation
 * Description: Class that takes in geometry representing a transformation and
 * geometry representing artwork as well as mapping information to animate
 * the artwork accordingly. In addition to mapping information, this class
 * contains playback control. An animation might also be composed of one or
 * more child animations.
 *
 * ----------------------------------------------------------------------------
 */
export class AMES_Animation {
	static count = 1;
	key;
	name;
	artwork = null;
	transformation = null;
	transformation_is_proprtional = true;
	start_state_idx = 0;
	is_animation_playble = false;
	is_paused = false;
	is_looping = false;
	n_states = 100;
	time_scale_factor = 1;
	transformation_scale_factor = 1;


	// Default constructor
	// Defaults: a transformation is interpreted as a translation
	constructor() {
		// Update name & add to layers view
		this.name = "Animation " + AMES_Animation.count;
		console.log("Setting animation name...", this.name);
		AMES_Animation.count += 1;

		if (!this.transformation_property) this.transformation_property = "position";
	}

	// For editors
	_clear_cb_helpers() {}

	// TODO returns position of the animation block
	get_pos() {
		return ames.canvas_view.bounds.center;
	}

	// TODO
	make_interactive() {

	}

	// show_editor
	// ------------------------------------------------------------------------
	// @description: Shows the editor that can be used to control this animation.
	show_editor() {
		this.editor.show(true);
	}

	// TODO
	get_bbox() {

	}

	// set_geometry_field
	// ------------------------------------------------------------------------
	// @description: Sets inputted geometery the artwork or transformation field.
	// @params: field - 'artwork' or 'transformation', geometry - svg object
	//
	set_geometry_field(field, geometry) {
		this[field] = geometry;
		console.log("Animation.set_geometry_field", "params: ", field, geometry, "result: ", this[field]);

		if (this.transformation && this.artwork) this.interpret_transformation_geometry();
	}

	// interpret_transformation_geometry
	// ------------------------------------------------------------------------
	// @description: Precursor to animation after artwork and transformation have
	// been assigned. Determines that this animation is playable and stores a
	// copy of the original artwork to help in resetting the animation.
	//
	interpret_transformation_geometry() {
		// TODO should store only the state corresponding to the transformation property
		if (this.transformation.is_shape) this.transformation_is_closed = this.transformation.poly.closed;
		if (this.transformation.is_list) {
			this.transformation_is_closed = [];
			let n = this.transformation.shapes.length;
			for (let i = 0; i < n; i++) {
				this.transformation_is_closed[i] = this.transformation.shapes[i].poly.closed;
			}
		}

		if (this.artwork.is_shape)
			this.artwork_copy = this.artwork.poly.clone({insert: false, deep: true});
		if (this.artwork_is_list) {
			this.artwork_copy = [];
			let n = this.artwork.shapes.length;
			for (let i = 0; i < n; i++) {
				this.artwork_copy[i] = this.artwork.shapes[i];
			}
		}

		this.is_animation_playble = true;
	}

	// remove_geometry_field
	// ------------------------------------------------------------------------
	// @description: Unsets geometry assigned to the particular field and
	// specififes that this animation is no longer playable as either the
	// target artwork or transformation geometry is now missing.
	// @params: field - 'artwork' or 'transformation
	//
	remove_geometry_field(field) {
		this[field] = null;

		this.is_animation_playable = false;
		console.log("Animation.remove_geometry_field", "params: ", field, "result: ", this[field]);
	}

	// TODO
	set_transformation_axes() {
		if (!this.transformation) return;
		console.log("Setting axes for transformation geometry", this.transformation);

		// Create one or more axes objects
		let transformation_shape = this.transformation;
		if (this.transformation.is_shape) {
			this.create_axes(transformation_shape);
		} else if (this.transformation.is_list) {
			let n = this.transformation.shapes.length;
			for (let i = 0; i < n; i++) {
				transformation_shape = this.transformation.shapes[i];
				this.create_axes(transformation_shape, i);
			}
		}

	}

	// Creates an axis object for a specific transformation_shape
	create_axes(transformation_shape, transformation_idx) {
		this.axes = new AMES_Axes(this);
		console.log(this.axes);
		this.axes.make_axes_for_transformation_curve(transformation_shape, transformation_idx);
		this.axes.show_axes(true);
	}

	// TODO
	change_animation_property() {
		let property;
		let isValid = false;
		while (!isValid) {
			property = prompt("Enter the property that the transformation represents: position, scaling, rotation: ");
			console.log("entered...", property);
			if (property == "position" || property == "scaling" || property == "rotation") isValid = true;
		}
		console.log("Changing axes property to indicate ", property);
		this.transformation_property = property;
		if (property == "position") this.transformation_is_proprtional = true;
		else this.transformation_is_proprtional = false;
	}

	// play
	// ------------------------------------------------------------------------
	// @description: plays the animation from it's stored state or from the
	// beginning by calling a recursive function to animate each state.
	//
	play() {
		console.log("hit play");
		// If artwork and transformation aren't set return
		if (!this.transformation || !this.artwork) return;

		// Resume from pause state or play from beginning
		if (this.is_paused) {
			this.animate_helper(this.curr_tw, this.nxt_state_idx);
			this.is_paused = false;
		} else {
			// Reset animation
			this.is_at_open_path_end = false;
			let path;
			if (this.artwork.is_shape) path = this.artwork.poly;
			if (this.artwork.is_list) {
				path = [];
				let n_artworks = this.artwork.shapes.length;
				for (let i = 0; i < n_artworks; i++) {
					path[i] = this.artwork.shapes[i].poly;
				}
			}
			this.animate_helper(path, this.start_state_idx);
		}
	}

	// pause
	// ------------------------------------------------------------------------
	// @description: pauses the animation according to it's current stored state
	// and indicates that the animation is in a paused state.
	//
	pause() {
		if (!this.curr_tw) return;
		if (this.artwork.is_shape) this.curr_tw.stop();
		if (this.artwork.is_list) {
			let n_artworks = this.artwork.shapes.length;
			for (let i = 0; i < n_artworks; i++) {
				this.curr_tw[i].stop();
			}
		}
		this.is_paused = true;
	}

	// rewind
	// ------------------------------------------------------------------------
	// @description: pauses and rewinds the animation to it's starting state.
	//
	rewind() {
		this.pause();
		this.is_paused = false;
		let tw = this.artwork.poly.tween({},1);
		let path = this.artwork.poly;
		let pathFrom = this.artwork.poly.clone({insert: false ,deep: true});
		let pathTo = this.artwork_copy;
		tw.onUpdate = function(event) {
			path.interpolate(pathFrom, pathTo, event.factor);
		}
	}

	// loop
	// ------------------------------------------------------------------------
	// @description: toggles whether or not the playback of the animation loops.
	//
	loop() {
		this.is_looping = !this.is_looping;
	}

	get_path_offset_for_target(target_offset, transformation_geometry, transformation_idx) {
		// Initialize start_path_offset if necessary
		if (!this.start_path_offset) {
			if (this.transformation.is_shape) {
				this.start_path_offset = 0;
			}
			if (this.transformation.is_list) {
				this.start_path_offset = [];
				let n_transformations = this.transformation.shapes.length;
				for (let i = 0; i < n_transformations; i++) {
					this.start_path_offset[i] = 0;
				}
			}
		}

		// Access start_path_offset
		let start_path_offset = this.start_path_offset;
		if (this.transformation.is_list) {
			start_path_offset = this.start_path_offset[transformation_idx];
		}


		// Use offsets to determine appropriate path offset in the geomtry
		// to determine the next state
		let transformation_path_length = transformation_geometry.length;
		let path_offset = target_offset + start_path_offset;
		if (path_offset > transformation_path_length)
		{
			if (transformation_geometry.closed) {
				path_offset -= transformation_path_length;
			} else {
				path_offset = transformation_path_length;
				// Indicate that the animation has reached the end of the path
				if (this.transformation.is_shape) {
					this.is_at_open_path_end = true;
				}
				if (this.transformation.is_list) {
					this.is_at_open_path_end[transformation_idx] = true;
				}
			}
		}

		return path_offset;
	}

	get_delta_from_state(i, next_idx, transformation_idx) {
		let transformation_geometry = this.transformation.poly;
		if (this.transformation.is_list)
			transformation_geometry = this.transformation.shapes[transformation_idx].poly;

		let transformation_path_length = transformation_geometry.length;
		let prev_state_offset = this.get_path_offset_for_target(i/this.n_states*transformation_path_length, transformation_geometry, transformation_idx);
		let next_state_offset = this.get_path_offset_for_target(next_idx/this.n_states*transformation_path_length, transformation_geometry, transformation_idx);

		let prev_state = transformation_geometry.getPointAt(prev_state_offset);
		let next_state = transformation_geometry.getPointAt(next_state_offset);
		let delta;

		// For a translation,  use the difference in the transformation geometry
		// locations to calculate a position update
		if (this.transformation_property == "position") {
			delta = next_state.subtract(prev_state);
		}

		// For a scaling animation, use the difference in the transformation geometry
		// locations in y to calculate the change in scale factor
		if (this.transformation_property == "scaling") {
			delta = (next_state.y - prev_state.y) / (transformation_geometry.bounds.height/2);
		}

		// For a rotation animation, use the difference in the transformation geometry
		// locations in y to calculate the change in rotation angle
		if (this.transformation_property == "rotation") {
			delta = (next_state.y - prev_state.y);
		}

		return delta;
	}

	// get_update_for_state(state_idx)
	// ------------------------------------------------------------------------
	// @description: interprets the transformation goeometry to get the update
	// that will determine the tween given the state of the animation.
	// @params: state_idx
	//
	get_updates_from_state(state_idx) {
		// console.log("in get updates from state");
		// Indices to map to locations on the transformation path
		let i = state_idx;
		let next_idx = state_idx + 1;

		// Get states and calculate distance between states to set update value
		let delta = [];
		if (this.transformation.is_shape) {
			// console.log("transformation is shape");
			let d = this.get_delta_from_state(i, next_idx);
			let n_artworks;
			if (this.artwork.is_shape) n_artworks = 1;
			if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;
			for (let artwork_idx = 0; artwork_idx < n_artworks; artwork_idx++) {
				delta[artwork_idx] = d;
			}
		} else if (this.transformation.is_list) {
			// Create interpolation using delta values
			let n = this.transformation.shapes.length;
			let d = []; let x = []; let y = [];

			for (let transformation_idx = 0; transformation_idx < n; transformation_idx++) {
				d[transformation_idx] = this.get_delta_from_state(i, next_idx, transformation_idx);
				if (this.transformation_property == "position") {
					x[transformation_idx] = d[transformation_idx].x;
					y[transformation_idx] = d[transformation_idx].y;
				}
			}
			// console.log("collected path data", d, x, y);
			d = d.map((y, idx) => [idx, y]);
			x = x.map((i, idx) => [idx, i]);
			y = y.map((j, idx) => [idx, j]);

			let n_artworks;
			if (this.artwork.is_shape) n_artworks = 1;
			if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;
			for (let artwork_idx = 0; artwork_idx < n_artworks; artwork_idx++) {
				if (this.transformation_property == "position") {
					let d_x = utils.interpolate(x, artwork_idx);
					let d_y = utils.interpolate(y, artwork_idx);
					delta[artwork_idx] = {"x": d_x, "y": d_y};
				} else {
					delta[artwork_idx] = utils.interpolate(d, artwork_idx);
				}
			}
		}

		// console.log("our delta is:", delta);

		let result = [];

		// Special case: set starting point using relative displacement of transformation curves
		let x = []; let y = [];
		if (state_idx == 0) {
			if (this.transformation_property == "position") {
				let origin = this.transformation.shapes[0].poly.position;

				let n_transformations = this.transformation.shapes.length;
				for (let idx = 0; idx < n_transformations; idx++) {
					console.log(idx, this.transformation.shapes[idx].poly.position);
					let p = this.transformation.shapes[idx].poly.position.subtract(origin);
					x[idx] = p.x;
					y[idx] = p.y;
				}
				console.log("position displacement", x, y);
				x = x.map((i, idx) => [idx, i]);
				y = y.map((j, idx) => [idx, j]);
			}
		}

		let n_artworks;
		if (this.artwork.is_shape) n_artworks = 1;
		if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;
		for (let artwork_idx = 0; artwork_idx < n_artworks; artwork_idx++) {
			// Create empty state update
			let state_update = {};
			let d = delta[artwork_idx];

			if (state_idx == 0) {
				let d_x = utils.interpolate(x, artwork_idx/n_artworks);
				let d_y = utils.interpolate(y, artwork_idx/n_artworks);
				d.x += d_x;
				d.y += d_y;
			}


			switch (this.transformation_property) {
				case "position":
					d = {"x": d.x*this.transformation_scale_factor, "y": d.y*this.transformation_scale_factor};
					break;
				default:
				 	d *= this.transformation_scale_factor;
			}
			// Update the transformation property by the appropriate amount
			state_update[this.transformation_property] = ["+=", d];
			let duration = 1*this.time_scale_factor;
			result[artwork_idx] = [state_update, duration];
		}


		return result;
	}

	is_complete(state_idx) {
		if (state_idx >= this.n_states) return true;
		// if (this.is_at_open_path_end == true) return true;
		return false;
	}

	// animate_helper
	// ------------------------------------------------------------------------
	// @description: a recursive function that tweens from one state to the next
	// until the animation is complete.
	// @params: path - the path to be animate, state_idx - the state of
	// the animation out of the total number of states
	//
	animate_helper = async function(path, state_idx) {
		// console.log("in animate helper");
		// After completing the animation, end or loop the animation
		if (this.is_complete(state_idx)) {
			if (this.is_looping) {
				// if (this.transformation_is_closed == false) this.rewind();
				this.animate_helper(path, this.start_state_idx);
			}
			return;
		}

		let nextPath;
		let STATE_IDX = 0; let DURATION_IDX = 1;

		let updates = this.get_updates_from_state(state_idx);
		// console.log("retrieved updates for state", state_idx);

		let n_artworks;
		if (this.artwork.is_shape) n_artworks = 1;
		if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;
		console.log(state_idx);

		for (let artwork_idx = 0; artwork_idx < n_artworks; artwork_idx++) {
			let update = updates[artwork_idx];

			let state = update[STATE_IDX];
			let duration = update[DURATION_IDX];

			let artwork;
			if (this.artwork.is_shape) artwork = this.artwork.poly;
			if (this.artwork.is_list) artwork = this.artwork.shapes[artwork_idx].poly;

			let tw = artwork.tween(state, duration);

			// Capture state to support pausing and restarting playback
			if (this.artwork.is_shape) {
				this.nxt_state_idx = state_idx;
				this.curr_tw = tw;
			}
			if (this.artwork.is_list) {
				if (!this.nxt_state_idx) this.nxt_state_idx = [];
				if (!this.curr_tw) this.curr_tw = [];
				this.nxt_state_idx[artwork_idx] = state_idx;
				this.curr_tw[artwork_idx] = tw;
			}

			// TODO Will need to revisit to support path deformations
			tw.onUpdate = function(event) {
			   //  path.interpolate(pathFrom, pathTo, event.factor)
			};

			// Pass the new path that is drawn on the screen after the current tween
			// has completed and recurse
			if (this.artwork.is_shape) nextPath = await tw;
			else {
				if (!nextPath) nextPath = [];
				nextPath[artwork_idx] = await tw;
			}
		}

		this.animate_helper(nextPath, state_idx + 1);
	}

	set_start_path_offset_at_point(point, transformation_idx) {
		if (transformation.is_shape)
			this.start_path_offset = this.transformation.poly.getOffsetOf(point);
		if (this.transformation.is_list)
			this.start_path_offset[transformation_idx] = this.transformation.shapes[transformation_idx].poly.getOffsetOf(point);
	}

	// set_animation_start_point(point) {
	// 	let transformation_geometry = this.transformation.poly;
	//
	// 	let target = transformation_geometry.getOffsetOf(point);
	// 	let offset = target - this.start_path_offset;
	// 	if (offset < 0) offset += transformation_geometry.length;
	// 	let new_start_state_idx = Math.round((offset/transformation_geometry.length)*99);
	//
	//
	// 	// Tween ahead to the new start state (otherwise you'll create a new animation)
	// 	let tw = this.artwork.poly.tween({
	// 		this.transformation_property: get_update_from_state_a_to_b(this.start_state_idx, new_start_state_idx)
	// 	},1);
	// 	let path = this.artwork.poly;
	// 	tw.onUpdate = function(event) {
	// 		//path.interpolate(pathFrom, pathTo, event.factor);
	// 	}
	//
	// 	this.start_state_idx = new_start_state_idx;
	// }

	set_transformation_scale_factor(factor) {
		this.transformation_scale_factor = 1/factor;
		console.log("transformation_scale_factor", this.transformation_scale_factor);
	}

	set_time_scale_factor(factor) {
		this.time_scale_factor = 1/factor;
		console.log("time_scale_factor", this.time_scale_factor);
	}

	update_name(new_name) {
		this.name = new_name;
	}
}

class AMES_Axes {
	origin;
	u_axis;
	v_axis;
	axes;
	animation;
	aesthetic_overhang = 10;
	transformation_idx;

	constructor(animation) {
		this.animation = animation;
		this.axes = new Group();

		console.log(ames.canvas_view.bounds);

		// Make dot at origin
		this.origin = utils.make_dot(new Point(100, 100));

		// Make lines extending along transformation bbox edges
		this.u_axis = utils.make_line(new Point(100, 100), new Point(200, 100));
		this.v_axis = utils.make_line(new Point(100, 100), new Point(100, 200));

		// Make arrows to scale u and v axis
		this.u_axis_arrow_right = this.make_arrow(270);
		this.u_axis_arrow_left = this.make_arrow(90);
		this.v_axis_arrow_top = this.make_arrow(180);
		this.v_axis_arrow_bottom = this.make_arrow(0);

		this.axes.addChildren([this.origin, this.u_axis, this.v_axis]);
	}

	make_arrow(angle) {
		let arrow = ames.icons["arrow"].clone();
		arrow.position = ames.canvas_view.center;
		arrow.visible = true;
		arrow.strokeColor = utils.SHAPE_PATH_COLOR;
		arrow.rotate(angle);
		console.log("Making arrow", arrow);
		return arrow;
	}

	show_axes(bool) {
		this.u_axis.visible = bool;
		this.v_axis.visible = bool
		let arrows = [this.u_axis_arrow_left, this.u_axis_arrow_right, this.v_axis_arrow_top, this.v_axis_arrow_bottom];
		for (let a in this.arrows) { a.visible = bool; }

	}

	make_axes_for_transformation_curve(transformation_shape, transformation_idx) {
		// Update position of origin to be the start of the animation curve;
		let transformation_curve = transformation_shape.poly;
		let o = transformation_curve.getPointAt(0)
		this.origin.position = o;

		if (transformation_idx) this.transformation_idx = transformation_idx;


		let bbox = transformation_shape.get_bbox();
		let bbox_corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];

		let TL = 1; let TR = 2; let BR = 3; let BL = 0;
		this.u_axis.segments[0].point = new Point(bbox_corners[BL].x - this.aesthetic_overhang, o.y);
		this.u_axis.segments[1].point = new Point(bbox_corners[BR].x + this.aesthetic_overhang, o.y);
		this.v_axis.segments[0].point = new Point(o.x, bbox_corners[BL].y +  this.aesthetic_overhang);
		this.v_axis.segments[1].point = new Point(o.x, bbox_corners[TL].y - this.aesthetic_overhang);
		this.original_u_axis_length = this.u_axis.length;
		this.original_v_axis_length = this.v_axis.length;
		this.u_axis.position = o;
		this.v_axis.position = o;
		this.update_arrow_positions();
		this.show_axes(true);

		// Make origin draggable along path
		this.origin.onMouseDrag = (e) => {
			// Update origin to nearest point to cursor
			let new_origin = this.animation.transformation.poly.getNearestPoint(e.point);
			this.origin.position = new_origin;

			// Update animation start index using same underlying animation
			this.animation.set_start_path_offset_at_point(new_origin, transformation_idx);

			// Update axis to sit at origin
			this.u_axis.position = new_origin;
			this.v_axis.position = new_origin;
			// Update arrows to follow axes
			this.update_arrow_positions();
		}

		// Make axes scalable
		// LEFT
		this.u_axis_arrow_left.onMouseDrag = (e) => {
			let companion_arrow = this.u_axis_arrow_right;
			if (e.point.x < this.origin.position.x && companion_arrow.position.x > this.origin.position.x) {
				let delta = e.point.x - this.u_axis_arrow_left.position.x;
				this.update_axis(this.u_axis, delta);
			}
		}
		// RIGHT
		this.u_axis_arrow_right.onMouseDrag = (e) => {
			let companion_arrow = this.u_axis_arrow_left;
			if (e.point.x > this.origin.position.x && companion_arrow.position.x < this.origin.position.x) {
				let delta = this.u_axis_arrow_right.position.x - e.point.x;
				this.update_axis(this.u_axis, delta);
			}
		}
		// TOP
		this.v_axis_arrow_top.onMouseDrag = (e) => {
			let companion_arrow = this.v_axis_arrow_bottom;
			if (e.point.y < this.origin.position.y && companion_arrow.position.y > this.origin.position.y) {
				let delta = this.v_axis_arrow_top.position.y - e.point.y;
				this.update_axis(this.v_axis, delta);
			}
		}
		// BOTTOM
		this.v_axis_arrow_bottom.onMouseDrag = (e) => {
			let companion_arrow = this.v_axis_arrow_top;
			if (e.point.y > this.origin.position.y && companion_arrow.position.y < this.origin.position.y) {
				let delta = e.point.y - this.v_axis_arrow_bottom.position.y;
				this.update_axis(this.v_axis, delta);
			}
		}
	}

	update_arrow_positions() {
		this.u_axis_arrow_left.position = this.u_axis.segments[0].point;
		this.u_axis_arrow_right.position = this.u_axis.segments[1].point;
		this.v_axis_arrow_top.position = this.v_axis.segments[1].point;
		this.v_axis_arrow_bottom.position = this.v_axis.segments[0].point;
	}

	update_axis(axis, delta) {
		let is_v_axis = (axis == this.v_axis) ? true : false;
		let coordinate = is_v_axis? "y" : "x";

		axis.segments[0].point[coordinate] += delta;
		axis.segments[1].point[coordinate] -= delta;

		// If the axis is an xy mapping (motion path) update the other axis as well
		if (this.animation.transformation_is_proprtional) {
			let opp_axis = is_v_axis? this.u_axis : this.v_axis;
			let opp_coordinate = coordinate == "x" ? "y" : "x";
			opp_axis.segments[1].point[opp_coordinate] += delta;
			opp_axis.segments[0].point[opp_coordinate] -= delta;

			let original_axis_length = is_v_axis ? this.original_v_axis_length : this.original_u_axis_length;
			let factor = axis.length / original_axis_length;

			let v_factor = this.original_v_axis_length / this.v_axis.length;
			let u_factor = this.original_u_axis_length / this.u_axis.length;

			this.animation.set_transformation_scale_factor(v_factor);
			this.animation.set_time_scale_factor(u_factor);

		} else {
			// Otherwise scale the transformation according to the single set of axis
			// used to define this transformation
			let original_axis_length = is_v_axis ? this.original_v_axis_length : this.original_u_axis_length;
			let factor = axis.length / original_axis_length;
			is_v_axis? this.animation.set_transformation_scale_factor(factor) : this.animation.set_time_scale_factor(factor);
		}


		this.update_arrow_positions();
	}
}
