// ----------------------------------------------------------------------------
// shapes.js
// Author: Sonia Hashim
//
// Description: AMES basic geometry representations
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {PropertyBox} from './propertybox.js'

let cb_canvas_crosshair = (e) => {
	ames.canvas.style.cursor = 'crosshair';
}

// Class: Shape
// ----------------------------------------------------------------------------
// Description: Basic shape representation with visual & temporal properties
export class AMES_Shape {
	// Display properties including name, visibility, layer
	name = "Shape"
	visible = false;
	static count = 1;
	// Visual Properties: position, scale, rotate, stroke w, stroke c, fill
	pos = {x: ames.canvas_cy, y: ames.canvas_cy};
	scale = {x: 1, y: 1};
	visual_props = {'Position': this.pos, 'Scale': this.scale};
	// Temporal Properties: length
	length = 2000;
	temporal_properties = {'Length': this.length};
	// Shape geoemtry
	poly;
	// State
	is_selected = false;
	path_control_shapes = [];

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
	set_scale(f) {
		this.scale.x = f*this.scale.x;
		this.scale.y = f*this.scale.y;
		if (this.poly)
			this.poly.scale(f, f);

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
		console.log("Manipulate ", p);
	}

	// create_path_control_shapes: create path control objects
	create_path_control_shapes() {
		// for every segment in the path
		for (let i in this.poly.segments) {
			console.log("here");
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
			this.editor.open(bool)
		}
	}

	// select: if true, select object and opens editor; otherwise deselect and close
	select(bool) {
		if (this.poly) {
			// this.poly.fullySelected = bool;
			this.is_selected = bool;

			// If path is selected enable editability on shape
			if (this.is_selected) {
				// update & show path control shapes
				for (let i in this.path_control_shapes) {
					let s = this.poly.segments[i];
					let controls = this.path_control_shapes[i];
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

			this.show_path_control_shapes(bool);
		}
	}

	// show_path_control_shapes: if true show shapes; otherwise hide
	show_path_control_shapes(bool) {
		for (let i in this.path_control_shapes) {
			let controls = this.path_control_shapes[i];
			for (let j in controls) {
				controls[j].visible = bool;
			}
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
		console.log("Shape.show() " + bool);
		this.visible = bool;
		this.poly.visible = bool;
		this.show_editor(bool);
		// Ensure consistency if object is selected
		if (this.is_selected) {
			this.show_path_control_shapes(bool);
		}

	}

	// make_interactive: if true, enable interacitivty & open editor; otherwise disable and close
	make_interactive(bool) {
		this.select(bool);
		this.attach_interactivity(bool);
		this.open_editor(bool);
	}

	// attach_interactivity: if true, enable interactivity; otherwise disable
	attach_interactivity(bool) {
		if (this.poly) {
			if (bool) {
				this.poly.onClick = (e) => {
					let toggle = !this.is_selected;
					this.select(toggle);
					this.open_editor(toggle);
				}
			} else {
				this.poly.onClick = null;
			}
		}
	}

	// open_editor: if true, open; otherwise close
	open_editor(bool) {
		console.log("Shape.open_editor() - to do ");
		if (bool) {

		} else {

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

	// make_shape
	// Description: Creates a new shape
	// make_shape() {
	// 	console.log('makeShape');
	// 	if (this.poly && !this.poly.visible) {
	// 		// Show crosshair cursor
	// 		ames.canvas.addEventListener('mouseover', cb_canvas_crosshair);
	// 		// On 1st click, set the center of the circle
	// 		let cb_make_shape_on_click = (e) => {
	// 			this.set_pos( utils.get_e_point(e));
	// 			this.poly.visible = true;
	// 			this.is_made = true;
	// 			// Fire a is made signal to reset
	//
	// 			// Remove crosshair cursor
	// 			ames.canvas.style.cursor = 'default';
	// 			ames.canvas.removeEventListener('mouseover', cb_canvas_crosshair);
	//
	// 			// Remove make circle listener
	// 			ames.canvas.removeEventListener('click', cb_make_shape_on_click);
	// 		}
	// 		ames.canvas.addEventListener('click', cb_make_shape_on_click);
	// 	}
	// }
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

	set_pos(p) {
		super.set_pos(p);
		this.update_bbox();
	}

	set_scale(f) {
		super.set_scale(f);
		this.update_bbox();
	}

}
