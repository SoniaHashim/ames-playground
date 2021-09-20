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
		// Enable pause handling: on puase event access current tween & store next flipbook_idx
		this.nxt_flipbook_idx = flipbook_idx;
		this.curr_tw = tw;
		tw.onUpdate = function(event) {
		    path.interpolate(pathFrom, pathTo, event.factor)
		};

		// Need to pass the new path that is drawn on the screen
		let nextPath = await tw;
		this.animate_helper(nextPath, flipbook_idx + 1);

	}

	pause() {

	}
}

export class AMES_Animation {
	static count = 1;
	key;
	name;
	keyframes = [];
	paths = [];
	states = [];
	artwork = null;
	transformation = null;
	flipbook_start_idx = 0;
	is_animation_playble = false;

	constructor() {
		// Set key & add to ames animations

		// Update name & add to layers view
		this.name = "Animation " + AMES_Animation.count;
		console.log("Setting animation name...", this.name);
		AMES_Animation.count += 1;

		if (!this.animated_property) this.animated_property = "position";
	}

	_clear_cb_helpers() {}

	get_pos() {
		return ames.canvas_view.bounds.center;
	}

	make_interactive() {

	}

	show_editor() {
		this.editor.show(true);
	}

	get_bbox() {

	}

	set_geometry_field(field, geometry) {
		this[field] = geometry;
		console.log("Animation.set_geometry_field", "params: ", field, geometry, "result: ", this[field]);

		if (this.transformation && this.artwork) this.interpret_transformation_geometry();
	}

	interpret_transformation_geometry() {
		// For now interpret all transformation geometry as motion paths
		this.paths = [];
		this.states = [];
		let transformation_path_length = this.transformation.poly.length;
		console.log("transformation_path_length", this.transformation.poly.length);
		let disp;
		for (let i = 0; i < 100; i++) {
			let tween_path;
			if (i == 0) {
				tween_path = this.artwork.poly;
				disp = this.transformation.poly.getPointAt(0).subtract(this.artwork.poly.position);
			} else {
				tween_path = this.artwork.poly.clone({ insert: false });
			}
			let p = this.transformation.poly.getPointAt((i/100)*transformation_path_length).subtract(disp);

			let next_idx = (i+1) < 100 ? (i+1) : 0;
			let prev_state = this.transformation.poly.getPointAt(i/100*transformation_path_length);
			let next_state = this.transformation.poly.getPointAt((i+1)/100*transformation_path_length);

			let delta = next_state.subtract(prev_state);

			// this.paths[i] = tween_path;
			this.states[i] = {
				fillColor: new Color(Math.random(), Math.random(), Math.random()),
				position: ["+=", delta],
			};
			// this.paths[i].position = p;
			this.keyframes[i] = i;
		}

		this.transformation_path_length = this.transformation.poly.length;
		this.is_animation_playble = true;
		this.n_states = 100;
	}

	remove_geometry_field(field) {
		this[field] = null;

		this.is_animation_playable = false;
		console.log("Animation.remove_geometry_field", "params: ", field, "result: ", this[field]);
	}

	set_transformation_axes() {
		if (!this.transformation) return;
		console.log("Setting axes for transformation geometry", this.transformation);

		// Create one or more axes objects
		this.axes = new AMES_Axes(this);
		console.log(this.axes);
		this.axes.make_axes_for_transformation_curve(this.transformation);
		console.log("After making axes for transformation curve: ", this.axes.origin, this.axes.u_axis, this.axes.v_axis);
		this.axes.show(true);
		console.log("After showing axes: ", this.axes.origin, this.axes.u_axis, this.axes.v_axis);
	}

	change_axes_properties() {
		let property;
		let isValid = false;
		while (!isValid) {
			property = prompt("Enter the property that the transformation represents: position, scaling, rotation: ");
			console.log("entered...", property);
			if (property == "position" || property == "scaling" || property == "rotation") isValid = true;
		}
		console.log("Changing axes property to indicate ", property);
		this.animated_property = property;
	}

	animate(t) {
		// Calculate animation state given system time
		// Fast-forward through tweens (not visible) to reach desired start state
		// Start animating from desired start state

		// If artwork and transformation aren't set return
		if (!this.transformation || !this.artwork) return;

		// this.interpret_transformation_geometry();
		// First call to recursive async function to generate tweens
		console.log("Playing animation with states: ", this.states.length-1);
		console.log("... animating", this.artwork);
		console.log("... using this transformation", this.transformation);
		console.log("... with paths", this.paths);
		console.log("... with states", this.states);
		console.log("... starting at flipbook_idx", this.flipbook_start_idx);
		this.original_state = this.artwork.poly[this.animated_property];
		console.log("original state, ", this.animated_property, this.original_state);
		this.animate_helper(this.paths[0], this.flipbook_start_idx);
	}

	get_state(flipbook_idx) {
		// let original_state = this.transformation.poly.getPointAt(this.transformation_path_length*(flipbook_idx/100));
		//
		// let next_flipbook_idx = (flipbook_idx+1) < this.n_states ? (flipbook_idx + 1) / 100 : 0;
		// let next_state = this.transformation.poly.getPointAt(this.transformation_path_length*(next_flipbook_idx/100));

		let state_update = {};

		let i = flipbook_idx;

		if (i == 100) {
			state_update[this.animated_property] = this.original_state;
			console.log(i, this.animated_property, 'returns to', this.original_state);
			return state_update;
		}
		let next_idx = (i+1) < 100 ? (i+1) : 0;


		let prev_state;
		let next_state;
		let delta;

		if (this.animated_property == "position") {
			prev_state = this.transformation.poly.getPointAt(i/100*this.transformation_path_length);
			next_state = this.transformation.poly.getPointAt(next_idx/100*this.transformation_path_length);
			delta = next_state.subtract(prev_state);
		}

		if (this.animated_property == "scaling") {
			let adj = this.transformation.poly.getPointAt(i/100*this.transformation_path_length).y;
			prev_state = this.transformation.poly.getPointAt(i/100*this.transformation_path_length).y - adj;
			next_state = this.transformation.poly.getPointAt(next_idx/100*this.transformation_path_length).y - adj;
			delta = (next_state - prev_state) / (this.transformation.poly.bounds.height/2);
		}
		if (this.animated_property == "rotation") {
			let adj = this.transformation.poly.getPointAt(i/100*this.transformation_path_length).y;
			prev_state = this.transformation.poly.getPointAt(i/100*this.transformation_path_length).y - adj;
			next_state = this.transformation.poly.getPointAt(next_idx/100*this.transformation_path_length).y - adj;
			delta = (next_state - prev_state);
		}

		console.log(i, next_idx, this.animated_property, '+=', delta);

		// let state_update = {
		// 	position: ["+=", delta],
		// 	fillColor: new Color(Math.random(), Math.random(), Math.random()),
		// }


		state_update[this.animated_property] = ["+=", delta];
		// state_update['fillColor'] = new Color(Math.random(), Math.random(), Math.random());

		return state_update;
	}

	animate_helper = async function(path, flipbook_idx) {
		if (! (flipbook_idx < 100)) return

		// let pathTo = this.paths[flipbook_idx + 1];
		// let pathFrom = path.clone({ insert: false });


		let state = this.states[flipbook_idx + 1];
		let duration = (this.keyframes[flipbook_idx + 1] - this.keyframes[flipbook_idx])/ames.fps * 1000;
		// pathTo.visible = false;
		// state.opacity = 0;

		// let tw = path.tween(state, duration);
		let tw = this.artwork.poly.tween(this.get_state(flipbook_idx+1), duration);
		// console.log(flipbook_idx, state.position[1], this.get_state(flipbook_idx+1).position[1]);
		this.add_pause_handling(tw, flipbook_idx);
		tw.onUpdate = function(event) {
		   //  path.interpolate(pathFrom, pathTo, event.factor)
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

class AMES_Axes {
	origin;
	u_axis;
	v_axis;
	axes;
	animation;
	static aesthetic_overhang = 10;

	constructor(animation) {
		this.animation = animation;
		this.axes = new Group();

		console.log(ames.canvas_view.bounds);
		// Make dot at origin
		 this.origin = utils.make_dot(new Point(100, 100));

		// Make lines extending along transformation bbox edges
		this.u_axis = utils.make_line(new Point(100, 100), new Point(200, 100));
		this.v_axis = utils.make_line(new Point(100, 100), new Point(100, 200));

		this.axes.addChildren([this.origin, this.u_axis, this.v_axis]);
	}

	make_axes_for_transformation_curve(transformation_shape) {
		// Update position of origin to be the start of the animation curve;
		let transformation_curve = transformation_shape.poly;
		let o = transformation_curve.getPointAt(0)
		this.origin.position = o;

		let bbox = transformation_shape.get_bbox();
		let bbox_corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
		let TL = 1; let TR = 2; let BR = 3; let BL = 0;
		this.u_axis.segments[0].point = new Point(bbox_corners[BL].x - AMES_Axes.aesthetic_overhang, o.y);
		this.u_axis.segments[1].point = new Point(bbox_corners[BR].x + AMES_Axes.aesthetic_overhang, o.y);
		this.v_axis.segments[0].point = new Point(o.x, bbox_corners[BL].y +  AMES_Axes.aesthetic_overhang);
		this.v_axis.segments[1].point = new Point(o.x, bbox_corners[TL].y - AMES_Axes.aesthetic_overhang);

		// Make origin draggable along path
		this.origin.onMouseDrag = (e) => {
			// Update origin to nearest point to cursor
			let new_start = transformation_curve.getNearestPoint(e.point);
			this.origin.position = new_start;
			// Update animation start index using same underlying animation
			this.animation.flipbook_start_idx = Math.round(transformation_curve.getOffsetOf(new_start)/transformation_curve.length*100);

			// Update axis to sit at origin
			this.u_axis.position.y = new_start.y;
			this.v_axis.position.x = new_start.x;
		}

		// Make axes scalable
	}

	show(bool) {
		this.axes.visible = bool;
	}
}
