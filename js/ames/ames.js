// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Square, AMES_Circle, AMES_Path} from './shapes.js'
import {AMES_Shape_Editor} from './editors.js'
import {AMES_Animation} from './animations.js'

// Globals for ames
// ames.canvas_cx;
// ames.canvas_cy;
// ames.animations;

export class AMES {
	// controls
	active_shape_btn;
	objs = {};
	n_shapes = 0;
	n_lists = 0;
	n_aobjs = 0;
	n_shapes = 1;
	l_shape_idx = 1;
	n_lists = 1;
	l_list_idx = 1;
	n_aobjs = 1;
	l_aobjs_idx = 1;
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
	fps = 60;
	time = 0;			// time in system
	t_delta = 0; 		// time between elapsed frames
	dur = 10; 			// in seconds
	// State
	animations;
	is_playing = false;
	is_looping = false;
	reset_time = false;

	// Iniitalize AMES app properties after window loads
	init() {
		// Get references to canvas objects
		let canvas = document.getElementById('animation-canvas');
		// let controls = document.getElementById('control-canvas');
		let layers = document.getElementById('layers-canvas');

		// Store animation canvas properties
		window.ames.canvas = canvas;
		window.ames.canvas_cx = canvas.width/2;
		window.ames.canvas_cy = canvas.height/2;
		window.ames.animations = {};

		// // Set up project & view for controls - DELETE OLD CODE w/ SCRUBBER
		// paper.setup(controls);
		// this.init_controls(controls);

		// Set up project & view for layers
		paper.setup(layers);
		this.init_layers();

		// Set up project & view for animation canvas
		paper.setup(canvas);
		this.init_canvas(canvas);

		// Make drawing tools
		this.tools['inactive_tool'] = new Tool();
		this.tools['Path'] = this.init_path_tool();
		this.tools['Circle'] = this.init_circle_tool();
		this.tools['Square'] = this.init_square_tool();


		// Import any necessary icons
		this.idx_boxes = new Array();
		this.setup_layers();


		this.import_icons();

		// Layers: create empty array for shapes



	}

	// import_icon: imports *.svg from local dir ../svg/
	import_icons() {
		let icons = ["eye", "eye-slash", "trash", "caret-down", "caret-right",
			"position", "scale", "rotation", "fill", "strokewidth", "strokecolor",
			"close"];
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
			console.log('imported ', n);

			if (n == 'caret-down' || n == 'caret-right') {
				ames.icon_caret(n);
			}


		});
	}

	// icon_caret: use caret to expand & contract layers controls
	icon_caret(i_name) {
		let by = utils.LAYER_HEIGHT;
		for (let idx in utils.L_CONTROLS) {
			let n = utils.L_CONTROLS[idx];
			let box = ames.obj_boxes[n];

			console.log(n);

			let caret = this.icons[i_name].clone();
			let caret_w = caret.bounds.width;
			caret.scaling = 0.65;

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
		console.log("expand_layers", t_obj, bool);
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
		console.log(start_idx, end_idx, count);
		// Show or hide
		for (let i = start_idx; i < end_idx; i++) {
			let n = this.idx_boxes[i];
			let box = this.obj_boxes[n];
			box.visible = bool;
		}
		// Adjust position of subsequent boxes
		let by = utils.LAYER_HEIGHT;
		let n_boxes = this.idx_boxes.length;
		console.log(end_idx, n_boxes);
		for (let i = end_idx; i < n_boxes; i++) {
			let n = this.idx_boxes[i];
			let box = this.obj_boxes[n];
			console.log(box);
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
			console.log("Clicked on controls_view");
			// this._project.activate();
		}
	}

	init_layers() {
		this.layers_view = view;

		this.layers_view.onClick = function(e) {
			console.log("Clicked on layers_view");
			// this._project.activate();
		}
	}

	setup_layers() {
		// Activate layers project
		this.layers_view._project.activate();

		// Add control boxes for shapes, lists, animations
		let controls = utils.L_CONTROLS;
		let w = this.layers_view.size.width;
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
			console.log(box);
			// Add box to ames controls
			this.idx_boxes[n_boxes] = c_name;
			this.obj_boxes[c_name] = box;
		}

		// Activate canvas
		this.canvas_view._project.activate();
	}

	init_canvas(canvas) {
		this.canvas_view = view;

		let frame_trigger_dur = 1/ames.fps;
		let eps = frame_trigger_dur/10;
		console.log("trigger_dur", frame_trigger_dur);
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
				// console.log(ames.time);

				// If complete, complete the animation and either stop or loop
				if (ames.time + (ames.t_delta - eps)/ames.dur >= 1) {
					console.log("completing animation");
					console.log(ames.time);
					ames.t_delta = (1 - ames.time)*ames.dur;
					console.log(ames.t_delta);
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

	adjust_t_delta() {
		let x = this.time * this.dur * this.fps;
		this.t_delta = (x - Math.floor(x)) * 1/this.fps;
	}

	update_animations() {
		// Takes this.time and updates the animations accordingly
	}

	play() {
		console.log("play animations");
		// Start playing and reset system time
		if (!this.is_playing) {
			if (ames.time != 0) this.adjust_t_delta();
			this.is_playing = true;
		}
	}

	pause() {
		console.log("pause animations");
		this.is_playing = false;
		// Pause animations
		console.log(this.animations);
		for (let k in this.animations) {
			let a = this.animations[k];
			console.log(a.curr_tw);
			a.curr_tw.stop();
			setTimeout(() => {a.curr_tw.start(); a.curr_tw.update(.2);}, 500);

			// a.curr_tw.object.opacity = 1;
		}
	}

	loop() {
		this.is_looping = !this.is_looping;
		console.log("loop animations: ", this.is_looping);
	}

	get_time_from_scrubber() {
		let sc_x = this.scrubber.position.x;
		let t = (sc_x - this.min_sc) / (this.max_sc - this.min_sc);
		return t;
	}

	update_scrubber_to_time() {
		let sc_x = (this.time * (this.max_sc - this.min_sc)) + this.min_sc;
		return sc_x;
	}

	set_time(t) {
		this.time = t;
		this.adjust_t_delta;
		console.log("update time to: ", t);
	}

	get_duration(x) {
		return 1000;
	}

	// Constructor for ames (empty)
	constructor() {
		// Warning: ames is not defined here
	}

	test() {
		let animation = new AMES_Animation();
		animation.animate();
	}

	// add_shape: adds given object as a shape
	add_shape(x) {
		x.create_path_control_shapes();
		this.expand_layers(utils.L_CONTROLS[0], true);

		this.n_shapes += 1;
		let n_shape = this.n_shapes - 1;
		x.name = "Shape " + n_shape + " (" + x.get_name() + ") ";
		x.editor = new AMES_Shape_Editor(x);
		this.add_obj(x, utils.L_CONTROLS[0]);
	}

	add_obj(x, t_obj) {

		let n = x.name;
		let box_idx;
		if (t_obj == utils.L_CONTROLS[0]) {
			box_idx = this.l_shape_idx;
			this.l_shape_idx += 1;
		}
		if (t_obj == utils.L_CONTROLS[1]) {
			this.n_lists += 1;
			let n_list = this.n_lists - 1;
			n = "List " + n_list + " (" + x.get_name() + ") ";
			box_idx = this.l_shape_idx + this.l_list_idx;
			this.l_list_idx += 1;
		}
		if (t_obj == utils.L_CONTROLS[2]) {
			this.n_aobjs += 1;
			let n_aboj = this.n_aobjs - 1;
			n = "Animation Obj " + n_aboj + " (" + x.get_name() + ") ";
			box_idx = this.l_shape_idx + this.l_list_idx + this.l_aobj_idx;
			this.l_aobj_idx += 1;
		}

		// Rename obj
		x.name = n;
		// Add obj
		this.objs[n] = x;

		// Create obj box in layers view

		// Activate layers project
		this.layers_view._project.activate();
		let w = this.layers_view.size.width;
		let h = this.layers_view.size.height;

		// Create a new layers ui box
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
			point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
			content: n,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});

		// Remove icon
		let trash = ames.icons['trash'].clone();
		let trash_w = trash.bounds.width;
		trash.visible = true;
		trash.position = new Point(w-trash_w/2-utils.ICON_OFFSET, by/2);

		// Visibility icons
		let eye = ames.icons['eye'].clone();
		let eye_slash = ames.icons['eye-slash'].clone();
		let eye_w = eye.bounds.width;
		eye.visible = true;
		eye_slash.visible = false;
		let eye_pos = new Point(w-trash_w-eye_w/2-2*utils.ICON_OFFSET, by/2);
		eye.position = eye_pos;
		eye_slash.position = eye_pos;

		// Add children to box
		box.addChild(rect);
		box.addChild(n_text);
		box.addChild(trash);
		box.addChild(eye);
		box.addChild(eye_slash);

		// Set active box to false
		box.is_active_box = false;

		// Add box to ames controls
		this.idx_boxes.splice(box_idx, 0, n);
		this.obj_boxes[n] = box;

		// Insert box & update the locations of the other boxes
		let ny = box_idx*by + by/2 + box_idx*.5;
		box.position = new Point(w/2, ny);
		console.log(box.position);
		let n_boxes = this.idx_boxes.length;
		for (let i = box_idx + 1; i < n_boxes; i++) {
			let b_name = this.idx_boxes[i];
			this.obj_boxes[b_name].position.y += (by+.5);
		}

		// Click on layers obj box selects the object
		box.onClick = (e) => {
			// if the point is not a click on the children return .
			for (let idx in box.children) {
				if (idx != 0 && box.children[idx].bounds.contains(e.point)) return;
			}
			if (box.is_active_box) {
				// deactivate object
				this.deactivate_obj(n);
			} else {
				// activate object
				this.activate_obj(n);
			}
			box.is_active_box = !box.is_active_box;
		};

		// Remove object on clicking the trash can
		trash.onClick = (e) => {
			// Box has to be active to delete an object
			if (box.is_active_box) {
				this.remove_obj(n, t_obj);
			}
		};

		// Toggle visibility on clicking the eye
		eye.onClick = (e) => {
			// Box has to be active to toggle visibility
			if (!box.is_active_box) return;
			console.log(box.is_active_box);
			eye.visible = false;
			eye_slash.visible = true;
			x.show(false);
		}
		eye_slash.onClick = (e) => {
			// Box has to be active to toggle visibility
			if (!box.is_active_box) return;
			console.log(box.is_active_box);
			eye_slash.visible = false;
			eye.visible = true;
			x.show(true);
		}

		// Re-activate main project
		this.canvas_view._project.activate();
	}

	// active_obj: Activates layers box and enables object selection
	activate_obj(n) {
		let x = this.objs[n];
		x.make_interactive(true);
		x.show_editor(true);

		// Activate layers box
		let box = this.obj_boxes[n];
		box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_COLOR;
		box.children[utils.L_IDX_BOX].strokeColor = utils.ACTIVE_S_COLOR;
		box.children[utils.L_IDX_NAME].fillColor = utils.ACTIVE_S_COLOR;
		for (let idx in utils.L_IDX_ICONS) {
			box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.ACTIVE_S_COLOR;
		}
	}


	// deactivate_obj: Deactivates layers box and disables object selection
	deactivate_obj(n) {
		let x = this.objs[n];
		x.make_interactive(false);
		x.show_editor(false);

		// Deactivate layers box
		let box = this.obj_boxes[n];
		box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_DARK_COLOR;
		box.children[utils.L_IDX_BOX].strokeColor = utils.INACTIVE_S_COLOR;
		box.children[utils.L_IDX_NAME].fillColor = utils.INACTIVE_S_COLOR;
		for (let idx in utils.L_IDX_ICONS) {
			box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.INACTIVE_S_COLOR;
		}
	}

	remove_obj(n, t_obj) {
		// Remove from objs in ames
		this.objs[n].show(false);
		delete this.objs[n];

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


	// select_obj: Enables path editing on the object and editing using layers box
	select_obj(n) {
		// TO IMPLEMENT
	}

	// switch_shape_tool: toggles shape tool to enable drawing new shapes
	switch_tool(opt) {
		opt = opt || {};
		let b = opt.b;
		if (utils.is_active(b) || opt.deactivate) {
			console.log('deactivate shape ' + b);
			utils.deactivate(b);
			ames.canvas.style.cursor = null;
			this.active_shape_btn = null;
			this.tools['inactive_tool'].activate();
		} else {
			// Disable active shape button
			if (this.active_shape_btn) {
				this.switch_tool({'b': this.active_shape_btn, 'deactivate': true});
			}
			ames.canvas.style.cursor = 'crosshair';
			this.active_shape_btn = b;
			utils.activate(b);
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
			if (!this.on_canvas(e)) return;
			x = new AMES_Square();
			if (x.poly) {
				x.set_pos(e.point);
				x.poly.visible = true;
			}
			square_tool.onMouseDrag = cb_scale_circle;
		}
		let cb_scale_circle = (e) => {
			if (!x) return;
			let s = e.point.getDistance(x.poly.position) + 2;
			x.poly.size = new Size(s, s);
		}
		let cb_finish_square = (e) => {
			if (!x)return
			square_tool.onMouseDrag = null;
			x.to_path();
			x.poly.fillColor = utils.INACTIVE_COLOR;
			this.add_shape(x);
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
			if (!this.on_canvas(e)) return;
			c = new AMES_Circle();
			if (c.poly) {
				c.set_pos(e.point);
				c.poly.visible = true;
			}
			circle_tool.onMouseDrag = cb_scale_circle;
		}
		let cb_scale_circle = (e) => {
			if (!c) return;
			c.poly.radius = e.point.getDistance(c.poly.position) + 2;
		}
		let cb_finish_circle = (e) => {
			if (!c) return;
			circle_tool.onMouseDrag = null;
			c.to_path();
			c.poly.fillColor = utils.INACTIVE_COLOR;
			this.add_shape(c);
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
		// Initialize a new path
		let cb_start_path = (e) => {
			if (!this.on_canvas(e)) return;
			x = new AMES_Path();
			path_tool.onMouseDrag = cb_draw_path;
		}
		// Add points to the path
		let cb_draw_path = (e) => {
			if (!x) return;
			x.poly.add(e.point);
		}
		// Simplify the path and reveal it
		let cb_simplify_path = (e) => {
			if (!x) return;
			path_tool.onMouseDrag = null;
			x.make_path_helper();
			this.add_shape(x);
			x = null;
		}
		path_tool.onMouseDown = cb_start_path;
		path_tool.onMouseUp = cb_simplify_path;
		return path_tool;
	}


	// on_canvas: determines if event fired is on the animation canvas
	on_canvas(e) {
		let a = e.event.clientX;
		let b = e.event.clientY;
		let p = new Point(a,b);
		return this.canvas_view.bounds.contains(p);
	}

}
