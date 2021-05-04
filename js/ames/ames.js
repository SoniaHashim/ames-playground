// ----------------------------------------------------------------------------
// ames.js
// Author: Sonia Hashim
//
// Description: AMES library to animate multiple elements simultaneously
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Circle, AMES_Path} from './shapes.js'
import {AMES_Animation} from './animations.js'

// Globals for ames
// ames.canvas_cx;
// ames.canvas_cy;
// ames.animations;

export class AMES {
	// controls
	active_shape_btn;
	shape_make_btns = {
		'Circle': this.make_circle,
		'Path': this.make_path,
	};
	// Views & controls
	canvas_view;
	controls_view;
	layers_view;
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
		let controls = document.getElementById('control-canvas');
		let layers = document.getElementById('layers-canvas');

		// Store animation canvas properties
		window.ames.canvas = canvas;
		window.ames.canvas_cx = canvas.width/2;
		window.ames.canvas_cy = canvas.height/2;
		window.ames.animations = {};

		// Set up project & view for controls
		paper.setup(controls);
		this.init_controls(controls);

		// Set up project & view for layers
		paper.setup(layers);
		this.init_layers();

		// Set up project & view for animation canvas
		paper.setup(canvas);
		this.init_canvas(canvas);
	}

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

	constructor() {
		// Warning: ames is not defined here
	}

	test() {
		let animation = new AMES_Animation();
		animation.animate();
	}

	make_circle(opt) {
		let b = "Circle";
		opt = opt || {};
		// If the button is active, deactivate it
		if (utils.is_active(b) || opt.deactivate) {
			console.log('makeSphere - deactivate');
			utils.deactivate(b);
			// Reset cursor
			ames.canvas.style.cursor = null;
			// Remove control
			ames.canvas.onclick = null;
			this.active_shape_btn = null;
		} else {
			// Turn off other active shape btns
			if (this.active_shape_btn) {
				this.shape_make_btns[this.active_shape_btn]({'deactivate': true});
			}
			console.log('makeSphere - activate');
			utils.activate(b);
			this.active_shape_btn = 'Circle';
			ames.canvas.style.cursor = 'crosshair';

			// Callback to make circle on click
			let cb_make_circle = (e) => {
				let c = new AMES_Circle();
				if (c.poly) {
					c.set_pos(utils.get_e_point(e));
					c.poly.visible = true;
				}
			}
			ames.canvas.onclick = cb_make_circle;
		}
	}

	make_path(opt) {
		let b = 'Path';
		opt = opt || {};
		if (utils.is_active(b) || opt.deactivate) {
			console.log('make_path - deactivate');
			utils.deactivate(b);
			// Reset cursor
			ames.canvas.style.cursor = null;
			// Reset controls
			ames.tool.onMouseDown = null;
			ames.tool.onMouseUp = null;
			this.active_shape_btn = null;
		} else {
			// Turn off other active shape btns
			if (this.active_shape_btn) {
				this.shape_make_btns[this.active_shape_btn]({'deactivate': true});
			}
			console.log('make_path - activate');
			utils.activate(b);
			this.active_shape_btn = 'Path';
			ames.canvas.style.cursor = 'crosshair';

			let x;
			let cb_start_path = (e) => {
				console.log("cb_start_path");
				x = new AMES_Path();
				ames.tool.onMouseDrag = cb_draw_path;
			}
			let cb_draw_path = (e) => {
				x.poly.add(e.point);
			}
			let cb_simplify_path = (e) => {
				console.log("cb_show_path_segments");
				ames.tool.onMouseDrag = null;
				x.make_shape_helper();
			}
			ames.tool.onMouseDown = cb_start_path;
			ames.tool.onMouseUp = cb_simplify_path;
		}

	}

}
