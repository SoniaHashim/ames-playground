// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Viewfoil as AMES_Viewfoil} from './viewfoil.js'
// import {AMES_Shape, AMES_Square, AMES_Circle, AMES_Path} from './shapes.js'
import {AMES_Artwork, AMES_Polygon, AMES_Ellipse, AMES_Artwork_Path} from './artwork.js'
import {AMES_Shape_Editor, AMES_Collection_Editor, AMES_Transformation_Editor} from './editors.js'
import {AMES_Constraint} from './constraints.js'
import {AMES_List, AMES_Duplicator} from './lists.js'
import {AMES_Collection} from './collection.js'
import {AMES_Animation_Test, AMES_Animation} from './animations.js'
import {AMES_Transformation} from './transformation.js'

// Globals for ames
// ames.canvas_cx;
// ames.canvas_cy;
// ames.animations;

export class AMES {
	// controls
	active_shape_btn;
	active_objs = {};
	objs = {};
	lists = {};
	aobjs = {};
	n_shapes = 0;
	n_lists = 0;
	n_aobjs = 0;
	n_shapes = 1;
	l_shape_idx = 1;
	n_lists = 1;
	l_list_idx = 1;
	n_aobjs = 1;
	l_aobj_idx = 1;
	// Views & controls
	canvas_view;
	controls_view;
	layers_view;
	obj_boxes = {};
	idx_boxes;
	tools = {};
	icons = {};
	// Scrubber
	scrubber;
	// State & Timing
	fps = 60;			// frames per second used by transformations
	time = 0;			// time in system
	t_delta = 0; 		// time between elapsed frames
	dur = 10; 			// in seconds
	// State
	animations;
	is_playing = false;
	is_looping = false;
	reset_time = false;
	// Testing
	offset_mode = false;
	// UX
	ux = [];
	// layers = {};


	// Iniitalize AMES app properties after window loads
	init() {
		// Get references to canvas objects
		let canvas = document.getElementById('animation-canvas');

		// Store animation canvas properties
		window.ames.canvas = canvas;
		window.ames.canvas_cx = canvas.width/2;
		window.ames.canvas_cy = canvas.height/2;
		window.ames.animations = {};


		// Set up project & view for animation canvas
		paper.setup(canvas);
		this.init_canvas(canvas);

		// Make drawing tools
		this.tools['inactive_tool'] = new Tool();
		this.tools['Path'] = this.init_path_tool();
		this.tools['Circle'] = this.init_circle_tool();
		this.tools['Square'] = this.init_square_tool();
		this.tools['List'] = this.init_list_tool();
		this.tools['Collection'] = this.init_list_tool({'is_para_style_list': false});
		this.tools['Duplicator'] = this.init_list_tool({'is_para_style_list': false, 'is_duplicator': true});
		this.tools['Constraint'] = this.init_constraint_tool();
		this.tools['Transformation'] = this.init_create_transformation_tool();
		this.tools['Animation_Link'] = this.init_animation_link_tool();


		// Activate canvas
		this.canvas_view._project.activate();

		// Set up sidebar
		this.idx_boxes = new Array();
		// this.setup_layers();

		// Import icons
		this.create_toolbar();
		this.create_sidebar();
		this.import_icons();

	}

	test() {
		let line1 = new AMES_Artwork_Path();
		let line2 = new AMES_Artwork_Path();
		line1.add_points([new Point(75, 100), new Point(75, 90)]);
		line1.finish_creating_path();
		line2.add_points([new Point(100, 100), new Point(100, 110)]);
		line2.finish_creating_path();

		let line3 = new AMES_Artwork_Path();
		line3.add_points([new Point(500, 525), new Point(500, 500)]);
		line3.finish_creating_path();

		let lines = new AMES_Collection([line1, line2]);
		console.log(line1.poly);

		// let e = new AMES_Ellipse({
		// 	"centroid": new Point(150, 150),
		// });
		// let p = new AMES_Polygon({
		// 	"centroid": new Point(300, 300),
		// 	 "nsides": 12,
		// 	 "radius": 50
		//  });


		// let t = new AMES_Transformation({
		// 	"input": lines,
		// 	"target": p,
		// });
		// t.set_mapping({"type": "Vertex", "mapping": "relative position"});
		// t.set_mapping_behavior("alternate");
		// t.tf_space_absolute = false;
		// t.show(true);

		// a.poly.strokeColor = "pink";
		// let b = new AMES_Ellipse();
		// b.poly.sendToBack();
		// let a_triangle = new AMES_Polygon();
		// let a_square = new AMES_Polygon({centroid: new Point(200, 200), nsides: 4, radius: 50});
		// let a_dot = new AMES_Ellipse({centroid: new Point(500, 500), rx: 5, ry: 5});
		// let a_ellipse = new AMES_Ellipse({centroid: new Point(750, 500), rx: 50, ry: 150});
		// let c = new AMES_Collection([a_dot]);
		// for (let i = 0; i < 9; i++) {
		// 	c.duplicate();
		// }
		// let t = new AMES_Transformation({input: a_ellipse, mapping: "position"});
		// t.set_target(c);
		// ames.starfield(6)
	}

	create_toolbar() {
		let toolbar = new Group();
		toolbar.n_btns = 0;
		toolbar.active_btn = null;
		toolbar.btns = {};

		toolbar.get_position = () => {
			let cw = -ames.canvas_view.size.width/2 + 5*utils.ICON_OFFSET;
			let ch = ames.canvas_view.size.height/2 - 5*utils.ICON_OFFSET;
			let csize = new Point(-toolbar.bounds.width/2, toolbar.bounds.height/2)
			let p = ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
			return p;
		};

		toolbar.activate_btn = (btn_name) => {
			this.toolbar.active_btn = btn_name;
			this.toolbar.btns[btn_name].children[0].fillColor = "black";
			// console.log(this.toolbar.active_btn);
		};

		toolbar.deactivate_btn = (btn_name) => {
			// console.log("deactivate button", this.toolbar.active_btn);
			if (this.toolbar.active_btn == btn_name)
				this.toolbar.active_btn = null;
			this.toolbar.btns[btn_name].children[0].fillColor = utils.INACTIVE_S_COLOR;
		};

		toolbar.create_btn = (btn_name, i_name, cb) => {
			let btn = new Group();

			let btn_i = ames.icons[i_name].clone();
			let p = ames.toolbar.get_position();
			btn_i.position = new Point(p.x, p.y - 27.5*ames.toolbar.n_btns);
			btn_i.strokeColor = utils.INACTIVE_DARK_COLOR;
			btn_i.scaling = 1.25;
			btn_i.visible = true;
			let btn_position = btn_i.position;

			let btn_r = new Path.Rectangle({
				position: ames.canvas_view.center,
				size: new Size(25, 25),
				radius: 15,
			});
			btn_r.fillColor = utils.INACTIVE_S_COLOR;
			btn_r.position = btn_i.position;
			btn_r.strokeWidth = 1;
			btn_r.strokeColor = utils.INACTIVE_DARK_COLOR;

			btn.addChildren([btn_r, btn_i]);
			btn.position = btn_i.position;

			btn.onClick = (e) => { cb(); };

			ames.toolbar.n_btns += 1;
			ames.toolbar.btns[btn_name] = btn;

			toolbar.position = toolbar.get_position();
			ames.ux.push(btn);
		};

		toolbar.create_tool_btn = (btn_name, i_name) => {
			let tool_cb = () => {
				ames.switch_tool({b: btn_name});
			};

			ames.toolbar.create_btn(btn_name, i_name, tool_cb);
		};

		toolbar.position = toolbar.get_position();
		ames.toolbar = toolbar;
	};

	create_sidebar() {
		let sidebar = new Group();
		this.create_color_picker();

		let w = utils.SIDEBAR_WIDTH;

		let h = utils.SIDEBAR_HEIGHT;

		let r = new Path.Rectangle({
			position: ames.canvas_view.center,
			size: new Size(w, h),
			radius: 5
		});
		r.position = new Point(0, 0);
		r.strokeColor = utils.INACTIVE_S_COLOR;
		this.ux.push(r);

		let ames_text = new PointText({
			point: [0, 0],
			content: "Animating Multiple Elements Simultaneously",
			fillColor: utils.INACTIVE_DARK_COLOR,
			fontFamily: utils.FONT,
			fontSize: 12,
			visible: true,
			position: [r.position.x, r.position.y - r.bounds.height/2]
		});
		ames_text.position = new Point(0, -h/2 + 1.5*ames_text.bounds.height);

		let ames_box = new Path.Rectangle({
			position: r.position,
			size: new Size(w, 3*ames_text.bounds.height),
			radius: 0,
		});

		ames_box.position = ames_text.position;
		console.log("ames_box", ames_box.bounds.height, utils.SIDEBAR_WIDTH);
		ames_box.fillColor = utils.INACTIVE_S_COLOR;
		ames_box.strokeColor = utils.INACTIVE_S_COLOR;

		// Add ux show / hide carets
		sidebar.add_caret = (i_name) => {
			let button = ames.icons[i_name].clone();
			let caret_position = new Point(ames_text.position.x - ames_text.bounds.width/2 - 3*utils.ICON_OFFSET, ames_text.position.y);
			button.position = caret_position;
			button.scaling = 1.125;
			button.strokeColor = utils.INACTIVE_DARK_COLOR;
			button.fillColor = utils.INACTIVE_DARK_COLOR;
			// Show
			if (i_name == "caret-right") {
				button.visible = false;
				button.onClick = (e) => {
					this.show_ux(true);
					button.visible = false;
					sidebar.children[utils.UX_HIDE_IDX].visible = true;
				}
				sidebar.insertChild(utils.UX_SHOW_IDX, button);
			}

			// Hide
			if (i_name == "caret-down") {
				button.visible = true;
				button.onClick = (e) => {
					this.show_ux(false);
					button.visible = false;
					sidebar.children[utils.UX_SHOW_IDX].visible = true;

				}
				sidebar.insertChild(utils.UX_HIDE_IDX, button);
			}

		}

		sidebar.addChildren([r, ames_box, ames_text]);


		let get_position = () => {
			let cw = ames.canvas_view.size.width/2 - .5*utils.ICON_OFFSET;
			let ch = -ames.canvas_view.size.height/2 + 2*utils.ICON_OFFSET;
			let csize = new Point(-sidebar.bounds.width/2, sidebar.bounds.height/2)
			return ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
		};

		sidebar.position = get_position();
		sidebar.visible = true;
		this.sidebar = sidebar;

		let label_x = ames.canvas_view.size.width/2;
		let label_y = -ames.canvas_view.size.height/2;

		let save_label = new PointText({
			point: [sidebar.position.x - sidebar.bounds.width/2 + 5*utils.ICON_OFFSET, sidebar.position.y],
			content: "Save",
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			visible: true,
		});
		let save_btn = new Path.Rectangle({
			position: [save_label.position.x, save_label.position.y],
			size: [save_label.bounds.width + 5*utils.ICON_OFFSET, save_label.bounds.height + 2.5*utils.ICON_OFFSET],
			strokeColor: utils.INACTIVE_S_COLOR,
			radius: 5
		});
		let import_label = new PointText({
			point: [sidebar.position.x - sidebar.bounds.width/2 + save_label.bounds.width + 12*utils.ICON_OFFSET, sidebar.position.y],
			content: "Import",
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			visible: true,
		});
		let import_btn = new Path.Rectangle({
			position: [import_label.position.x, import_label.position.y],
			size: [import_label.bounds.width + 5*utils.ICON_OFFSET, import_label.bounds.height + 2.5*utils.ICON_OFFSET],
			strokeColor: utils.INACTIVE_S_COLOR,
			radius: 5
		});
		let sidebar_btn_click = (btn) => {
			if (btn == "import") {
				document.getElementById('file_input').click();
				import_btn.fillColor = "lightgray";
				setTimeout(() => { import_btn.fillColor = null;}, 250);
			}
			if (btn == "save") {
				save_btn.fillColor = "lightgray";
				setTimeout(() => { save_btn.fillColor = null;}, 250);
				// TO DO: Save an ames file
			}

		}
		import_btn.onMouseDown = (e) => { sidebar_btn_click("import"); }
		import_label.onMouseDown = (e) => { sidebar_btn_click("import"); }
		save_btn.onMouseDown = (e) => { sidebar_btn_click("save"); }
		save_btn.onMouseDown = (e) => { sidebar_btn_click("save"); }
		this.ux.push(import_btn, import_label, save_btn, save_label);
		this.sidebar.addChildren[save_label, save_btn, import_label, import_btn];

		let layers = new Group();
		let scrollbar_top = sidebar.position.y + save_btn.bounds.height/2 + 2*utils.ICON_OFFSET;
		let scrollbar_x = sidebar.position.x + sidebar.bounds.width/2 - 1.25*utils.ICON_OFFSET;
		let scrollbar_bottom = sidebar.position.y + r.bounds.height/2 - utils.ICON_OFFSET;
		layers.scroll = (e) => {
			layers.sendToBack()
			layers.position.y += -e.event.movementY;
			for (let i in this.layers.children) {
				let lbox = this.layers.children[i];
				lbox.sendToBack();
				lbox.visible = true;
				if (lbox.position.y < scrollbar_top) lbox.visible = false;
				if (lbox.position.y > scrollbar_bottom) lbox.visible = false;
			}
		}

		let scrollbar = new Path.Line({
			from: [scrollbar_x, scrollbar_top],
			to: [scrollbar_x, scrollbar_bottom],
			strokeColor: "lightgray",
			strokeWidth: 4,
			strokeCap: 'round'
		});
		scrollbar.onMouseDrag = (e) => {
			layers.scroll(e);
		}
		let r_top = new Path.Rectangle({
			point: [100, 100],
			size: [sidebar.bounds.width + 2, 22],
			fillColor: "white"
		});
		r_top.position = new Point(sidebar.position.x, scrollbar_top - 10.25);
		let r_btm = r_top.clone();
		r_btm.position = new Point(sidebar.position.x, scrollbar_bottom + 10.25);
		r_top.sendToBack();
		r_btm.sendToBack();
		scrollbar.top = scrollbar_top;
		scrollbar.bottom = scrollbar_bottom;
		sidebar.addChild(scrollbar);
		layers.scrollbar = scrollbar;
		this.layers = layers;
		this.ux.push(scrollbar);
		this.ux.push(layers);
	}

	import_file(filename) {
		let file_name_parts = filename.split(".");
		let name = file_name_parts[0];
		let ext = file_name_parts[1];

		if (ext == "ames") {
			// TO DO: load an ames file
		}

		if (ext == "svg") {
			project.importSVG(filename, {
				onError: function() {
					console.log("Error: unable to import svg file.")
				},
				onLoad: function(i, s) {
					console.log(i, s);
					i.visible = true; // create new artwork type to support
				}
			})
		}
	}

	show_ux(bool) {

		for (let idx in this.ux) {
			this.ux[idx].visible = bool;
		}
	}

	// import_icon: imports *.svg from local dir ../svg/
	import_icons() {
		let icons = ["eye", "eye-slash", "trash", "caret-down", "caret-right",
			"position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor",
			"close", "link", "link-remove", "path", "play", "axes", "brush", "pause",
			"rewind", "loop", "arrow", "dotted-circle", "dotted-square", "vector-pen",
			"card-list", "nsides", "asterisk"];
		for (let idx in icons) {
			this.import_icon(icons[idx]);
		}
	}

	// import_icon: import_icon helper for formatting and storage
	import_icon(n) {
		project.importSVG('../svg/'+n+'.svg', function(i,s) {
			i.visible = false;
			i.fillColor = utils.INACTIVE_S_COLOR;
			i.strokeColor = utils.INACTIVE_S_COLOR;
			i.strokeWidth = 0.5;
			i.scaling = 0.65;
			ames.icons[n] = i.clone();

			if (n == 'caret-down' || n == 'caret-right') ames.icon_caret(n);
			if (n == 'dotted-circle') ames.toolbar.create_tool_btn('Circle', n);
			if (n == 'dotted-square') ames.toolbar.create_tool_btn('Square', n);
			if (n == 'vector-pen') ames.toolbar.create_tool_btn('Path', n);
			if (n == 'card-list') ames.toolbar.create_tool_btn('Collection', n);
			if (n == 'asterisk') ames.toolbar.create_tool_btn('Transformation', n);
		});
	}

	// icon_caret: use caret to expand & contract layers controls
	icon_caret(i_name) {
		ames.sidebar.add_caret(i_name);

		// CHANGE - Delete everything below this line
		let by = utils.LAYER_HEIGHT;
		for (let idx in utils.L_CONTROLS) {
			let n = utils.L_CONTROLS[idx];
			let box = ames.obj_boxes[n];

			let caret = this.icons[i_name].clone();
			let caret_w = caret.bounds.width;

			let box_y = box.position.y;
			let caret_p = new Point(caret_w/2 + utils.ICON_OFFSET, box_y+1);
			caret.position = caret_p;

			let expand_idx = utils.L_EXPAND_IDX;
			let collapse_idx = utils.L_CONTRACT_IDX;

			if (i_name == 'caret-right') {
				box.insertChild(expand_idx, caret);
				caret.visible = true;
				caret.onClick = (e) => {
					this.expand_layers(n, true);
					caret.visible = false;
					box.children[collapse_idx].visible = true;
				}
			}

			if (i_name == 'caret-down') {
				box.insertChild(collapse_idx, caret);
				caret.visible = false;
				caret.onClick = (e) => {
					this.expand_layers(n, false);
					caret.visible = false;
					box.children[expand_idx].visible = true;
				}
			}
		}
	}

	// expand_layers: expand & contract helpers to control layers view
	expand_layers(t_obj, bool) {
		// adjust caret if necessary
		let control_box = this.obj_boxes[t_obj];
		let expand_idx = utils.L_EXPAND_IDX;
		let collapse_idx = utils.L_CONTRACT_IDX;
		let adjust_pos = true;
		// If already expanded / contracted, return
		if (control_box.children[expand_idx].visible == !bool) return;
		if (bool) {
			// If expanding, show contract caret
			control_box.children[collapse_idx].visible = true;
			control_box.children[expand_idx].visible = false;
		} else {
			// If contracting, show expand caret
			control_box.children[collapse_idx].visible = false
			control_box.children[expand_idx].visible = true;
		}
		// Determine start and end indices to collapse
		let start_idx = 1;
		let end_idx = 1;
		if (t_obj == utils.L_CONTROLS[0]) {
			end_idx = this.l_shape_idx;
		}
		if (t_obj == utils.L_CONTROLS[1]) {
			start_idx = 1 + this.l_shape_idx;
			end_idx = this.l_shape_idx + this.l_list_idx;
		}
		if (t_obj == utils.L_CONTROLS[2]) {
			start_idx = 1+this.l_shape_idx + this.list_idx;
			end_idx = this.l_shape_idx + this.l_list_idx + this.l_aobjs_idx;
		}
		let count = end_idx - start_idx;
		// Show or hide
		for (let i = start_idx; i < end_idx; i++) {
			let n = this.idx_boxes[i];
			let box = this.obj_boxes[n];
			box.visible = bool;
		}
		// Adjust position of subsequent boxes
		let by = utils.LAYER_HEIGHT;
		let n_boxes = this.idx_boxes.length;
		for (let i = end_idx; i < n_boxes; i++) {
			let n = this.idx_boxes[i];
			let box = this.obj_boxes[n];
			if (bool) {
				// Expand
				box.position.y += (count*(by+.5))
			} else {
				// Contract
				box.position.y -= (count*(by+.5));
			}
		}
	}

	// DELETE - old code
	init_controls(controls) {
		// Import & set-up control over play, pause & loop buttons
		// nb: loading 24 x 24 px icons
		let i_off = 12;
		let w = view.size._width;

		project.importSVG('../svg/ames-i-play.svg', function(i, s) {
			let play_btn = i._children[1];
			play_btn.onClick = function(e) {
				ames.play();
			}
		});
		project.importSVG('../svg/ames-i-play.svg', function(i, s) {
			i.position = new Point(3*i_off, i_off);
			let pause_btn = i._children[1];
			pause_btn.onClick = function(e) {
				ames.pause();
			}
		});
		project.importSVG('../svg/ames-i-play.svg', function(i, s) {
			i.position = new Point(5*i_off, i_off);
			let loop_btn = i._children[1];
			loop_btn.onClick = function(e) {
				ames.loop();
			}
		});

		// Create scrubber
		let timeline = new Path.Line(new Point(6*i_off + i_off/2, i_off), new Point(w - i_off/2, i_off));
		timeline.strokeColor = 'grey';
		let min_scrub = 6*i_off + i_off/2 + 4; let max_scrub = w - i_off/2 - 4;
		let scrubber = new Path.Circle(new Point(min_scrub, 12), 4);
		scrubber.fillColor = 'lightgrey';
		scrubber.strokeColor = 'grey'
		// Allow the user to change the system time by moving the scrubber
		scrubber.onMouseDrag = function(e) {
			let new_x = scrubber.position.x + e.delta.x;
			if ( new_x > min_scrub && new_x < max_scrub) {
				scrubber.position.x = new_x;
				ames.set_time(ames.get_time_from_scrubber());
			}
		}
		scrubber.onMouseUp = function(e) {
			ames.set_time(ames.get_time_from_scrubber());
		}
		// Update the position of the scrubber as the animation progresses
		scrubber.onFrame = function(e) {
			scrubber.position.x = ames.update_scrubber_to_time();
		}
		this.scrubber = scrubber;

		this.controls_view = view;
		this.min_sc = min_scrub; this.max_sc = max_scrub;
		this.controls_view.onClick = function(e) {
			// this._project.activate();
		}
	}

	init_layers() {
		this.layers_view = view;

		this.layers_view.onClick = function(e) {
			// this._project.activate();
		}
	}

	setup_layers() {

		// Add control boxes for shapes, lists, animations
		let controls = utils.L_CONTROLS;
		let w = 250; // CHANGE
		for (let i in controls) {
			let c_name = controls[i];


			// Create box with dropdown control
			let box = new Group();
			box.position = new Point(0,0);
			let by = utils.LAYER_HEIGHT;
			// Background rectangle
			let rect = new Shape.Rectangle({
				point: [0, 0],
				size: [w, by],
				strokeColor: utils.INACTIVE_S_COLOR,
				strokeWidth: 1,
				fillColor: utils.INACTIVE_DARK_COLOR,
				opacity: 1
			});
			// Object name
			let n_text = new PointText({
				point: [20, by/2 + 5],
				content: c_name,
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: 10
			});

			// Contract glyph
			box.addChild(rect);
			box.addChild(n_text);
			box.visible = true;
			// box.addChild(caret_r);
			// box.addChild(caret_d);

			// Adjust position of box
			let n_boxes = ames.idx_boxes.length;
			let ny = n_boxes*by + by/2 + n_boxes*.5;
			box.position = new Point(w/2, ny);
			// Add box to ames controls
			this.idx_boxes[n_boxes] = c_name;
			this.obj_boxes[c_name] = box;
		}
	}

	init_canvas(canvas) {
		this.canvas_view = view;


		let frame_trigger_dur = 1/ames.fps;
		let eps = frame_trigger_dur/10;
		let trigger_frame = true;
		ames.t_delta = 0;

		this.canvas_view.onFrame = function(e) {
			// If playing...
			if (ames.is_playing) {
				// If reset time is true, time should be set to 0
				if (ames.reset_time) {
					ames.time = 0;
					trigger_frame = true;
					ames.reset_time = false;
				}

				// Calculate progression based on elapsed time and duration
				ames.t_delta += e.delta;

				// If complete, complete the animation and either stop or loop
				if (ames.time + (ames.t_delta - eps)/ames.dur >= 1) {
					ames.t_delta = (1 - ames.time)*ames.dur;
					ames.time = 1;
					// If not looping, stop the animation
					if (!ames.is_looping)  {
						ames.is_playing = false;
					} else {
						ames.reset_time = true;
					}
				}

				// If sufficient time has elapsed to trigger a frame, update time
				if (ames.t_delta >= (frame_trigger_dur - eps)) {
					ames.time += ames.t_delta/ames.dur;
					trigger_frame = true;
				}

				if (trigger_frame) {
					ames.update_animations();
					trigger_frame = false;
					ames.t_delta = 0;
				}
			}
		}
	}

	create_color_picker() {
		// ames.layers_view._project.activate();
		let colorwheel = new Raster('colorwheel');
		// ames.canvas_view._project.activate();
		colorwheel.on('load', function() {
			// ames.layers_view._project.activate();
			colorwheel.scaling = 0.18;
			ames.colorwheel = colorwheel;

			// Create color picker
			let colorpicker = new Group();
			let cpicker_origin = new Point(200, 200);
			colorpicker.position = cpicker_origin;
			// Create symbol from color wheel raster
			let cwheel = new SymbolItem(ames.colorwheel, view.center);
			cwheel.position = colorpicker.position;
			let get_colorpicker_drift = () => {
				return colorpicker.position.subtract(cpicker_origin);
			};

			// Create color swatch
			let r_dim = 100;
			let r = new Path.Rectangle({
				position: colorpicker.position,
				size: new Size(r_dim, r_dim),
				radius: 2.5
			});
			r.position = colorpicker.position.add(new Point(140, -12));
			r.strokeColor = utils.INACTIVE_S_COLOR;
			r.fillColor = 'white';
			let cname = new PointText({
				point: [0,0],
				content: r.fillColor.toCSS(true),
				fillColor: utils.INACTIVE_S_COLOR,
				fontFamily: utils.FONT,
				fontSize: utils.FONT_SIZE,

			});

			let get_bound = function(isStart) {
				let p = r.position;
				if (isStart) return p.x - r_dim/2;
				else return p.x + r_dim/2;
			}

			// Set position of color name above swatch
			let c_x = r.position.x + r.bounds.width/2 - cname.bounds.width;
			let c_y = r.position.y - r.bounds.height/2 - 2*utils.ICON_OFFSET;
			cname.position = new Point(c_x, c_y);

			// start and end points of sliders
			let start = r.position.x - r.bounds.width/2;
			let end = r.position.x + r.bounds.width/2
			// utility function to make slider
			let make_slider = function(y, label_text, cb, dot_start) {
				let slider = new Path.Line({
					from: [start, y + 2*utils.ICON_OFFSET],
					to: [end, y + 2*utils.ICON_OFFSET],
					strokeColor: utils.INACTIVE_S_COLOR
				});
				let dot = utils.make_dot(new Point(dot_start, y + 2*utils.ICON_OFFSET), null, 4);
				dot.fillColor = utils.INACTIVE_S_COLOR;
				dot.onMouseDrag = (e) => {
					// define function for start / end based on colorpicker position
					// or colorpicker position drift
					let range_s = get_bound(true);
					let range_e = get_bound(false);
					if (e.point.x >= range_s && e.point.x <= range_e) {
						dot.position.x = e.point.x;
						cb(e.point);
					};
				 };
				let label = new PointText({
					point: [start, y + 0.25*utils.ICON_OFFSET],
					content: label_text,
					fillColor: utils.INACTIVE_S_COLOR,
					fontFamily: utils.FONT,
					fontSize: utils.FONT_SIZE,
				});
				return [dot, slider, label];
			}
			// Make alpha slider & define function to calculate alpha
			let alpha_y = r.position.y + r.bounds.height/2 + 3.5*utils.ICON_OFFSET;
			let get_slider_value = (p) => {
				let range_s = get_bound(true);
				return (p.x - range_s) / r.bounds.width
			}
			let update_dot_x = (v, dot) => {
				let range_s = get_bound(true);
				dot.position.x = (v*r.bounds.width) + (range_s);
			}
			let set_alpha = (p) => {
				r.fillColor.alpha = get_slider_value(p);
				cname.content = r.fillColor.toCSS(true);
				// Update color of color target if any
				if (ames.colorpicker.color_target) {
					ames.colorpicker.color_target(r.fillColor);
				}
			}
			let alpha = make_slider(alpha_y, 'alpha', set_alpha, end);
			let alpha_dot = alpha[0]; let alpha_slider = alpha[1]; let alpha_label = alpha[2];
			// Make lightness slider & define function to set lightness
			let lightness_y = alpha_y + 5.5*utils.ICON_OFFSET;
			let set_lightness = (p) => {
				let v = get_slider_value(p);
				r.fillColor.brightness = v;
				cname.content = r.fillColor.toCSS(true);
				gwheel.fillColor.opacity = 1-v;
				gwheel.opacity = 1-v;
				// Update color of color target if any
				if (ames.colorpicker.color_target) {
					ames.colorpicker.color_target(r.fillColor);
				}
			}
			let lightness = make_slider(lightness_y, 'brightness', set_lightness, end);
			let lightness_dot = lightness[0]; let lightness_slider = lightness[1]; let lightness_label = lightness[2];

			// Color wheel radius is 65
			let radius = 65;
			let gwheel = new Path.Circle({
				center: [cwheel.position.x, cwheel.position.y-1],
				radius: 66,
				fillColor: 'black',
				opacity: 0,
			});

			gwheel.onClick = (e) => {
				// Calculate relative pixel position
				// Note: account for scale factor of colorwheel
				let offset = e.point.subtract(cwheel.bounds.topLeft).multiply(5);

				// radius is 70
				let e_rad = e.point.getDistance(cwheel.position)
				if (e_rad < radius) {
					let color = ames.colorwheel.getPixel(offset);
					let v = 0;
					if (gwheel.fillColor.opacity) v = gwheel.fillColor.opacity;
					color.brightness = 1-v;
					// console.log(color.saturation);
					color.alpha = get_slider_value(alpha_dot.position);
					// color.lightness = get_slider_value(lightness_dot.position);
					let range_s = get_bound(true);
					r.fillColor = color;
					cname.content = color.toCSS(true);
					// Set color of color target if any
					if (ames.colorpicker.color_target) {
						ames.colorpicker.color_target(color);
					}
				}
			}

			colorpicker.load_color = (c) => {
				if (!c) c = new Color(utils.INACTIVE_COLOR);
				// update swatch
				r.fillColor = c;
				// update color label
				cname.content = r.fillColor.toCSS(true);
				// update alpha slider dot
				update_dot_x(c.alpha, alpha_dot);
				// match colorwheel brightness
				let v = c.brightness;
				gwheel.fillColor.opacity = 1-v;
				gwheel.opacity = 1-v;
				// update lightness slider dot
				update_dot_x(v, lightness_dot);
			}

			colorpicker.addChildren([r, cwheel, cname, gwheel]);
			colorpicker.addChildren([alpha_dot, alpha_slider, alpha_label]);
			colorpicker.addChildren([lightness_dot, lightness_slider, lightness_label]);

			// close icon and surrounding box
			let get_position = (e) => {
				let x = ames.sidebar.position.x - utils.OFFSET*2;
				let y = ames.sidebar.bounds.topLeft.y + .85*colorpicker.bounds.height;
				return new Point(x, y);
			}

			// Make colorpicker draggable
			// let dragging = false;
			// let drag_offset = 0;
			// colorpicker.onMouseDown = (e) => {
			// 	let n_children = colorpicker.children.length;
			// 	for (let idx = 1; idx < n_children; idx++) {
			// 		let c = colorpicker.children[idx];
			// 		if (c.contains(e.point)) {
			// 			dragging = false;
			// 			return;
			// 		}
			// 	}
			// 	drag_offset = e.point.subtract(colorpicker.position);
			// 	dragging = true;
			// }
			// colorpicker.onMouseDrag = (e) => {
			// 	if (dragging) colorpicker.position = e.point.subtract(drag_offset);
			// }
			// colorpicker.onMouseUp = (e) => {
			// 	if (dragging) dragging = false;
			// }

			// utils.make_dot(ames.canvas_view.center);
			colorpicker.position = get_position();
			ames.sidebar.addChild(colorpicker);
			ames.colorpicker = colorpicker;
			ames.ux.push(colorpicker);
			// ames.colorpicker.visible = false;
			// this.canvas_view._project.activate();
		});
		// ames.canvas_view._project.activate();

	}

	adjust_t_delta() {
		let x = this.time * this.dur * this.fps;
		this.t_delta = (x - Math.floor(x)) * 1/this.fps;
	}

	update_animations() {
		// Takes this.time and updates the animations accordingly
	}

	play() {
		// Start playing and reset system time
		if (!this.is_playing) {
			if (ames.time != 0) this.adjust_t_delta();
			this.is_playing = true;
		}
	}

	pause() {
		this.is_playing = false;
		// Pause animations
		for (let k in this.animations) {
			let a = this.animations[k];
			a.curr_tw.stop();
			setTimeout(() => {a.curr_tw.start(); a.curr_tw.update(.2);}, 500);

			// a.curr_tw.object.opacity = 1;
		}
	}

	// loop() {
	// 	this.is_looping = !this.is_looping;
	// }

	// get_time_from_scrubber() {
	// 	let sc_x = this.scrubber.position.x;
	// 	let t = (sc_x - this.min_sc) / (this.max_sc - this.min_sc);
	// 	return t;
	// }
	//
	// update_scrubber_to_time() {
	// 	let sc_x = (this.time * (this.max_sc - this.min_sc)) + this.min_sc;
	// 	return sc_x;
	// }
	//
	// set_time(t) {
	// 	this.time = t;
	// 	this.adjust_t_delta;
	// }
	//
	// get_duration(x) {
	// 	return 1000;
	// }

	// Constructor for ames (empty)
	constructor() {
		// Warning: ames is not defined here
	}

	example(str) {
		if (str == "ngon") this.ngon();
		if (str == "starfield") this.starfield();
 	}

	starfield(step) {
		if (step == null) step = 5;
		console.log("---AMES STARFIELD EXAMPLE LOG---------------------------");

		if (step == -1) {
			let line1 = new AMES_Artwork_Path();
			let line2 = new AMES_Artwork_Path();
			line1.add_points([new Point(75, 100), new Point(75, 90)]);
			line2.add_points([new Point(100, 100), new Point(100, 110)]);
			let lines_perturb = new AMES_Collection([line1, line2]);
		}
		let lines_collection;
		if (step == 0) {
			let line1 = new AMES_Artwork_Path();
			let line2 = new AMES_Artwork_Path();
			line1.add_points([new Point(75, 100), new Point(75, 90)]);
			line2.add_points([new Point(100, 100), new Point(100, 110)]);
			lines_collection = new AMES_Collection([line1, line2]);
		}

		// if (step != 5) project.activeLayer.removeChildren();
		let oct;
		if (step >= 0) {
			oct = new AMES_Polygon({"nsides": 12});
			oct.poly.strokeColor = "silver";
			oct.poly.fillColor = "black";
			oct.poly.scaling = 0.8;
			oct.poly.strokeWidth = 2;
		}

		let poly_collection;
		if (step >= 1) {
			poly_collection = new AMES_Collection([oct]);
			poly_collection.set_count(12);
		}

		let tf_position; let line_position;
		if (step >= 2) {
			line_position = new AMES_Artwork_Path();
			line_position.add_points([new Point(300, 550), new Point(1050, 50)]);
			tf_position = new AMES_Transformation({
				"input": line_position,
				"target": poly_collection,
				"mapping": "position"
			});
			tf_position.transform();
			poly_collection.show_box(false);
		}

		let tf_point_perturb; let lines_perturb;
		if (step >= 3) {
			let line1 = new AMES_Artwork_Path();
			let line2 = new AMES_Artwork_Path();
			line1.add_points([new Point(75, 100), new Point(75, 90)]);
			line2.add_points([new Point(100, 100), new Point(100, 110)]);
			lines_perturb = new AMES_Collection([line1, line2]);
			tf_point_perturb = new AMES_Transformation({
				"input": lines_perturb,
				"target": poly_collection
			});
			tf_point_perturb.set_mapping({"type": "Vertex", "mapping": "relative position"});
			tf_point_perturb.set_mapping_behavior("alternate");
			tf_point_perturb.tf_space_absolute = false;

			tf_position.show_tf_space(false);
			line_position.poly.visible = false;

			if (step == 3) tf_point_perturb.transform();
		}

		let tf_nsides;
		if (step >= 4) {
			// let line_nsides = new AMES_Artwork_Path();
			// line_nsides.add_points([new Point(50, 300), new Point(150, 200)]);
			// tf_nsides = new AMES_Transformation();
			// tf_nsides.set_target(poly_collection);
			// tf_nsides.set_input(line_nsides);
			// tf_nsides.set_mapping({"type": "Polygon", "mapping": "number of sides"});
			// tf_nsides.set_tf_space({"my1": 10, "my2": 28});
			// tf_nsides.show_tf_space(true);
			// tf_nsides.transform();

			tf_point_perturb.transform();
		}

		let tf_point_perturb_animation;
		// let lines_perturb_animated;
		if (step >= 5) {
			// let line1 = new AMES_Artwork_Path();
			// let line2 = new AMES_Artwork_Path();
			// line1.add_points([new Point(275, 100), new Point(275, 95)]);
			// line2.add_points([new Point(300, 100), new Point(300, 105)]);
			// lines_perturb_animated = new AMES_Collection([line1, line2]);
			tf_point_perturb_animation = new AMES_Transformation({
				"input": lines_perturb,
				"target": poly_collection,
				"mapping": {
					"type": "Vertex",
					"mapping": "relative animation"
				}
			});
			tf_point_perturb_animation.set_mapping_behavior("alternate");
			tf_point_perturb_animation.tf_space_absolute = false;
			// tf_point_perturb_animation.tf_space_path_nsegments = 250;
			// tf_point_perturb_animation.tf_space_speed_factor = 1;
			// tf_point_perturb_animation.loop_max_count = 1;
			// tf_point_perturb_animation.loop = true;

			tf_point_perturb.show_tf_space(false);
			if (step == 5) tf_point_perturb_animation.transform();
		}

		if (step >= 6) {
			let playback_loop1 = new AMES_Ellipse({"centroid": new Point(200, 150), "rx": 25, "ry": 25});
			// let playback_loop2 = new AMES_Ellipse({"centroid": new Point(200, 150), "rx": 50, "ry": 25});
			// let playback_loop_collection = new AMES_Collection([playback_loop1, playback_loop2])
			let tf_playback = new AMES_Transformation({
				"input": playback_loop1,
				"target": tf_point_perturb_animation,
				"mapping": {
					"type": "Transformation",
					"mapping": "playback"
				}
			});
			tf_playback.tf_space_path_nsegments = 10;
			// tf_playback.loop_max_count = 10;
			tf_playback.loop = true;
			// if (step == 6) tf_point_perturb_animation.transform();
			// if (step >= 6) tf_playback.transform();
		}

	}


	ngon(step) {
		if (step == null) step = 15;
		console.log("---AMES NGON EXAMPLE LOG--------------------------------");

		// for example walkthrough - strips all other
		project.activeLayer.removeChildren();

		let tri;
		if (step >= 0) {
			// Create polygon collection
			tri = new AMES_Polygon();
			tri.poly.strokeColor = "blue";
			tri.poly.strokeWidth = 1.5
		}

		let poly_collection;
		if (step >= 1) {
			poly_collection = new AMES_Collection(tri);
			poly_collection.set_count(6);
		}

		let dot; let dot_collection;
		if (step >= 2) {
			// Create dot collection
			dot = new AMES_Ellipse();
			dot.poly.fillColor = "blue";
			dot.poly.strokeWidth = 0;
			dot_collection = new AMES_Collection(dot);
			dot_collection.set_count(6)
		}

		let tf_motion_path;
		if (step >= 3) {
			// Create motion path transformation function
			tf_motion_path = new AMES_Transformation({
				"input": poly_collection,
				"target": dot_collection,
				"mapping": "motion path"
			});
			tf_motion_path.tf_space_speed_factor = 1;
			if (step == 3) tf_motion_path.transform();
			if (step > 3) {
				dot_collection.align();
				poly_collection.align();

				tf_motion_path.show_tf_space(false);
				dot_collection.show_box(false);
				poly_collection.show_box(false);
			}
		}

		let line2; let tf_scale_tri;
		if (step >= 4) {
			// Create static scaling transformation function using a line
			line2 = new AMES_Artwork_Path();
			line2.add_points([new Point(100, 450), new Point(200, 250)]);
			// line2.add_points([new Point(100, 450), new Point(200, 250)]);
			// line2.add_points([new Point(100, 300), new Point(200, 250)]);
			tf_scale_tri = new AMES_Transformation({
				"input": line2,
				"target": poly_collection,
				"mapping": "static scale"
			});
			tf_scale_tri.transform();
			if (step == 4) tf_motion_path.transform();
		}

		let line1; let tf_nsides_tri;
		if (step >= 5) {
			// Create number of sides transformation function using a line
			line1 = new AMES_Artwork_Path();
			line1.add_points([new Point(100, 200), new Point(200, 100)]);
			tf_nsides_tri = new AMES_Transformation();
			tf_nsides_tri.set_target(poly_collection);
			tf_nsides_tri.set_input(line1);
			tf_nsides_tri.set_mapping({"type": "Polygon", "mapping": "number of sides"});
			tf_nsides_tri.transform();
			if (step == 5) tf_motion_path.transform();
		}

		if (step >= 6) {
			tf_motion_path.tf_space_speed_factor = 1;
			tf_motion_path.tf_space_speed = tf_motion_path.SPEED_LINEAR;
			if (step == 6) tf_motion_path.transform();
		}

		let line3; let tf_duplicate_dots;
		if (step >= 7) {
			line3 = new AMES_Artwork_Path();
			line3.add_points([new Point(100, 550), new Point(200, 500)]);
			tf_duplicate_dots = new AMES_Transformation({
				"input": line3,
				"target": dot_collection,
				"mapping": "duplicate each"
			});
			tf_duplicate_dots.loop = false;
			tf_motion_path.use_playback_points_to_trigger_transformation({
				"tf": tf_duplicate_dots,
				"condition": "slope change"
			});
			if (step == 7) tf_motion_path.transform();
		}

		let circle; let quick_flare; let tf_scale_dots;
		if (step >= 8) {
			// Create scaling animation using a cirlce in image space (ease in and out)
			circle = new AMES_Ellipse({"centroid": new Point(325, 150), "r": 50});
			quick_flare = new AMES_Artwork_Path();
			quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);
			tf_scale_dots = new AMES_Transformation({
				"input": circle,
				"target": dot_collection,
				"mapping": "scale animation"
			});
			tf_scale_dots.loop = false;
			tf_scale_dots.tf_space_path_nsegments = 100;
			// tf_scale_dots.tf_space_speed = tf_scale_dots.SPEED_XAXIS;
			tf_duplicate_dots.use_playback_points_to_trigger_transformation({
				"tf": tf_scale_dots,
				"condition": "new instance"
			});
			if (step == 8) tf_motion_path.transform();
		}

		if (step >= 9) {
			tf_scale_dots.use_playback_points_to_trigger_transformation({
				"tf": null,
				"condition": "remove at end"
			});
			if (step == 9) tf_motion_path.transform();
		}


		if (step >= 10) {
			// Create hue transformation function
			let line0 = new AMES_Artwork_Path();
			line0.add_points([new Point(275, 350), new Point(375, 275)]);
			let tf_hue_dots = new AMES_Transformation({
				"input": line0,
				"target": dot_collection,
				"mapping": "hue"
			});
			tf_hue_dots.transform();

			let tf_hue_poly = new AMES_Transformation({
				"input": line0,
				"target": poly_collection,
				"mapping": "hue"
			});
			tf_hue_poly.transform();

			tf_motion_path.transform();
		}

		if (step == -1) {
			// Create scaling animation demo pt 1
			let p1 = new AMES_Ellipse({"centroid": ames.canvas_view.center, "r": 25});
			p1.poly.fillColor = "pink"; p1.poly.position = p1.poly.position.subtract(400, 0); p1.poly.strokeWidth = 0;
			circle = new AMES_Ellipse({"centroid": new Point(325, 150), "r": 50}); circle.poly.strokeColor = "pink";

			let tf_scale_test1 = new AMES_Transformation({
				"input": circle,
				"target": p1,
				"mapping": "scale animation"
			});
			tf_scale_test1.tf_space_path_nsegments = 100;
			tf_scale_test1.transform();
		}

		if (step == -2) {
			// Create scaling animation demo pt 2
			let p2 = new AMES_Ellipse({"centroid": ames.canvas_view.center, "r": 25});
			p2.poly.fillColor = "orange"; 	p2.poly.position = p2.poly.position.add(400, 0); p2.poly.strokeWidth = 0;
			quick_flare = new AMES_Artwork_Path(); quick_flare.poly.strokeColor = "orange";
			quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);
			let tf_scale_test2 = new AMES_Transformation({
				"input": quick_flare,
				"target": p2,
				"mapping": "scale animation"
			});
			tf_scale_test2.tf_space_path_nsegments = 100;
			tf_scale_test2.transform();
		}

		if (step == -3) {
			// Create scaling animation using a cirlce in image space (ease in and out)
			let p1 = new AMES_Ellipse({"centroid": ames.canvas_view.center, "r": 25});
			p1.poly.fillColor = "pink"; p1.poly.position = p1.poly.position.subtract(400, 0); p1.poly.strokeWidth = 0;

			let p2 = new AMES_Ellipse({"centroid": ames.canvas_view.center, "r": 25});
			p2.poly.fillColor = "orange"; 	p2.poly.position = p2.poly.position.add(400, 0); p2.poly.strokeWidth = 0;


			circle = new AMES_Ellipse({"centroid": new Point(325, 150), "r": 50}); circle.poly.strokeColor = "pink";
			quick_flare = new AMES_Artwork_Path(); quick_flare.poly.strokeColor = "orange";
			quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);

			let tf_scale_test1 = new AMES_Transformation({
				"input": circle,
				"target": p1,
				"mapping": "scale animation"
			});
			let tf_scale_test2 = new AMES_Transformation({
				"input": quick_flare,
				"target": p2,
				"mapping": "scale animation"
			});

			tf_scale_test1.tf_space_path_nsegments = 100;
			tf_scale_test2.tf_space_path_nsegments = 100;
			tf_scale_test1.transform();
			tf_scale_test2.transform();
		}
	}

	// add_shape: adds given object as a shape
	add_shape(x) {
		x.create_control_shapes();
		x.poly.fillColor = new Color({
			hue: 90,
			brightness: 1,
			saturation: 0,
			alpha: 1
		});
		if (x.poly.fillColor) x.poly.fillColor.brightness = 1;
		this.expand_layers(utils.L_CONTROLS[0], true);
		this.n_shapes += 1;
		let n_shape = this.n_shapes - 1;
		x.name = "Shape " + n_shape + " (" + x.get_type() + ")";
		x.editor = new AMES_Shape_Editor(x);
		this.add_obj(x, utils.L_CONTROLS[0]);
	}

	// add_list: adds given object as a list
	add_list(x) {
		this.n_lists += 1;
		// let n_list = this.n_lists - 1;
		// x.name = "List " + n_list;
		// console.log("list name set to", x.name);
		x.editor = new AMES_List_Editor(x);
		this.add_obj(x, utils.L_CONTROLS[1]);
		x.show(true);
		this.lists[x.name] = x;
	}

	add_animation(x) {
		this.n_aobjs += 1;
		// x.editor = new AMES_Animation_Editor(x);
		this.add_obj(x, utils.L_CONTROLS[2]);
		this.aobjs[x.name] = x;
	}

	hide_editors(obj) {
		obj = obj || {};
		for (let i in this.objs) {
			if (this.objs[i].name != obj.name) {
				if (!(obj.is_shape && this.objs[i].is_list && this.objs[i].has_shape(obj))) {
					this.objs[i].editor.show(false);
					this.objs[i]._clear_cb_helpers();
				}
			}
		}
		// ames.colorpicker.visible = false;
		// if (obj.active_prop == 'strokeColor' || obj.active_prop == 'fillColor') ames.colorpicker.visible = true;
	}

	update_layers(opt) {
		opt = opt || {};

		let box;
		if (opt.box) box = opt.box;
		else return;

		// Insert box into layers box
		if (opt.insert) {
			this.layers.insertChild(0, box);
			box.sendToBack();
		}

		// Delete box from layers box
		if (opt.remove) {
			let idx = box.index;
			this.layers.removeChildren(idx, idx+1);
		}

		// Parent box to another box (change order of boxes)
		if (opt.parent) {
			// let parent_idx = opt.parent_box.index;
			// console.log(box);
			// let box_idx = box.index;
			// box.children[1].content = '    ' + box.children[1].content;
			// this.layers.removeChildren(box_idx, box_idx+1);
			// this.layers.insertChild(parent_idx, box);
			// let str = "";
			// for (let i in this.layers.children) {
			// 	str += this.layers.children[i].children[1].content
			// }
			// console.log("layers: ", str);
		}

		// TO DO: Keep all transformation functions without a target at the top

		// Update view for layers box
		this.layers.sendToBack();
		let nchildren = this.layers.children.length;
		for (let i = 0; i < nchildren; i++) {
			let lbox = this.layers.children[i];
			lbox.position.x = ames.sidebar.position.x - utils.SCROLLBAR_WIDTH;
			lbox.position.y = i*lbox.bounds.height;
		}
		let layers_ypos = this.layers.scrollbar.top + this.layers.bounds.height/2 + utils.ICON_OFFSET/2;
		this.layers.position = new Point(ames.sidebar.position.x - utils.SCROLLBAR_WIDTH, layers_ypos)
		for (let i = 0; i < nchildren; i++) {
			let lbox = this.layers.children[i];
			lbox.visible = true;
			if (lbox.position.y < this.layers.scrollbar.top) lbox.visible = false;
			if (lbox.position.y > this.layers.scrollbar.bottom) lbox.visible = false;
		}

		let str = "";
		for (let i in this.layers.children) {
			str += this.layers.children[i].children[1].content
		}
	}

	create_layers_box(obj) {
		let obj_box = new Group();
		obj.obj_box = obj_box;

		// Create a box in the side panel
		let ypos = 450;
		let box = new Path.Rectangle({
			point: [500, 450],
			size: [utils.SIDEBAR_WIDTH - 2*utils.SCROLLBAR_WIDTH, 20],
			fillColor: "white",
			strokeColor: utils.INACTIVE_S_COLOR,
			radius: 3,
			strokeWidth: .75,
			position: [ames.sidebar.position.x - utils.SCROLLBAR_WIDTH, ypos]
		});
		// box.sendToBack();

		let box_label = new PointText({
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE,
			visible: true,
			point: [box.position.x - utils.SIDEBAR_WIDTH/2 + 5*utils.ICON_OFFSET, box.position.y + utils.ICON_OFFSET]
		});

		let name;
		obj_box.change_name = () => {
			name = obj.name
			if (obj instanceof AMES_Transformation) {
				let obj_name_parts = obj.name.split(" ");
				let num = obj_name_parts[1];
				let mapping = obj.get_mapping();
				if (mapping) {
					mapping = mapping[0].toUpperCase() + mapping.substr(1);
					name = "T" + num + " " + mapping;
				}
			}
			box_label.content = name;
		}
		obj_box.change_name();

		// Remove btn to remove obj
		let trash = ames.icons['trash'].clone();
		let trash_w = trash.bounds.width;
		trash.scaling = .825
		trash.visible = true;
		trash.position = new Point(box.position.x + box.bounds.width/2 - trash_w, box.position.y);
		trash.bringToFront();
		trash.onClick = (e) => {
			obj.remove();
			this.update_layers({remove: true, box: obj_box});
			obj_box.remove();
		};

		obj_box.addChildren([box, box_label, trash])

		// Visibility btns to toggle visibility
		let eye = ames.icons['eye'].clone();
		let eye_slash = ames.icons['eye-slash'].clone();
		let eye_w = eye.bounds.width;
		eye.visible = true;
		eye_slash.visible = false;
		let eye_pos = new Point(trash.position.x - eye_w - utils.ICON_OFFSET, box.position.y);
		eye.position = eye_pos;
		eye_slash.position = eye_pos;
		eye.bringToFront();
		eye_slash.bringToFront();
		eye.onClick = (e) => {
			eye.visible = false;
			eye_slash.visible = true;
			obj.show(false);
		}
		eye_slash.onClick = (e) => {
			eye_slash.visible = false;
			eye.visible = true;
			ames.hide_editors(obj);
			obj.show(true);
		}
		obj_box.addChildren([eye, eye_slash]);
		if (obj instanceof AMES_Transformation) {
			// For a transformation toggle whether or not the transformation space is visible
			let axes = ames.icons['axes'].clone();
			let axes_w = axes.bounds.width;
			axes.position = new Point(eye_pos.x - axes_w - utils.ICON_OFFSET, box.position.y)
			axes.active = obj.tf_space_visible;
			if (axes.active) {
				axes.strokeColor = utils.ACTIVE_S_COLOR;
				axes.fillColor = utils.ACTIVE_S_COLOR;
			}
			axes.onClick = (e) => {
				if (axes.active) {
					axes.strokeColor = utils.INACTIVE_S_COLOR;
					axes.fillColor = utils.INACTIVE_S_COLOR;
					obj.toggle_show_tf({"deactivate": true});
					axes.active = false;
				} else {
					axes.strokeColor = utils.ACTIVE_S_COLOR;
					axes.fillColor = utils.ACTIVE_S_COLOR;
					obj.toggle_show_tf();
					axes.active = true;
				}
			}
			axes.visible = true;
			axes.bringToFront();
			obj_box.addChild(axes);
		}

		this.update_layers({insert: true, box: obj_box});
	}


	add_obj(x, t_obj) {
		this.objs[x.name] = x;
		// Hide all open editors
		this.hide_editors(x);
		this.create_layers_box(x);

		// let n = x.name;
		// let box_idx;
		// if (t_obj == utils.L_CONTROLS[0]) {
		// 	box_idx = this.l_shape_idx;
		// 	this.l_shape_idx += 1;
		// }
		// if (t_obj == utils.L_CONTROLS[1]) {
		// 	// this.n_lists += 1;
		// 	// let n_list = this.n_lists - 1;
		// 	// n = "List " + n_list + " (" + x.get_name() + ") ";
		// 	box_idx = this.l_shape_idx + this.l_list_idx;
		// 	this.l_list_idx += 1;
		// }
		// if (t_obj == utils.L_CONTROLS[2]) {
		// 	box_idx = this.l_shape_idx + this.l_list_idx + this.l_aobj_idx;
		// 	this.l_aobj_idx += 1;
		// }
		//
		// // Add obj
		// this.objs[n] = x;
		//
		// // Create obj box in layers view
		//
		// // Activate layers project
		// let w = 250;
		//
		// // Create a new layers ui box
		// let box = new Group();
		// box.position = new Point(0,0);
		// let by = utils.LAYER_HEIGHT;
		// // Background rectangle
		// let rect = new Shape.Rectangle({
		// 	point: [0, 0],
		// 	size: [w, by],
		// 	strokeColor: utils.INACTIVE_S_COLOR,
		// 	strokeWidth: 1,
		// 	fillColor: utils.INACTIVE_DARK_COLOR,
		// 	opacity: 1
		// });
		// // Object name
		// let n_text = new PointText({
		// 	point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
		// 	content: n,
		// 	fillColor: utils.INACTIVE_S_COLOR,
		// 	fontFamily: utils.FONT,
		// 	fontSize: utils.FONT_SIZE
		// });
		//
		// // Remove icon
		// let trash = ames.icons['trash'].clone();
		// let trash_w = trash.bounds.width;
		// trash.visible = true;
		// trash.position = new Point(w-trash_w/2-utils.ICON_OFFSET, by/2);
		//
		// // Visibility icons
		// let eye = ames.icons['eye'].clone();
		// let eye_slash = ames.icons['eye-slash'].clone();
		// let eye_w = eye.bounds.width;
		// eye.visible = true;
		// eye_slash.visible = false;
		// let eye_pos = new Point(w-trash_w-eye_w/2-2*utils.ICON_OFFSET, by/2);
		// eye.position = eye_pos;
		// eye_slash.position = eye_pos;
		//
		// // Add children to box
		// box.addChild(rect);
		// box.addChild(n_text);
		// box.addChild(trash);
		// box.addChild(eye);
		// box.addChild(eye_slash);
		//
		// // Set active box to false
		// box.is_active_box = true;
		//
		// // Add box to ames controls
		// this.idx_boxes.splice(box_idx, 0, n);
		// this.obj_boxes[n] = box;
		// if (t_obj == utils.L_CONTROLS[2]) console.log("adding animation box?", box_idx, box);
		//
		// // Insert box & update the locations of the other boxes
		// let ny = box_idx*by + by/2 + box_idx*.5;
		// box.position = new Point(w/2, ny);
		// let n_boxes = this.idx_boxes.length;
		// for (let i = box_idx + 1; i < n_boxes; i++) {
		// 	let b_name = this.idx_boxes[i];
		// 	this.obj_boxes[b_name].position.y += (by+.5);
		// }
		//
		// // Click on layers obj box selects the object
		// box.onClick = (e) => {
		// 	// if the point is not a click on the children return .
		// 	for (let idx in box.children) {
		// 		if (idx != 0 && box.children[idx].bounds.contains(e.point)) return;
		// 	}
		// 	if (box.is_active_box) {
		// 		// deactivate object
		// 		this.deactivate_obj(n);
		// 		delete this.active_objs[n];
		// 	} else {
		// 		// activate object
		// 		this.activate_obj(n);
		// 		this.active_objs[n] = x;
		// 	}
		// 	box.is_active_box = !box.is_active_box;
		// };
		//
		// // Remove object on clicking the trash can
		// trash.onClick = (e) => {
		// 	// Box has to be active to delete an object
		// 	if (box.is_active_box) {
		// 		this.remove_obj(n, t_obj);
		// 	}
		// };
		//
		// // Toggle visibility on clicking the eye
		// eye.onClick = (e) => {
		// 	// Box has to be active to toggle visibility
		// 	if (!box.is_active_box) return;
		// 	eye.visible = false;
		// 	eye_slash.visible = true;
		// 	x.show(false);
		// 	// Remove from active objs until visible
		// 	delete this.active_objs[x.name];
		// }
		// eye_slash.onClick = (e) => {
		// 	// Box has to be active to toggle visibility
		// 	if (!box.is_active_box) return;
		// 	eye_slash.visible = false;
		// 	eye.visible = true;
		// 	x.show(true);
		// 	// Add back to active objs
		// 	// Remove from active objects
		// 	this.active_objs[x.name] = x;
		// }
		//
		// // start objects as active
		// this.activate_obj(n);
		// this.active_objs[n] = x;
	}

	// active_obj: Activates layers box and enables object selection
	activate_obj(n) {
		let x = this.objs[n];
		x.make_interactive(true);
		x.show_editor(true);

		// // Activate layers box
		// let box = this.obj_boxes[n];
		// box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_COLOR;
		// box.children[utils.L_IDX_BOX].strokeColor = utils.ACTIVE_S_COLOR;
		// box.children[utils.L_IDX_NAME].fillColor = utils.ACTIVE_S_COLOR;
		// for (let idx in utils.L_IDX_ICONS) {
		// 	box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.ACTIVE_S_COLOR;
		// }
	}

	// deactivate_obj: Deactivates layers box and disables object selection
	deactivate_obj(n) {
		let x = this.objs[n];
		x.make_interactive(false);
		x.show_editor(false);

		// // Deactivate layers box
		// let box = this.obj_boxes[n];
		// box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_DARK_COLOR;
		// box.children[utils.L_IDX_BOX].strokeColor = utils.INACTIVE_S_COLOR;
		// box.children[utils.L_IDX_NAME].fillColor = utils.INACTIVE_S_COLOR;
		// for (let idx in utils.L_IDX_ICONS) {
		// 	box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.INACTIVE_S_COLOR;
		// }
	}

	remove_obj(n, t_obj) {
		// Remove from objs in ames
		if (this.objs[n].is_list) {
			delete this.lists[n];
		}
		this.objs[n].show(false);
		this.objs[n].remove();
		delete this.objs[n];

		// Remove from active objs if necessary
		if (this.active_objs[n]) {
			this.active_objs[n].remove();
			delete this.active_objs[n];
		}

		if (this.objs[n].is_list) {
			delete this.lists[n];
		}

		// Update length of entries for appropriate type of obj
		if (t_obj == utils.L_CONTROLS[0]) this.l_shape_idx -= 1;
		if (t_obj == utils.L_CONTROLS[1]) this.l_list_idx -= 1;
		if (t_obj == utils.L_CONTROLS[2]) this.l_aobj_idx -= 1;

		// Remove layers box - first identify the correct box in the ordered list
		let idx = 0;
		for (let i in this.idx_boxes) {
			if (this.idx_boxes[i] === n) idx = i;
		}
		// Remove the old box
		this.idx_boxes.splice(idx, 1);
		this.obj_boxes[n].visible = false;
		delete this.obj_boxes[n];
		// Then move up the other boxes
		let by = utils.LAYER_HEIGHT;
		for (let i = idx; i < this.idx_boxes.length; i++) {
			let m = this.idx_boxes[i];
			let m_box = this.obj_boxes[m];
			let ny = (i)*by + by/2 + (i)*.5;
			m_box.position = new Point(m_box.position.x, ny);
		}
	}

	// switch_shape_tool: toggles shape tool to enable drawing new shapes
	switch_tool(opt) {
		opt = opt || {};
		let b = opt.b;
		if (ames.toolbar.active_btn == b || opt.deactivate) {
			if (b == 'Path') {
				this.tools[b].clean_tool(true);
			}
			ames.toolbar.deactivate_btn(b);
			ames.canvas.style.cursor = null;
			ames.toolbar.active_btn = null;
			this.tools['inactive_tool'].activate();
		} else {
			// Disable active shape button
			if (ames.toolbar.active_btn) {
				this.switch_tool({'b': ames.toolbar.active_btn, 'deactivate': true});
			}
			ames.canvas.style.cursor = 'crosshair';
			this.active_shape_btn = b;
			ames.toolbar.activate_btn(b);
			let tool = this.tools[b];
			tool.activate();
		}
	}

	// init_square_tool: creates tool to draw squares / rectangles
	init_square_tool() {
		let square_tool = new Tool();
		let x;
		// Adjust the scale of the circle
		// Set center point of circle and scale to desired radius
		let cb_start_square = (e) => {
			if (this.on_ux(e)) return;
			x = new AMES_Polygon();
			if (x.poly) {
				x.set_pos(e.point);
				x.poly.visible = true;
			}
			square_tool.onMouseDrag = cb_scale_circle;
		}
		let cb_scale_circle = (e) => {
			if (!x) return;
			let s = e.point.getDistance(x.poly.position) + 2;
			x.set_scale(s/10, s/10);
		}
		let cb_finish_square = (e) => {
			if (!x)return
			square_tool.onMouseDrag = null;
			x.to_path();
			x.poly.fillColor = utils.INACTIVE_COLOR;
			// this.add_shape(x);
			x = null
		}
		square_tool.onMouseDown = cb_start_square;
		square_tool.onMouseUp = cb_finish_square;
		return square_tool;
	}

	// init_circle_tool: creates tool to draw circles / ellipses
	init_circle_tool() {
		let circle_tool = new Tool();
		let c;
		// Adjust the scale of the circle
		// Set center point of circle and scale to desired radius
		let cb_start_circle = (e) => {
			if (this.on_ux(e)) return;
			c = new AMES_Ellipse();
			if (c.poly) {
				c.set_pos(e.point);
				c.poly.visible = true;
			}
			circle_tool.onMouseDrag = cb_scale_circle;
		}
		let cb_scale_circle = (e) => {
			if (!c) return;
			let s = e.point.getDistance(c.poly.position) + 2;
			c.set_scale(s, s);
		}
		let cb_finish_circle = (e) => {
			if (!c) return;
			circle_tool.onMouseDrag = null;
			c.to_path();
			c.poly.fillColor = utils.INACTIVE_COLOR;
			// this.add_shape(c);
			c = null;
		}
		circle_tool.onMouseDown = cb_start_circle;
		circle_tool.onMouseUp = cb_finish_circle;
		return circle_tool;
	}

	// init_path_tool: creates tool to draw paths
	init_path_tool() {
		let path_tool = new Tool();
		let x;
		let spt;
		let seg;
		let d_h1; let d_h2; let p1; let p2;
		let helper_shapes = [];

		let make_segment_controls = (s, e) => {
			let h1 = s.handleIn.add(s.point);
			let h2 = s.handleOut.add(s.point);
			p1 = utils.make_line(h1, s.point);
			p2 = utils.make_line(s.point, h2);
			d_h1 = utils.make_dot(h1);
			d_h2 = utils.make_dot(h2);
			let d = utils.make_square_dot(s.point);

			// Edit the path by dragging the anchor point
			d.onMouseDrag = (e) => {
				s.point = e.point;
				// update the manipulable dots and visual aids
				d.position = e.point;
				let n_h1 = s.handleIn.add(e.point);
				let n_h2 = s.handleOut.add(e.point);
				d_h1.position = n_h1;
				d_h2.position = n_h2;
				p1.firstSegment.point = n_h1;
				p1.lastSegment.point = e.point;
				p2.firstSegment.point = e.point;
				p2.lastSegment.point = n_h2;
			}

			// create handles with manipulable dots at endpoints to manipulate the path
			d_h1.onMouseDrag = (e) => {
				s.handleIn = e.point.subtract(s.point);
				p1.firstSegment.point = e.point;
				d_h1.position = e.point;
			}
			d_h2.onMouseDrag = (e) => {
				s.handleOut = e.point.subtract(s.point);
				p2.lastSegment.point = e.point;
				d_h2.position = e.point;
			}

			helper_shapes.push(d_h1, d_h2, d, p1, p2);
		}

		path_tool.clean_tool = (remove_path) => {
			if (remove_path && x) x.poly.remove();
			x = null; seg = null; d_h1 = null; d_h2 = null; p1 = null; p2 = null;
			for (let i in helper_shapes) {
				helper_shapes[i].remove();
			}
			helper_shapes = [];
			path_tool.onMouseDown = cb_start_path;
			path_tool.onMouseDrag = null;
		}

		// Initialize a new path
		let cb_start_path = (e) => {
			if (this.on_ux(e)) return;
			x = new AMES_Artwork_Path();
			path_tool.onMouseDown = cb_add_point;
			path_tool.onMouseDrag = cb_adjust_handle;
			cb_add_point(e);
		}

		let thresh = 144; // within 12px
		// Add point to line
		let cb_add_point = (e) => {
			if (this.on_ux(e)) {
				path_tool.clean_tool(true); return;
			}
			// If point is close enough to previous point or first point
			// finish path and reset tool
			if (x.poly.segments.length >= 2) {
				// Make closed path and reset
				if (utils.lengthsq(x.poly.firstSegment.point, e.point) < thresh) {
					console.log("closed path")
					x.poly.closed = true;
					x.finish_creating_path();
					// this.add_shape(x);
					path_tool.clean_tool();
					return;
				}
				// Make open-ended path
				if (utils.lengthsq(x.poly.lastSegment.point, e.point) < thresh) {
					console.log("open path");
					x.finish_creating_path();
					// this.add_shape(x);
					path_tool.clean_tool();
					return;
				}
			}
			x.poly.add(e.point);
			seg = x.poly.lastSegment;
			make_segment_controls(seg, e);
		}

		// Drag to manipulate handle
		let cb_adjust_handle = (e) => {
			// Adjust handle of last point drawn
			if (seg != x.poly.firstSegment) {
				seg.handleIn = seg.point.subtract(e.point);
				p1.firstSegment.point = seg.handleIn.add(seg.point);
				d_h1.position = seg.handleIn.add(seg.point);

				seg.handleOut = e.point.subtract(seg.point);
				p2.firstSegment.point = seg.handleOut.add(seg.point);
				d_h2.position = seg.handleOut.add(seg.point);
			}
		}

		// Add points to the path
		let cb_draw_path = (e) => {
			if (!x) return;
			dist += (e.event.movementX*e.event.movementX + e.event.movementY*e.event.movementY);
			console.log(dist);
			if (dist > 100) {
				x.poly.add(e.point);
				dist = 0;
			}

		}

		path_tool.onMouseDown = cb_start_path;
		return path_tool;
	}

	// init_list_tool: creates a list using underlying active shapes
	init_list_tool(opt) {
		opt = opt || {};
		let list_tool = new Tool();
		let TL = 1; let TR = 2; let BR = 3; let BL = 0;
		let lbox; let s_dot; let e_dot;
		let selected_shapes = {};
		let select_helpers = {};

		// Start rectangle to make list
		let cb_start_list = (e) => {
			if (this.on_ux(e)) return;

			lbox = new Path.Rectangle(e.point, 10);
			lbox.strokeColor = utils.ACTIVE_COLOR;
			lbox.strokeWidth = 1;
			lbox.dashArray = [3,1];

			// Create boundary dots
			s_dot = utils.make_dot(lbox.segments[TL].point, utils.ACTIVE_COLOR);
			e_dot = utils.make_dot(lbox.segments[BR].point, utils.ACTIVE_COLOR);
		}

		// Increase rectangle size and highlight activated shapes that the
		// selection rectangle to make a list contains
		let cb_select_shapes = (e) => {
			console.log("select shapes");
			if (!lbox) return;
			lbox.segments[BR].point = e.point;
			lbox.segments[TR].point.x = e.point.x;
			lbox.segments[BL].point.y = e.point.y;
			e_dot.position = e.point;

			// From active shapes select shapes
			let lbox_bbox = lbox.strokeBounds;

			for (let i in this.objs) {
				let s = this.objs[i];
				if (s.is_artwork) {
					let s_bbox = s.get_bbox();
					// If bbox contains shape...
					if (lbox_bbox.contains(s_bbox)) {
						// If shape is not in selected shape...
						if (!selected_shapes[s.name]) {
							// Add it to the selected shapes and highlight it
							selected_shapes[s.name] = s;
							select_helpers[s.name] = utils.make_rect(s_bbox, utils.ACTIVE_COLOR);
						}
					} else {
						// Otherwise if it was selected...
						if (selected_shapes[s.name]) {
							select_helpers[s.name].remove();
							// Remove it from the selected shapes
							delete selected_shapes[s.name];
							delete select_helpers[s.name];
						}
					}
				}
			}
		}

		// If active shapes are selected, make a list using those forms
		let cb_make_list = (e) => {
			console.log("make list", selected_shapes);
			let shapes = [];
			for (let k in selected_shapes) shapes.push(selected_shapes[k]);
			if (shapes.length !=0 ) {
				if (shapes.length == 1) {
					console.log("shapes length = 1", shapes)
					opt.is_duplicator = true;
				}
				let list = new AMES_Collection(shapes, opt);
			}

			// clean tool shapes
			for (let i in select_helpers) {
				let s = select_helpers[i];
				s.remove();
			}
			if (lbox) lbox.remove(); if (s_dot) s_dot.remove(); if (e_dot) e_dot.remove();
			lbox = null; s_dot = null; e_dot = null;
			selected_shapes = {}; select_helpers = [];
		}

		list_tool.onMouseDown = cb_start_list;
		list_tool.onMouseDrag = cb_select_shapes;
		list_tool.onMouseUp = cb_make_list;
		return list_tool;
	}

	// // init_duplicator_tool: creates a duplicator using underlying active shapes
	// init_duplicator_tool() {
	// 	let list_tool = new Tool();
	// 	let TL = 1; let TR = 2; let BR = 3; let BL = 0;
	// 	let lbox; let s_dot; let e_dot;
	// 	let selected_shapes = {};
	// 	let select_helpers = {};
	//
	// 	// Start rectangle to make list
	// 	let cb_start_list = (e) => {
	// 		console.log("start list");
	//
	// 		lbox = new Path.Rectangle(e.point, 10);
	// 		lbox.strokeColor = utils.ACTIVE_COLOR;
	// 		lbox.strokeWidth = 1;
	// 		lbox.dashArray = [3,1];
	//
	// 		// Create boundary dots
	// 		s_dot = utils.make_dot(lbox.segments[TL].point, utils.ACTIVE_COLOR);
	// 		e_dot = utils.make_dot(lbox.segments[BR].point, utils.ACTIVE_COLOR);
	// 	}
	//
	// 	// Increase rectangle size and highlight activated shapes that the
	// 	// selection rectangle to make a list contains
	// 	let cb_select_shapes = (e) => {
	// 		console.log("select shapes");
	// 		if (!lbox) return;
	// 		lbox.segments[BR].point = e.point;
	// 		lbox.segments[TR].point.x = e.point.x;
	// 		lbox.segments[BL].point.y = e.point.y;
	// 		e_dot.position = e.point;
	//
	// 		// From active shapes select shapes
	// 		let lbox_bbox = lbox.strokeBounds;
	//
	// 		for (let i in this.active_objs) {
	// 			let s = this.active_objs[i];
	// 			if (s.is_shape) {
	// 				let s_bbox = s.get_bbox();
	// 				// If bbox contains shape...
	// 				if (lbox_bbox.contains(s_bbox)) {
	// 					// If shape is not in selected shape...
	// 					if (!selected_shapes[s.name]) {
	// 						// Add it to the selected shapes and highlight it
	// 						selected_shapes[s.name] = s;
	// 						select_helpers[s.name] = utils.make_rect(s_bbox, utils.ACTIVE_COLOR);
	// 					}
	// 				} else {
	// 					// Otherwise if it was selected...
	// 					if (selected_shapes[s.name]) {
	// 						select_helpers[s.name].remove();
	// 						// Remove it from the selected shapes
	// 						delete selected_shapes[s.name];
	// 						delete select_helpers[s.name];
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	//
	// 	// If active shapes are selected, make a list using those forms
	// 	let cb_make_list = (e) => {
	// 		console.log("make list");
	// 		let shapes = [];
	// 		for (let k in selected_shapes) shapes.push(selected_shapes[k]);
	// 		if (shapes.length !=0 ) {
	// 			let list = new AMES_Duplicator(shapes);
	// 		}
	//
	// 		// clean tool shapes
	// 		for (let i in select_helpers) {
	// 			let s = select_helpers[i];
	// 			s.remove();
	// 		}
	// 		lbox.remove(); s_dot.remove(); e_dot.remove();
	// 		lbox = null; s_dot = null; e_dot = null;
	// 		selected_shapes = {}; select_helpers = [];
	// 	}
	//
	// 	list_tool.onMouseDown = cb_start_list;
	// 	list_tool.onMouseDrag = cb_select_shapes;
	// 	list_tool.onMouseUp = cb_make_list;
	// 	return list_tool;
	// }

	init_constraint_tool() {
		let constraint_tool = new Tool();

		let line; let line_start;
		let c_relative_box;
		let curr_obj; let c_reference_box;
		let point_in_box = false;

		let clean_constraint_tool = () => {
			if (c_reference_box) {
				c_reference_box.remove();
				//if (curr_obj && curr_obj.is_list) curr_obj.list_box.visible = true;
			}
			if (c_relative_box) {
				c_relative_box.remove();
				if (ames.c_relative && ames.c_relative.is_list) ames.c_relative.list_box.visible = true;
			}
			if (line) line.remove();
			c_reference_box = null;
			c_relative_box = null;
			line = null;
			line_start = null;
			curr_obj = null;
			point_in_box = false;
		}


		let cb_start_constraint = (e) => {
			clean_constraint_tool();
			if (!this.on_canvas(e)) return;
			if (!this.active_objs[this.c_relative.name]) { return; }
			// console.log("The relative is " + ames.c_relative.name);
			line_start = ames.c_relative.editor.constraint_info.link.position;
			console.log(line_start);
			line = new Path.Line(line_start, e.point);
			line.strokeWidth = 1;
			line.dashArray = [3,1];
			line.strokeColor = utils.ACTIVE_COLOR;
			c_relative_box = ames.c_relative.highlight(utils.C_RELATIVE_COLOR);
			if (ames.c_relative.is_list) ames.c_relative.list_box.visible = false;
			curr_obj = null;
			c_reference_box = null;
			point_in_box = false;
		}

		let cb_select_obj = (e) => {
			if (!this.active_objs[this.c_relative.name]) { clean_constraint_tool(); return; }
			if (!line) { clean_constraint_tool(); return; }
			point_in_box = false;
			// If end point is the bounding box of an active object
			for (let k in this.active_objs) {
				// Snap the endpoint to the closest bounding box corner
				let obj = this.active_objs[k];
				if (obj != ames.c_relative) {
					if (obj.contains(e.point)) {
						// Attach line to bbox corner with closest match
						let p = obj.get_closest_bbox_corner(line_start);
						if (p) line.lastSegment.point = p;
						else line.lastSegment.point = e.point;
						if (obj != curr_obj) {
							// Update highlighted object
							if (c_reference_box) {
								c_reference_box.remove();
							}
							c_reference_box = obj.highlight(utils.C_REFERENCE_HIGHLIGHT);
							curr_obj = obj;
							// If list, hide list box
							if (curr_obj.is_list) curr_obj.list_box.visible = false;

						}
						point_in_box = true;
					}
				}
			}

			if (!point_in_box) {
				line.lastSegment.point = e.point;
				if (c_reference_box) {
					c_reference_box.remove();
					c_reference_box = null;
				}
				curr_obj = null;
			}
		}

		let cb_enable_constraint = (e) => {
			// Create & preview constraint
			let link = ames.c_relative.editor.constraint_info.link;
			let link_remove = ames.c_relative.editor.constraint_info.link_remove;
			if (curr_obj) {
				let rel = ames.c_relative;
				let p = ames.c_relative.active_prop;
				let sub_p = ames.c_relative.active_sub_p;
				// console.log("p and sub_p", p, sub_p);
				console.log("constrain", rel.name, curr_obj.name, p, sub_p)
				let constraint = new AMES_Constraint(rel, curr_obj, p, sub_p, {
					'c_rel_box': c_relative_box,
					'c_ref_box': c_reference_box,
					'is_manual_constraint': true
				});
				// console.log("made constraint", constraint);
				// console.log('p + sub_p', p, sub_p);
				ames.c_relative.update_constraints();
				link.visible = false;
				link_remove.visible = true;
			}

			// Turn off constraint tool
			ames.tools['inactive_tool'].activate();
			link.strokeColor = utils.INACTIVE_S_COLOR;
			clean_constraint_tool();
		}

		constraint_tool.onMouseDown = cb_start_constraint;
		constraint_tool.onMouseDrag = cb_select_obj;
		constraint_tool.onMouseUp = cb_enable_constraint;
		return constraint_tool;
	}

	init_animation_link_tool() {
		let animation_link_tool = new Tool();

		let line; let line_start;
		let c_relative_box;
		let curr_obj; let c_reference_box;
		let point_in_box = false;

		let clean_animation_link_tool = () => {
			if (c_reference_box) {
				c_reference_box.remove();
				// if (curr_obj && curr_obj.is_list) curr_obj.list_box.visible = true;
			}
			if (line) line.remove();
			c_reference_box = null;
			line = null;
			line_start = null;
			curr_obj = null;
			point_in_box = false;
		}


		let cb_start_animation_link = (e) => {
			if (this.on_ux(e)) return;
			clean_animation_link_tool();
			console.log("starting animation link connection?")
			line_start = this.active_linking_transformation.editor.geometry_field_info[this.transformation_active_field].link.position;
			console.log("line_start", line_start);
			line = new Path.Line(line_start, e.point);
			line.strokeWidth = 1;
			line.dashArray = [3,1];
			line.strokeColor = utils.ACTIVE_COLOR;
			curr_obj = null;
			c_reference_box = null;
			point_in_box = false;
		}

		let cb_select_obj = (e) => {
			//line.lastSegment.point = e.point;
			if (!line) { clean_animation_link_tool(); return; }
			point_in_box = false;
			let containing_objs = [];
			// If end point is the bounding box of an active object
			for (let k in this.objs) {
				// Snap the endpoint to the closest bounding box corner
				let obj = this.objs[k];
				if (obj.is_artwork) {
					if (obj.contains(e.point)) {
						containing_objs.push(obj);
						point_in_box = true;
					}
				}
			}

			if (point_in_box) {
				let min_dist = Number.MAX_SAFE_INTEGER;
				let closest_obj = null;
				for (let i in containing_objs) {
					let obj = containing_objs[i];
					let d = obj.get_distance_from_bbox_center_to_point(e.point);
					if (d < min_dist) {
						min_dist = d;
						closest_obj = obj;
					}
				}

				if (curr_obj != closest_obj) {
					// Update highlighted object
					if (c_reference_box) {
						c_reference_box.remove();
					}
					c_reference_box = closest_obj.highlight(utils.C_REFERENCE_HIGHLIGHT);
					curr_obj = closest_obj;
					// If list, hide list box
					if (curr_obj.is_list) curr_obj.list_box.visible = false;
				}

			} else {
				if (c_reference_box) {
					c_reference_box.remove();
					c_reference_box = null;
				}
				curr_obj = null;
			}
			line.lastSegment.point = e.point;
		}

		let cb_enable_animation_link = (e) => {
			// Set animation geometry field as specified
			let geometry_field_info = ames.active_linking_transformation.editor.geometry_field_info[ames.transformation_active_field]
			let link = geometry_field_info.link;
			let link_remove = geometry_field_info.link_remove;
			if (curr_obj) {
				let rel = ames.active_linking_transformation;
				ames.active_linking_transformation.set_geometry_field(ames.transformation_active_field, curr_obj);
				ames.active_linking_transformation.editor.geometry_field_info[ames.transformation_active_field].label.content = curr_obj.name;
				link.visible = false;
				link_remove.visible = true;
			}

			// Turn off constraint tool
			ames.tools['inactive_tool'].activate();
			link.strokeColor = utils.INACTIVE_S_COLOR;
			clean_animation_link_tool();
		}

		animation_link_tool.onMouseDown = cb_start_animation_link;
		animation_link_tool.onMouseDrag = cb_select_obj;
		animation_link_tool.onMouseUp = cb_enable_animation_link;
		return animation_link_tool;
	}

	init_animation_tool() {
		let animation_tool = new Tool();

		let create_animation_box = () => {
			// Create empty animation object
		}

		let cb_make_animation = (e) => {
			if (this.on_canvas(e)) {
				// Create box and show animation editor
				let a = new AMES_Animation();
			}
		}

		let cb_deactivate_tool = (e) => {
			this.switch_tool({b: "Animation", deactivate: true});
		}

		animation_tool.onMouseDown = cb_make_animation;
		animation_tool.onMouseUp = cb_deactivate_tool;
		return animation_tool;
	}

	init_create_transformation_tool() {
		let create_transformation_tool = new Tool();

		let cb_make_transformation_function = (e) => {
			if (this.on_ux(e)) return;
			let tf = new AMES_Transformation();
		}

		let cb_deactivate_tool = (e) => {
			this.switch_tool({b: "Transformation", deactivate: true});
		}

		create_transformation_tool.onMouseDown = cb_make_transformation_function;
		create_transformation_tool.onMouseUp = cb_deactivate_tool;
		return create_transformation_tool;
	}


	// on_canvas: determines if event fired is on the animation canvas
	on_canvas(e) {
		let a = e.event.clientX;
		let b = e.event.clientY - 40;
		let p = new Point(a,b);
		return this.canvas_view.bounds.contains(p);
	}

	on_ux(e) {
		let on_ux = false;
		for (let idx in this.ux) {
			let x = this.ux[idx];
			let bounds = x.bounds;
			if (x.strokeBounds) bounds = x.strokeBounds;
			if (bounds.contains(e.point)) {
				on_ux = true;
			}
		}
		return on_ux;
	}

}
