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
	original_shapes = [];
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
		"position" : {"all": [], "x": [], "y": []},
		"scale": {"all": [], "x": [], "y": []},
		"rotation": {"all": [], "t": []},
		"fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		"strokeWidth": {"all": [], "w": []},
		"strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
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

	list_constraints = [];
	offset_mode = false;

	constructor(shapes) {
		this.box = new Group();
		let n_list = ames.n_lists;
		this.name = "List " + ames.n_lists;
		console.log("Setting list name", this.name);
		this.count = shapes.length;
		// Sort shapes by x_position
		shapes.sort((a, b) => a.pos.x - b.pos.x);
		console.log(shapes);

		for (let idx in shapes) {
			let s = shapes[idx];
			this.add_to_list(s);
		}

		this._make_show_box();

		if (!ames.mode) ames.mode = 'list';

		// TO DO: Make this touch screen friendly
		for (let i in this.shapes) {
			this.shapes[i].poly.on("doubleclick", (e) => {
				// Change offset mode for all lists that contain shape
				console.log(this.name, "changed offset mode to", !this.offset_mode);
				this.offset_mode = !this.offset_mode;
				this.update_offset_mode();
			})
		}

		console.log("printing all ",ames.n_lists," lists...");
		for (let i in ames.lists) {
			console.log(ames.lists[i].name, ames.lists[i].box.children);
		}

		this.active_obj = this.shapes[0];
	}

	update_offset_mode() {
		for (let i in this.list_constraints) {
			this.list_constraints[i].offset_mode = this.offset_mode;
		}
	}

	// show_editor: if true open editor; otherwise close;
	show_editor(bool) {
		if (this.editor) {
			this.editor.show(bool)
			this.show_box(bool);

			if (!bool) {
				if (this.active_prop) this.manipulate(this.active_prop);
			}
		}
	}

	// has_shape: returns whether or not the shape is in the list
	has_shape(x) {
		for (let i in this.shapes) {
			if (this.shapes[i] == x) return true;
		}
		return false;
	}


	add_to_list(s) {
		if (this.shapes.length > 0) {
			let fs = this.shapes[0];
			let ls = this.shapes[this.shapes.length - 1];
			// Remove constraint connecting ls to fs
			for (let i = 0; i < utils.VIS_PROPS.length; i++) {
				let p = utils.VIS_PROPS[i];
				if (p != 'path') {
					if (this.shapes.length > 1) {
						let oc;
						for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
							let sub = utils.SUB_PROPS[p][sub_idx];
							// console.log(sub);
							oc = ls.c_outbound[p][sub][fs.name];
							this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
							oc.remove();
						}
						oc = ls.c_outbound[p]['all'][fs.name];
						this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
						oc.remove();
					}

					let c_append = new AMES_Constraint(s, ls, p, 'all');
					let c_loop = new AMES_Constraint(fs, s, p, 'all');

					this.list_constraints.push(c_append);
					this.list_constraints.push(c_loop);

					for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
						let sub = utils.SUB_PROPS[p][sub_idx];
						this.list_constraints.push(s.c_inbound[p][sub][ls.name]);
						this.list_constraints.push(fs.c_inbound[p][sub][s.name]);
					}
				}
			}
		}
		this.shapes.push(s);
		s.add_list(this);
	}

	update_constraints() {
		AMES_List.update_constraints(this);
	}

	static update_constraints(list) {
		let s = list.active_sub_p;
		if (!s) s = "all";
		AMES_Constraint.update_constraints(list.active_prop, s, list);
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
		this.update_show_box_count();
		this.update_show_box_bounds();
	}

	update_show_box_bounds() {
		let TL = 1; let BL = 0;
		let bbox = this.get_bbox();
		// console.log(this.name, 'update_show_box', this.box.children);
		let x_off = 20 / (bbox.width + 20);
		let y_off = 20 / (bbox.height + 20);
		bbox = bbox.scale(1 + x_off, 1 + y_off);
		let is_visible = this.list_box.visible;
		this.list_box.remove();
		this.list_box = utils.make_rect(bbox, utils.LIST_HIGHLIGHT_COLOR);
		this.list_box.visible = is_visible;
		this.count_box.position = this.list_box.segments[BL].point.add(this.label_box_offset);
	}

	// update_show_box_count: updates count box value to match list count of items in list
	update_show_box_count() {
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
			point: [bbox.bottomLeft.x + utils.ICON_OFFSET, bbox.bottomLeft.y + utils.ICON_OFFSET*2.5],
			content: 'count:',
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			fillColor: utils.LIST_HIGHLIGHT_COLOR
		});
		let x = this.label_count.bounds.bottomRight.x + utils.ICON_OFFSET;
		this.text_count = new PointText({
			point: [x, bbox.bottomLeft.y + utils.ICON_OFFSET*2.5],
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
		let r_size = new Size(this.label_count.bounds.width + this.text_count.bounds.width + utils.ICON_OFFSET*5, this.label_count.bounds.height + utils.ICON_OFFSET);
		let r_count = new Rectangle(bbox.bottomLeft, r_size);
		console.log(r_size);
		console.log(r_count);
		this.label_box = utils.make_rect(r_count, utils.LIST_HIGHLIGHT_COLOR);
		this.count_box = new Group();
		this.count_box.addChildren([this.label_count, this.text_count, this.label_box]);
		let TL = 1;
		this.label_box_offset = this.label_box.position.subtract(this.label_box.segments[TL].point);
	}

	make_interactive() {
		console.log("To do -- List.make_interactive()");
	}

	manipulate(p, sub) {
		this._clear_cb_helpers();
		console.log("Manipulate list", p, sub);
		// Turn off the active property
		if (this.active_prop) {
			// Remove subproperty buttons
			this.editor.show_subprops(this.active_prop, false);
			this.editor.select_prop(this.active_prop, false);
			this.editor.show_constraint(false);
			for (let i in this.shapes) {
				if (this.shapes[i].active_prop == p)
					this.shapes[i].manipulate(p);
			}
		}
		// If the new propety is not the property just turned off, turn it on
		if (this.active_prop != p) {
			// Turn off selection toggle and hide path control shapes
			this.attach_interactivity(false);
			// this.show_path_control_shapes(false);
			// Activate new propety callback
			this.active_prop = p;
			let sub_p = 'all'
			this.active_sub_p = sub_p;

			for (let i in this.shapes) {
				console.log('...iterating over', this.shapes[i].name);
				if (this.shapes[i].active_prop == p) {
					this.shapes[i].manipulate_helper('all');
				} else {
						this.shapes[i].manipulate(p, sub);
			 	}
			}
			// this.cbs[p](this, this.cb_helpers);
			// Indicate active property and show subproperty buttons
			this.editor.show_subprops(p, true);
			this.editor.select_prop(p, true);
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

	set_active_obj(obj) {
		this.active_obj = obj;
		this.editor.update_constraint(this.active_prop, this.active_sub_p);
	}

	manipulate_helper(sub) {
		this._clear_cb_helpers();
		this.active_sub_p = sub;
		this.editor.show_constraint(true, this.active_prop, sub);
		for (let i in this.shapes) {
			this.shapes[i].manipulate_helper(sub);
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

	// attach_interactivity: if true, enable interactivity on child shapes; otherwise disable
	attach_interactivity(bool) {
		for (let i in this.shapes) {
			if (this.shapes[i].poly) {
				if (bool) {
					this.shapes[i].poly.onClick = (e) => {
						let toggle = !this.is_selected;
						this.select(toggle);
					}
				} else {
					this.shapes[i].poly.onClick = null;
				}
			}
			// Make all other handlers void
			this.shapes[i].poly.onMouseDrag = null;
		}
	}

	// select: if true, select object and opens editor; otherwise deselect and close
	select(bool) {
		if (this.poly) {
			// this.poly.fullySelected = bool;
			this.is_selected = bool;
		}
	}

	// contains: true if list contains point and point is not inside a shape of the list that
	// is currently active; false otherwise
	contains(p) {
		let b = this.list_box.strokeBounds;
		if (b) {
			let in_other_shape = false;
			if (p.isInside(b)) {
				for (let i in this.shapes) {
					let is_active = ames.active_objs[this.shapes[i].name];
					if (is_active && this.shapes[i].contains(p)) in_other_shape = true;
				}
				if (in_other_shape) return false;
				else return true;
			}

		}
		return false;
	}

	remove() {
		console.log("To do -- List.remove()");
	}

	make_list_group() {
		let box = new Group();
		for (let i in this.shapes) {
			box.addChild(this.shapes[i].poly);
		}
		return box;
	}

	empty_list_group(box) {
		for (let i in box.children) {
			box.children[i].addTo(ames.canvas_view._project);
		}
	}

	// get_bbox: returns the bounding box of the group containing the list items
	get_bbox() {
		let bbox;
		let box = this.make_list_group();
		if (box.strokeBounds) bbox = box.strokeBounds;
		else bbox = box.bounds;
		this.empty_list_group(box);
		return bbox;;
	}

	highlight(color) {
		let r = utils.make_rect(this.list_box.strokeBounds, color);
		r.insertBelow(this.list_box);
		return r;
	}

	get_closest_bbox_corner(p) {
		return null; // nb: better UX
	}

	// get_pos: returns position of list
	get_pos() {
		let box = this.make_list_group();
		let p = box.position;
		console.log(p);
		this.empty_list_group(box);
		return p;
	}

	show_path_control_shapes(bool) {};
}

export class AMES_Duplicator extends AMES_List {
	// Make control shapes list to control duplicator
	controls = {
		name: null,
		is_list: true,
		is_list_control: true,
		count: 0,
		shapes: [],
		parent: null,
		active_prop: null,
		active_sub_p: null,
		c_inbound: {
		   "position" : {"all": [], "x": [], "y": []},
		   "scale": {"all": [], "x": [], "y": []},
		   "rotation": {"all": [], "t": []},
		   "fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		   "strokeWidth": {"all": [], "w": []},
		   "strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		   "path" : {}
	   },
	   c_outbound: {
		   "position" : {"all": [], "x": [], "y": []},
		   "scale": {"all": [], "x": [], "y": []},
		   "rotation": {"all": [], "t": []},
		   "fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		   "strokeWidth": {"all": [], "w": []},
		   "strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
		   "path" : {}
	   },
	   update_constraints: function() {
		   this.active_prop = this.parent.active_prop;
		   this.active_sub_p = this.parent.active_sub_p;
		   AMES_List.update_constraints(this);
		},
	   list_constraints: [],
	   update_list_constraints: function() { AMES.update_list_constraints(this) },
	   update_show_box_bounds: function() {},
	   manipulate: function(p, sub) { console.log("here..."); },
	   manipulate_helper: function(sub) { console.log("here..."); },
	   set_active_obj: function(s) { this.active_obj = s; }
	};

	constructor(shapes) {
		super(shapes);

		// AMES_List(controls);

		// Initialize control list (for now just first / last)
		// TO DO change to all original shapes

		this.controls.parent = this;
		this.controls.name = this.name + " Controls";
		this.add_to_control_list(shapes[0]);
		this.add_to_control_list(shapes[shapes.length-1]);
		console.log(this.controls.shapes);

		// // Self constrain child list with all duplicator shapes to parent
		// for (let i = 0; i < utils.VIS_PROPS.length; i++) {
		// 	let p = utils.VIS_PROPS[i];
		// 	if (p != 'path') {
		// 		let c = new AMES_Constraint(this, this.controls, p, 'all');
		// 	}
		// }

		let c = new AMES_Constraint(this, this.controls, 'position', 'all');
		console.log("is self-referencing?", c.is_self_referencing);
		c.is_manual_constraint = true;
		this.active_prop = 'position';
		super.update_constraints();
		this.active_prop = null;
	}

	add_to_control_list(s) {
		let controls = this.controls;
		if (controls.shapes.length > 0) {
			let fs = controls.shapes[0];
			let ls = controls.shapes[controls.shapes.length - 1];
			// Remove constraint connecting ls to fs
			for (let i = 0; i < utils.VIS_PROPS.length; i++) {
				let p = utils.VIS_PROPS[i];
				if (p != 'path') {
					if (controls.shapes.length > 1) {
						let oc;
						for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
							let sub = utils.SUB_PROPS[p][sub_idx];
							oc = ls.c_outbound[p][sub][fs.name];
							controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
							oc.remove();
						}
						oc = ls.c_outbound[p]['all'][fs.name];
						controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
						oc.remove();
					}

					let c_append = new AMES_Constraint(s, ls, p, 'all');
					let c_loop = new AMES_Constraint(fs, s, p, 'all');

					controls.list_constraints.push(c_append);
					controls.list_constraints.push(c_loop);

					for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
						let sub = utils.SUB_PROPS[p][sub_idx];
						controls.list_constraints.push(s.c_inbound[p][sub][ls.name]);
						controls.list_constraints.push(fs.c_inbound[p][sub][s.name]);
					}
				}
			}
		}
		controls.count += 1;
		controls.shapes.push(s);
		s.add_list(controls);

		// TO DO: Make this touch screen friendly
		s.poly.on("doubleclick", (e) => {
			// Change offset mode for all lists that contain shape
			console.log(this.name, "changed offset mode to", !controls.offset_mode);
			controls.offset_mode = !this.offset_mode;
			this.update_controls_offset_mode();
		})
	}


	update_offset_mode() {
		super.update_offset_mode();
		this.controls.offset_mode = this.offset_mode;
	}

	update_controls_offset_mode() {

	}
}
