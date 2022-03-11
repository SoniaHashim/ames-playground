// ----------------------------------------------------------------------------
// editors.js
// Author: Sonia Hashim
//
// Description: AMES editors to manipulate key data types
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'
import {AMES_Artwork, AMES_Polygon, AMES_Ellipse, AMES_Artwork_Path} from './artwork.js'
import {AMES_Collection} from './collection.js'

// AMES_Editor
// ----------------------------------------------------------------------------
// Base editor that creates named editor for the specified object
class AMES_Editor {
	box;
	obj;

	// Display properties
	is_visible = false;
	pos_is_set = false;

	constructor(obj, opt) {
		let box = new Group();
		opt = opt || {};

		// Add background rectangle
		let e_width = 167.5;
		this.box_width = e_width;
		let e_height = opt.e_height || 150;
		let rect = new Shape.Rectangle({
			point: [0, 0],
			size: [e_width, e_height],
			fillColor: utils.INACTIVE_COLOR,
			strokeWidth: 1,
			radius: 5,
			strokeColor: utils.INACTIVE_S_COLOR,
			opacity: 0.5
		});
		box.addChild(rect);
		this.box_rect = rect;
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
		// Add close icon
		let close_button = ames.icons["close"].clone();
		close_button.scaling = 0.75;
		let close_w = close_button.bounds.width;
		close_button.position = new Point(e_width - utils.ICON_OFFSET - close_w/2, by/2 - close_w/2);
		close_button.visible = true;
		close_button.onClick = (e) => {
			this.show(false);
			this.pos_is_set = false;
			if (this.editor_close_cleanup) this.editor_close_cleanup();
		}
		box.addChild(close_button);

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

		this.box = box;
		this.obj = obj;
		obj.editor = this;
	}

	set_editor_position() {
		// if (this.pos_is_set) return;
		// this.pos_is_set = true;
		// let pos = this.obj.get_pos();
		// let b = this.obj.get_bbox();
		// if (b) {
		// 	b.strokeColor = 'green';
		// 	b.strokeWidth = 2;
		// 	b.visible - true;
		// } else {
		// 	this.box.position = pos; return;
		// }
		// let c = ames.canvas_view.bounds.center;
		//
		// let x = b.width/2 + this.box.bounds.width/2 + 3*utils.ICON_OFFSET;
		//
		// // Adjust horizontal posiiton
		// let d_left = b.leftCenter.getDistance(c, true);
		// let d_right = b.rightCenter.getDistance(c, true);
		// if (d_left < d_right) {
		// 	x *= -1;
		// }
		//
		// // Adjust position;
		// this.box.position = pos.add(new Point(x, -20));

		let bounds = this.box.bounds
		let w = bounds.width/2 + utils.ICON_OFFSET*3 + 12.5;
		let x = ames.toolbar.get_position().x + w;
		let h = ames.canvas_view.size.height - 2*utils.ICON_OFFSET - bounds.height/2;
		this.box.position = new Point(x, h);
	}

	// open: if true show editor; otherwise close
	show(bool) {
		// Update editor position
		if (bool && !this.is_visible) { this.set_editor_position(); }
		this.is_visible = bool;
		this.box.visible = bool;
		// if (!bool) {
		// 	// Disable property interactivity if any
		// 	if (this.obj.active_prop) {
		// 		this.obj.manipulate(this.obj.active_prop)
		// 	}
		// 	// Deselect any active properties
		// 	if (this.selected_prop) this.select_prop(this.selected_prop, false);
		// 	if (this.selected_subprop) this.select_subprop(this.selected_subprop, false);
		// }
	}
}

export class AMES_Transformation_Editor extends AMES_Editor {
	static e_height = 305;

	constructor(obj) {

		super(obj, {"e_height": AMES_Transformation_Editor.e_height});
		let box = this.box;
		let by = utils.LAYER_HEIGHT;
		this.box_width = 167.5;

		// Make geometry link button for artwork
		this.geometry_field_info = {};
		let x_off = 4*utils.ICON_OFFSET;
		let y_off = utils.LAYER_HEIGHT*6.5;
		this.make_link_button([x_off, y_off], 'target')
		this.make_link_button([x_off, y_off + utils.LAYER_HEIGHT*1.5], 'input')

		this.make_button(0, "axes", "toggle_show_tf", {"deactivate_required": true});
		this.make_button(0, "brush", "change_transformation_property");
		this.make_button(0, "play", "transform");
		this.make_button(0, "loop", "toggle_loop", {"deactivate_required": true});


		this.make_dropdown([x_off, utils.LAYER_HEIGHT*1.5], 'mapping', 'change_mapping');
		this.make_dropdown([x_off, utils.LAYER_HEIGHT*3], 'behavior', 'set_mapping_behavior');
		this.make_dropdown([x_off, utils.LAYER_HEIGHT*4.5], 'mode', 'set_mapping_mode');

		// Add playback points UX and button
		this.create_playback_points_editor();
		this.make_playback_point_btn([x_off - utils.ICON_OFFSET, utils.LAYER_HEIGHT*11]);

		// Initialize editor position
		this.set_editor_position();
	}

	set_editor_position() {
		super.set_editor_position();

		this.playback_box.position.x = this.box.position.x + this.box_width + 4*utils.ICON_OFFSET;
		this.playback_box.position.y = this.box.position.y + AMES_Transformation_Editor.e_height/2 - this.playback_box.bounds.height/2;
	}

	editor_close_cleanup() {
		this.playback_editor_close_cleanup();
		for (let f in this.dropdown) {
			if (this.dropdown[f].drop_opts) {
				this.dropdown[f].drop_opts.remove();
			}
		}
	}

	make_playback_point_btn(editor_loc) {
		let x_off = editor_loc[0];
		let y_off = editor_loc[1];

		let playback_pt_btn = new Group();


		let box = new Path.Rectangle({
			point: new Point(x_off-5, y_off),
			size: new Size(150, utils.LAYER_HEIGHT*.75),
			fillColor: utils.INACTIVE_DARK_COLOR,
			strokeColor: utils.INACTIVE_S_COLOR,
			strokeWidth: 1,
			radius: 1.25,
		});

		let label = new PointText({
			point: [3.25*utils.ICON_OFFSET + x_off, y_off + .75*utils.ICON_OFFSET + 10],
			content: 'Edit Playback Points',
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});

		playback_pt_btn.addChildren([box, label]);

		playback_pt_btn.onClick = (e) => {
			console.log("Edit Playback Points")
			this.playback_box.visible = true;
		}

		this.box.addChild(playback_pt_btn);
	}

	playback_editor_close_cleanup() {
		this.playback_box.visible = false;
	}

	load_playback_points() {
		let triggers = this.obj.transformation_functions_to_trigger;
		if (!triggers) return;

		x_off = this.playback_box.position.x - this.playback_box.bounds.width/2 + 2*utils.ICON_OFFSET;
		y_off = this.playback_box.position.y - this.playback_box.bounds.height/2 + utils.LAYER_HEIGHT;

		this.playback_pt_ux = [];

		for (let i = triggers.length-1; i >= 0; i--) {
			let trigger = triggers[i];
			let condition = trigger.condition;
			let tf = trigger.tf;
			let q = trigger.q;

			let playback_pt = new Group();

			// Delete button

			// Box for trigger condition
			// Label for trigger condition

			// Box for trigger transformation function
			// Label for trigger transformation function

			// (opt) box for Q

			// Increment y_off
		}
	}

	create_playback_points_editor() {
		let playback_box = new Group();

		let by = utils.LAYER_HEIGHT;
		let e_height = AMES_Transformation_Editor.e_height*3/4;
		let box = new Shape.Rectangle({
			point: [0, 0],
			size: [this.box_width, e_height],
			fillColor: utils.INACTIVE_COLOR,
			strokeWidth: 1,
			radius: 5,
			strokeColor: utils.INACTIVE_S_COLOR,
			opacity: 0.5
		});
		playback_box.addChild(box);
		let n_text = new PointText({
			point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
			content: "Playback Points" + " :\n" +this.obj.name,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		// Add close icon
		let close_button = ames.icons["close"].clone();
		close_button.scaling = 0.75;
		let close_w = close_button.bounds.width;
		close_button.position = new Point(this.box_width - utils.ICON_OFFSET - close_w/2, by/2 - close_w/2);
		close_button.visible = true;
		close_button.onClick = (e) => {
			this.playback_box.visible = false;
			this.pos_is_set = false;
			if (this.editor_close_cleanup) this.playback_editor_close_cleanup();
		}
		// Create buttons to add playback pt
		let plus_button = ames.icons["plus"].clone();
		plus_button.scaling = 0.75;
		let plus_w = close_button.bounds.width;
		plus_button.position = new Point(2*utils.ICON_OFFSET + plus_w/2, n_text.position.y + n_text.bounds.height + 2*utils.ICON_OFFSET);
		plus_button.visible = true;
		plus_button.onClick = (e) => {
			console.log("Add playback point");
		}
		this.make_dropdown([plus_button.position.x, plus_button.position.y], 'condition', 'set_new_playback_condition', playback_box);
		this.dropdown['condition'].field_label.position.x += plus_w;
		this.make_link_button([plus_button.position.x + utils.ICON_OFFSET, plus_button.position.y + 1.75*utils.LAYER_HEIGHT], 'playback transformation', playback_box)
		plus_button.onClick = (e) => {
			let c = this.obj.new_playback_condition;
			let tf = this.obj.new_playback_transformation;
			let q = this.obj.new_playback_q;
			if (c && tf) {
				this.obj.use_playback_points_to_trigger_transformation({
					'tf': tf,
					'condition': c,
					'q': q
				});
			}

			// this.load_playback_points();
		}


		// Make editor draggable
		let dragging = false;
		let drag_offset = 0;

		box.onMouseDown = (e) => {
			let n_children = playback_box.children.length;
			for (let idx = 1; idx < n_children; idx++) {
				let c = playback_box.children[idx];
				if (c.contains(e.point)) {
					dragging = false;
					return;
				}
			}
			drag_offset = e.point.subtract(playback_box.position);
			dragging = true;
		}
		box.onMouseDrag = (e) => {
			if (dragging) playback_box.position = e.point.subtract(drag_offset);
		}
		box.onMouseUp = (e) => {
			if (dragging) dragging = false;
		}

		playback_box.addChildren([n_text, close_button, plus_button]);
		playback_box.position = ames.canvas_view.center;
		this.playback_box = playback_box;
		this.playback_box.visible = false;
	}

	make_dropdown(editor_location, field, dropdown_function, parent, args) {
		// this.obj[btn_function](args);
		if (!this.dropdown) this.dropdown = {};
		this.dropdown[field] = {};

		let x_off = editor_location[0];
		let y_off = editor_location[1];

		let dropdown = new Group();

		let label = new PointText({
			point: [3*utils.ICON_OFFSET, y_off + .75*utils.ICON_OFFSET],
			content: field[0].toUpperCase() + field.substring(1)+ ":",
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		this.dropdown[field].field_label = label;
		y_off += 10;
		let box = new Path.Rectangle({
			point: new Point(x_off-5, y_off),
			size: new Size(150, utils.LAYER_HEIGHT*.75),
			fillColor: utils.INACTIVE_DARK_COLOR,
			strokeColor: utils.INACTIVE_S_COLOR,
			strokeWidth: 1,
			radius: 1.25,
		});
		let caret_a = ames.icons['caret-down'].clone();
		caret_a.scaling = .625;
		caret_a.position = new Point(x_off + 2.5, y_off + 12.5);
		caret_a.visible = true;
		let caret_b = caret_a.clone();
		caret_b.position = new Point(x_off + 2.5, y_off + 5);
		caret_b.rotation = 180;

		let opts = this.obj.get_dropdown_opts(field);
		this.dropdown[field].selected_opt = this.obj.get_mapping_opt(field);

		let selected_label = new PointText({
			point: [x_off + 25, y_off + 12.5],
			content: this.dropdown[field].selected_opt,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		this.dropdown[field].label = selected_label;

		this.dropdown[field].opts_visible = false;

		let set_dropdown_selected = (field, opt) => {
			console.log("editor dropdown selection: ", field, opt);
			this.obj[dropdown_function](opt);
			this.dropdown[field].label.content = opt;
			this.dropdown[field].selected_opt = opt;
			if (this.dropdown[field].drop_opts) {
				this.dropdown[field].drop_opts.remove();
			}
			this.dropdown[field].opts_visible = false;
		};

		let get_dropdown_position = () => {
			let position = dropdown.position;
			return {"x_off": position.x, "y_off": position.y}
		}


		// On click show menu with remaining options that enable selection
		this.dropdown[field].drop_opts;
		dropdown.onMouseDown = (e) => {
			console.log("Clicked on dropdown")
			e.stopPropagation();
			if (this.dropdown[field].opts_visible) {
				// Click on same opt resets the menu and hides the visible options
				set_dropdown_selected(field, this.dropdown[field].selected_opt);
			} else {
				this.dropdown[field].opts_visible = true;
				// console.log("Show drop opts")
				// Show the visible options so the user can select them
				this.dropdown[field].drop_opts = new Group();
				let p = get_dropdown_position();
				p.x_off -= 69;
				for (let i in opts) {
					let opt = opts[i];
					if (opt != this.dropdown[field].selected_opt) {
						// console.log(opt, p);
						let opt_group = new Group();
						p.y_off += box.bounds.height;

						let opt_box = new Path.Rectangle({
							point: new Point(p.x_off-5, p.y_off - 0.25),
							size: new Size(150, utils.LAYER_HEIGHT*.75),
							fillColor: utils.INACTIVE_DARK_COLOR,
							strokeColor: utils.INACTIVE_S_COLOR,
							strokeWidth: 1,
							radius: 1.25
						});
						let opt_label = new PointText({
							point: [p.x_off + 25, p.y_off + 12.5],
							content: opt,
							fillColor: utils.INACTIVE_S_COLOR,
							fontFamily: utils.FONT,
							fontSize: utils.FONT_SIZE,
						});
						opt_group.addChildren([opt_box, opt_label]);
						this.dropdown[field].drop_opts.addChild(opt_group);
						opt_group.onMouseDown = (e) => {
							set_dropdown_selected(field, opt);
						}
					}
				}
			}

		}

		dropdown.addChildren([label, box, caret_a, caret_b, selected_label]);
		if (!parent) parent = this.box;
		parent.addChild(dropdown);
	}

	make_button(btn_row, icon_name, btn_function, args) {
		args = args || {};
		let btn = ames.icons[icon_name].clone();
		let bw = btn.bounds.width;
		let by = 4.5*utils.LAYER_HEIGHT + bw*btn_row + 10;
		if (!this.n_btns) this.n_btns = {};
		if (!this.n_btns[btn_row]) this.n_btns[btn_row] = 0;
		btn.position = new Point(3.5*utils.ICON_OFFSET + this.n_btns[btn_row]*(utils.ICON_OFFSET + bw) + bw/2, by*2);
		btn.visible = true;
		btn.active = false;
		args.btn = btn;

		btn.deactivate = () => {
			btn.strokeColor = utils.INACTIVE_S_COLOR;
			btn.fillColor = utils.INACTIVE_S_COLOR;
			if (args.deactivate_required) {
				args.deactivate = true;
				this.obj[btn_function](args)
			}
			btn.active = false;
		}

		btn.onClick = (e) => {
			if (btn.active) {
				btn.deactivate();
			} else {
				btn.strokeColor = utils.ACTIVE_S_COLOR;
				btn.fillColor = utils.ACTIVE_S_COLOR;
				this.obj[btn_function](args);
				btn.active = true;
			}
		}

		this.n_btns[btn_row] += 1;

		this.box.addChild(btn);
	}

	make_link_button(editor_location, field, parent) {
		let x_off = editor_location[0];
		let y_off = editor_location[1];

		let field_label = new PointText({
			point: [3*utils.ICON_OFFSET, y_off + .75*utils.ICON_OFFSET],
			content: field[0].toUpperCase() + field.substring(1)+ ":",
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		y_off += 15;
		let link = ames.icons['link'].clone();
		link.scaling = 1.25;
		link.position = new Point(x_off + utils.ICON_OFFSET, y_off);
		link.visible = true;
		link.strokeWidth = .25;
		let link_remove = ames.icons['link-remove'].clone();
		link_remove.scaling = 1.25;
		link_remove.position = link.position;
		link_remove.visible = false;
		link_remove.strokeWidth = .25;
		this.geometry_field_info[field] = {};
		let field_name;
		if (this.obj[field]) field_name = this.obj[field].name;
		field_name = field_name || field;
		let label = new PointText({
			point: [3.25*utils.ICON_OFFSET + x_off, y_off + .75*utils.ICON_OFFSET],
			content: field_name,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		this.geometry_field_info[field].label = label;
		// When the link button is clicked activate constraint tool
		link.onMouseDown = (e) => {
			console.log("click animation link button", field);
			ames.active_linking_transformation = this.obj;
			ames.transformation_active_field = field;
			ames.tools['Animation_Link'].activate();
			// Little workaround... to start drawing line that defines constraint
			link.strokeColor = utils.ACTIVE_S_COLOR;
			ames.tools['Animation_Link'].onMouseDown(e);
			ames.tools['Animation_Link'].onMouseDrag(e);
		}
		link_remove.onMouseDown = (e) => {
			// Remove obj field
			this.obj.set_geometry_field(field, null);
			this.geometry_field_info[field].label.content = field;
			link.visible = true;
			link_remove.visible = false;
		}
		this.geometry_field_info[field].link = link;
		this.geometry_field_info[field].link_remove = link_remove;

		if (!parent) parent = this.box;

		parent.addChild(field_label);
		parent.addChild(label);
		parent.addChild(link);
		parent.addChild(link_remove);
	}
}


export class AMES_Shape_Editor extends AMES_Editor {
	props = {};
	subprops = {};
	constraint_info = {};

	selected_subprop;
	selected_prop;


	constructor(obj) {
		super(obj);
		let box = this.box;
		let by = utils.LAYER_HEIGHT;
		let e_width = this.box_width;
		let props = utils.VIS_PROPS;


		// create all sub-property box
		this._make_subprop('all', 0, box);
		// Create property buttons
		let properties = [];
		for (let p in utils.VIS_PROPS) {
			properties.push(utils.VIS_PROPS[p]);
		}
		// Add nsides for Polygon
		if (obj.artwork_type == "Polygon") {
			properties.push("nsides");
		}
		let b_w;
		for (let idx in properties) {
			let p = properties[idx];
			let button = ames.icons[p].clone();
			b_w = button.bounds.width;
			button.position = new Point(2*utils.ICON_OFFSET + idx*(utils.ICON_OFFSET + b_w) + b_w/2, by*2);
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
		// Add special slider for polygon (nsides)
		if (obj.artwork_type == "Polygon") {
			let p_text =  new Point(2*utils.ICON_OFFSET + properties.length*(utils.ICON_OFFSET + b_w) + b_w/2, by*2)
			this.nsides = new PointText({
				point: [p_text.x, p_text.y + utils.ICON_OFFSET],
				content: obj.sides,
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,
				visible: false
			});

			let total_drag = 0;
			this.nsides.onMouseDown = (e) => {
				ames.canvas.style.cursor = 'move';
			}
			this.nsides.onMouseDrag = (e) => {
				// ames.canvas.style.cursor = null;
				total_drag += e.event.movementX;
				if (total_drag < 0) {
					if (total_drag > 0) total_drag = 0;
					ames.canvas.style.cursor = 'w-resize';
				}
				if (total_drag > 0) {
					if (total_drag < 0) total_drag = 0;
					ames.canvas.style.cursor = 'e-resize';
				}
				if (total_drag < -5) {
					// Decrement nsides
					if (obj.sides > 3) {
						obj.set_number_of_sides(Number(obj.sides) - 1);
						this.nsides.content = obj.sides;
					}
					total_drag = 0;
				}
				if (total_drag > 5) {
					// Increase nsides
					obj.set_number_of_sides(Number(obj.sides) + 1);
					this.nsides.content = obj.sides;
					total_drag = 0;
				}
			}
			this.nsides.onMouseUp = (e) => {
				ames.canvas.style.cursor = null;
				total_drag = 0;
			}

			box.addChild(this.nsides);
		}


		this.box = box;
		// Initialize editor
		this.set_editor_position();
	}

	editor_close_cleanup() {
		// Disable property interactivity if any
		if (this.obj.active_prop) {
			this.obj.manipulate(this.obj.active_prop)
		}
		// Deselect any active properties
		if (this.selected_prop) this.select_prop(this.selected_prop, false);
		if (this.selected_subprop) this.select_subprop(this.selected_subprop, false);
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
			point: [2.25*utils.ICON_OFFSET + offset, utils.LAYER_HEIGHT*3],
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
			this.underline_width = subline_end - subline_start;
			let subprop_line = new Path.Line(subline_start, subline_end);
			subprop_line.strokeColor = utils.INACTIVE_S_COLOR;
			subprop_line.strokeWidth = 1;
			subprop_line.opacity = 0.5;
			box.addChild(subprop_line);

			// Make and hide link and unlink buttons
			let link = ames.icons['link'].clone();
			link.scaling = 1.25;
			link.position = new Point(3.5*utils.ICON_OFFSET, utils.LAYER_HEIGHT*3.75);
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
				link.strokeColor = utils.ACTIVE_S_COLOR;
				ames.tools['Constraint'].onMouseDown(e);
				ames.tools['Constraint'].onMouseDrag(e);
			}
			link_remove.onMouseDown = (e) => {
				let p = this.obj.active_prop;
				let s = this.obj.active_sub_p;
				console.log("link remove constraint", p, s);
				if (!s) s = "all";
				let c_ins = this.obj.c_inbound[p][s];
				let c = null;
				for (let i in c_ins) {
					if (c_ins[i].is_manual_constraint)
						c = c_ins[i];
				}
				if (c) {
					console.log(c);
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
			// Make offset val draggable
			this.constraint_info.offset_val.onMouseDown = (e) => {
				console.log("mouse down on offset val")
				ames.canvas.style.cursor = 'move';
			}
			let offset_val_drag = 0;
			this.constraint_info.offset_val.onMouseDrag = (e) => {
				offset_val_drag += e.event.movementX;
				if (offset_val_drag < 0) ames.canvas.style.cursor = 'w-resize';
				if (offset_val_drag > 0) ames.canvas.style.cursor = 'e-resize';
				let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
				if (offset_val_drag < -5) {
					// Manipulate active constraint
					for (let i in c_ins) {
						if (c_ins[i].is_manual_constraint) {
							c_ins[i].change_offset(-1);
						}

					}
					offset_val_drag = 0;
				}
				if (offset_val_drag > 5) {
					// Manipulate active constraint
					for (let i in c_ins) {
						if (c_ins[i].is_manual_constraint) {
							c_ins[i].change_offset(1);
						}
					}
					offset_val_drag = 0;
				}
			}
			this.constraint_info.offset_val.onMouseUp = (e) => {
				ames.canvas.style.cursor = null;
			}
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
			if (!this.obj.active_prop) return;
			this.select_subprop(s, true);
			this.obj.manipulate_helper(s);
		}
		subprop_text.onClick = (e) => {
			if (!this.obj.active_prop) return;
			this.select_subprop(s, true);
			this.obj.manipulate_helper(s);
		}
		box.addChild(subprop_text);
		box.addChild(subprop_box);
		this.subprops[s] = [subprop_text, subprop_box];
	}

	// _show_constraint
	show_constraint(bool, p, sub_p) {
		if (p == 'path') { bool = false;}
		if (p == 'nsides') { bool = false; }

		for (let k in this.constraint_info) {
			this.constraint_info[k].visible = bool;
		}
		// Hide link remove button
		this.constraint_info.link_remove.visible = false;
		// Show link remove button if there is an active constraint
		if (bool && this.obj) {
			let s = sub_p;
			if (!s) s = "all";
			let c_ins = this.obj.c_inbound[p][s];
			let c = null;
			for (let i in c_ins) {
				if (c_ins[i].is_manual_constraint)
					c = c_ins[i];
			}
			if (c) {
				this.constraint_info.link_remove.visible = true;
				this.constraint_info.link.visible = false;
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
			let c_ins = this.obj.c_inbound[p][s];
			// console.log(c_ins);
			for (let i in c_ins) {
				if (c_ins[i].is_manual_constraint)
					c = c_ins[i];
			}
			if (c) {
				link_name = c.reference.name;

				if (s != "all") {
					let offset = c.get_offset();
					offset_val = offset.toFixed(2);
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
			// console.log(p, prop);
			prop.fillColor = utils.INACTIVE_S_COLOR;
			prop.strokeColor = utils.INACTIVE_S_COLOR;
			this.selected_prop = null;
		}
	}
}



export class AMES_Collection_Editor extends AMES_Shape_Editor {
	rel_idx_val;
	e_height = 175;

	constructor(obj) {
		super(obj);
		this.add_relative_index_to_constraint_info();
	}

	add_relative_index_to_constraint_info() {
		// Group relative coords
		let bx = this.constraint_info.offset_label.position.x - this.constraint_info.offset_label.bounds.width/2;
		let by = this.constraint_info.offset_label.position.y;

		// Add obj name
		let uy = utils.LAYER_HEIGHT;
		let rel_idx_label = new PointText({
			point: [bx, by + 5*utils.ICON_OFFSET],
			content: 'relative index',
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		let rel_idx_val = new PointText({
			point: [this.constraint_info.offset_val.position.x - this.constraint_info.offset_val.bounds.width/2, rel_idx_label.position.y + 3],
			content: '0',
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		let ox = this.constraint_info.offset_line.position.x - this.constraint_info.offset_line.bounds.width/2;
		let oy = rel_idx_val.position.y + rel_idx_val.bounds.height/2;
		let rel_idx_line = new Path.Line(new Point(ox, oy), new Point(this.constraint_info.offset_val.position.x+ 6*utils.ICON_OFFSET, oy));
		rel_idx_line.strokeColor = utils.INACTIVE_S_COLOR;
		rel_idx_line.strokeWidth = 1;
		rel_idx_line.opacity = 0.5;
		rel_idx_line.visible = true;

		// switch y position
		let y1_label = rel_idx_label.position.y;
		let y1_val = rel_idx_val.position.y;
		let y1_line = rel_idx_line.position.y;

		let y2_label = this.constraint_info.offset_label.position.y;
		let y2_val = this.constraint_info.offset_val.position.y;
		let y2_line = this.constraint_info.offset_line.position.y;

		this.constraint_info.offset_label.position.y = y1_label;
		this.constraint_info.offset_val.position.y = y1_val;
		this.constraint_info.offset_line.position.y = y1_line;

		rel_idx_label.position.y = y2_label;
		rel_idx_val.position.y = y2_val;
		rel_idx_line.position.y = y2_line;

		rel_idx_label.visible = false;
		rel_idx_val.visible = false;
		rel_idx_line.visible = false;

		// Add to constraint info
		this.constraint_info.rel_idx_label = rel_idx_label;
		this.constraint_info.rel_idx_val = rel_idx_val;
		this.constraint_info.rel_idx_line = rel_idx_line;

		// Add to editor box
		this.box.addChildren([rel_idx_label, rel_idx_val, rel_idx_line]);

		// Draggable editability to change rel idx value
		this.constraint_info.rel_idx_val.onMouseDown = (e) => {
			ames.canvas.style.cursor = 'move';
		}
		let rel_idx_drag = 0;
		this.constraint_info.rel_idx_val.onMouseDrag = (e) => {
			rel_idx_drag += e.event.movementX;
			if (rel_idx_drag < 0) ames.canvas.style.cursor = 'w-resize';
			if (rel_idx_drag > 0) ames.canvas.style.cursor = 'e-resize';
			if (rel_idx_drag < -5) {

				let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
				for (let i in c_ins) {
					if (c_ins[i].is_manual_constraint) c_ins[i].change_rel_idx(-1)
				}
				console.log("drag left", c_ins);
				rel_idx_drag = 0;
			}
			if (rel_idx_drag > 5) {

				let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
				for (let i in c_ins) {
					if (c_ins[i].is_manual_constraint) c_ins[i].change_rel_idx(1);
				}
				console.log("drag right", c_ins);
				rel_idx_drag = 0;
			}
		}
		this.constraint_info.rel_idx_val.onMouseUp = (e) => {
			ames.canvas.style.cursor = null;
		}
	}

	update_constraint(p, s) {
		if (!p) p = this.obj.active_prop;
		if (!s) s = this.obj.active_sub_p;
		if (!s) s = "all";
		super.update_constraint(p, s);

		let c = null; let rel_idx;
		let c_ins = this.obj.c_inbound[p][s];
		// console.log(c_ins);
		for (let i in c_ins) {
			if (c_ins[i].is_manual_constraint)
				c = c_ins[i];
		}
		if (c) {
			rel_idx = c.get_rel_idx();
			rel_idx = rel_idx.toFixed(0);
		}

		this.constraint_info.rel_idx_val.content = rel_idx;
	}

	// show_constraint: also include relative index information
	show_constraint(bool, p, sub_p) {
		super.show_constraint(bool, p, sub_p);

		// if (sub_p == 'all') {
		// 	this.constraint_info['rel_idx_label'].visible = false;
		// 	this.constraint_info['rel_idx_val'].visible = false;
		// 	this.constraint_info['rel_idx_line'].visible = false;
		// }

		// Update property value
		if (bool) this.update_constraint(p, sub_p);
	}

	show(bool) {
		// Show / hide list highlight box
		this.obj.show_box(bool);
		super.show(bool);
	}
}
