// ames.js
// ---------------------------------------------------------------------------
// Description: A script that entiwnes svg.js and it's plug-ins to create a svg
// library for authoring and animating geometric constraints across multiple
// elements
//
// Author: Sonia Hashim & Jennifer Jacobs
// Date Last Modified: 02/09/21

// TEST CODE
// ---------------------------------------------------------------------------
console.log("I'm KING OF THE WORLD!");

var draw = SVG('#env-animation');
var draw_dom = document.getElementById("env-animation");
var draw_cx = draw.width()/2;
var draw_cy = draw.height()/2;
console.log(draw_cx, draw_cy);


let makeSquare = () => {
	console.log("makeSquare")
	var r = draw.rect(20,20).attr({fill: '#f06'})
	r.animate(500, 100, 'now').attr({ fill: '#fe3' })
	r.animate(5000, 100, 'now').center(draw_cx, draw_cy).animate({delay: 2000}).transform({scale:2});
	r.draggable();
}

let makeGroup = () => {
	console.log("makeGroup");
}

// Class: AMES_Utils
// // ----------------------------------------------------------------------------
// Description: Basic utilities to facilitate calculation
class AMES_Utils {
	lengthsq(x1, y1, x2, y2) {
		return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
	}
}

// Class: Shape
// ----------------------------------------------------------------------------
// Description: Basic geometry representation with visual & temporal properties
class Shape {
	// Display properties including name, visibility, layer
	name = "Shape"
	visible = false;
	// Visual Properties: position, scale, rotate, stroke w, stroke c, fill
	pos = {x: draw_cx, y: draw_cy};
	scale = {x: 1, y: 1};
	visual_props = {'Position': this.pos, 'Scale': this.scale};
	// Temporal Properties: length
	length = 2000;
	temporal_properties = {'Length': this.length};

	// Necessary methods
	// makeShape()
	// editShape()
	// drawShape()

}

// Callback: change cursor over drawing environment to crosshair
var callback_draw_dom_crosshair = (e) => {
	draw_dom.style.cursor = 'crosshair';
}

//
// var eventlistener_list = []
//
// var callback_position = function(e, shape, opt) {
// 	console.log('Position callback: ', shape.name);
// 	let clicked = false;
//
// 	// Callback to follow mouse
// 	let cb_position_follow = function(e) {
// 		if (clicked) {
// 			delta = draw.point(e.pageX, e.pageY);
// 			shape.pos.x = delta.x;
// 			shape.pos.y = delta.y;
// 			shape.drawShape();
// 		}
// 	}
//
// 	// Callback to toggle follow if clicked
// 	var cb_position_toggle = function (e) {
// 		console.log('toggle');
// 		clicked = !clicked;
// 	}
//
// 	// Activate by clicking on shape
// 	if (opt.activate) {
// 		console.log("activating")
// 		// Clicking on the object instigates changing the property
// 		shape.poly.on("click", cb_position_toggle);
// 		draw_dom.addEventListener("mousemove", cb_position_follow);
// 		eventlistener_list.push(cb_position_follow)
// 	}
//
// 	// Deactivate by clicking on shape
// 	if (opt.deactivate) {
// 		console.log("deactivating")
// 		// remove additional event listeners
// 		console.log(shape.poly);
// 		shape.poly.off("click", cb_position_toggle);
// 		console.log(shape.poly);
//
// 		console.log(eventlistener_list)
// 		console.log("Enric: THIS IS DANGEROUS CODE!!")
// 		draw_dom.removeEventListener("mousemove", eventlistener_list[0]);
// 		eventlistener_list.pop();
// 		// eventlistener_list
// 	}
// }
//
// // Callback: scale property edit
// var callback_scale = function(e, shape, opt) {
// 	console.log("Scale callback: ", shape.name);
//
// 	if (opt.activate) {
// 		console.log("activating");
// 	}
//
// 	if (opt.deactivate) {
// 		console.log("deactivating");
// 	}
//
// 	// Draw line from shape's position to cursor
// 	let endp = draw.point(e.pageX, e.pageY)
// 	let x1 = shape.pos.x;
// 	let y1 = shape.pos.y;
// 	let line = draw.line(x1,y1, endp.x, endp.y).stroke({color: 'gray', opacity: '50%', width: 1, linecap: 'round' });
// 	let base_lengthsq;
// 	let base_sx = shape.scale.x;
// 	let base_sy = shape.scale.y;
//
// 	// Callback: scale update line
// 	let callback_scale_updateline = (e) => {
// 		endp = draw.point(e.pageX, e.pageY);
// 		line.plot(shape.pos.x, shape.pos.y, endp.x, endp.y);
// 	};
//
// 	// Callback: scale set base length, trigger object transform, remove scale callbacks
// 	let callback_scale_setBase = (e) => {
// 		base_lengthsq = utils.lengthsq(x1, y1, endp.x, endp.y);
// 		console.log("Setting base: ", base_lengthsq);
// 		// start scaling object
// 		draw_dom.addEventListener("mousemove", callback_scale_transform);
// 		// one time fire
// 		draw_dom.removeEventListener("dblclick", callback_scale_setBase);
// 		// on second click stop scaling object, updating line, and remove line
// 		let callback_scale_stop = (e) => {
// 			draw_dom.removeEventListener("mousemove", callback_scale_updateline);
// 			draw_dom.removeEventListener("mousemove", callback_scale_transform);
// 			line.remove();
// 			// one time fire
// 			draw_dom.removeEventListener("click", callback_scale_stop);
// 		}
// 		draw_dom.addEventListener("click", callback_scale_stop);
// 	}
//
// 	let callback_scale_transform = (e) => {
// 		if (base_lengthsq) {
// 			let scale_factor = utils.lengthsq(x1, y1, endp.x, endp.y) / base_lengthsq;
// 			console.log(scale_factor);
// 			shape.scale.x = scale_factor*base_sx;
// 			shape.scale.y = scale_factor*base_sy;
// 			shape.poly.transform({scale: [shape.scale.x, shape.scale.y]});
// 		}
// 	}
// 	// update line on mousemove
// 	draw_dom.addEventListener("mousemove", callback_scale_updateline);
// 	// on click set base length of line and begin scaling object
// 	draw_dom.addEventListener("dblclick", callback_scale_setBase);
// };

// var property_callbacks = {
// 	'Position': callback_position,
// 	'Scale': callback_scale,
// }
// Class: PropertyBox
//
class PropertyBox {
	// Display variables
	visible = false;
	offset = 50;
	pos = {x: 0, y: 0};
	// Control variables
	props_text = {};
	active_prop = null;
	// Callback functions per property
	elisteners = {};

	callback_position = function(e, shape, elisteners, opt) {
		console.log("callback_position: ", shape.name);
		let clicked = false;

		// Callback to follow mouse
		let cb_position_follow = function(e) {
			if (clicked) {
				let delta = draw.point(e.pageX, e.pageY);
				shape.pos.x = delta.x;
				shape.pos.y = delta.y;
				shape.drawShape();
			}
		}

		// Callback to toggle follow if clicked
		let cb_position_toggle = function (e) {
			clicked = !clicked;
		}

		// Activate by clicking on shape
		if (opt.activate) {
			// Clicking on the shape toggles being able to change the property
			shape.poly.on("click", cb_position_toggle);
			elisteners['cb_position_toggle'] = cb_position_toggle;
			// If clicked, the shape follows the mouse
			draw_dom.addEventListener("mousemove", cb_position_follow);
			elisteners['cb_position_follow'] = cb_position_follow;
			console.log(elisteners);
		} else {
			// Remove event listeners
			if (elisteners.hasOwnProperty('cb_position_toggle')) {
				shape.poly.off("click", elisteners['cb_position_toggle']);
				delete elisteners['cb_position_toggle'];
			}
			if (elisteners.hasOwnProperty('cb_position_follow')) {
				draw_dom.removeEventListener("mousemove", elisteners['cb_position_follow']);
				delete elisteners['cb_position_follow'];
			}
			console.log(elisteners)
		}
	}

	callback_scale (e, shape, elisteners, opt) {
		console.log("callback_scale: ", shape.name);
		let cx = shape.pos.x;
		let cy = shape.pos.y;
		let line = draw.line(cx, cy, cx, cy).stroke({color: 'gray', opacity: '50%', width: 5, linecap: 'round' }).hide();
		let activated = false;
		let scaling = false;
		let base_lengthsq;
		let base_sx;
		let base_sy;
		let endp;

		// On first click, start scaling & show line
		let cb_scale_click = function(e) {
			endp = draw.point(e.pageX, e.pageY);
			// Activate on first click
			if (!activated) {
				// NB rbox coords are in (pageX, pageY) and must be converted
				let rb = shape.poly.rbox(draw);
				let is_inside = (x, y) => {
					return x >= rb.x && x <= rb.x2 && y >= rb.y && y <= rb.y2;
				}
				// Only if the click is inside the shape
				if (is_inside(endp.x, endp.y)){
					activated = true;
					line.plot(cx, cy, endp.x, endp.y).show();
				}
			} else {
				// On second click start scaling
				if (!scaling) {
					scaling = true;
					base_lengthsq = utils.lengthsq(cx, cy, endp.x, endp.y);
					base_sx = shape.scale.x;
					base_sy = shape.scale.y;
					// console.log("base_lengthsq: ", base_lengthsq);
				} else {
					// On the third click reset
					line.hide();
					activated = false;
					scaling = false;
				}
			}
		}

		// Update line & transform shape if shape has been clicked
		let cb_scale_update = function(e) {
			if (activated) {
				endp = draw.point(e.pageX, e.pageY);
				line.plot(cx, cy, endp.x, endp.y);
				if (scaling) {
					let scale_factor = utils.lengthsq(cx, cy, endp.x, endp.y) / base_lengthsq;
					shape.scale.x = scale_factor*base_sx;
					shape.scale.y = scale_factor*base_sy;
					shape.poly.transform({scale: [shape.scale.x, shape.scale.y]});
				}
			}
		}

		// Activate by clicking on shape
		if (opt.activate) {
			// Add event listener for clicks
			draw_dom.addEventListener("click", cb_scale_click);
			elisteners['cb_scale_click'] = cb_scale_click;
			// Add event listener to scale line
			draw_dom.addEventListener("mousemove", cb_scale_update);
			elisteners['cb_scale_update'] = cb_scale_update;
			console.log(elisteners);
		} else {
			// Deactivate by removing event listeners
			console.log(elisteners);
			if (elisteners.hasOwnProperty('cb_scale_click')) {
				draw_dom.removeEventListener("click", elisteners['cb_scale_click']);
				delete elisteners['cb_scale_click'];
			}
			if (elisteners.hasOwnProperty('cb_scale_update')) {
				draw_dom.removeEventListener("mousemove", elisteners['cb_scale_update']);
				delete elisteners['cb_scale_update'];
			}
			console.log(elisteners);
		}
	}

	property_callbacks = {
		'Position': this.callback_position,
		'Scale': this.callback_scale,
	}

	update_position() {
		this.pos.x = this.parent.pos.x + this.offset;
		this.pos.y = this.parent.pos.y - this.offset;
		this.box.attr({x: this.pos.x, y: this.pos.y});
	}

	constructor(shape, properties) {
		// parent shape
		this.parent = shape;
		// nested svg
		this.box = draw.nested().draggable();
		this.box.hide();
		this.update_position();
		// containing box
		this.rect = this.box.rect(100, 120).attr({fill: 'darkgray', 'fill-opacity': '50%'});
		// set up text objects for each property
		var i = 0;
		for (let p in properties) {
			let p_text = this.box.text(p).attr({x: 5, y: i*this.offset/2})
			this.props_text[p] = p_text;
			i = i + 1;
		}
		// add callbacks to each property
		for (let p in properties) {
			let p_text = this.props_text[p];
			// Property click handler to toggle activate / deactivate properties
			let toggle_property = (e) =>
			{
				if (this.active_prop != p) {
					// Deactivate previous active property
					if (this.active_prop) {
						this.property_callbacks[this.active_prop](e, this.parent, this.elisteners, {'activate': false});
						// ux feedback: show inactive color to indicate property is deactivated
						this.props_text[this.active_prop].fill('black');
					}
					// Activate new property & set new active property
					this.active_prop = p;
					this.property_callbacks[this.active_prop](e, this.parent, this.elisteners,  {'activate': true});
					// ux feedback: persist active color to indicate active property being edited
					p_text.fill('lavender');
				} else {
					// Deactive this property & set active property to null
					this.property_callbacks[this.active_prop](e, this.parent, this.elisteners, {'activate': false});
					this.active_prop = null;
					// ux feedback: show inactive color
					p_text.fill('black');
				}
			}
			p_text.on('click', toggle_property);
			// ux feedback: change to active color to indicate clickable
			p_text.on('mouseenter', (e) => {
				p_text.fill('lavender');
			}).on('mouseout', (e) => {
				// ux feedback: if the current property is not active show the object is not about to be clicked
				if (this.active_prop != p) p_text.fill('black');
			});
		}

		// Closing indicator
		this.close_text = this.box.text('x').font({fill: 'lavender', x: 87.5, y: -5});
		this.close_text.click((e) => {
			this.box.hide();
			this.visible = false;
		});
	}

	show() {
		this.update_position();
		this.box.show();
	}

}

// import PropertyBox from './PropertyBox.js';
// Class: Circle
// Description: Circle geometry representation
class Circle extends Shape {
	name = "Circle"
	radius = 10;

	// Draw a new circle (set center & radius)
	makeShape() {
		console.log('Circle.makeShape');
		if (!this.poly.visible()) {
			// Show crosshair cursor
			draw_dom.addEventListener('mouseover', callback_draw_dom_crosshair);
			// On 1st click, set the center of the circle
			let callback_make_circle_on_click = (e) => {
				this.pos = draw.point(e.pageX, e.pageY);
				this.drawShape();

				// Remove crosshair cursor
				draw_dom.style.cursor = 'default';
				draw_dom.removeEventListener('mouseover', callback_draw_dom_crosshair);

				// Remove make circle listener
				draw_dom.removeEventListener('click', callback_make_circle_on_click);
			}
			draw_dom.addEventListener('click', callback_make_circle_on_click);
		}
	}

	// Edit temporal properties of the shape
	editAnimation() {

	}

	// Draw the shape
	drawShape() {
		// Shape specific properties
		this.poly.radius(this.radius);

		// Visual properties
		this.poly.center(this.pos.x, this.pos.y);
		this.poly.transform({scale: [this.scale.x, this.scale.y]});

		// Make visible
		this.poly.show()
		this.visible = true;
	}

	// Show the animation representation of the shape
	drawAnimation() {

	}

	constructor() {
		super();
		this.poly = draw.group().circle().hide();
		this.visual_prop_box = new PropertyBox(this, this.visual_props);

		// On double click launch properties editor
		this.poly.on('dblclick', e => {
			// Open shape editor
			if (edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
				this.visual_prop_box.visible = true;
				this.visual_prop_box.show();
			}
		});
	}
}

// Class: Rectangle
// ----------------------------------------------------------------------------
// Description: Rectangle geometry representation

// Class: Polyline
// Description: Polyline geometry used to specify a path



// Class: Collection
// Description: An ordered collection of shapes with self-referencing constraints

// Class: Constraint
// Description: Defines output property-value = f(input property-value)

// Class: Animation
// Description: Includes the shape / collection being animated, the shape / collection that
// represents the animation, and a timeline representation
class Animation {
	constructor () {

	}
}

// ----------------------------------------------------------------------------
// Mode Buttons
// ----------------------------------------------------------------------------
let ACTIVE_COLOR = 'lavender';
var mode_btns = {
	'SHAPE' : 'btn-mode-shape',
	'CONSTRAINT': 'btn-mode-constraint',
	'ANIMATE': 'btn-mode-animate',
	'ELEMENT': 'btn-mode-element',
	'LIST': 'btn-mode-list'
};

// changeEditMode(ux_mode)
// ----------------------------------------------------------------------------
// Description: Toggles mode from SHAPE / CONSTRAINT / ANIMATION using UX buttons.
// Notes:
// - Default is SHAPE
// - UX feedback: active mode button is highlighted
let changeEditMode = (ux_mode) => {
	console.log("changeEditMode:" + ux_mode);

	if (ux_mode != edit_mode) {
		// Make previous mode button clickable
		if (edit_mode) {
			// Remove ux active color indicator
			document.getElementById(mode_btns[edit_mode]).style.backgroundColor = null;
		}
		// Change mode
		edit_mode = ux_mode;
		// Toggle new mode button color to active
		document.getElementById(mode_btns[edit_mode]).style.backgroundColor = ACTIVE_COLOR;

		switch(edit_mode) {
			case 'SHAPE':
				break;
			case 'CONSTRAINT':
				break;
			case 'ANIMATE':
				break;
			default: break;
		}
	}
}

// changeMode(ux_mode)
// ----------------------------------------------------------------------------
// Description: Toggles mode from SHAPE / CONSTRAINT / ANIMATION using UX buttons.
// Notes:
// - Default is SHAPE
// - UX feedback: active mode button is highlighted
let changeMode = (ux_mode) => {
	console.log("changeMode:" + ux_mode);

	if (ux_mode != mode) {
		// Make previous mode button clickable
		if (mode) {
			// Remove ux active color indicator
			document.getElementById(mode_btns[mode]).style.backgroundColor = null;
		}
		// Change mode
		mode = ux_mode;
		// Toggle new mode button color to active
		document.getElementById(mode_btns[mode]).style.backgroundColor = ACTIVE_COLOR;

		switch(mode) {
			case 'ELEMENT':
				break;
			case 'LIST':
				break;
			default: break;
		}
	}
}

let makeSphere = () => {
	console.log("makeSphere");
	var s = new Circle();
	s.makeShape();
	shapes.push(s);
	// var s = draw.circle(20).attr({ fill: '#f06' });
	// s.center(draw_cx, draw_cy);
	// s.draggable();
	// s.animate(10,10,'now').transform(new SVG.Matrix({ scale:100}));
}

console.log(makeSphere);

// MAIN EXECUTION
var utils = new AMES_Utils();
var mode;
var edit_mode;
changeMode('ELEMENT');
changeEditMode('SHAPE');
var global_timeline = new SVG.Timeline();
var shapes = [];
