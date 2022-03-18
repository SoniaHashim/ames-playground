// ----------------------------------------------------------------------------
// artwork.js
// Author: Sonia Hashim
//
// Description: AMES basic geometry representations
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape_Editor as AMES_Shape_Editor} from './editors.js'
import {AMES_Constraint as constraints} from './constraints.js'

// let cb_canvas_crosshair = (e) => {
// 	ames.canvas.style.cursor = 'crosshair';
// }

// Class: Artwork
// ----------------------------------------------------------------------------
// Description: Basic artwork representation with visual & temporal properties
export class AMES_Artwork {
	// Display properties including name, visibility, layer
	name = "Shape";
	is_geometry = true;
	is_shape = true;
	is_artwork = true;
	obj_type = "shape";
	visible = false;
	static count = 1;
	number = 0;
	// Visual Properties: position, scale, rotate, stroke w, stroke c, fill
	pos = {x: ames.canvas_cy, y: ames.canvas_cy};
	scale = {x: 1, y: 1};
	rotation = 0;
	visual_props = {'Position': this.pos, 'Scale': this.scale};
	// Shape geoemtry
	poly;
	// State
	is_selected = false;
	selection_opts = [];
	path_control_shapes = [];
	scale_control_shapes = {'scale_box': null, 'scale_dots': null};
	rotation_control_shapes = {}
	vis_control_shapes = {
		'path': false
	}
	cbs = {
		'position': this._position_cb,
		'scale': this._scale_cb,
		'rotation': this._rotation_cb,
		'fillColor': this._fill_cb,
		'strokeWidth': this._strokewidth_cb,
		'strokeColor': this._strokecolor_cb,
		'path': this._path_cb,
	}
	cb_helpers = {'shapes': []};
	collections = [];
	transformations = [];
	lists = {};
	c_inbound = {
		"position" : {"all": {}, "x": {}, "y": {}},
		"scale": {"all": {}, "x": {}, "y": {}},
		"rotation": {"all": {}, "t": {}},
		"fillColor": {"all": {}, "h": {}, "s": {}, "v": {}, "a": {}},
		"strokeWidth": {"all": {}, "w": {}},
		"strokeColor": {"all": {}, "h": {}, "s": {}, "v": {}, "a": {}},
		"path" : {}
	}
	c_outbound = {
		"position" : {"all": {}, "x": {}, "y": {}},
		"scale": {"all": {}, "x": {}, "y": {}},
		"rotation": {"all": {}, "t": {}},
		"fillColor": {"all": {}, "h": {}, "s": {}, "v": {}, "a": {}},
		"strokeWidth": {"all": {}, "w": {}},
		"strokeColor": {"all": {}, "h": {}, "s": {}, "v": {}, "a": {}},
		"path" : {}
	}

	constructor() {
		this.number = AMES_Artwork.count;
		AMES_Artwork.count += 1;
	}

	// add_list: adds list to track which lists the shape is in so updates to the shape
	// can update the list helper shapes
	add_list(list) {
		this.lists[list.name] = list;
	}

	add_collection(collection) {
		let missing = true;
		for (let i in this.collections) {
			if (this.collections[i] == collection) missing = false;
		}
		if (missing) this.collections.push(collection);
		if (missing) console.log("add collection", this.collections, collection);
	}

	add_transformation(transformation) {
		let missing = true;
		for (let i in this.transformations) {
			if (this.transformations[i] == transformation) missing = false;
		}
		if (missing) this.transformations.push(transformation);
	}

	remove_collection(collection) {
		let idx = -1;
		for (let i in this.collections) {
			if (this.collections[i] == collection) {
				idx = i;
				break;
			}
		}
		if (idx >= 0) this.collections.splice(idx, 1);
	}

	remove_transformation(transformation) {
		let idx = -1;
		for (let i in this.transformations) {
			if (this.transformations[i] == transformation) {
				idx = i;
				break;
			}
		}
		if (idx >= 0) this.transformations.splice(idx, 1);
	}

	// set_pos(pt, is_delta)
	// Description: Updates the position of the shape to the pt specified or by
	// the vector specified if is_delta is true
	set_pos(p, is_delta) {
		if (is_delta) {
			this.pos.x += p.x;
			this.pos.y += p.y;
			if (this.poly)
				this.poly.position.add(p);
			if (this.rotation_control_shapes.line) {
				this.rotation_control_shapes.line.position = this.rotation_control_shapes.line.position.add(p);
			}
		} else {
			this.pos.x = p.x;
			this.pos.y = p.y;
			let npos = new Point(p.x, p.y);
			if (this.poly)
				this.poly.position = new Point(this.pos.x, this.pos.y);
			if (this.rotation_control_shapes.line) {
				this.rotation_control_shapes.line.segments[0].point = this.poly.position.add(this.rotation_control_shapes.a_offset);
			}

		}
	}

	set_scaling(x) {
		this.poly.scaling = x;
	}

	// set_scale(f)
	// Description: Updates the scale of the shape by the given amount
	set_scale(fx, fy) {
		// this.scale.x = fx*this.scale.x;
		// this.scale.y = fy*this.scale.y;
		let sx = 1; let sy = 1;
		if (fx) {
			sx = fx/this.scale.x;
			this.scale.x = fx;
		}
		if (fy) {
			sy = fy/this.scale.y;
			this.scale.y = fy;
		}
		if (this.poly)
			this.poly.scale(sx, sy);
		if (this.rotation_control_shapes.line) {
			this.rotation_control_shapes.a_offset = this.rotation_control_shapes.a_offset.multiply(sx, sy);
		}
	}

	set_rotation(theta, anchor) {
		this.rotation += theta;
		if (this.poly) {
			// if (this.rotation_control_shapes.da) {
			// 	anchor = this.rotation_control_shapes.da.position;
			// }
			if (!anchor) anchor = this.rotation_control_shapes.line.segments[0].point;
			if (anchor) {
				this.poly.rotate(theta, anchor);
				if (this.rotation_control_shapes.line)
					this.rotation_control_shapes.line.rotate(theta, anchor);
			} else {
				this.poly.rotate(theta);
			}

		}
	}

	// draw_shape()
	// Description: Default shows not implemented
	draw_shape() {
		console.log("draw_shape not implemented for " + this.name);
	}

	get_bbox() {
		if (this.poly) {
			if (this.poly.strokeBounds) return this.poly.strokeBounds;
			else return this.poly.bounds;
		}
		return;
	}

	get_large_bbox() {
		let r = this.get_bbox();


		this.update_selection_opts();
		let h_min = this.selection_opt_names.length * utils.LAYER_HEIGHT*.75;
		let w_min = 20;

		let h = r.height; if (r.height < h_min) h = h_min; if (h < 30) h = 30;
		let w = r.width; if (w < w_min) w = w_min;

		let bbox = new Rectangle(r.point, new Size(w, h));
		bbox.center = r.center;

		return bbox;
	}

	update_bbox() {
		this.bbox = this.get_bbox();
	}

	// get_pos: returns the position of this shape
	get_pos() {
		return this.poly.position;
	}

	// is_inside(p)
	// Description: Checks if the point p is within the bounding box of shape
	contains(p) {
		if (this.poly) {
			let bounds = this.get_large_bbox();
			return p.isInside(bounds);
		}
		return;
	}

	get_distance_from_bbox_center_to_point(p) {
		let c  = this.get_large_bbox().center;
		let x = c.x - p.x;
		let y = c.y - p.y;
		return Math.sqrt(x*x + y*y);
	}

	// manipulate: enable interaction on a given property with opt sub properties
	manipulate(p, sub) {
		// Change active property in lists containing shape to match
		for (let i in this.lists) {
			if (this.lists[i].active_prop != p) {
				if (!this.lists[i].is_list_control) {
					this.lists[i].manipulate(p, sub);
					return;
				}
			} else {
				if (sub && this.lists[i].active_sub_p != sub) {
					if (!this.lists[i].is_list_control) {
						this.lists[i].manipulate_helper(sub);
						return;
					}
				}
			}
		}
		this._clear_cb_helpers();
		// Turn off the active property
		if (this.active_prop) {
			// Remove subproperty buttons
			this.editor.show_subprops(this.active_prop, false);
			this.editor.select_prop(this.active_prop, false);
			// this.editor.show_constraint(false);
		}
		// If the new propety is not the property just turned off, turn it on
		if (this.active_prop != p) {
			// Turn off selection toggle and hide path control shapes
			// this.attach_interactivity(false);
			this.show_path_control_shapes(false);

			this.active_prop = p;
			let sub_p = 'all'
			this.active_sub_p = sub_p;

			if (p == 'strokeColor' || p == 'fillColor') {
				if (!ames.colorpicker.visible) ames.colorpicker.visible = true;
			} else {
				// if (ames.colorpicker.visible) ames.colorpicker.visible = false;
			}

			// Indicate active property and show subproperty buttons
			this.editor.show_subprops(p, true);
			this.editor.select_prop(p, true);

			// this.editor.show_constraint(true, p, sub_p);

			// Activate new propety callback
			this.cbs[p](this, this.cb_helpers);


		} else {
			// Turn selection toggle back on
			this.attach_interactivity(true);
			// Deactivate property and subproperty
			this.active_prop = null;
			this.active_sub_p = null;
		}
	}

	manipulate_helper(sub) {
		// Change active property in lists containing shape to match
		for (let i in this.lists) {
			if (this.lists[i].active_prop != this.active_prop) {
				this.lists[i].manipulate(this.active_prop, sub);
				return;
			} else {
				if (sub && this.lists[i].active_sub_p != sub) {
					this.lists[i].manipulate_helper(sub);
					return;
				}
			}
		}
		this._clear_cb_helpers();
		this.active_sub_p = sub;
		this.editor.select_subprop(sub, true);
		// this.editor.show_constraint(true, this.active_prop, sub);
		this.cbs[this.active_prop](this, this.cb_helpers, sub);
	}

	// Update helpers after a transformation that changes the artwork
	// If the transformation is geometric (changes the scale, position, rotation,
	// stroke width of the shape)... ie anything that can change its bbox the
	// bbox for the artwork is updated as well as the bbox for any collections
	// that it belongs to and the transformation space bounds of any transformation
	// spaces where it is an input
	update_helpers(artwork, is_geometric) {
		console.log(artwork);
		// artwork.update_constraints();
		if (is_geometric) {
			artwork.update_bbox();
			artwork.update_collections();
			artwork.update_transformations();
		}
	}

	update_constraints() {
		let p = this.active_prop;
		let s = this.active_sub_p;
		if (!s) s = 'all';
		// constraints.update_constraints(p, s, this);
		for (let i in this.lists) {
			// this.lists[i].update_constraints();
		}
		for (let i in ames.lists) {
			ames.lists[i].update_show_box_bounds();
		}
	}

	update_collections() {
		for (let i in this.collections) {
			this.collections[i].update_show_box();
			for (let j in this.collections[i].tranformations) {
				this.collections[i].transformations[j].update_tf_space();
			}
		}
	}

	update_transformations() {
		for (let i in this.transformations) {
			this.transformations[i].update_tf_space();
		}
	}

	notify_lists_shape_is_active() {
		for (let i in this.lists) {
			this.lists[i].set_active_obj(this);
		}
	}

	_clear_cb_helpers() {
		let shapes = this.cb_helpers['shapes'];
		let n_shapes = this.cb_helpers['shapes'].length;
		for (let idx = 0; idx < n_shapes; idx++) {
			let s = shapes[idx];
			s.remove();
		}
		if (this.cb_helpers['color_target']) {
			let f = this.cb_helpers['color_target'];
			ames.colorpicker.color_target = null;
		}
		if (this.cb_helpers['path']) this.show_path_control_shapes(false);
		if (this.cb_helpers['scale']) this.show_scale_control_shapes(false);
		if (this.cb_helpers['rotation']) this.show_rotation_control_shapes(false);
		this.cb_helpers = {};
		this.cb_helpers['shapes'] = [];
		this.attach_interactivity(true);
	}

	_apply_cb_to_collections(cb, e) {
		for (let i in this.collections) {
			let c = this.collections[i];
			if (c.active_prop == this.active_prop) {
				if (c.active_sub_p == this.active_sub_p) {
					for (let j in c.shapes) {
						let s = c.shapes[j];
						if (s != this)  {
							console.log(s.name);
							s.poly[cb](e, true);
						}
					}
				}
			}
		}
	}


	_position_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			shape.poly.onMouseDown = (e, in_chain) => {
				// ames.hide_editors(shape);
				// shape.show_all_editors();
				console.log(shape.name, 'onMouseDown', e, in_chain)
				shape.notify_lists_shape_is_active();
				let pos = shape.poly.position;
				let offset = pos.subtract(e.point);

				if (sub && sub == 'x') cb_helpers['y'] = pos.y;
				if (sub && sub == 'y') cb_helpers['x'] = pos.x;

				cb_helpers['offset'] = offset;

				if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);

			}
			shape.poly.onMouseDrag = (e, in_chain) => {
				let offset = cb_helpers['offset'];
				let point = e.point.add(offset);

				if (sub && sub == 'x') point.y = cb_helpers['y'];
				if (sub && sub == 'y') point.x = cb_helpers['x'];

				if (offset) shape.set_pos(point);

				// Update helpers
				shape.update_helpers(shape, true);

				if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
			}
		}
	}

	_scale_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			shape.update_scale_control_shapes();
			shape.show_scale_control_shapes(true);
			cb_helpers['scale'] = true;

			let scale_box = shape.scale_control_shapes.scale_box;
			let scale_dots = shape.scale_control_shapes.scale_dots;

			shape.poly.onMouseDown = (e) => {
				// ames.hide_editors(shape);
				// shape.show_all_editors();
			}

			let bbox = shape.get_bbox();
			let corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
			let TL = 1; let TR = 2; let BR = 3; let BL = 0;
			let dot_pairs = [TR, BR, BL, TL];
			let bf = 1; let pf = 1;
			for (let d_idx = 0; d_idx < 4; d_idx++) {
				let d = scale_dots[d_idx];
				d.replaceWith(d.insertBelow(scale_box));
				let d_pair = scale_dots[dot_pairs[d_idx]];
				let scale_start_x = 1; let scale_start_y = 1;
				d.onMouseDown = (e, in_chain) => {
					shape.notify_lists_shape_is_active();
					pf = 1;
					scale_start_x = shape.scale.x;
					scale_start_y = shape.scale.y;
					// Set relative scale to 1 (current size is scale 1)
					let b = shape.poly.position.subtract(d.position);
					bf = b.length;
					if (sub == 'x') bf = b.x;
					if (sub == 'y') bf = b.y;

					if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);
				}
				d.onMouseDrag = (e, in_chain) => {
					let p = shape.poly.position.subtract(e.point);
					let f = p.length/bf;
					let fx = scale_start_x * p.x/bf;
					let fy = scale_start_y * p.y/bf;

					// Scale shape and box
					if (sub == 'x') {
						f = p.x/bf;
						// shape.set_scale((1/pf)*f, 1);
						shape.set_scale(fx, null);
						scale_box.scale((1/pf)*f, 1);
					} else if (sub == 'y') {
						f = p.y/bf;
						// shape.set_scale(1, (1/pf)*f);
						shape.set_scale(null, fy);
						scale_box.scale(1, (1/pf)*f);
					} else {
						// shape.set_scale((1/pf)*f, (1/pf)*f);
						shape.set_scale(scale_start_x*f, scale_start_y*f);
						// console.log(f);
						scale_box.scale((1/pf)*f, (1/pf)*f);
					}
					// console.log(f);
					pf = f;

					// Update dot position and scale_box
					d.position = scale_box.segments[d_idx].point;
					for (let n = 0; n < 4; n++) {
						scale_dots[n].position = scale_box.segments[n].point;
					}

					// Update helpers
					shape.update_helpers(shape, true);

					if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
				}
			}
		}
	}

	_rotation_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			// Draw rotation guide
			shape.update_rotation_control_shapes();
			// Set dt to be at the top of the current bounding box of the shape
			let bbox = shape.get_bbox();
			shape.rotation_control_shapes.line.segments[1].point = bbox.topCenter;
			shape.rotation_control_shapes.dt.position = bbox.topCenter;

			shape.show_rotation_control_shapes(true);
			cb_helpers['rotation'] = true;

			let line = shape.rotation_control_shapes.line;
			shape.da = shape.rotation_control_shapes.da;
			let dt = shape.rotation_control_shapes.dt;

			let anchor = shape.da.position;
			let x_base = dt.position.subtract(shape.da.position);

			let prev_ro = 0;

			let get_rotation_a = function(p, anchor) {
				let r_vec = p.subtract(anchor);
				let total_ro = x_base.getDirectedAngle(r_vec);
				let a = total_ro - prev_ro;
				prev_ro = prev_ro + a;
				return a;

			}

			shape.poly.onMouseDown = (e) => {
				// ames.hide_editors(shape);
				// shape.show_all_editors();
			}

			// Update anchor point for rotation
			shape.da.onMouseDrag = (e, in_chain) => {
				shape.da.position = e.point;
				// Update line
				line.firstSegment.point = e.point;
				// Update x_base and total rotation using new reference
				anchor = shape.da.position;
				x_base = dt.position.subtract(anchor);
				prev_ro = 0;
				shape.rotation_control_shapes.a_offset = e.point.subtract(shape.poly.position);
				console.log(shape.rotation_control_shapes.a_offset);
				console.log(shape.da.position);


			}

			// Rotate based on angle between subsequent rays created by dragging
			let ro;
			let asum = 0;
			dt.onMouseDown = (e, in_chain) => {
				shape.notify_lists_shape_is_active();
				ro = dt.position;
				prev_ro = shape.poly.rotation;
				x_base = dt.position.subtract(shape.da.position);

				if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);
			}
			// Update rotation
			dt.onMouseDrag = (e, in_chain) => {
				anchor = shape.rotation_control_shapes.da.position;
				let a = get_rotation_a(e.point, anchor);
				shape.set_rotation(a, anchor);
				// shape.poly.rotate(a, anchor);

				// Rotate line
				// line.rotate(a, anchor);
				// asum += a;
				// console.log(asum);
				// Update line segment to match dt
				dt.position = e.point
				line.lastSegment.point = dt.position;

				// Update helpers
				shape.update_helpers(shape, true);

				if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
			}
		}
	}

	_fill_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			if (shape.poly) ames.colorpicker.load_color(shape.poly.fillColor);

			let color_function = (c) => {
				shape.poly.fillColor = c;
			}

			if (sub == 'h') {
				color_function = (c) => {
					if (shape.poly.fillColor.saturation == 0) shape.poly.fillColor.saturation = 1;
					shape.poly.fillColor.hue = c.hue;
				};
			}

			if (sub == 's') {
				color_function = (c) => {
					shape.poly.fillColor.saturation = c.saturation;
				};
			}

			if (sub == 'v') {
				color_function = (c) => {
					shape.poly.fillColor.brightness = c.brightness;
				};
			}

			if (sub == 'a') {
				color_function = (c) => {
					shape.poly.fillColor.alpha = c.alpha;
				};
			}

			let shape_color_target = (c) => {
				color_function(c);
				// Update helpers
				shape.update_helpers(shape);
			}

			ames.colorpicker.color_target = shape_color_target;

			shape.poly.onMouseDown = (e) => {
				ames.hide_editors(shape);
				// shape.show_all_editors();
				shape.notify_lists_shape_is_active();
				ames.colorpicker.color_target = shape_color_target;
			}

			cb_helpers['color_target'] = ames.colorpicker.color_target;
		}
	}

	_strokewidth_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			let yo;
			let w;
			shape.poly.onMouseDown = (e) => {
				ames.hide_editors(shape);
				// shape.show_all_editors();
				shape.notify_lists_shape_is_active();
				yo = e.point.y;
				w = shape.poly.strokeWidth;
			}
			shape.poly.onMouseDrag = (e) => {
				// console.log(.1*(yo - e.point.y));
				let nw = w + .1*(yo - e.point.y);
				if (nw <= 0) {
					shape.poly.strokeWidth = 0;
				} else {
					shape.poly.strokeWidth = nw;
				}

				// Update helpers
				shape.update_helpers(shape, true);
			}
		}
	}

	_strokecolor_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			if (shape.poly) ames.colorpicker.load_color(shape.poly.strokeColor);

			let color_function = (c) => {
				shape.poly.strokeColor = c;
			}

			if (sub == 'h') {
				color_function = (c) => {
					if (shape.poly.strokeColor.saturation == 0) shape.poly.strokeColor.saturation = 1;
					shape.poly.strokeColor.hue = c.hue;
				};
			}

			if (sub == 's') {
				color_function = (c) => {
					shape.poly.strokeColor.saturation = c.saturation;
				};
			}

			if (sub == 'v') {
				color_function = (c) => {
					shape.poly.fillColor.brightness = c.brightness;
				};
			}

			if (sub == 'a') {
				color_function = (c) => {
					shape.poly.fillColor.alpha = c.alpha;
				};
			}

			let shape_color_target = (c) => {
				color_function(c);
				// Update helpers
				shape.update_helpers(shape);
			}

			ames.colorpicker.color_target = shape_color_target;

			shape.poly.onMouseDown = (e) => {
				ames.hide_editors(shape);
				// shape.show_all_editors();
				shape.notify_lists_shape_is_active();
				ames.colorpicker.color_target = shape_color_target;
			}

			cb_helpers['color_target'] = ames.colorpicker.color_target;
		}
	}

	_path_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			shape.update_path_control_shapes();
			shape.show_path_control_shapes(true);
			cb_helpers['path'] = true;

			shape.onMouseDown = (e) => {
				ames.hide_editors(shape);
				// shape.show_all_editors();
			}
		}
	}


	// create_control_shapes: create all control shapes
	create_control_shapes() {
		this._create_path_control_shapes();
		this._create_scale_box();
		this._create_rotation_shapes();
	}

	// create_rotation_shapes: create rotation control shapes
	_create_rotation_shapes() {
		let shape = this;
		if (shape.poly) {
			let tc = shape.poly.bounds.topCenter;
			if (shape.strokeBounds) tc = shape.poly.strokeBounds.topCenter
			let line = utils.make_line(shape.poly.position, tc);
			let da = utils.make_dot(shape.poly.position);
			let dt = utils.make_dot(tc);
			da.scaling = 1.5;
			da.fillColor = utils.INACTIVE_COLOR;
			da.strokeColor = utils.SHAPE_PATH_COLOR;
			da.strokeWidth = 2;

			line.visible = false;
			da.visible = false;
			dt.visible = false;

			this.rotation_control_shapes.line = line;
			this.rotation_control_shapes.da = da;
			this.rotation_control_shapes.a_offset = new Point(0, 0);
			this.rotation_control_shapes.dt = dt;
		}

	}

	// create_scale_box: scale control shapes
	_create_scale_box() {
		let shape = this;
		if (shape.poly) {
			let bbox = shape.get_bbox();
			let scale_box = utils.make_rect(bbox, utils.SHAPE_PATH_COLOR);
			// cb_helpers['shapes'].push(scale_box)
			let corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
			let TL = 1; let TR = 2; let BR = 3; let BL = 0;
			let dot_pairs = [TR, BR, BL, TL];
			let scale_dots = [];
			for (let c in corners) {
				let d = utils.make_dot(corners[c]);
				scale_dots.push(d.clone());
				d.remove();
			}
			scale_box.visible = false;
			for (let i = 0; i < 4; i++) {
				scale_dots[i].visible = false;
			}

			this.scale_control_shapes.scale_box = scale_box;
			this.scale_control_shapes.scale_dots = scale_dots;
		}
	}

	// create_path_control_shapes: create path control objects
	_create_path_control_shapes() {
		// for every segment in the path
		for (let i in this.poly.segments) {
			let s = this.poly.segments[i];

			// Create manipulable dots on the anchor point and handle endpoints
			// as well as handles connecting the anchor to the handle points
			let h1 = s.handleIn.add(s.point);
			let h2 = s.handleOut.add(s.point);
			let p1 = utils.make_line(h1, s.point);
			let p2 = utils.make_line(s.point, h2);

			let d = utils.make_square_dot(s.point);
			let d_h1 = utils.make_dot(h1);
			let d_h2 = utils.make_dot(h2);

			// Edit the path by dragging the anchor point
			d.onMouseDrag = (e) => {
				s.point = e.point;
				// update the manipulable dots and visual aids
				d.position = e.point;
				let n_h1 = s.handleIn.add(e.point);
				let n_h2 = s.handleOut.add(e.point);
				d_h1.position = n_h1;
				d_h2.position = n_h2;
				p1.firstSegment.point = n_h1;
				p1.lastSegment.point = e.point;
				p2.firstSegment.point = e.point;
				p2.lastSegment.point = n_h2;
			}

			// create handles with manipulable dots at endpoints to manipulate the path
			d_h1.onMouseDrag = (e) => {
				s.handleIn = e.point.subtract(s.point);
				p1.firstSegment.point = e.point;
				d_h1.position = e.point;
			}
			d_h2.onMouseDrag = (e) => {
				s.handleOut = e.point.subtract(s.point);
				p2.lastSegment.point = e.point;
				d_h2.position = e.point;
			}

			let controls = [d, d_h1, d_h2, p1, p2];
			for (let x in controls) {
				controls[x].visible = false;
			}

			this.path_control_shapes.push(controls);
		}
	}

	// show_editor: if true open editor; otherwise close;
	show_editor(bool) {
		if (this.editor) {
			this.editor.show(bool)
			if (!bool) {
				if (this.active_prop) this.manipulate(this.active_prop);
			}
		}
	}

	show_all_editors() {
		if (this.editor && !this.editor.is_visible) {
			this.editor.show(true);
		}

		for (let i in this.lists) {
			if (this.lists[i].editor && !this.lists[i].editor.is_visible) this.lists[i].editor.show(true);
		}
	}

	// select: if true, select object and opens editor; otherwise deselect and close
	select(bool) {
		if (this.poly) {
			// this.poly.fullySelected = bool;
			this.is_selected = bool;
		}
	}

	update_control_shapes() {
		if (this.vis_control_shapes.path) this.update_path_control_shapes();
		if (this.vis_control_shapes.scale) this.update_scale_control_shapes();
		if (this.vis_control_shapes.rotation) this.update_rotation_control_shapes();
	}

	_redraw_above_poly(s) {
		s = s.insertAbove(this.poly);
	}

	update_rotation_control_shapes() {
		this.rotation_control_shapes.dt.position = this.rotation_control_shapes.line.segments[1].point;
		this.rotation_control_shapes.da.position = this.rotation_control_shapes.line.segments[0].point;

		this._redraw_above_poly(this.rotation_control_shapes.line);
		this._redraw_above_poly(this.rotation_control_shapes.dt);
		this._redraw_above_poly(this.rotation_control_shapes.da);
	}

	update_scale_control_shapes() {
		let TL = 1; let TR = 2; let BR = 3; let BL = 0;

		// update scale dot positions and corners of scale box
		let bbox = this.get_bbox();
		let sbox_tl = this.scale_control_shapes.scale_box.segments[TL].point;
		let sbox_tr = this.scale_control_shapes.scale_box.segments[TR].point;
		let sbox_bl = this.scale_control_shapes.scale_box.segments[BL].point;
		let sbox_br = this.scale_control_shapes.scale_box.segments[BR].point;

		// If not flipped in x...
		let l; let r; let t; let b;
		if (sbox_tl.x <= sbox_tr.x) {
			// Set left and right coord to bbox left and right
			l = bbox.topLeft.x;
			r = bbox.topRight.x;
		} else {
			// Otherwise flip in x
			l = bbox.topRight.x;
			r = bbox.topLeft.x;
		}

		// If not flipped in y...
		if (sbox_tl.y <= sbox_bl.y) {
			// Set top and bottom coord to bbox top and bottom
			t = bbox.topLeft.y;
			b = bbox.bottomLeft.y;
		} else {
			// Otherwise flip
			t = bbox.bottomLeft.y;
			b = bbox.topLeft.y;
		}

		this.scale_control_shapes.scale_box.segments[TL].point = new Point(l, t);
		this.scale_control_shapes.scale_box.segments[TR].point = new Point(r, t);
		this.scale_control_shapes.scale_box.segments[BL].point = new Point(l, b);
		this.scale_control_shapes.scale_box.segments[BR].point = new Point(r, b);

		this._redraw_above_poly(this.scale_control_shapes.scale_box);

		for (let n = 0; n < 4; n++) {
			this.scale_control_shapes.scale_dots[n].position = this.scale_control_shapes.scale_box.segments[n].point;
			this._redraw_above_poly(this.scale_control_shapes.scale_dots[n]);
		}
	}

	update_path_control_shapes() {
		for (let i in this.path_control_shapes) {
			let controls = this.path_control_shapes[i];
			let s = this.poly.segments[i];
			if (controls) {
				// update & show path control shapes
				let d = controls[0];
				let d_h1 = controls[1];
				let d_h2 = controls[2];
				let p1 = controls[3];
				let p2 = controls[4];

				// update visual aids
				d.position = s.point;

				let n_h1 = s.handleIn.add(s.point);
				if (s.handleIn.x == 0 && s.handleIn.y == 0) {
					let previous = s.previous;
					if (!previous) previous = s;
					n_h1 = n_h1.add(previous.point.subtract(s.point).normalize().multiply(8));
				}
				let n_h2 = s.handleOut.add(s.point);
				if (s.handleOut.x == 0 && s.handleOut.y == 0) {
					let next = s.next;
					if (!next) next = s;
					n_h2 = n_h2.add(next.point.subtract(s.point).normalize().multiply(8));
				}
				d_h1.position = n_h1;
				d_h2.position = n_h2;
				p1.firstSegment.point = n_h1;
				p1.lastSegment.point = s.point;
				p2.firstSegment.point = s.point;
				p2.lastSegment.point = n_h2;

				// Edit the path by dragging the anchor point
				d.onMouseDrag = (e) => {
					s.point = e.point;
					// update the manipulable dots and visual aids
					d.position = e.point;
					let n_h1 = s.handleIn.add(e.point);
					let n_h2 = s.handleOut.add(e.point);
					if (s.handleIn.x == 0 && s.handleIn.y == 0) {
						n_h1 = n_h1.add(s.previous.point.subtract(s.point).normalize().multiply(8));
						if (s.previous.handleOut.length == 0) {
							let prev_idx = i-1;
							if (i == 0) prev_idx = this.poly.segments.length - 1;

							let prev_controls = this.path_control_shapes[prev_idx];
							let prev_d_h2 = prev_controls[2];
							let prev_p2 = prev_controls[4];
							let prev_h2 = s.previous.point.add(s.point.subtract(s.previous.point).normalize().multiply(8));

							prev_d_h2.position = prev_h2;
							prev_p2.lastSegment.point = prev_h2;

						}
					}
					if (s.handleOut.x == 0 && s.handleOut.y == 0) {
						n_h2 = n_h2.add(s.next.point.subtract(s.point).normalize().multiply(8));
						if (s.next.handleIn.length == 0) {
							let nxt_idx = i*1.0+1;
							if (i == this.poly.segments.length - 1) nxt_idx = 0;

							let nxt_controls = this.path_control_shapes[nxt_idx];

							let nxt_d_h1 = nxt_controls[1];
							let nxt_p1 = nxt_controls[3];
							let nxt_h1 = s.next.point.add(s.point.subtract(s.next.point).normalize().multiply(8));

							nxt_d_h1.position = nxt_h1;
							nxt_p1.firstSegment.point = nxt_h1;
						}
					}
					d_h1.position = n_h1;
					d_h2.position = n_h2;
					p1.firstSegment.point = n_h1;
					p1.lastSegment.point = e.point;
					p2.firstSegment.point = e.point;
					p2.lastSegment.point = n_h2;
				}

				// create handles with manipulable dots at endpoints to manipulate the path
				d_h1.onMouseDrag = (e) => {
					s.handleIn = e.point.subtract(s.point);
					p1.firstSegment.point = e.point;
					d_h1.position = e.point;
				}
				d_h2.onMouseDrag = (e) => {
					s.handleOut = e.point.subtract(s.point);
					p2.lastSegment.point = e.point;
					d_h2.position = e.point;
				}


				for(let i in controls) {
					this._redraw_above_poly(controls[i]);
				}

			}
		}
	}

	show_rotation_control_shapes(bool) {
		this.vis_control_shapes['rotation'] = bool;
		this.rotation_control_shapes.line.visible = bool;
		this.rotation_control_shapes.da.visible = bool;
		this.rotation_control_shapes.dt.visible = bool;
	}

	show_scale_control_shapes(bool) {
		this.vis_control_shapes['scale'] = bool;
		this.scale_control_shapes.scale_box.visible = bool;
		for (let d in this.scale_control_shapes.scale_dots) {
			this.scale_control_shapes.scale_dots[d].visible = bool;
		}
	}

	// show_path_control_shapes: if true show shapes; otherwise hide
	show_path_control_shapes(bool) {
		this.vis_control_shapes['path'] = bool;
		for (let i in this.path_control_shapes) {
			let controls = this.path_control_shapes[i];
			if (controls) {
				for (let j in controls) {
					controls[j].visible = bool;
				}
			}
		}
	}

	highlight(color) {
		this.show_selection_opts();
		if (this.poly) {
			let bbox = this.get_large_bbox();
			return utils.make_rect(bbox, color);
		}
		return null;
	}

	update_selection_opts() {
		let opts = {}; let opt_names = [];
		this.selection_opt_names = null;
		this.selection_opt_references = null;

		if (ames.transformation_active_field != 'playback_transformation') {
			opt_names.push(this.name)
			opts[this.name] = this;

			for (let i in this.collections) {
				let c = this.collections[i];
				opt_names.push(c.name);
				opts[c.name] = c;
			}
		}

		if (ames.transformation_active_field != "input") {
			for (let i in this.transformations) {
				let t = this.transformations[i];
				let mapping = t.get_mapping();
				mapping = mapping[0].toUpperCase() + mapping.substr(1);
				let str = " T ( " + t.input.name + ": " + mapping + ")";
				opt_names.push(str);
				opts[str] = t;
			}

			for (let i in this.collections) {
				let c = this.collections[i];
				for (let j in c.transformations) {
					let t = c.transformations[j];
					let mapping = t.get_mapping();
					mapping = mapping[0].toUpperCase() + mapping.substr(1);
					let str = " T ( " + t.input.name + ": " + mapping + ")";
					opt_names.push(str);
					opts[str] = t;
				}
			}
		}

		this.selection_opt_names = opt_names;
		this.selection_opt_references = opts;
	}

	show_selection_opts() {
		this.update_selection_opts();

		let opt_names = this.selection_opt_names;
		let opts = this.selection_opt_references;
		console.log(opt_names, opts);

		let box = this.get_large_bbox();
		let bx = box.topRight.x; let by = box.topRight.y;

		let selected_opt_box; let a_opt_box;
		for (let i in opt_names) {
			let opt = new Group();
			let opt_box = new Path.Rectangle({
				point: new Point(bx-7.5, by - 0.25),
				size: new Size(200, utils.LAYER_HEIGHT*.75),
				fillColor: utils.INACTIVE_DARK_COLOR,
				strokeColor: utils.INACTIVE_S_COLOR,
				strokeWidth: 0,
				radius: 1.25
			});
			let opt_label = new PointText({
				point: [bx + 15, by + 12.5],
				content: opt_names[i],
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,
			});
			opt_box.bringToFront(); opt_label.bringToFront();

			if (opt_names[i] == this.name) {
				opt_box.strokeWidth = 1;
				ames.selected_obj = this;
				a_opt_box = opt_box;
				selected_opt_box = opt_box;
				ames.selected_obj = this;
			}

			by += opt_box.bounds.height;

			opt.addChildren([opt_box, opt_label]);
			opt.bringToFront();

			opt.onMouseEnter = (e) => {
				selected_opt_box = opt_box;
				if (opt_box != a_opt_box) a_opt_box.strokeWidth = 0;
				selected_opt_box.strokeWidth = 1;
				ames.selected_obj = opts[opt_names[i]];
			};
			opt.onMouseLeave = (e) => {
				selected_opt_box.strokeWidth = 0;
				selected_opt_box = null;
				setTimeout(() => {
					if (!selected_opt_box) {
						a_opt_box.strokeWidth = 1
						selected_opt_box = a_opt_box;
						ames.selected_obj = this;
					}
				}, 250);
			}
			opt.onMouseUp = (e) => {
				ames.selected_obj = opts[opt_names[i]];
				console.log("mouse up on", opt_names[i]);
				this.hide_selection_opts();
			}
			this.selection_opts.push(opt);
		}

		console.log(opts);
	}

	hide_selection_opts() {
		for (let i in this.selection_opts) {
			this.selection_opts[i].remove();
		}
	}

	get_bbox() {
		if (this.poly) {
			let bbox = this.poly.bounds;
			if (this.poly.strokeBounds) bbox = this.poly.strokeBounds;
			return bbox;
		};
		return;
	}

	get_closest_bbox_corner(p) {
		if (this.poly) {
			let bbox = this.poly.bounds;
			if (this.poly.strokeBounds) bbox = this.poly.strokeBounds;
			let bbox_corners = [bbox.topLeft, bbox.topRight, bbox.bottomLeft, bbox.bottomRight];
			let min_d = Number.MAX_VALUE;
			let min_idx = 0;
			for (let idx = 0; idx < 4; idx++) {
				let d = utils.lengthsq(bbox_corners[idx], p);
				if (d < min_d) {
					min_d = d;
					min_idx = idx;
				}
			}
			return bbox_corners[min_idx];
		}
	}

	to_path() {
		if (this.poly) {
			let p = this.poly.toPath();
			this.poly.remove();
			this.poly = p;
		}
	}

	get_name() {
		return this.name;
	}

	get_type() {
		return this.artwork_type;
	}

	set_name(n) {
		this.name = n;
	}

	// show: if true, show; otherwise hide
	show(bool) {
		this.show_editor(bool);
		this.visible = bool;
		this.poly.visible = bool;
		if (bool && !this.pos_is_set) this.pos_is_set = bool;
		// Ensure consistency if object is selected
		// if (this.is_selected) {
		// 	this.show_path_control_shapes(bool);
		// }

	}

	remove() {
		// this.editor.remove();
		let idx = -1;
		// Remove from all collections
		// Remove from all transformations
		this.poly.remove();
		ames.update_layers({"remove": true, "box": ames.obj_boxes_dict[this.name]});
	}

	// make_interactive: if true, enable interacitivty & open editor; otherwise disable and close
	make_interactive(bool) {
		this.select(bool);
		this.attach_interactivity(bool);
	}

	// attach_interactivity: if true, enable interactivity; otherwise disable
	attach_interactivity(bool) {
		if (this.poly) {
			if (bool) {
				this.poly.onMouseDown = (e) => {
					// Show only editors for this object
					ames.hide_editors(this);
					this.editor.show(true);
				}
				// select and de-select on click
				this.poly.onClick = (e) => {
					let toggle = !this.is_selected;
					this.select(toggle);
					// this.open_editor(toggle);
				}
			} else {
				this.poly.onClick = null;
				this.poly.onMouseDown = null;
			}
			// make all other handlers void;
			this.poly.onMouseDrag = null;

			// console.log("attaching interactivity?")

			// if (this.is_ames_path) {
			// 	this.poly.onMouseDrag = (e) => {
			// 		let nearest_point_on_path = this.poly.getNearestPoint(e.point);
			// 		let path_offset = this.poly.getOffsetOf(nearest_point_on_path);
			// 		console.log("event point / point on path / path offset / path length:", e.point, nearest_point_on_path, path_offset, this.poly.length);
			// 		console.log("path offset at point:", path_offset / this.poly.length);
			// 		console.log("path curvature at point:", this.poly.getCurvatureAt(path_offset))
			// 	}
			// }
		}
	}

	create_in_ames() {
		this.name = this.get_type() + " (" + this.get_type_count() + ")";
		this.increment_type_count();
		this.create_control_shapes();
		this.create_editor();
		ames.add_obj(this);
		this.make_interactive(true);
	}

	create_editor() {
		this.editor = new AMES_Shape_Editor(this);
		let bounds = this.editor.box.bounds
		let w = bounds.width/2 + utils.ICON_OFFSET*3 + 12.5;
		let x = ames.toolbar.get_position().x + w;
		let h = ames.canvas_view.size.height - 2*utils.ICON_OFFSET - bounds.height/2;
		this.editor.box.position = new Point(x, h);
	}

	clone(obj) {
		obj = Object.assign(obj, this);

		obj.poly = this.poly.clone({
			insert: false
		});

		obj.create_in_ames();
		return obj;
	}

}

// // Class: Square
// // ---------------------------------------------------------------------------
// // Description: Implementation of a square / rectangle
// export class AMES_Square extends AMES_Artwork {
// 	name = "Rectangle";
// 	shape_type = "Rectangle";
// 	is_ames_rectangle = true;
//
// 	constructor() {
// 		super();
// 		this.poly = new Shape.Rectangle({
// 			center: [this.pos.x, this.pos.y],
// 			radius: 2,
// 			fillColor: 'lavender',
// 			visible: true,
// 			strokeWidth: 1,
// 			strokeColor: 'darkgray'
// 		});
// 	}
// }

export class AMES_Polygon extends AMES_Artwork {
	static type_count = 1;
	name = "Polygon";
	shape_type = "Polygon";
	artwork_type = "Polygon";
	sides;
	radius;
	centroid;

	constructor(opt) {
		super();
		opt = opt || {};

		if (!opt.centroid) opt.centroid = ames.canvas_view.center;
		if (!opt.nsides) opt.nsides = 3;
		if (!opt.radius) opt.radius = 25;

		this.sides = opt.nsides;
		this.radius = opt.radius;
		this.centroid = opt.centroid;

		if (!opt.clone) {
			this.poly = new Path.RegularPolygon(opt.centroid, opt.nsides, this.radius);
			this.poly.strokeWidth = 1;
			this.poly.strokeColor = 'darkgray';
			this.to_path();
			this.create_in_ames();
		}

		this.cbs['nsides'] = this._nsides_cb;
	}

	_clear_cb_helpers() {
		super._clear_cb_helpers();
		this.editor.nsides.visible = false;
	}

	_nsides_cb(shape, cb_helpers, sub) {
		shape.editor.nsides.visible = true;
	}

	clone() {
		let opt = {"clone": true}
		let obj = new AMES_Polygon(opt);
		return super.clone(obj)
	}

	get_type_count() {
		return AMES_Polygon.type_count;
	}

	increment_type_count() {
		AMES_Polygon.type_count += 1;
	}

	set_number_of_sides(nsides) {
		let style = this.poly.style;
		let position = this.poly.position;
		let radius;
		// Find the radius (the distance between the centroid and the farthest)
		let n = this.poly.segments.length;
		let x_sum = 0;
		let y_sum = 0;
		for (let i = 0; i < n; i++) {
			x_sum += this.poly.segments[i].point.x;
			y_sum += this.poly.segments[i].point.y;
		}
		let centroid = new Point(x_sum / n, y_sum / n);
		let max_dist = 0;
		for (let i = 0; i < n; i++) {
			let p = this.poly.segments[i].point;
			let x = p.x - centroid.x;
			let y = p.y - centroid.y;
			let dist = Math.sqrt(x*x + y*y);
			if (dist > max_dist) radius = dist;
		}


		let new_poly = new Path.RegularPolygon(position, nsides, radius);
		new_poly.remove();
		this.poly = this.poly.replaceWith(new_poly);
		// console.log("replaced?", replaced);
		this.poly.style = style;

		if (nsides == 6 || nsides == 9) {
			this.poly.rotate(-90);
		}
		this.poly.position = position;
		this.sides = nsides;
	}

	get_radius_from_side_length(side_length, nsides) {
		return side_length / 2*Math.sin((180/nsides)*Math.PI/180);
	}
}


// Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle / ellipse
export class AMES_Ellipse extends AMES_Artwork {
	static type_count = 1;
	name = "Ellipse"
	shape_type = "Ellipse";
	artwork_type = "Ellipse";
	is_ames_ellipse = true;

	constructor(opt) {
		super();

		opt = opt || {};

		if (!opt.centroid) opt.centroid = ames.canvas_view.center;
		if (!opt.r) opt.r = 2;
		if (!opt.rx) opt.rx = opt.r;
		if (!opt.ry) opt.ry = opt.rx;

		if (!opt.clone) {
			this.poly = new Shape.Ellipse({
				center: [opt.centroid.x, opt.centroid.y],
				radius: [opt.rx, opt.ry],
				visible: true,
				strokeWidth: 1,
				strokeColor: 'darkgray'
			});
			this.poly.visible = true;
			this.to_path();
			this.poly.rotate(-90);
			this.create_in_ames();
		}
	}

	clone() {
		let opt = {"clone": true}
		let obj = new AMES_Ellipse(opt);
		return super.clone(obj)
	}

	get_type_count() {
		return AMES_Ellipse.type_count;
	}

	increment_type_count() {
		AMES_Ellipse.type_count += 1;
	}

}

// Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path
export class AMES_Artwork_Path extends AMES_Artwork {
	static type_count = 1;
	name = "Path";
	shape_type = "Path";
	artwork_type = "Path";
	bbox;
	is_ames_path = true;

	constructor(opt) {
		super();
		opt = opt || {};
		if (!opt.clone) {
			this.poly = new Path({
				strokeColor: 'darkgray',
				strokeWidth: 1,
				visible: true,
				fillColor: 'rgba(255, 0, 0, 0)'
			});
		}

	}

	clone() {
		let opt = {"clone": true};
		let obj = new AMES_Artwork_Path(opt);
		return super.clone(obj)
	}

	finish_creating_path() {
		console.log("finished path", this.name, this.poly);
		this.create_in_ames();
	}

	get_type_count() {
		return AMES_Artwork_Path.type_count;
	}

	increment_type_count() {
		AMES_Artwork_Path.type_count += 1;
	}

	add_points(points) {
		for (let i in points) {
			this.poly.add(points[i]);
		}
	}

	// update_bbox() {
	// 	this.bbox = new Path.Rectangle(this.poly.strokeBounds);
	// 	this.bbox.visible = true;
	// 	this.bbox.sendToBack();
	// 	this.bbox.fillColor = "lavender";
	// 	this.bbox.opacity = 0;
	// }

	make_path_helper() {
		// If last point is very close to the previous point close the path
		let thresh = 144; // 1f first and last pts are within 12px, seal curve
		let n_segs = this.poly.segments.length;
		if (n_segs > 2) { // Check there are at least 2 points in the line
			let a = this.poly.segments[n_segs-1].point;
			let b = this.poly.segments[0].point;
			if (utils.lengthsq(a.x, a.y, b.x, b.y) < thresh)
				this.poly.closed = true;
		}
		// Simplify, smooth & select path
		this.poly.simplify();
		this.poly.smooth();
		this.poly.fullySelected = false;
		this.pos = {'x': this.poly.position.x, 'y': this.poly.position.y};
		console.log(this.poly.strokeBounds)
		// on double tap open visual props
		this.update_bbox();
	}

}
