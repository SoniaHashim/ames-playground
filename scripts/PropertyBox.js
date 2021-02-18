export default class PropertyBox {
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
