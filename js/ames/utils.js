// ---------------------------------------------------------------------------
// utils.js
// Author: Sonia Hashim
//
// Description: AMES utilities
// ---------------------------------------------------------------------------
export class AMES_Utils {
	static ACTIVE_COLOR = 'lavender';
	static INACTIVE_COLOR = 'black';

	static mode_btns = {
		'SHAPE' : 'btn-mode-shape',
		'CONSTRAINT': 'btn-mode-constraint',
		'ANIMATE': 'btn-mode-animate',
		'ELEMENT': 'btn-mode-element',
		'LIST': 'btn-mode-list'
	};

	static shape_btns = {
		'Circle' : 'btn-shape-circle',
		'Path' : 'btn-shape-path'
	}

	static btns = [this.mode_btns, this.shape_btns];

	static get_e_point(e) {
		// console.log('utils.get_e_point', e);
		// let p = view.viewToProject(DomEvent.getOffset(e, ames.canvas));
		// console.log('utils.get_e_point', p);
		return view.viewToProject(DomEvent.getOffset(e, ames.canvas));
	}

	static lengthsq(x1, y1, x2, y2) {
		return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
	}

	static is_active(b) {
		let btn = this.get_button(b);
		if (btn) return btn.style.backgroundColor == this.ACTIVE_COLOR;
	}

	static deactivate(b) {
		let btn = this.get_button(b);
		if (btn) btn.style.backgroundColor = null;
	}

	static activate(b) {
		let btn = this.get_button(b);
		console.log(btn);
		if (btn) btn.style.backgroundColor = this.ACTIVE_COLOR;
	}

	// get_buttons(b)
	// Returns the button given the value of the button b if it's defined in a btn list
	static get_button(b) {
		console.log("get_button: ", b);
		for (let i = 0; i < this.btns.length; i++) {
			let btn_list = this.btns[i];
			if (btn_list.hasOwnProperty(b)) {
				return document.getElementById(btn_list[b]);
			}
		}
		return null;
	}

	static cb_canvas_crosshair(e) {
		ames.canvas.style.cursor = 'crosshair';
	}
}
