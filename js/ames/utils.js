// ---------------------------------------------------------------------------
// utils.js
// Author: Sonia Hashim
//
// Description: AMES utilities
// ---------------------------------------------------------------------------
export class AMES_Utils {
	// General ui format elements
	static ACTIVE_COLOR = 'lavender';
	static INACTIVE_COLOR = 'white';
	static INACTIVE_DARK_COLOR = 'whitesmoke';
	static INACTIVE_S_COLOR = 'darkgray';
	static ACTIVE_S_COLOR = 'black';
	static SHAPE_PATH_COLOR = 'dodgerblue';
	static SHAPE_HIGHLIGHT_COLOR = 'aqua';
	static C_REFERENCE_HIGHLIGHT = 'orange';
	static C_RELATIVE_COLOR = 'mediumorchid';
	static LAYER_HEIGHT = 25;
	static ICON_OFFSET = 4;
	static FONT = 'Times';
	static FONT_SIZE = 10;

	// Layer box ui elements
	static L_CONTROLS = ["Shapes", "Lists", "Animations"];
	static L_IDX_BOX = 0;
	static L_IDX_NAME = 1;
	static L_IDX_TRASH = 2;
	static L_IDX_EYE = 3;
	static L_IDX_EYE_SLASH = 4;
	static L_IDX_ICONS = [2,3,4];
	static L_EXPAND_IDX = 2;
	static L_CONTRACT_IDX = 3;

	// Editor properties
	static VIS_PROPS = ["position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "path"];
	static SUB_PROPS = {
		"position" : [ "x", "y"],
		"scale": ["x", "y"],
		"rotation": ["t"],
		"fillColor": ["h", "s", "v", "a"],
		"strokeWidth": ["w"],
		"strokeColor": ["h", "s", "v", "a"],
		"path" : []
	}

	static shape_btns = {
		'Square' : 'btn-shape-square',
		'Circle' : 'btn-shape-circle',
		'Path' : 'btn-shape-path',
		'List': 'btn-list',
	}

	static btns = [this.shape_btns];

	static get_e_point(e) {
		return view.viewToProject(DomEvent.getOffset(e, ames.canvas));
	}

	static lengthsq(p1, p2) {
		let x1 = p1.x; let x2 = p2.x;
		let y1 = p1.y; let y2 = p2.y
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

	static make_dot(p) {
		let d = new Path.Circle(p, 2.5);
		d.fillColor = this.SHAPE_PATH_COLOR;
		return d;
	}

	static make_line(p1, p2) {
		let p = new Path.Line(p1, p2);
		p.strokeColor = this.SHAPE_PATH_COLOR;
		return p;
	}

	static make_rect(r, color) {
		if (!color) color = this.SHAPE_HIGHLIGHT_COLOR;
		let p = new Path.Rectangle(r);
		p.strokeColor = color;
		p.strokeWidth = 0.5;
		return p;
	}
}
