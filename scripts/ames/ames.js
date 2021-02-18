// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {Shape, Circle} from './shapes.js'

// Globals for ames
window.ames = {};
ames.mode;
ames.edit_mode;
ames.canvas;
ames.canvas_cx;
ames.canvas_cy;

let shapes = [];

export class AMES {

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

	static make_sphere(s) {
		console.log('makeSphere');
		let c = new Circle();
		c.make_shape();
	}
}
