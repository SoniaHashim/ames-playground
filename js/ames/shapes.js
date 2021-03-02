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
}

// Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle
export class AMES_Circle extends AMES_Shape {
	name = "Circle";

	constructor() {
		super();
		this.poly = new Shape.Circle({
			center: [this.pos.x, this.pos.y],
			radius: 50,
			fillColor: 'lavender',
			visible: false
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
	make_shape() {
		console.log('makeShape');
		if (this.poly && !this.poly.visible) {
			// Show crosshair cursor
			ames.canvas.addEventListener('mouseover', cb_canvas_crosshair);
			// On 1st click, set the center of the circle
			let cb_make_shape_on_click = (e) => {
				this.set_pos( utils.get_e_point(e));
				this.poly.visible = true;
				this.is_made = true;
				// Fire a is made signal to reset

				// Remove crosshair cursor
				ames.canvas.style.cursor = 'default';
				ames.canvas.removeEventListener('mouseover', cb_canvas_crosshair);

				// Remove make circle listener
				ames.canvas.removeEventListener('click', cb_make_shape_on_click);
			}
			ames.canvas.addEventListener('click', cb_make_shape_on_click);
		}
	}
}

// Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path
export class AMES_Path extends AMES_Shape {
	name = "Path";

	constructor() {
		super();
		this.poly = new Path({
			strokeColor: 'black',
			strokeWidth: 1.5,
			visible: true,
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

	make_shape() {
		console.log("override");
	}

}
