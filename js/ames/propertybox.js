// ----------------------------------------------------------------------------
// propertybox.js
// Author: Sonia Hashim
//
// Description: AMES property boxes that set up callbacks based on each
// property
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'

export class PropertyBox {
	// Display variables
	pos = {x: 0, y: 0};
	box;
	offset;
	close_text;
	rect;
	dragBox = false;
	// Control variables
	props_text = {};
	active_prop = null;
	elisteners = {}; // Store handlers for callbacks to remove as needed
	cb_handlers = {};
	property_callbacks = {
		'Position': this.callback_position,
		'Scale': this.callback_scale,
	}

	// callback_position(e, shape, cb_handlers, opt)
	// Description: Callback to manipulate position property
	callback_position(e, shape, cb_handlers, opt) {
		console.log("callback_position: ", shape.name);
		let offset;

		let cb_position_follow = function (e) {
			shape.set_pos(e.point.add(offset));
		}

		let cb_position_get_offset = function (e) {
			let pos = new Point(shape.pos.x, shape.pos.y);
			let click_pos = e.point;
			offset = pos.subtract(click_pos);
		}

		let drag_event = "mousedrag";
		let trigger_event = (e.event.type.indexOf('mouse') != -1) ? "mousedown" : "touchstart";

		if (opt.activate) {
			shape.poly.on("mousedown", cb_position_get_offset);
			cb_handlers['cb_position_get_offset'] = cb_position_get_offset;
			shape.poly.on(drag_event, cb_position_follow);
			cb_handlers['cb_position_follow'] = cb_position_follow;
		} else {
			// Remove listeners
			if (cb_handlers.hasOwnProperty('cb_position_follow')) {
				shape.poly.off(drag_event, cb_handlers['cb_position_follow']);
				delete cb_handlers['cb_position_follow'];
			}
			if (cb_handlers.hasOwnProperty('cb_position_get_offset')) {
				shape.poly.off("mousedown", cb_handlers['cb_position_get_offset']);
				delete cb_handlers['cb_position_get_offset'];
			}
		}
	}

	// callback_scale(e, shape, cb_handlers, opt)
	// Description: Callback to manipulate scale property
	callback_scale (e, shape, cb_handlers, opt) {
		console.log("callback_scale: ", shape.name);
		let cx = shape.pos.x;
		let cy = shape.pos.y;
		let line;

		// If the line exists remove it
		if (cb_handlers.scale_line) {
			cb_handlers.scale_line.remove();
			delete cb_handlers['scale_line'];
		} else {
			line = new Path.Line({
				from: [cx, cy],
				to: [cx+5, cy+5],
				strokeColor: utils.INACTIVE_COLOR,
				opacity: 0.5,
				visible: false
			});
			cb_handlers.scale_line = line;
		}
		let activated = false;
		let scaling = false;
		let base_lengthsq;
		let endp;
		let pf = 1; // previous scale factor

		// On first click, start scaling & show line
		let cb_scale_click = function(e) {
			endp = utils.get_e_point(e);
			// Activate on first click
			if (!activated) {
				// Only if the click is inside the shape
				if (shape.contains(endp)){
					activated = true;
					line.segments[0].point = new Point(cx, cy);
					line.segments[1].point = endp;
					line.visible = true;
					console.log(line);
				}
			} else {
				// On second click start scaling
				if (!scaling) {
					scaling = true;
					base_lengthsq = utils.lengthsq(cx, cy, endp.x, endp.y);
				} else {
					// On the third click reset
					line.visible = false;
					activated = false;
					scaling = false;
					pf = 1;
				}
			}
		}

		// Update line & transform shape if shape has been clicked
		let cb_scale_update = function(e) {
			console.log("dragEvent")
			if (activated) {
				endp = utils.get_e_point(e);
				line.segments[0].point = new Point(cx, cy);
				line.segments[1].point = endp;
				if (scaling) {
					let f = utils.lengthsq(cx, cy, endp.x, endp.y) / base_lengthsq;
					shape.set_scale((1/pf)*f);
					pf = f;
				}
			}
		}

		let move_event = (e.event.type.indexOf('mouse') != -1) ? "mousemove" : "touchmove";
		let trigger_event = (e.event.type.indexOf('mouse') != -1) ? "mousedown" : "touchstart";

		// Activate by clicking on shape
		if (opt.activate) {
			// Add event listener for clicks
			ames.canvas.addEventListener(trigger_event, cb_scale_click);
			cb_handlers['cb_scale_click'] = cb_scale_click;
			// Add event listener to scale line
			ames.canvas.addEventListener(move_event, cb_scale_update);
			cb_handlers['cb_scale_update'] = cb_scale_update;
			console.log(cb_handlers);
		} else {
			// Deactivate by removing event listeners
			if (cb_handlers.hasOwnProperty('cb_scale_click')) {
				ames.canvas.removeEventListener(trigger_event, cb_handlers['cb_scale_click']);
				delete cb_handlers['cb_scale_click'];
			}
			if (cb_handlers.hasOwnProperty('cb_scale_update')) {
				ames.canvas.removeEventListener(move_event, cb_handlers['cb_scale_update']);
				delete cb_handlers['cb_scale_update'];
			}
			console.log(cb_handlers);
		}
	}


	update_position() {
		// Use parent bounding box to displace property box away from center
		let parent_bbox = this.parent.get_bbox();
		this.offset = parent_bbox.width/2;
		// Set property box position
		this.pos.x = this.parent.pos.x + 2.25*this.offset;
		this.pos.y = this.parent.pos.y - .25*this.offset;
		this.box.position = new Point(this.pos.x, this.pos.y);
	}

	constructor(shape, properties) {
		// parent shape
		this.parent = shape;
		// new group
		this.box = new Group({
			visible: false,
		});
		this.update_position();
		// containing box
		this.rect = new Shape.Rectangle({
			point: [this.pos.x, this.pos.y],
			size: [100, 120],
			strokeColor: 'black',
			radius: 2,
			opacity: 0.50,
			fillColor: 'darkgray',

		});
		this.box.addChild(this.rect);
		// set up text objects for each property
		var i = 0;
		for (let p in properties) {
			if (!p in this.property_callbacks) break;
			let p_text = new PointText({
				point: [this.pos.x + 5, this.pos.y + 17.5 + i*17.5],
				content: p,
				fillColor: utils.INACTIVE_COLOR,
				fontSize: '.75rem'
			});
			// this.box.text(p).attr({x: 5, y: i*this.offset/2})
			this.props_text[p] = p_text;
			this.box.addChild(p_text);
			i = i + 1;
		}
		// add callbacks to each property
		for (let p in properties) {
			if (!p in this.property_callbacks) { console.log("property callback not implemented for", p); break; }
			let p_text = this.props_text[p];
			// Property click handler to toggle activate / deactivate properties
			let toggle_property = (e) =>
			{
				// Activate if not currently activate
				if (this.active_prop != p) {
					// Deactivate previous active property
					if (this.active_prop) {
						this.property_callbacks[this.active_prop](e, this.parent, this.elisteners, {'activate': false});
						// ux feedback: show inactive color to indicate property is deactivated
						this.props_text[this.active_prop].fillColor = utils.INACTIVE_COLOR;
					}
					// Activate new property & set new active property
					this.active_prop = p;
					console.log('active_prop: ', this.active_prop);
					this.property_callbacks[this.active_prop](e, this.parent, this.elisteners,  {'activate': true});
					// ux feedback: persist active color to indicate active property being edited
					p_text.fillColor = utils.ACTIVE_COLOR;
				} else {
					// Deactive this property & set active property to null
					this.property_callbacks[this.active_prop](e, this.parent, this.elisteners, {'activate': false});
					this.active_prop = null;
					// ux feedback: show inactive color and reset to inactive color
					p_text.fillColor = utils.INACTIVE_COLOR;
				}
			}
			p_text.on('click', toggle_property);
			// ux feedback: change to active color to indicate clickable
			p_text.on('mouseenter', (e) => {
				p_text.fillColor = utils.ACTIVE_COLOR;
			});
			p_text.on('mouseleave', (e) => {
				// ux feedback: if the current property is not active show the object is not about to be clicked
				if (this.active_prop != p) p_text.fillColor = utils.INACTIVE_COLOR;
			});
		}
		//
		// Closing indicator
		this.close_text = new PointText({
			point: [this.pos.x + 87.5, this.pos.y + 17.5],
			content: 'x',
			fillColor: utils.INACTIVE_COLOR,
			fontSize: '.75rem'
		});
		this.box.addChild(this.close_text)
		this.close_text.on('click', (e) => {
			this.box.visible = false;
			// Deactivate previous active property
			if (this.active_prop) {
				this.property_callbacks[this.active_prop](e, this.parent, this.elisteners, {'activate': false});
				// ux feedback: show inactive color to indicate property is deactivated
				this.props_text[this.active_prop].fillColor = utils.INACTIVE_COLOR;
			}
		});
		this.close_text.on('mouseenter', (e) => {
			this.close_text.fillColor = utils.ACTIVE_COLOR;
		})
		this.close_text.on('mouseleave', (e) => {
			this.close_text.fillColor = utils.INACTIVE_COLOR;
		});

		// Add draggablity to box
		this.rect.on("mousedown", (e) => {
			this.rect_offset = this.rect.position.subtract(e.point);
		})
		this.rect.on("mousedrag", (e) => {
			this.box.position = e.point.add(this.rect_offset);
		});

	}

	show() {
		this.update_position();
		this.box.visible = true;
	}

}
