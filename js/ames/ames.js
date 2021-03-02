// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Circle, AMES_Path} from './shapes.js'
import {AMES_Sequence} from './sequences.js'

// Globals for ames
window.ames = {};
ames.tool;
ames.mode;
ames.edit_mode;
ames.canvas;
ames.canvas_cx;
ames.canvas_cy;

export class AMES {
	sequences = [];
	seq;
	// controls
	active_shape_btn;
	shape_make_btns = {
		'Circle': this.make_circle,
		'Path': this.make_path,
	};

	constructor() {
		// Create initial sequence
		this.seq = new AMES_Sequence();
		this.sequences.push(this.seq);
		ames.tool = new Tool();

	}
	// changeEditMode(ux_mode)
	// ------------------------------------------------------------------------
	// Description: Toggles mode from ELEMENT / LIST using UX buttons.
	static change_edit_mode = (ux_mode) => {
		console.log("changeEditMode:" + ux_mode);
		if (ux_mode != ames.edit_mode) {
			// Make previous mode button clickable
			if (ames.edit_mode) {
				// Remove ux active color indicator
				document.getElementById(utils.mode_btns[ames.edit_mode]).style.backgroundColor = null;
			}
			// Change mode
			ames.edit_mode = ux_mode;
			// Toggle new mode button color to active
			document.getElementById(utils.mode_btns[ames.edit_mode]).style.backgroundColor = utils.ACTIVE_COLOR;

			switch(ames.edit_mode) {
				case 'SHAPE':
					break;
				case 'CONSTRAINT':
					break;
				case 'ANIMATE':
					break;
				default: break;
			}
		}
	}

	// changeMode(ux_mode)
	// ------------------------------------------------------------------------
	// Description: Toggles mode from SHAPE / CONSTRAINT / ANIMATION using UX buttons.
	static change_mode = (ux_mode) => {
		console.log("changeMode:" + ux_mode);

		if (ux_mode != ames.mode) {
			// Make previous mode button clickable
			if (ames.mode) {
				// Remove ux active color indicator
				document.getElementById(utils.mode_btns[ames.mode]).style.backgroundColor = null;
			}
			// Change mode
			ames.mode = ux_mode;
			// Toggle new mode button color to active
			document.getElementById(utils.mode_btns[ames.mode]).style.backgroundColor = utils.ACTIVE_COLOR;

			switch(ames.mode) {
				case 'ELEMENT':
					break;
				case 'LIST':
					break;
				default: break;
			}
		}
	}

	make_circle(opt) {
		let b = "Circle";
		opt = opt || {};
		// If the button is active, deactivate it
		if (utils.is_active(b) || opt.deactivate) {
			console.log('makeSphere - deactivate');
			utils.deactivate(b);
			// Reset cursor
			ames.canvas.style.cursor = null;
			// Remove control
			ames.canvas.onclick = null;
			this.active_shape_btn = null;
		} else {
			// Turn off other active shape btns
			if (this.active_shape_btn) {
				this.shape_make_btns[this.active_shape_btn]({'deactivate': true});
			}
			console.log('makeSphere - activate');
			utils.activate(b);
			this.active_shape_btn = 'Circle';
			ames.canvas.style.cursor = 'crosshair';

			// Callback to make circle on click
			let cb_make_circle = (e) => {
				let c = new AMES_Circle();
				if (c.poly) {
					c.set_pos(utils.get_e_point(e));
					c.poly.visible = true;
					if (this.seq.shapes.hasOwnProperty(c.name)) {
						c.name = c.name + " " + AMES_Circle.count;
						AMES_Circle.count = AMES_Circle.count + 1;
					}
					this.seq.shapes[c.name] = c;
				}
			}
			ames.canvas.onclick = cb_make_circle;
		}
	}

	make_path(opt) {
		let b = 'Path';
		opt = opt || {};
		if (utils.is_active(b) || opt.deactivate) {
			console.log('make_path - deactivate');
			utils.deactivate(b);
			// Reset cursor
			ames.canvas.style.cursor = null;
			// Reset controls
			ames.tool.onMouseDown = null;
			ames.tool.onMouseUp = null;
			this.active_shape_btn = null;
		} else {
			// Turn off other active shape btns
			if (this.active_shape_btn) {
				this.shape_make_btns[this.active_shape_btn]({'deactivate': true});
			}
			console.log('make_path - activate');
			utils.activate(b);
			this.active_shape_btn = 'Path';
			ames.canvas.style.cursor = 'crosshair';

			let x;
			let cb_start_path = (e) => {
				console.log("cb_start_path");
				if (x) {
					x.poly.selected = false;
				}
				x = new AMES_Path();
				x.poly.visible = true;
				x.poly.fullySelected = true;
				ames.tool.onMouseDrag = cb_draw_path;
			}
			let cb_draw_path = (e) => {
				console.log("cb_draw_path");
				console.log(x.poly);
				x.poly.add(e.point);
			}
			let cb_simplify_path = (e) => {
				console.log("cb_show_path_segments")
				x.poly.strokeColor = 'lavender';
				x.poly.simplify();
				x.poly.smooth();
				x.poly.fullySelected = false;
				ames.tool.onMouseDrag = null;
				if (this.seq.shapes.hasOwnProperty(x.name)) {
					x.name = x.name + " " + AMES_Path.count;
					AMES_Path.count = AMES_Path.count + 1;
				}
				this.seq.shapes[x.name] = x;
			}
			ames.tool.onMouseDown = cb_start_path;
			ames.tool.onMouseUp = cb_simplify_path;
		}

	}

}
