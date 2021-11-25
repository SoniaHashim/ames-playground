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
	mapping = 0;
	mappings = ["motion path"];
	typed_mappings = [
		{ "mapping_type": "Polygon",
		  "mapping": "number of sides" },
	];
	MOTION_PATH = 0;
	NUMBER_OF_SIDES = -1;

	// TF space
	tf_space_absolute = true;
	tf_mx; tf_mx_range = {"min": 0, "max": 1}; tf_sx = 1;
	tf_my; tf_my_range = {"min": 0, "max": 1}; tf_sy = 1;
	tf_mp;
	tf_space_path_nsegments; 	// The number of frames used to interpret the path
	tf_space_path_length_relative_scale	// Scale factor using average length
	tf_space_speed_factor = 1;	// # of segments to traverse per frame
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
		this.tf_space_setup_visuals();
		if (opt.input) this.set_input(opt.input);
		if (opt.target) this.set_target(opt.target);
		if (opt.mapping) this.set_mapping(opt.mapping);


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

		// if (this.target && this.input) this.transform();
	}

	// set_target_artwork
	// ------------------------------------------------------------------------
	// Modifies the target artwork that the transformation affects
	//
	// @param: target - target artwork or collection to be impacted
	// or null
	set_target(target) {
		let change_target = true;
		if (target) {
			// If the mapping is typed, check the target is of the correct type
			if (this.mapping < 0) {
				let mapping = this.typed_mappings[-1*this.mapping].mapping_type;
				valid_type = this.check_valid_target_for_typed_mapping(target, mapping_type);
				if (!valid_type) change_target = false;
			}
		} else {
			change_target = true;
		}


		if (change_target) {
			this.target = target;

			if (target.is_collection) this.update_count(target);
			else this.n_target = 1;

			if (this.mapping) this.set_tf_space_to_defaults();
		}

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
		console.log("set_mapping", mapping);
		let changed_mapping = false;
		if (!mapping) {
			this.mapping = this.MOTION_PATH;
			changed_mapping = true;
		}

		// Check for mappings applicable to all types (vertices, artwork, objects)
		for (let x in this.mappings) {
			if (this.mappings[x] == mapping) {
				this.mapping = x;
				changed_mapping = true;
			}
		}

		// Check for mappings applicable to specific types (polygon, etc)
		if (mapping && mapping.type) {
			for (let x in this.typed_mappings) {
				if (this.typed_mappings[x].mapping == mapping.mapping) {
					// If all the objects match, set the mapping accordingly
					let mapping_type = this.typed_mappings[x].mapping_type;
					if (this.check_valid_target_for_typed_mapping(this.target, mapping_type)) {
						this.mapping = -(x+1);
						changed_mapping = true;
					}
				}
			}
		}
		// If the mapping changed update the transfromation space or throw err
 		if (!changed_mapping) console.log("Transformation: Invalid mapping");
		else this.set_tf_space_to_defaults();

		// Indicate if transformation property is a playbale mapping
		if (this.mapping == this.MOTION_PATH) this.is_playable = true;
		if (this.mapping == this.NUMBER_OF_SIDES) this.is_playable = false;
	}

	// check_valid_target_for_mapping
	// ------------------------------------------------------------------------
	// Returns bool indicating if target matches type necessary for a typed
	// mapping such as number of sides (target must contain only polygons)
	check_valid_target_for_typed_mapping(target, mapping_type) {
		let valid_type = false;
		// Check all of the items in the target match the mapping
		if (target.is_artwork) {
			if (target.artwork_type == mapping_type) {
				valid_type = true;
			}
		} else if (target.is_collection) {
			valid_type = true;
			for (let a_idx in target.shapes) {
				if (target.shapes[a_idx].artwork_type != mapping_type) {
					valid_type = false;
				}
			}
		}
		return valid_type;
	}

	set_tf_space_to_defaults() {
		// Default size of transformation space is the bounding box of the input
		let bbox = null;
		if (this.input) {
			if (this.input.is_artwork || this.input.is_collection) {
				bbox = this.input.get_bbox();
			}
		} else {
			bbox = new Rectangle(ames.canvas_view.center, new Size(200, 100));
		}
		let BL = bbox.bottomLeft; let TL = bbox.topLeft; let TR = bbox.topRight; let BR = bbox.bottomRight;


		// If an axis is n (the idx across a collection), set initial axis scale to 1 and length to n
		let n_target = (this.target && this.target.is_collection) ? this.target.shapes.length : 10;

		if (this.mapping == this.MOTION_PATH) {
			this.set_tf_space({
				"mx": "x", "mx1": TL.x, "mx2": TR.x,
				"my": "y", "my1": TL.y, "my2": BL.y,
				"mp": "time", "show": true, "yflip": false,
				"sx1": TL.x, "sx2": TR.x, "sy1": TL.y, "sy2": BL.y
			}); return;
		}

		if (this.mapping == this.NUMBER_OF_SIDES) {
			let my2 = this.linear_map(0, TR.x - TL.x, 0, n_target-1, BL.y - TL.y);
			this.set_tf_space({
				"mx": "index", "mx1": 0, "mx2": n_target-1,
				"my": "sides", "my1": 3, "my2": 3 + my2,
				"mp": null, "show": true, "yflip": true,
				"sx1": TL.x, "sx2": TR.x, "sy1": TL.y, "sy2": BL.y
			}); return;
		}
	}

	set_tf_space(opt) {
		console.log("set_tf_space", opt);
		opt = opt || {};
		if (opt.hasOwnProperty("mx")) this.tf_mx = opt.mx;
		if (opt.hasOwnProperty("my")) this.tf_my = opt.my;
		if (opt.hasOwnProperty("mp")) this.tf_mp = opt.mp;
		if (opt.hasOwnProperty("mx1")) this.tf_mx1 = opt.mx1;
		if (opt.hasOwnProperty("mx2")) this.tf_mx2 = opt.mx2;
		if (opt.hasOwnProperty("my1")) this.tf_my1 = opt.my1;
		if (opt.hasOwnProperty("my2")) this.tf_my2 = opt.my2;
		if (opt.hasOwnProperty("sx1")) this.tf_sx1 = opt.sx1;
		if (opt.hasOwnProperty("sx2")) this.tf_sx2 = opt.sx2;
		if (opt.hasOwnProperty("sy1")) this.tf_sy1 = opt.sy1;
		if (opt.hasOwnProperty("sy2")) this.tf_sy2 = opt.sy2;
		if (opt.hasOwnProperty("yflip")) this.tf_s_yflip = opt.yflip;

		if (opt.show) this.show_tf_space(opt.show);
	}

	tf_space_setup_visuals() {
		let tf_s = {};
		let w = 200; let h = 100;
		let ox = ames.canvas_view.center.x;
		let oy = ames.canvas_view.center.y;

		tf_s["box"] = new Path.Rectangle(new Point(ox-w/2, oy-h/2),new Point(ox+w/2, oy+h/2));
		tf_s.box.strokeColor = 'lightgray';
		tf_s.box.strokeWidth = 0.5;
		tf_s.box.dashArray = [6,2];

		tf_s["x_axis"] = utils.make_line(new Point(ox-w/2, oy), new Point(ox+w/2, oy));
		tf_s["y_axis"] = utils.make_line(new Point(ox, oy-h/2), new Point(ox, oy+h/2));
		tf_s.x_axis.strokeColor = 'lightgray';
		tf_s.y_axis.strokeColor = 'lightgray';
		tf_s.x_axis.strokeWidth = 0.5;
		tf_s.y_axis.strokeWidth = 0.5;
		tf_s.x_axis.dashArray = [6, 2];
		tf_s.y_axis.dashArray = [6, 2];

		tf_s["mx1_label"] = new PointText(tf_s.x_axis.segments[0].point);
		tf_s["mx2_label"] = new PointText(tf_s.x_axis.segments[1].point);
		tf_s["my1_label"] = new PointText(tf_s.y_axis.segments[0].point);
		tf_s["my2_label"] = new PointText(tf_s.y_axis.segments[1].point);
		tf_s["mp_label"] = new PointText(new Point(ox, oy));
		tf_s["mx_label"] = new PointText(tf_s.x_axis.segments[1].point.subtract(25, -10));
		tf_s["my_label"] = new PointText(tf_s.y_axis.segments[0].point.add(0, 10));

		utils.style_label(tf_s.mx1_label);
		utils.style_label(tf_s.mx2_label);
		utils.style_label(tf_s.my1_label);
		utils.style_label(tf_s.my2_label);
		utils.style_label(tf_s.mx_label);
		utils.style_label(tf_s.my_label);
		utils.style_label(tf_s.mp_label);

		tf_s.mx1_label.content = "mx1_label";
		tf_s.mx2_label.content = "mx2_label";
		tf_s.my1_label.content = "my1_label";
		tf_s.my2_label.content = "my2_label";
		tf_s.mp_label.content = "path_label";
		tf_s.mx_label.content = "mx_label";
		tf_s.my_label.content = "my_label";

		for (let x in tf_s) {
			tf_s[x].visible = false;
		}
		this.tf_s = tf_s;
	}

	show_tf_space(bool) {
		if (!bool) bool = true;
		if (bool) {
			// Update screen space rectangle
			let TL = 1; let BL = 0; let TR = 2; let BR = 3;
			this.tf_s.box.segments[TL].point = new Point(this.tf_sx1, this.tf_sy1);
			this.tf_s.box.segments[BL].point = new Point(this.tf_sx1, this.tf_sy2);
			this.tf_s.box.segments[TR].point = new Point(this.tf_sx2, this.tf_sy1);
			this.tf_s.box.segments[BR].point = new Point(this.tf_sx2, this.tf_sy2);
			// Find origin using reverse mapping or use bottom left corner
			let o = this.tf_space_reverse_map_x_y(0, 0);
			if (!this.tf_s.box.bounds.contains(o)) o = this.tf_s.box.segments[BL].point;
			// Update x-axis and y-axis
			this.tf_s.x_axis.segments[0].point = new Point(this.tf_sx1, o.y);
			this.tf_s.x_axis.segments[1].point = new Point(this.tf_sx2, o.y);
			this.tf_s.x_axis.strokeColor = "pink";
			this.tf_s.y_axis.segments[0].point = new Point(o.x, this.tf_sy1);
			this.tf_s.y_axis.segments[1].point = new Point(o.x, this.tf_sy2);
			this.tf_s.y_axis.strokeColor = "orange";
			// Update label content and positions
			let loff = 10; // label offset
			this.tf_s.mx1_label.content = this.tf_mx1 ? this.tf_mx1.toFixed(0) : 0;
			this.tf_s.mx2_label.content = this.tf_mx2 ? this.tf_mx2.toFixed(0) : 0;
			this.tf_s.my1_label.content = this.tf_my1 ? this.tf_my1.toFixed(0) : 0;
			this.tf_s.my2_label.content = this.tf_my2 ? this.tf_my2.toFixed(0) : 0;
			this.tf_s.mp_label.content = this.tf_mp ? this.tf_mp : "";
			if (!this.tf_mx) {
				this.tf_s.mx1_label.content = "";
				this.tf_s.mx2_label.content = "";
			}
			if (!this.tf_my) {
				this.tf_s.my1_label.content = "";
				this.tf_s.my2_label.content = "";
			}
			this.tf_s.mx_label.content = this.tf_mx ? this.tf_mx : "";
			this.tf_s.my_label.content = this.tf_my ? this.tf_my : "";
			this.tf_s.mx1_label.position = this.tf_s.x_axis.segments[0].point.add(0, loff);
			this.tf_s.mx2_label.position = this.tf_s.x_axis.segments[1].point.add(0, loff);
			this.tf_s.my1_label.position = this.tf_s.y_axis.segments[0].point.add(-loff,0);
			this.tf_s.my2_label.position = this.tf_s.y_axis.segments[1].point.add(-loff,0);
			this.tf_s.mx_label.position = this.tf_s.x_axis.segments[1].point.subtract(2*loff, -1.5*loff);
			this.tf_s.my_label.position = this.tf_s.y_axis.segments[0].point.add(-1.5*loff, loff);
			this.tf_s.mp_label.position = this.tf_s.box.segments[TR].point.subtract(2*loff, -2*loff)
			// Flip y label if needed
			if (this.tf_s_yflip) {
				let temp = this.tf_s.my1_label.position;
				this.tf_s.my1_label.position = this.tf_s.my2_label.position;
				this.tf_s.my2_label.position = temp;
			}
			// Show all items
			for (let x in this.tf_s) {
				this.tf_s[x].visible = true;
			}
		} else {
			// Hide all items
			for (let x in this.tf_s) {
				this.tf_s[x].visible = false;
			}
		}
	}

	tf_space_map_x_y(x, y) {
		let tx = null;
		let ty = null;

		if (x != null) {
			tx = this.linear_map(this.tf_sx1, this.tf_sx2, this.tf_mx1, this.tf_mx2, x);
		}

		if (y != null) {
			if (!this.tf_s_yflip) ty = this.linear_map(this.tf_sy1, this.tf_sy2, this.tf_my1, this.tf_my2, y);
			if (this.tf_s_yflip) ty = this.linear_map(this.tf_sy1, this.tf_sy2, this.tf_my2, this.tf_my1, y);
		}

		return {"x": tx, "y": ty};
	}

	tf_space_reverse_map_x_y(x, y) {
		let tx = null;
		let ty = null;

		if (x != null) {
			tx = this.linear_map(this.tf_mx1, this.tf_mx2, this.tf_sx1, this.tf_sx2, x);
		}

		if (y != null) {
			if (!this.tf_s_yflip) ty = this.linear_map(this.tf_my1, this.tf_my2, this.tf_sy1, this.tf_sy2, y);
			if (this.tf_s_yflip) ty = this.linear_map(this.tf_my1, this.tf_my2, this.tf_sy2, this.tf_sy1, y);
		}

		return {"x": tx, "y": ty};
	}

	linear_map(in_s, in_f, out_s, out_f, v) {
		return out_s + (v - in_s) * (out_f - out_s) / (in_f - in_s);
	}

	// transform
	// ------------------------------------------------------------------------
	// Plays the transformation function if it represents an animation;
	// otherwise it applies the transformation function to the objects
	// properties
	transform() {
		if (!this.mapping) this.set_mapping();

		if (this.is_playable) {
			this.play();
		} else {
			this.apply();
		}
	}

	// apply
	//
	// Applies a transformation that represents a procedural relationship in
	// a static context. I.e. if the artist makes a change to any artwork in
	// the target, the input constrains how that change is applied
	//
	// The property of the target artwork impacted by the transformation is
	// shifted to match the input value
	apply() {
		for (let idx = 0; idx < this.n_target; idx++) {
			let a;
			if (this.target.is_artwork) a = this.target;
			if (this.target.is_collection) a = this.target.shapes[idx];
			// if (this.tf_space_absolute) {
			// 	let sv = this.get_value_at_target_index_for_axis_mapping(idx, 0, "index");
			// 	// this.set_artwork_value_to(a, sv);
			// }
			let v = this.get_value_at_target_index_for_axis_mapping(idx, idx, "index")
			this.set_artwork_value_to(a, v);
		}
	}

	// play
	// ------------------------------------------------------------------------
	// @description: If the transformation function represents an animation,
	// this plays the animation
	//
	// Note: the playback point also triggers this function
	play() {
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
				let sv = this.get_value_at_target_index_for_path_offset(idx, 0);
				this.set_artwork_value_to(a, sv);
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

	set_artwork_value_to(a, sv) {
		if (this.mapping == this.MOTION_PATH)
			a.position = new Point(sv.x, sv.y);
		if (this.mapping == this.NUMBER_OF_SIDES)
			a.set_number_of_sides(Math.round(sv.y));
	}

	// Assump a_target is always a shape
	get_transform_artwork_at_state(state_idx, a_idx) {
		let i = state_idx;
		let nxt_i = state_idx + 1;

		let d; let dx; let dy;
		let delta;

		if (this.input.is_shape) {
			d = this.get_delta_from_state(i, nxt_i);
			dx = delta.x; dy = delta.y;
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
		}

		delta = {"x": dx, "y": dy, "v": d};

		let duration = (1000/ames.fps) * this.tf_space_speed_factor;
		if (this.tf_space_speed == this.SPEED_CONSTANT) duration = duration;
		if (this.tf_space_speed == this.SPEED_LINEAR) duration *= Math.abs(d)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_XAXIS) duration *= Math.abs(dx)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_YAXIS) duration *= Math.abs(dy)*this.tf_space_path_length_relative_scale;
		if (this.tf_space_speed == this.SPEED_MAP) {} // TBD
		if (duration == 0) duration = .001;

		return [delta, duration];
	}

	get_delta_from_state(i, nxt_i, in_idx) {
		let in_artwork;

		if (this.input.is_artwork) in_artwork = this.input.poly;
		if (this.input.is_collection) in_artwork = this.input.shapes[in_idx].poly;

		let l = in_artwork.length;

		let prev_s = this.get_artwork_value_at_offset(in_artwork, i*l/this.tf_space_path_nsegments);
		let nxt_s = this.get_artwork_value_at_offset(in_artwork, nxt_i*l/this.tf_space_path_nsegments)

		return nxt_s.subtract(prev_s);
	}

	get_artwork_value_at_offset(artwork, off) {
		let p = artwork.getPointAt(off);
		let t = this.tf_space_map_x_y(p.x, p.y);
		p.x = t.x; p.y = t.y;
		return p;
	}

	get_artwork_value_at_intersection(artwork, axis_idx, axis_mapping) {
		let eps = 0.5;
		let p1; let p2;
		if (this.tf_mx == axis_mapping) { // Horizontal
			p1 = this.tf_space_reverse_map_x_y(axis_idx, this.tf_my1);
			if (axis_idx == 0) p1.x += eps
			if (axis_idx == this.tf_mx2) p1.x -= eps;

			let ymax = this.tf_sy2; if (this.tf_s_yflip) ymax = this.tf_sy1;
			p2 = new Point(p1.x, ymax);
		}
		if (this.tf_my == axis_mapping) { // Vertical
			p1 = this.tf_space_reverse_map_x_y(this.tf_mx1, axis_idx);
			if (axis_idx == 0) p1.y += (this.tf_s_yflip? -eps : eps);
			if (axis_idx == this.tf_my2) p1.y -= (this.tf_s_yflip? eps : -eps);

			p2 = new Point(this.tf_sx2, p1.y)
		}

		let line = new Path.Line(p1, p2);
		let intersects = artwork.getIntersections(line);
		// line.strokeWidth = 1; line.strokeColor = "blue";

		let t = this.tf_space_map_x_y(intersects[0].point.x, intersects[0].point.y);
		return t;
	}

	get_value_at_target_index_for_axis_mapping(artwork_idx, axis_idx, axis_mapping) {
		return this.get_value_at_target_index_for_path_offset_or_axis_mapping(artwork_idx, null, axis_idx, axis_mapping);
	}

	get_value_at_target_index_for_path_offset(artwork_idx, offset) {
		return this.get_value_at_target_index_for_path_offset_or_axis_mapping(artwork_idx, offset, null, null);
	}

	get_value_at_target_index_for_path_offset_or_axis_mapping(a_idx, offset, axis_idx, axis_mapping) {
		let p; let x; let y;

		if (this.input.is_shape) {
			if (axis_mapping) {
				p = this.get_artwork_value_at_intersection(this.input.poly, axis_idx, axis_mapping)
			} else {
				p = this.get_artwork_value_at_offset(this.input.poly, offset);
			}
			x = p.x; y = p.y; p = Math.sqrt(x*x + y*y)
		}

		if (this.input.is_collection) {
			p = [];
			for (let in_idx = 0; in_idx < this.n_input; in_idx++) {
				let in_artwork = this.input.shapes[in_idx].poly;
				if (axis_mapping) {
					p[in_idx] = this.get_artwork_value_at_intersection(this.input.poly, axis_idx, axis_mapping);
				} else {
					p[in_idx] = this.get_artwork_value_at_offset(in_artwork, offset);
				}
			}
			x = p.map((p) => p.x);
			y = p.map((p) => p.y);
			p = p.map((p) => Math.sqrt(p.x*p.x + p.y*p.y))

			x = utils.interpolate_fast(x, a_idx);
			y = utils.interpolate_fast(y, a_idx);
			p = utils.interpolate_fast(p, a_idx);
		}

		return {"x": x, "y": y, "v": p};
	}
}

export class Transformation_Space {

}
