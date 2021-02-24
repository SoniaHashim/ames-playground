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

	static get_e_point(e) {
		// console.log('utils.get_e_point', e);
		// let p = view.viewToProject(DomEvent.getOffset(e, ames.canvas));
		// console.log('utils.get_e_point', p);
		return view.viewToProject(DomEvent.getOffset(e, ames.canvas));
	}

	static lengthsq(x1, y1, x2, y2) {
		return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
	}
}
