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
	property_callbacks = {
		'Position': this.callback_position,
		'Scale': this.callback_scale,
	}

	// callback_position(e, shape, elisteners, opt)
	// Description: Callback to manipulate position property
	callback_position (e, shape, elisteners, opt) {
		console.log(shape);
		console.log("callback_position: ", shape.name);
		let clicked = false;
		let offset = new Point(0,0);


		// Callback to follow mouse
		let cb_position_follow = function(e) {
			if (clicked) {
				let new_pos = utils.get_e_point(e);
				shape.set_pos(new_pos.add(offset));
			}
		}

		// Callback to toggle follow if clicked
		let cb_position_toggle = function (e) {
			clicked = !clicked;
			// calculate offset to shape
			let pos = new Point(shape.pos.x, shape.pos.y);
			let click_pos = utils.get_e_point(e.event);
			offset = pos.subtract(click_pos);
		}

		// Activate by clicking on shape
		if (opt.activate) {
			// Clicking on the shape toggles being able to change the property
			shape.poly.on("click", cb_position_toggle);
			elisteners['cb_position_toggle'] = cb_position_toggle;
			// If clicked, the shape follows the mouse
			ames.canvas.addEventListener("mousemove", cb_position_follow);
			elisteners['cb_position_follow'] = cb_position_follow;
			console.log(elisteners);
		} else {
			// Remove event listeners
			if (elisteners.hasOwnProperty('cb_position_toggle')) {
				shape.poly.off("click", elisteners['cb_position_toggle']);
				delete elisteners['cb_position_toggle'];
			}
			if (elisteners.hasOwnProperty('cb_position_follow')) {
				ames.canvas.removeEventListener("mousemove", elisteners['cb_position_follow']);
				delete elisteners['cb_position_follow'];
			}
			console.log(elisteners)
		}
	}

	callback_scale (e, shape, elisteners, opt) {
		console.log("callback_scale: ", shape.name);
		let cx = shape.pos.x;
		let cy = shape.pos.y;
		let line;

		if (elisteners.scale_line) {
			line = elisteners.scale_line;
		} else {
			line = new Path.Line({
				from: [cx, cy],
				to: [cx+5, cy+5],
				strokeColor: utils.INACTIVE_COLOR,
				opacity: 0.5,
				visible: false
			});
			elisteners.scale_line = line;
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

		// Activate by clicking on shape
		if (opt.activate) {
			// Add event listener for clicks
			ames.canvas.addEventListener("click", cb_scale_click);
			elisteners['cb_scale_click'] = cb_scale_click;
			// Add event listener to scale line
			ames.canvas.addEventListener("mousemove", cb_scale_update);
			elisteners['cb_scale_update'] = cb_scale_update;
			console.log(elisteners);
		} else {
			// Deactivate by removing event listeners
			console.log(elisteners);
			if (elisteners.hasOwnProperty('cb_scale_click')) {
				ames.canvas.removeEventListener("click", elisteners['cb_scale_click']);
				delete elisteners['cb_scale_click'];
			}
			if (elisteners.hasOwnProperty('cb_scale_update')) {
				ames.canvas.removeEventListener("mousemove", elisteners['cb_scale_update']);
				delete elisteners['cb_scale_update'];
			}
			// Remove line
			if (elisteners.hasOwnProperty('scale_line')) {
				elisteners['scale_line'].remove();
				delete elisteners['scale_line'];
			}
			console.log(elisteners);
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
		// this.dragBox = false;
		// this.rect.on("click", (e) => {
		// 	this.dragBox = !this.dragBox;
		// 	console.log("click on box: ", e.point);
		// });
		this.rect.on("mousedrag", (e) => {
			this.box.position = e.point;
		})
	}

	show() {
		this.update_position();
		this.box.visible = true;
	}

}
