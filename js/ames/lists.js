// ----------------------------------------------------------------------------
// lists.js
// Author: Sonia Hashim
//
// Description: AMES list data structure and list editor
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'
import {AMES_Constraint} from './constraints.js'
import {AMES_Shape} from './shapes.js'

export class AMES_List {
	name = "List";
	is_list = true;
	shapes = [];
	count = 1;
	box;
	editor;
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
		"fillColor": {"all": null, "h": null, "s": null, "v": null, "a": null},
		"strokeWidth": {"all": null, "w": null},
		"strokeColor": {"all": null, "h": null, "s": null, "v": null, "a": null},
		"path" : {}
	}
	c_outbound = {
		"position" : {"all": [], "x": [], "y": []},
		"scale": {"all": [], "x": [], "y": []},
		"rotation": {"all": [], "t": []},
		"fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		"strokeWidth": {"all": [], "w": []},
		"strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		"path" : {}
	}
	first_last = [];

	constructor(shapes) {
		this.count = shapes.length;

		this.first_last.push(shapes[0]);
		if (shapes.length > 1) this.first_last.push(shapes[shapes.length-1]);

		this.box = new Group();
		for (let idx in shapes) {
			let s = shapes[idx];
			this.add_to_list(s);
		}

		// constrain shapes to the list (one to many constraint)

		this._make_show_box();
	}

	add_to_list(s) {
		console.log('add_to_list', s)
		if (this.shapes.length > 0) {
			let fs = this.shapes[0];
			let ls = this.shapes[this.shapes.length - 1];
			// Remove constraint connecting ls to fs
			for (let i = 0; i < utils.VIS_PROPS.length; i++) {
				let p = utils.VIS_PROPS[i];
				console.log(p);
				if (p != 'path') {
					if (this.shapes.length > 1) {
						let ref_list = ls.c_outbound[p]['all'];
						let oc_idx = ref_list.indexOf(fs.name);
						let oc = ref_list[oc_idx];
						ls.c_outbound[p]['all'].splice(ref_list.indexOf(fs.name), 1);
						oc_idx.remove();
					}
					let c1 = new AMES_Constraint(ls, s, p, 'all');
					let c2 = new AMES_Constraint(s, fs, p, 'all');
					console.log(p, c1.reference.name, c1.relative.name);
					console.log(p, c2.reference.name, c2.relative.name);
				}
			}
		}
		this.shapes.push(s);
		this.box.addChild(s.poly)
	}

	get_shape_names() {
		let str = "";
		for (let idx in this.shapes) {
			if (idx != 0 && idx != this.shapes.length) str += ", ";
			str += this.shapes[idx].name;
		}
		return str;
	}

	// show: if true, show; otherwise hide
	show(bool) {
		this.show_editor(bool);

		if (bool) {
			this._update_list();
		}
	}

	// _update_list: updates the artwork that the list contains
	_update_list() {
		// Use functions based on self-referencing constraints to define
		// visual artwork in the list
		for (let idx = 0; idx < this.count; idx++) {
			// Create symbol using shape function
			// let s = this._get_shape(idx);
			// Set position
			// Set rotation
		}
	}

	remove_item() {
		if (this.count == 1) return;
		this.count = this.count - 1;
		this.update_show_box();
	}

	add_item() {
		this.count = this.count + 1;
		this.update_show_box();
	}

	show_box(bool) {
		// Highlight list and update bbox if necessary
		this.list_box.visible = bool;
		this.label_box.visible = bool;
		this.label_count.visible = bool;
		this.text_count.visible = bool;
	}

	update_show_box() {
		this.text_count.content = this.count;
	}

	_make_show_box() {
		let bbox = this.get_bbox();
		let x_off = 20 / (bbox.width + 20);
		let y_off = 20 / (bbox.height + 20);
		bbox = bbox.scale(1 + x_off, 1 + y_off);
		this.list_box = utils.make_rect(bbox, utils.LIST_HIGHLIGHT_COLOR);
		this.list_box.visible = false;


		this.label_count = new PointText({
			point: [bbox.bottomLeft.x + utils.ICON_OFFSET, bbox.bottomLeft.y + utils.ICON_OFFSET*2],
			content: 'count:',
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			fillColor: utils.LIST_HIGHLIGHT_COLOR
		});
		let x = this.label_count.bounds.bottomRight.x + utils.ICON_OFFSET;
		this.text_count = new PointText({
			point: [x, bbox.bottomLeft.y + utils.ICON_OFFSET*2],
			content: this.count,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			fillColor: utils.LIST_HIGHLIGHT_COLOR
		});
		this.text_count.onMouseDown = (e) => {
			ames.canvas.style.cursor = 'move';
		}
		let total_drag = 0;
		this.text_count.onMouseDrag = (e) => {
			// ames.canvas.style.cursor = null;
			total_drag += e.event.movementX;
			if (total_drag < 0) ames.canvas.style.cursor = 'w-resize';
			if (total_drag > 0) ames.canvas.style.cursor = 'e-resize';
			if (total_drag < -5) {
				this.remove_item();
				total_drag = 0;
			}
			if (total_drag > 5) {
				this.add_item();
				total_drag = 0;
			}
		}
		this.text_count.onMouseUp = (e) => {
			ames.canvas.style.cursor = null;

		}
		console.log('count', '' + this.count);
		let r_size = new Size(this.label_count.bounds.width + this.text_count.bounds.width + utils.ICON_OFFSET*4, this.label_count.bounds.height + utils.ICON_OFFSET/2);
		let r_count = new Rectangle(bbox.bottomLeft, r_size);
		console.log(r_size);
		console.log(r_count);
		this.label_box = utils.make_rect(r_count, utils.LIST_HIGHLIGHT_COLOR);
	}

	show_editor(bool) {
		if (this.editor) {
			this.editor.show(bool);
			if (!bool) {
				// Something with active prop?
			}
		}
	}

	make_interactive() {
		console.log("To do -- List.make_interactive()");
	}

	manipulate() {
		console.log("To do -- manipulate()");
	}

	contains() {
		console.log("To do -- List.contains()");
	}

	remove() {
		console.log("To do -- List.remove()");
	}

	// get_bbox: returns the bounding box of the group containing the list items
	get_bbox() {
		if (this.count > 0) {
			if (this.box.strokeBounds) return this.box.strokeBounds;
			else return this.box.bounds;
		}
		return;
	}

	// get_pos: returns position of list
	get_pos() {
		return this.box.position;
	}
}
