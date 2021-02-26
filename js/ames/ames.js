// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Circle} from './shapes.js'

// Globals for ames
window.ames = {};
ames.mode;
ames.edit_mode;
ames.canvas;
ames.canvas_cx;
ames.canvas_cy;

let shapes = [];

export class AMES {
	shapes = [];

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
			ames.canvas.onclick = null;
		} else {
			console.log('makeSphere - activate');
			utils.activate(b);
			ames.canvas.style.cursor = 'crosshair';
			let c = new AMES_Circle();
			// Callback to make circle on click
			let cb_make_circle = (e) => {
				if (c.poly && !c.is_made) {
					c.set_pos(utils.get_e_point(e));
					c.poly.visible = true;
					this.shapes.push(c);

					// reset c
					c = new AMES_Circle;
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
			// Reset cursor
			ames.canvas.style.cursor = null;
			ames.canvas.onclick = null;
		} else {
			console.log('make_path - deactivate');
			ames.canvas.style.cursor = 'crosshair';

			// let x = new AMES_Path();
			let cb_make_path = (e) => {
				// reset on double click
				console.log(e.detail);
			}
			ames.canvas.onclick = cb_make_path;
		}

	}

}
