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
	is_shape = false;
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
	list_constraints;

	constructor(shapes) {
		this.count = shapes.length;
		// Sort shapes by x_position
		shapes.sort((a, b) => a.pos.x - b.pos.x);
		console.log(shapes);

		this.first_last.push(shapes[0]);
		if (shapes.length > 1) this.first_last.push(shapes[shapes.length-1]);

		this.box = new Group();
		for (let idx in shapes) {
			let s = shapes[idx];
			this.add_to_list(s);
		}

		this._make_show_box();

		this.poly = this.box;
	}

	add_to_list(s) {
		console.log('add_to_list', s)
		if (this.shapes.length > 0) {
			let fs = this.shapes[0];
			let ls = this.shapes[this.shapes.length - 1];
			// Remove constraint connecting ls to fs
			console.log("linking", ls.name, s.name);
			console.log("linking", s.name, fs.name);
			for (let i = 0; i < utils.VIS_PROPS.length; i++) {
				let p = utils.VIS_PROPS[i];
				console.log(p);
				if (p != 'path') {
					if (this.shapes.length > 1) {
						let oc = fs.c_outbound[p]['all'][ls.name];
						oc.remove();
					}
					let c_append = new AMES_Constraint(ls, s, p, 'all');
					let c_loop = new AMES_Constraint(s, fs, p, 'all');
				}
			}
			console.log("first inbound constraint", fs.c_inbound['position']['all']);
		}
		this.shapes.push(s);
		s.add_list(this);
		console.log('shapes: ', this.shapes);
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

		this._clear_cb_helpers();
		// Turn off the active property
		if (this.active_prop) {
			// Remove subproperty buttons
			this.editor.show_subprops(this.active_prop, false);
			this.editor.select_prop(this.active_prop, false);
			this.editor.show_constraint(false);
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
			this.editor.show_constraint(true, p, sub_p);
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
		if (this.cb_helpers['path']) this.show_path_control_shapes(false);
		if (this.cb_helpers['scale']) this.show_scale_control_shapes(false);
		if (this.cb_helpers['rotation']) this.show_rotation_control_shapes(false);
		this.cb_helpers = {};
		this.cb_helpers['shapes'] = [];
	}

	// attach_interactivity: if true, enable interactivity; otherwise disable
	attach_interactivity(bool) {
		for (let i in shapes) {
			if (shapes[i].poly) {
				if (bool) {
					shapes[i].poly.onClick = (e) => {
						let toggle = !this.is_selected;
						this.select(toggle);
					}
				} else {
					shapes[i].poly.onClick = null;
				}
			}
			// Make all other handlers void
			shapes[i].poly.onMouseDrag = null;
		}
	}

	manipulate_helper(sub) {
		console.log("To do -- List.manipulate_helper()")
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
