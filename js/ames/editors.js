// ----------------------------------------------------------------------------
// lists.js
// Author: Sonia Hashim
//
// Description: AMES list data structure and list editor
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Square, AMES_Circle, AMES_Path} from './shapes.js'


export class AMES_Shape_Editor {
	box;
	box_width;
	obj;
	props = {};
	subprops = {};
	constraint_info = {};

	selected_subprop;
	selected_prop;


	constructor(obj) {
		let props = utils.VIS_PROPS;

		let box = new Group();

		// background rectangle
		let e_width = 150;
		this.box_width = e_width;
		let e_height = 125;
		let rect = new Shape.Rectangle({
			point: [0, 0],
			size: [e_width, e_height],
			fillColor: utils.INACTIVE_COLOR,
			strokeWidth: 1,
			strokeColor: utils.INACTIVE_S_COLOR,
			opacity: 0.5
		});
		box.addChild(rect);

		// Add obj name
		let by = utils.LAYER_HEIGHT;
		let n_text = new PointText({
			point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
			content: obj.name,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		box.addChild(n_text);
		// Close icon
		let close_button = ames.icons["close"].clone();
		close_button.scaling = 0.75;
		let close_w = close_button.bounds.width;
		close_button.position = new Point(e_width - utils.ICON_OFFSET - close_w/2, by/2 - close_w/2);
		close_button.visible = true;
		close_button.onClick = (e) => {
			this.show(false);
			// Disable property interactivity if any
			if (obj.active_prop) {
				obj.manipulate(this.obj.active_prop)
			}
			// Deselect any active properties
			if (this.selected_prop) this.select_prop(this.selected_prop, false);
			if (this.selected_subprop) this.select_subprop(this.selected_subprop, false);
		}
		box.addChild(close_button);

		// create all sub-property box
		this._make_subprop('all', 0, box);

		// Create property buttons
		let properties = utils.VIS_PROPS;
		for (let idx in properties) {
			let p = properties[idx];
			let button = ames.icons[p].clone();
			let b_w = button.bounds.width;
			button.position = new Point(2*utils.ICON_OFFSET + idx*(utils.ICON_OFFSET + b_w) + b_w/2, by*1.75);
			button.visible = true;

			// create subproperty boxes
			let p_subprops = utils.SUB_PROPS[p];
			// note: index is incremented to account for all subproperty box
			for (let s_idx = 1; s_idx <=  p_subprops.length; s_idx++) {
				let s = p_subprops[s_idx-1];
				// Make a new subproperty box if necessary
				this._make_subprop(s, s_idx, box);
			}

			// Clicking enables intearctivity on selected trait
			button.onClick = (e) => {
				obj.manipulate(p, 'all');
			}

			// Add button to editor
			box.addChild(button);
			this.props[p] = button;
		}

		obj.editor = this;
		this.box = box;
		this.obj = obj;

		// Initialize editor
		this.set_editor_pos();

		// Make editor draggable
		let dragging = false;
		let drag_offset = 0;
		box.onMouseDown = (e) => {
			let n_children = box.children.length;
			for (let idx = 1; idx < n_children; idx++) {
				let c = box.children[idx];
				if (c.contains(e.point)) {
					dragging = false;
					return;
				}
			}
			drag_offset = e.point.subtract(box.position);
			dragging = true;
		}
		box.onMouseDrag = (e) => {
			if (dragging) box.position = e.point.subtract(drag_offset);
		}
		box.onMouseUp = (e) => {
			if (dragging) dragging = false;
		}
	}

	// show_subprops: if true, show subproperty boxes for a given property; otherwise hide
	show_subprops(p, bool) {
		let p_subprops = utils.SUB_PROPS[p];
		// open appropriate subproperty boxes
		for (let s_idx in p_subprops) {
			let s = p_subprops[s_idx];
			let sub = this.subprops[s];
			if (sub) {
				let s_text = sub[0];
				let s_box = sub[1];
				s_text.visible = bool;
				s_box.visible = bool;

				// If the subproperties are not being shown, deselect them if selected
				if (!bool) {
					if (this.selected_subprop == s) {
						this.select_subprop(s, false);
					}
				}
			}
		}

		// If the subprops are being shown, select & activate 'all'
		this.select_subprop('all', bool);
	}

	// _make_subprop: makes a subproperty box for the appropriate element
	_make_subprop(s, s_idx, box) {
		// Calculate offset for property boxes after all
		let offset = 0;
		if (s != 'all') {
			let all_box = this.subprops['all'][1];
			let x = all_box.position.x;
			let w = all_box.bounds.width;
			offset = s_idx*2.25*utils.ICON_OFFSET + s_idx*3.5*utils.ICON_OFFSET;

		}
		let subprop_text = new PointText({
			point: [2.25*utils.ICON_OFFSET + offset, utils.LAYER_HEIGHT*2.75],
			content: s,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		let t_width = subprop_text.bounds.width;
		let t_height = subprop_text.bounds.height;
		let subprop_box = new Shape.Rectangle({
			point: [subprop_text.position.x - .5*(t_width + utils.ICON_OFFSET), subprop_text.position.y - t_height + utils.ICON_OFFSET/2],
			size: [Math.max(t_width, t_height)+utils.ICON_OFFSET, t_height+utils.ICON_OFFSET],
			strokeWidth: .5,
			strokeColor: utils.INACTIVE_S_COLOR
		});
		// Center text for subproperty boxes after all and hide the subproperty box
		if ( s != 'all') {
			let x = subprop_text.position.x;
			if (s == 'w') x -= 2.5; // svg text alignment is challenging
			if (s == 't') x += 2.5; // svg text alignment is challenging
			subprop_text.point.x = x;
			subprop_text.visible = false;
			subprop_box.visible = false;
		}
		// Additional visual elements should be created once
		if (s == 'all') {
			// Make subproperty line after making first subproperty box
			let subline_start = subprop_box.bounds.bottomLeft;
			let subline_end = subline_start.add(new Point(this.box_width-2*subline_start.x,0))
			let subprop_line = new Path.Line(subline_start, subline_end);
			subprop_line.strokeColor = utils.INACTIVE_S_COLOR;
			subprop_line.strokeWidth = 1;
			subprop_line.opacity = 0.5;
			box.addChild(subprop_line);

			// Make and hide link and unlink buttons
			let link = ames.icons['link'].clone();
			link.scaling = 1.25;
			link.position = new Point(3.5*utils.ICON_OFFSET, utils.LAYER_HEIGHT*3.5);
			link.visible = true;
			link.strokeWidth = .25;
			let link_remove = ames.icons['link-remove'].clone();
			link_remove.scaling = 1.25;
			link_remove.position = link.position;
			link_remove.visible = false;
			link_remove.strokeWidth = .25;
			// When the link button is clicked activate constraint tool
			link.onMouseDown = (e) => {
				ames.c_relative = this.obj;
				ames.tools['Constraint'].activate();
				// Little workaround... to start drawing line that defines constraint
				ames.tools['Constraint'].onMouseDown(e);
				ames.tools['Constraint'].onMouseDrag(e);
				link.strokeColor = utils.ACTIVE_S_COLOR;
			}
			link_remove.onMouseDown = (e) => {
				console.log("link remove constraint");
				let p = this.obj.active_prop;
				let s = this.obj.active_sub_p;
				if (!s) s = "all";
				let c = this.obj.c_inbound[p][s];
				if (c) {
					c.remove();
				}
			}
			this.constraint_info.link = link;
			this.constraint_info.link_remove = link_remove;
			// Name of relative that defines the constraint
			let link_name = new PointText({
				point: [link.position.x + 3*utils.ICON_OFFSET, link.position.y + link.bounds.height/4],
				content: 'Constraint',
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,
			});
			this.constraint_info.link_name = link_name;
			let offset_label = new PointText({
				point: [subline_start.x + utils.ICON_OFFSET, link.position.y + 5*utils.ICON_OFFSET],
				content: 'relative offset',
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,
			});
			this.constraint_info.offset_label = offset_label;
			let offset_val = new PointText({
				point: [subline_start.x + offset_label.bounds.width + 2.5*utils.ICON_OFFSET, link.position.y + 5*utils.ICON_OFFSET],
				content: '10',
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,
			});
			this.constraint_info.offset_val = offset_val;
			let ox = offset_val.position.x; let oy = offset_val.position.y + offset_val.bounds.height/2;
			let offset_line = new Path.Line(new Point(ox - 1.25*utils.ICON_OFFSET, oy), new Point(ox + 6*utils.ICON_OFFSET, oy));
			offset_line.strokeColor = utils.INACTIVE_S_COLOR;
			offset_line.strokeWidth = 1;
			offset_line.opacity = 0.5;
			this.constraint_info.offset_line = offset_line;
			box.addChildren([link, link_name, offset_label, offset_val, offset_line, link_remove]);
			this.show_constraint(false);

		}
		// When the subproperty is clicked enable editing on it
		subprop_box.onClick = (e) => {
			this.select_subprop(s, true);
			this.obj.manipulate_helper(s);
		}
		subprop_text.onClick = (e) => {
			this.select_subprop(s, true);
			this.obj.manipulate_helper(s);
		}
		box.addChild(subprop_text);
		box.addChild(subprop_box);
		this.subprops[s] = [subprop_text, subprop_box];
	}

	// _show_constraint
	show_constraint(bool, p, sub_p) {
		if (p == 'path') { console.log("here"); bool = false;}

		for (let k in this.constraint_info) {
			this.constraint_info[k].visible = bool;
		}
		// Hide link remove button
		this.constraint_info.link_remove.visible = false;
		// Show link remove button if there is an active constraint
		if (bool && this.obj) {
			let s = sub_p;
			if (!s) s = "all";
			let c = this.obj.c_inbound[p][s];
			if (c) {
				this.constraint_info.link_remove.visible = true;
				this.constraint_info.link.visible = false
			}
		}

		if (sub_p == 'all') {
			this.constraint_info['offset_label'].visible = false;
			this.constraint_info['offset_val'].visible = false;
			this.constraint_info['offset_line'].visible = false;
		}

		// Update property value
		if (bool) this.update_constraint(p, sub_p);
	}

	update_constraint(p, s) {
		if (!p) p = this.obj.active_prop;
		if (!s) s = this.obj.active_sub_p;
		if (!s) s = "all"

		let link_name = 'Unconstrained';
		let offset_val = 0;

		let c = null;
		if (p) {
			c = this.obj.c_inbound[p][s];
			if (c) {
				link_name = c.reference.name;

				if (s != "all") {
					offset_val = c.offset.toFixed(2);
				}
				// Show unlink button
				this.constraint_info.link.visible = false;
				this.constraint_info.link_remove.visible = true;
			} else {
				// Show link button
				this.constraint_info.link.visible = true;
				this.constraint_info.link_remove.visible = false;
			}
		}


		this.constraint_info.link_name.content = link_name;
		this.constraint_info.offset_val.content = offset_val;
	}

	// _select_subprop: Activate subproperty including display if true; deselect otherwise
	select_subprop(s, bool) {
		let sub;
		let s_text;
		let s_box;
		if (bool) {
			// Indicate that the previously selected subproperty selector is inactive
			if (this.selected_subprop) {
				this.select_subprop(this.selected_subprop, false);
			}
			// Indicate that the selected subproperty box is active
			sub = this.subprops[s];
			s_text = sub[0];
			s_box = sub[1];
			s_box.fillColor = utils.ACTIVE_COLOR;
			s_box.strokeColor = utils.ACTIVE_S_COLOR;
			s_text.fillColor = utils.ACTIVE_S_COLOR;
			s_text.bringToFront();
			this.selected_subprop = s;
		} else {
			// Deactivate the property
			sub = this.subprops[s];
			s_text = sub[0];
			s_box = sub[1];
			s_box.strokeColor = utils.INACTIVE_S_COLOR;
			s_box.fillColor = utils.INACTIVE_COLOR;
			s_text.fillColor = utils.INACTIVE_S_COLOR;
			s_text.bringToFront();
			this.selected_subprop = null;
		}
	}

	// _select_prop: Select property including display if true; deselect otherwise
	select_prop(p, bool) {
		let prop;
		if (bool) {
			// Indicate previously selected property is inactive
			if (this.selected_prop) {
				this.select_prop(this.selected_prop, false);
			}
			prop = this.props[p];
			prop.fillColor = utils.ACTIVE_COLOR;
			prop.strokeColor = utils.ACTIVE_S_COLOR;
		} else {
			prop = this.props[p];
			console.log(p, prop);
			prop.fillColor = utils.INACTIVE_S_COLOR;
			prop.strokeColor = utils.INACTIVE_S_COLOR;
			this.selected_prop = null;
		}
	}

	// open: if true show editor; otherwise close
	show(bool) {
		// Update editor position
		if (bool) this.set_editor_pos();
		this.box.visible = bool;
	}

	set_editor_pos() {
		let b = this.obj.poly.bounds;
		b.strokeColor = 'green';
		b.strokeWidth = 2;
		b.visible - true;
		let c = ames.canvas_view.bounds.center;
		let pos = this.obj.poly.position;
		let x = b.width/2 + this.box.bounds.width/2 + 3*utils.ICON_OFFSET;

		// Adjust horizontal posiiton
		let d_left = b.leftCenter.getDistance(c, true);
		let d_right = b.rightCenter.getDistance(c, true);
		if (d_left < d_right) {
			x *= -1;
		}

		// Adjust position;
		this.box.position = this.obj.poly.position.add(new Point(x, 20));
	}
}



export class AMES_List_Editor {

	constructor() {

	}
}

class AMES_Property_Button {
	name;
	button;

	constructor(shape, name) {
		this.name = name;
		button = ames.icons[name].clone();

		button.onClick = (e) => {
			this.manipulate(shape)
		}
	}

	manipulate() {
		// void button
	}
}
