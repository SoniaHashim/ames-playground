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
	scrubber;
	// State
	animations; 

	// Iniitalize AMES app properties after window loads
	init() {
		// Get references to canvas objects
		let canvas = document.getElementById('animation-canvas');
		let controls = document.getElementById('control-canvas');
		let layers = document.getElementById('layers-canvas');

		// Store animation canvas properties
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
		this.canvas_view = view;
	}

	init_controls(controls) {
		// Import & set-up control over play, pause & loop buttons
		// nb: loading 24 x 24 px icons
		let i_off = 12;
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
		let timeline = new Path.Line(new Point(6*i_off + i_off/2, i_off), new Point(controls.width - i_off/2, i_off));
		timeline.strokeColor = 'grey';
		let min_scrub = 6*i_off + i_off/2 + 4; let max_scrub = controls.width - i_off/2 - 4;
		let scrubber = new Path.Circle(new Point(min_scrub, 12), 4);
		scrubber.fillColor = 'lightgrey';
		scrubber.strokeColor = 'grey'
		scrubber.onMouseDrag = function(e) {
			let new_x = scrubber.position.x + e.delta.x;
			if ( new_x > min_scrub && new_x < max_scrub) {
				scrubber.position.x = new_x;
				ames.set_time( (new_x - min_scrub) / (max_scrub - min_scrub) );
			}
		}
		this.scrubber = scrubber;

		this.controls_view = view;
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

	play() {
		console.log("play animations");
	}

	pause() {
		console.log("pause animations");
	}

	loop() {
		console.log("loop animations");
	}

	set_time(x) {
		// console.log(x);
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
