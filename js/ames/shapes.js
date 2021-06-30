// ----------------------------------------------------------------------------
// shapes.js
// Author: Sonia Hashim
//
// Description: AMES basic geometry representations
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Constraint as constraint} from './constraints.js'
import {PropertyBox} from './propertybox.js'

// let cb_canvas_crosshair = (e) => {
// 	ames.canvas.style.cursor = 'crosshair';
// }

// Class: Shape
// ----------------------------------------------------------------------------
// Description: Basic shape representation with visual & temporal properties
export class AMES_Shape {
	// Display properties including name, visibility, layer
	name = "Shape";
	obj_type = "shape";
	visible = false;
	static count = 1;
	// Visual Properties: position, scale, rotate, stroke w, stroke c, fill
	pos = {x: ames.canvas_cy, y: ames.canvas_cy};
	scale = {x: 1, y: 1};
	visual_props = {'Position': this.pos, 'Scale': this.scale};
	// Shape geoemtry
	poly;
	// State
	is_selected = false;
	path_control_shapes = [];
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
	c_inbound = {
		"position" : {"all": null, "x": null, "y": null},
		"scale": {"all": null, "x": null, "y": null},
		"rotation": {"all": null, "t": null},
		"fillColor": {"all": null, "h": null, "s": null, "v": null},
		"strokeWidth": {"all": null, "w": null},
		"strokeColor": {"all": null, "h": null, "s": null, "v": null},
		"path" : {}
	}
	c_outbound = {
		"position" : {"all": [], "x": [], "y": []},
		"scale": {"all": [], "x": [], "y": []},
		"rotation": {"all": [], "t": []},
		"fillColor": {"all": [], "h": [], "s": [], "v": []},
		"strokeWidth": {"all": [], "w": []},
		"strokeColor": {"all": [], "h": [], "s": [], "v": []},
		"path" : {}
	}


	// update_pos(delta)
	// Description: Updates the position of the shape
	set_pos(p) {
		this.pos.x = p.x;
		this.pos.y = p.y;
		if (this.poly)
			this.poly.position = new Point(this.pos.x, this.pos.y);
	}

	// update_scale(f)
	// Description: Updates the scale of the shape by the given amount
	set_scale(fx, fy) {
		this.scale.x = fx*this.scale.x;
		this.scale.y = fy*this.scale.y;
		if (this.poly)
			this.poly.scale(fx, fy);

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

	// is_inside(p)
	// Description: Checks if the point p is within the bounding box of shape
	contains(p) {
		if (this.poly) {
			let bounds = this.poly.strokeBounds;
			if (!bounds) bounds = this.poly.bounds;
			return p.isInside(bounds);
		}
		return;
	}

	// manipulate: enable interaction on a given property with opt sub properties
	manipulate(p, sub) {
		this._clear_cb_helpers();
		// Turn off the active property
		if (this.active_prop) {
			// Remove subproperty buttons
			this.editor.show_subprops(this.active_prop, false);
			this.editor.select_prop(this.active_prop, false);
			if (p != 'path') this.editor.show_constraint(false);
		}
		// If the new propety is not the property just turned off, turn it on
		if (this.active_prop != p) {
			// Turn off selection toggle and hide path control shapes
			this.attach_interactivity(false);
			this.show_path_control_shapes(false);
			// Activate new propety callback
			this.cbs[p](this, this.cb_helpers);
			// Indicate active property and show subproperty buttons
			this.editor.show_subprops(p, true);
			this.editor.select_prop(p, true);
			let sub_p = 'all'
			if (p != 'path') this.editor.show_constraint(true, p, sub_p);
			this.active_prop = p;
			this.active_sub_p = sub_p;
		} else {
			// Turn selection toggle back on
			this.attach_interactivity(true);
			// Deactivate property and subproperty
			this.active_prop = null;
			this.active_sub_p = null;
		}
	}

	manipulate_helper(sub) {
		this._clear_cb_helpers();
		this.active_sub_p = sub;
		this.editor.show_constraint(true, this.active_prop, sub);
		this.cbs[this.active_prop](this, this.cb_helpers, sub);
	}

	update_constraints() {
		// console.log("shape updating constraint")
		let p = this.active_prop;
		let sub_p = this.active_sub_p;
		if (!sub_p) sub_p = 'all';
		console.log("update constraints for ", this.name,  p, sub_p);

		// Inbound: update offset
		console.log('updating inbound constraint - offset', this.c_inbound[p][sub_p]);
		let c_in = this.c_inbound[p][sub_p];
		if (c_in) c_in.calculate_offset();

		// Outbound: update values
		console.log("updating outbound constraint - values", this.c_outbound[p][sub_p]);
		let c_outbounds = this.c_outbound[p][sub_p];
		for (let idx in c_outbounds) {
			let c_out = c_outbounds[idx];
			c_out.update_value();
		}

		this.editor.update_constraint(p, sub_p);
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
		if (this.cb_helpers['path']) {
			this.show_path_control_shapes(false);
		}
		this.cb_helpers = {};
		this.cb_helpers['shapes'] = [];
	}

	_position_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			shape.poly.onMouseDown = (e) => {
				let pos = shape.poly.position;
				let offset = pos.subtract(e.point);

				if (sub && sub == 'x') cb_helpers['y'] = pos.y;
				if (sub && sub == 'y') cb_helpers['x'] = pos.x;

				cb_helpers['offset'] = offset;
			}
			shape.poly.onMouseDrag = (e) => {
				let offset = cb_helpers['offset'];
				let point = e.point.add(offset);

				if (sub && sub == 'x') point.y = cb_helpers['y'];
				if (sub && sub == 'y') point.x = cb_helpers['x'];

				if (offset) shape.set_pos(point);

				// Update constraints
				shape.update_constraints();
			}
		}
	}

	_scale_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			let bbox = shape.get_bbox();
			let scale_box = utils.make_rect(bbox, utils.SHAPE_PATH_COLOR);
			cb_helpers['shapes'].push(scale_box)
			let corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
			let dot_pairs = [2, 3, 0, 1];
			let scale_dots = [];
			for (let c in corners) {
				let d = utils.make_dot(corners[c]);
				scale_dots.push(d.clone());
				d.remove();
			}
			console.log(scale_dots);
			// Attach handlers to dots - calculate scale factor using distance to corners
			let bf = 1; let pf = 1;
			for (let d_idx = 0; d_idx < 4; d_idx++) {
				let d = scale_dots[d_idx];
				d.replaceWith(d.insertBelow(scale_box));
				let d_pair = scale_dots[dot_pairs[d_idx]];
				d.onMouseDown = (e) => {
					let b = shape.poly.position.subtract(d.position);
					bf = b.length;
					if (sub == 'x') bf = b.x;
					if (sub == 'y') bf = b.y;
				}
				d.onMouseDrag = (e) => {
					let p = shape.poly.position.subtract(e.point);
					let f = p.length/bf;

					// Scale shape and box
					if (sub == 'x') {
						f = p.x/bf;
						shape.set_scale((1/pf)*f, 1);
						scale_box.scale((1/pf)*f, 1);
					} else if (sub == 'y') {
						f = p.y/bf;
						shape.set_scale(1, (1/pf)*f);
						scale_box.scale(1, (1/pf)*f);
					} else {
						shape.set_scale((1/pf)*f, (1/pf)*f);
						scale_box.scale((1/pf)*f, (1/pf)*f);
					}
					console.log(f);
					pf = f;

					// Update dot position and scale_box
					d.position = scale_box.segments[d_idx].point;
					for (let n = 0; n < 4; n++) {
						scale_dots[n].position = scale_box.segments[n].point;
					}

					// Update constraints
					shape.update_constraints();
				}
				cb_helpers['shapes'].push(d);
			}
		}
	}

	_rotation_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			// Draw rotation guide
			let tc = shape.poly.bounds.topCenter;
			if (shape.strokeBounds) tc = shape.poly.strokeBounds.topCenter
			let line = utils.make_line(shape.poly.position, tc);
			let da = utils.make_dot(shape.poly.position);
			let dt = utils.make_dot(tc);
			da.scaling = 1.5;
			da.fillColor = utils.INACTIVE_COLOR;
			da.strokeColor = utils.SHAPE_PATH_COLOR;
			da.strokeWidth = 2;


			let anchor = shape.poly.position;
			let x_base = shape.poly.bounds.topCenter.subtract(anchor);


			let prev_ro = 0;
			let get_rotation_a = function(p, anchor) {
				let r_vec = p.subtract(anchor);
				let total_ro = x_base.getDirectedAngle(r_vec);
				let a = total_ro - prev_ro;
				prev_ro = prev_ro + a;
				return a;

			}

			// Update anchor point for rotation
			da.onMouseDrag = (e) => {
				da.position = e.point;
				// Update line
				line.firstSegment.point = e.point;
				// Update x_base and total rotation using new reference
				anchor = da.position;
				x_base = dt.position.subtract(anchor);
				prev_ro = 0;
			}

			// Rotate based on angle between subsequent rays created by dragging
			let ro;
			let ao;
			dt.onMouseDown = (e) => {
				ro = dt.position;
				ao = shape.poly.rotation;
				console.log(ao);
			}
			// Update rotation
			dt.onMouseDrag = (e) => {
				anchor = da.position;
				let a = get_rotation_a(e.point, anchor);
				shape.poly.rotate(a, anchor);

				// Rotate line
				line.rotate(a, anchor);
				// Update line segment to match dt
				dt.position = e.point
				line.lastSegment.point = dt.position;

				// Update constraints
				shape.update_constraints();
			}

			cb_helpers['shapes'].push(line, dt, da);

		}

	}

	_fill_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			let p = ames.colorpicker.get_position();
			ames.colorpicker.position = p;
			ames.colorpicker.visible = true;

			let color_function = (c) => {
				shape.poly.fillColor = c;
			}

			if (sub == 'h') {
				color_function = (c) => {
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

			ames.colorpicker.color_target = (c) => {
				color_function(c);
				// Update constraints
				shape.update_constraints();
			}
			cb_helpers['color_target'] = ames.colorpicker.color_target;
		}
	}

	_strokewidth_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			let yo;
			let w;
			shape.poly.onMouseDown = (e) => {
				yo = e.point.y;
				w = shape.poly.strokeWidth;
			}
			shape.poly.onMouseDrag = (e) => {
				console.log(.1*(yo - e.point.y));
				let nw = w + .1*(yo - e.point.y);
				if (nw <= 0) {
					shape.poly.strokeWidth = 0;
				} else {
					shape.poly.strokeWidth = nw;
				}

				// Update constraints
				shape.update_constraints();
			}
		}
	}

	_strokecolor_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			let p = ames.colorpicker.get_position();
			ames.colorpicker.position = p;
			ames.colorpicker.visible = true;

			let color_function = (c) => {
				shape.poly.strokeColor = c;
			}

			if (sub == 'h') {
				color_function = (c) => {
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

			ames.colorpicker.color_target = (c) => {
				color_function(c);

				// Update constraints
				shape.update_constraints();
			}
			cb_helpers['color_target'] = ames.colorpicker.color_target;
		}
	}

	_path_cb(shape, cb_helpers, sub) {
		if (shape.poly) {
			shape.update_path_control_shapes();
			shape.show_path_control_shapes(true);
			cb_helpers['path'] = true;
		}
	}



	// create_path_control_shapes: create path control objects
	create_path_control_shapes() {
		// for every segment in the path
		for (let i in this.poly.segments) {
			let s = this.poly.segments[i];

			// Create manipulable dots on the anchor point and handle endpoints
			// as well as handles connecting the anchor to the handle points
			let h1 = s.handleIn.add(s.point);
			let h2 = s.handleOut.add(s.point);
			let p1 = utils.make_line(h1, s.point);
			let p2 = utils.make_line(s.point, h2);
			let d = utils.make_dot(s.point);
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

	// select: if true, select object and opens editor; otherwise deselect and close
	select(bool) {
		if (this.poly) {
			// this.poly.fullySelected = bool;
			this.is_selected = bool;
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
				let n_h2 = s.handleOut.add(s.point);
				d_h1.position = n_h1;
				d_h2.position = n_h2;
				p1.firstSegment.point = n_h1;
				p1.lastSegment.point = s.point;
				p2.firstSegment.point = s.point;
				p2.lastSegment.point = n_h2;
			}
		}
	}

	// show_path_control_shapes: if true show shapes; otherwise hide
	show_path_control_shapes(bool) {
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
		if (this.poly) {
			let bbox = this.get_bbox();
			return utils.make_rect(bbox, color);
		}
		return null;
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

	set_name(n) {
		this.name = n;
	}


	// show: if true, show; otherwise hide
	show(bool) {
		this.show_editor(bool);
		this.visible = bool;
		this.poly.visible = bool;
		// Ensure consistency if object is selected
		// if (this.is_selected) {
		// 	this.show_path_control_shapes(bool);
		// }

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
				// select and de-select on click
				this.poly.onClick = (e) => {
					let toggle = !this.is_selected;
					this.select(toggle);
					// this.open_editor(toggle);
				}
			} else {
				this.poly.onClick = null;
			}
			// make all other handlers void;
			this.poly.onMouseDrag = null;
		}
	}

}

// Class: Square
// ---------------------------------------------------------------------------
// Description: Implementation of a square / rectangle
export class AMES_Square extends AMES_Shape {
	name = "Rectangle";

	constructor() {
		super();
		this.poly = new Shape.Rectangle({
			center: [this.pos.x, this.pos.y],
			radius: 2,
			fillColor: 'lavender',
			visible: true,
			strokeWidth: 1,
			strokeColor: 'darkgray'
		});
		this.visual_prop_box = new PropertyBox(this, this.visual_props);

		// On double click launch properties editor
		this.latest_tap;
		this.poly.on('click', e => {
			console.log("tap on ", this.name);
			let now = new Date().getTime();
			if (this.latest_tap) {
				let time_elapsed = now - this.latest_tap;
				// Double tap
				if (time_elapsed < 600 && time_elapsed > 0) {
					console.log("double tap on ", this.name);
					// In Shape mode, open shape editor
					if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
						this.visual_prop_box.show();
					}
				}
			}
			this.latest_tap = new Date().getTime();
		});
	}
}


// Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle / ellipse
export class AMES_Circle extends AMES_Shape {
	name = "Ellipse";

	constructor() {
		super();
		this.poly = new Shape.Circle({
			center: [this.pos.x, this.pos.y],
			radius: 2,
			fillColor: 'lavender',
			visible: true,
			strokeWidth: 1,
			strokeColor: 'darkgray'
		});
		this.visual_prop_box = new PropertyBox(this, this.visual_props);

		// On double click launch properties editor
		this.latest_tap;
		this.poly.on('click', e => {
			console.log("tap on ", this.name);
			let now = new Date().getTime();
			if (this.latest_tap) {
				let time_elapsed = now - this.latest_tap;
				// Double tap
				if (time_elapsed < 600 && time_elapsed > 0) {
					console.log("double tap on ", this.name);
					// In Shape mode, open shape editor
					if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
						this.visual_prop_box.show();
					}
				}
			}
			this.latest_tap = new Date().getTime();
		});
	}
}

// Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path
export class AMES_Path extends AMES_Shape {
	name = "Path";
	bbox;

	constructor() {
		super();
		this.poly = new Path({
			strokeColor: 'darkgray',
			strokeWidth: 1,
			visible: true,
			fullySelected: true
		});
		this.visual_prop_box = new PropertyBox(this, this.visual_props);
	}

	update_bbox() {
		this.bbox = new Path.Rectangle(this.poly.strokeBounds);
		this.bbox.visible = true;
		this.bbox.sendToBack();
		this.bbox.fillColor = "lavender";
		this.bbox.opacity = 0;
		// On double click launch properties editor
		this.latest_tap;
		this.bbox.on('click', e => {
			let nearpoint = this.poly.getNearestPoint(e.point);
			if (nearpoint.getDistance(e.point, true) > 50 ) return;
			let now = new Date().getTime();
			if (this.latest_tap) {
				let time_elapsed = now - this.latest_tap;
				// Double tap
				if (time_elapsed < 600 && time_elapsed > 0) {
					console.log("double tap on ", this.name);
					// In Shape mode, open shape editor
					if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
						this.visual_prop_box.show();
					}
				}
			}
			this.latest_tap = new Date().getTime();
		});
	}

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

	// set_pos(p) {
	// 	super.set_pos(p);
	// 	this.update_bbox();
	// }
	//
	// set_scale(f) {
	// 	super.set_scale(f);
	// 	this.update_bbox();
	// }

}
