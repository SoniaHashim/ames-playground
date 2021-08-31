// ----------------------------------------------------------------------------
// constraints.js
// Author: Sonia Hashim
//
// Description: AMES constraint
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'

export class AMES_Constraint {
	reference;
	relative;
	offset;
	rel_idx;
	property;
	sub_prop;
	is_manual_constraint = false;
	is_self_referencing = false;
	// Visual aids
	c_rel_box;
	c_ref_box;
	rel_idx;
	cycle = 1;
	offset_mode = false;


	constructor(rel, ref, p, sub_p, opt) {

		console.log('Making constraint between ', rel.name, ref.name, p, sub_p);

		// if (!((rel.is_shape && ref.is_shape) || (rel.is_list))) return;

		if (rel.is_list) {
			let n = rel.count;
			let m = ref.count;
			if (ref.is_shape) m = 0;
			// Add to relative's list_constraints
			// rel.list_constraints.push(this);

			// Initialize rel_idx


			this.rel_idx = [];
			for (let i = 0; i < n; i++) {
				this.rel_idx[i] = i;
			}
			if (n == 1) this.rel_idx[0] = 0.5;

			if (ref.is_list) {
				for (let i = 0; i < n; i++) {
					let s1 = rel.shapes[i].name;
					for (let j = 0; j < m; j++) {
						let s2 = ref.shapes[j].name;
						// If they are the same object...
						if (s1 == s2) {
							this.is_self_referencing = true;
						}
					}
				}
			}
		}

		this.relative = rel;
		this.reference = ref;
		this.property = p;
		if (!sub_p) sub_p = 'all'
		this.sub_prop = sub_p;

		opt = opt || {};
		if (opt.c_rel_box) this.c_rel_box = opt.c_rel_box.clone(false);
		if (opt.c_ref_box) this.c_ref_box = opt.c_ref_box.clone(false);
		if (opt.is_manual_constraint) this.is_manual_constraint = true;
		let root = !opt.overwrite;

		if (sub_p != 'all') this.calculate_offset();

		console.log(this.relative, p, sub_p);


		this.relative.c_inbound[p][sub_p][ref.name] = this;
		this.reference.c_outbound[p][sub_p][rel.name] = this;
		// console.log("making constraint for", p, sub_p);
		// console.log("relative constraints", this.relative.c_inbound[p][sub_p]);
		// console.log('reference constraints', this.reference.c_outbound[p][sub_p]);

		// Handle constraint overwrites
		if (sub_p == 'all') {
			// Make constraints (recurse) on subproperties
			// console.log('utils sub props', utils.SUB_PROPS[p]);
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				let s = s_list[i];
				let c = new AMES_Constraint(rel, ref, p, s, {
					'c_rel_box': this.c_rel_box,
					'c_ref_box': this.c_ref_box,
					'overwrite': true,
					'is_manual_constraint': this.is_manual_constraint,
				 });
			}
		} else {
			// All constraint is not applicable anymore since an individual
			// subproperty is constrained
			if (root) this._remove_all_constraint()
		}

		console.log("constructor... self-referencing?", this.is_self_referencing);

	}


	// TO DO: child properties??
	_remove_all_constraint() {
		let p = this.property;

		// Remove the relative's inbound all constraint on property
		delete this.relative.c_inbound[p]['all'][this.reference.name];

		// Remove the reference's outbound all constraint on object property
		let all_list = this.reference.c_outbound[p]['all'];
		delete this.reference.c_outbound[p]['all'][this.relative.name];
	}

	_lookup(s) {
		if (s == 'h') return 'hue';
		if (s == 's') return 'saturation';
		if (s == 'v') return 'brightness';
		if (s == 'a') return 'alpha';
		return s;
	}

	calculate_offset() {
		// For now static offset
		let p = this.property;
		let s = this._lookup(this.sub_prop);

		let ol = this.get_data(this.relative, p, s);
		let of = this.get_data(this.reference, p, s);

		// Case #1: relative & reference are a shape
		if (this.relative.is_shape && this.reference.is_shape) {
			this.offset = ol - of;
			if (p == 'scale') {
				this.offset = ol / of;
			}
			if (!this.offset) this.offset = 0;
		}

		// Case #2: relative is a list & reference is a shape
		if (this.relative.is_list && this.reference.is_shape) {
			if (!this.offset) this.offset = [];
			// ol is y values of relative; of is y values of reference
			// Assume only mode for now is interpolate
			let n = this.relative.count;
			let m = 1;
			// Create Lagrangian representation of reference values by
			// evenly distributing them across the relative indices
			let data = [];
			if (n%2 == 0) data[0] = [(n-1)/2, of];
			else data[0] = [((n-1)/2) - 1, of];
			for (let i = 0; i < n; i++) {
				let ov = utils.interpolate(data, this.rel_idx[i]);
				let off = ol[i] - ov;
				if (p == 'scale') off = ov / ol[i];
				if (!off) off = 0;
				this.offset[i] = off;
			}
		}

		// Case #3: relative is a shape & reference is a list
		if (this.relative.is_shape && this.reference.is_list) {
			// ol is y values of relative; of is y values of reference
			// Assume only mode for now is interpolate
			let m = this.reference.count;
			// Create Lagrangian representation of reference values by
			// evenly distributing them across the relative indices
			let data = [];
			for (let i = 0; i < m; i++) {
				data[i] = [i/(m-1), of[i]];
			}
			let ov = utils.interpolate(data, 0.5);
			let off = ol- ov;
			if (p == 'scale') off = ov / ol;
			if (!off) off = 0;
			this.offset = off;
		}

		// Case #4: relative & reference are lists
		if (this.relative.is_list & this.reference.is_list) {
			if (!this.offset) this.offset = [];
			if (!this.exempt) this.exempt = [];
			// ol is y values of relative; of is y values of reference
			// Assume only mode for now is interpolate
			let n = this.relative.count;
			let m = this.reference.count;
			// Create Lagrangian representation of reference values by
			// evenly distributing them across the relative indices
			let data = [];
			let k = n-1;
			if (n == 1) k = 1;
			for (let i = 0; i < m; i++) {
				data[i] = [i*(k/(m-1)), of[i]];
			}
			if (m == 1) {
				if (n%2 == 0) data[0] = [(n-1)/2, of[0]];
				else data[0] = [((n-1)/2) - 1, of[0]]
			}

			console.log("list to list constraint", this.relative.shapes, this.reference.shapes);

			// For the objects in the relative list in the reference list...
			for (let i = 0; i < n; i++) {
				let s1 = this.relative.shapes[i].name;
				let match = false;
				for (let j = 0; j < m; j++) {
					let s2 = this.reference.shapes[j].name;
					// If they are the same object...
					if (s1 == s2) {
						match = true;
					}
				}
				if (match) this.exempt[i] = true;
				else this.exempt[i] = false;
			}

			//
			for (let i = 0; i < n; i++) {
				let ov = utils.interpolate(data, this.rel_idx[i]);
				let off = ol[i] - ov;
				if (p == 'scale') off = ov / ol[i];
				if (!off) off = 0;
				this.offset[i] = off;
			}

			console.log('check list to list constraint is correct', data, this.rel_idx, this.offset);
		}
	}

	process_data(y) {
		if (this.reference.is_shape) return [[0, y]];
		let n = this.relative.count;
		if (this.relative.is_shape) n = 1;
		let m = this.reference.count;
		let data = [];
		let k = n-1;
		if (n == 1) k = 1;
		for (let i = 0; i < m; i++) {
			data[i] = [i*(k/(m-1)), y[i]];
		}
		if (m == 1) {
			if (n%2 == 0) data[0] = [(n-1)/2, y[0]];
			else data[0] = [((n-1)/2) - 1, y[0]]
		}
		return data;
	}

	// get_data(obj, p, s): Returns the value of the obj specified by either
	// fetching data from a list or getting the necessary value from the shape
	get_data(obj, p, s) {
		let data = []; let x; let y;
		if (obj.is_list) {
			for (let i in obj.shapes) {
				x = i;
				y = obj.shapes[i].poly[p][s];
				if (p == "rotation") { y = obj.shapes[i].rotation; }
				if (p == "scale") { y = obj.shapes[i].scale[s]; }
				if (p == "strokeWidth") { y = obj.shapes[i].poly.strokeWidth; }
				if (!y) y = 0;
				data[i] = y;
			}
			return data;
		} else {
			y = obj.poly[p][s];
			if (p == "rotation") { y = obj.rotation; }
			if (p == "scale") { y = obj.scale[s]; }
			if (p == "strokeWidth") { y = obj.poly.strokeWidth; }
			if (!y) y = 0;
			return y;
		}
	}

	// change_offset: changes the offset by the amount specified by x
	change_offset(x) {
		console.log("change_offset")
		if (this.relative.is_shape) {
			this.offset += x;
			this.update_value();
			this.relative.update_constraints();
		}
		if (this.relative.is_list) {
			let n = this.relative.count;
			let active_obj_idx = 0;
			// If in list mode, update offsets for all items in the list
			if (!this.relative.offset_mode) {
				for (let i = 0; i < n; i++) {
					this.offset[i] += x;
				}
			} else {
				// Otherwise only update the offset for the active object
				for (let i = 0; i < n; i++) {
					if (this.relative.shapes[i].name == this.relative.active_obj.name)
					active_obj_idx = i;
				}
				this.offset[active_obj_idx] += x;
			}

			this.update_value();
			this.relative.update_constraints();
		}
	}

	change_rel_idx(x) {
		let constraints_to_update = [this];

		// If they exist update relative value of subproperty constraints
		if (this.sub_prop == "all") {
			let p = this.property;
			let s_list = utils.SUB_PROPS[p];
			for (let s_idx in s_list) {
				let s = s_list[s_idx];
				let c_s = this.relative.c_inbound[p][s][this.reference.name];
				if (c_s) constraints_to_update.push(c_s);
			}
		}

		// Iterate through all necessary constraints...
		for (let idx in constraints_to_update) {
			let c = constraints_to_update[idx];
			if (c.relative.is_list) {
				let active_obj_idx = 0;
				let n = this.relative.count;
				for (let i = 0; i < n; i++) {
					if (c.relative.shapes[i].name == c.relative.active_obj.name)
					active_obj_idx = i;
				}
				c.rel_idx[active_obj_idx] += x;

				c.update_value();
				c.relative.update_constraints();
			}
		}
	}

	update_value() {
		let p = this.property;
		let s;
		// console.log("updating constraint between rel / ref", this.relative.name, this.reference.name, this.property, this.sub_prop);

		// Update all subproperty values if necessary
		if (this.sub_prop == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				s = s_list[i];
				let c = this.relative.c_inbound[p][s][this.reference.name];
				if (c) c.update_value();
			}
		} else {
			// Or just update value for given subproperty
			s = this._lookup(this.sub_prop);
			if (p == 'position') {
				let pt;
				if (this.relative.is_shape) {
					let nv;
					if (this.reference.is_shape) nv = this.reference.poly[p][s];
					if (this.reference.is_list) nv = utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
					if (s == 'x') pt = new Point(nv + this.offset - this.relative.poly.position.x, 0);
					if (s == 'y') pt = new Point(0, nv + this.offset - this.relative.poly.position.y);
					if (pt) this.relative.set_pos(pt, true);
				}
				if (this.relative.is_list) {
					let n = this.relative.count; let nv;
					let data = this.process_data(this.get_data(this.reference, p, s));
					for (let i = 0; i < n; i++) {
						if (!this.exempt[i]) {
							nv = utils.interpolate(data, this.rel_idx[i]);
							if (s == 'x') pt = new Point(nv + this.offset[i] - this.relative.shapes[i].poly.position.x, 0);
							if (s == 'y') pt = new Point(0, nv + this.offset[i] - this.relative.shapes[i].poly.position.y);
							if (pt) this.relative.shapes[i].set_pos(pt, true);
						}
					}
				}
			}
			if (p == "rotation") {
				let r0;
				if (this.relative.is_shape) {
					let nv;
					if (this.reference.is_shape) nv = this.reference.rotation;
					if (this.reference.is_list) nv = utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
					r0 = this.relative.rotation;
					this.relative.set_rotation(-r0 + nv + this.offset);
				}
				if (this.relative.is_list) {
					let n = this.relative.count; let nv;
					let data = this.process_data(this.get_data(this.reference, p, s));
					console.log(data, this.rel_idx);
					for (let i = 0; i < n; i++) {
						r0 = this.relative.shapes[i].rotation;
						nv = utils.interpolate(data, this.rel_idx[i]);
						this.relative.shapes[i].set_rotation(-r0 + nv + this.offset[i]);
					}
				}
			} else if (p == "scale") {
				let fx; let fy;
				if (this.relative.is_shape) {
					let nv_x; let nv_y;
					if (this.reference.is_shape) {
						nv_x = this.reference.scale.x;
						nv_y = this.reference.scale.y;
					}
					if (this.reference.is_list) {
						nv_x = utils.interpolate(this.process_data(this.get_data(this.reference, p, 'x')), 0.5);
						nv_y = utils.interpolate(this.process_data(this.get_data(this.reference, p, 'y')), 0.5);
					}
					fx = this.reference.scale.x;
					fy = this.reference.scale.y;
					if (s == 'x') this.relative.set_scale(fx*this.offset, null);
					if (s == 'y') this.relative.set_scale(null, fy*this.offset);
				}
				if (this.relative.is_list) {
					let n = this.relative.count; let nv_x; let nv_y;
					let data_x = this.process_data(this.get_data(this.reference, p, "x"));
					let data_y = this.process_data(this.get_data(this.reference, p, "y"));
					for (let i = 0; i < n; i++) {
						fx = utils.interpolate(data_x, this.rel_idx[i]);
						fy = utils.interpolate(data_y, this.rel_idx[i]);
						if (s == 'x') this.relative.shapes[i].set_scale(fx*this.offset[i], null);
						if (s == 'y') this.relative.shapes[i].set_scale(null, fy*this.offset[i]);
					}
				}
			} else if (p == "strokeWidth") {
				if (this.relative.is_shape) {
					let nv;
					if (this.reference.is_shape) nv = this.reference.poly.strokeWidth;
					if (this.reference.is_list) nv = utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
					this.relative.poly.strokeWidth = this.reference.poly.strokeWidth + this.offset;
				}
				if (this.relative.is_list) {
					let n = this.relative.count; let nv;
					let data = this.process_data(this.get_data(this.reference, p, s));
					for (let i = 0; i < n; i++) {
						nv = utils.interpolate(data, this.rel_idx[i]);
						this.relative.shapes[i].poly.strokeWidth = nv + this.offset[i];
					}
				}
			} else {
				if (this.relative.is_shape) {
					let nv;
					if (this.reference.is_shape) nv = this.reference.poly[p][s];
					if (this.reference.is_list) nv = utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
					if (s == "hue" && this.relative.poly.fillColor.saturation == 0) {
						if (this.reference.is_shape) nv = this.reference.poly.fillColor.saturation
						if (this.reference.is_list) nv = utils.interpolate(this.process_data(this.get_data(this.reference, p, "saturation")), 0.5);
						this.relative.poly.fillColor.saturation = nv;
					}
					this.relative.poly[p][s] = nv + this.offset;
				}
				if (this.relative.is_list) {
					let n = this.relative.count; let nv;
					let data = this.process_data(this.get_data(this.reference, p, s));
					let data_hue = this.process_data(this.get_data(this.reference, p, "hue"));
					let reset_sat = true;
					if (s == "hue") {
						for (let i = 0; i < n; i++) {
							if (this.relative.shapes[i].poly.saturation != 0) {
								reset_sat = false;
							}
						}
					}
					for (let i = 0; i < n; i++) {
						if (s == "hue") {
							if (reset_sat) {
								nv = utils.interpolate(data_hue, this.rel_idx[i]);
								this.relative.shapes[i].poly.saturation = nv;
							}
						}
						nv = utils.interpolate(data, this.rel_idx[i]);
						this.relative.shapes[i].poly[p][s] = nv + this.offset[i]
					}
				}

			}
		}

		if (this.relative.is_shape) {
			this.relative.update_control_shapes();
		}
		if (this.relative.is_list) {
			let n = this.relative.count;
			for (let i = 0; i < n; i++) this.relative.shapes[i].update_control_shapes();
			this.relative.update_show_box_bounds();
			AMES_Constraint.update_list_constraints(this.relative, this.property, this.sub_prop, this);
		}
	}


	static update_list_constraints(obj, p, s, constraint) {
		if (obj.is_list) {
			let active_obj_idx = 0;
			// Iterate through all the shapes in the list starting w/ active list object
			// Update constraints that define the list on the same property
			for (let j in obj.list_constraints) {
				let c = obj.list_constraints[j];
				if (c != constraint && c.property == p && c.sub_prop == s) {
					c.calculate_offset();
					c.update_value();
				}
			}

			// If list defines duplicator update list constraints for the duplicator
			// controls
			if (obj.first_last) {
				for (let i in obj.first_last.list_constraints) {
					let c = obj.first_last.list_constraints[i];
					if (c.property == p && c.sub_prop == s) {
						c.calculate_offset();
						c.update_value();
					}
				}
			}
		}
	}

	get_offset() {
		if (this.relative.is_shape) {
			return this.offset;
		}
		if (this.relative.is_list) {
			let active_obj_idx = 0;
			if (this.relative.active_obj) {
				let n = this.relative.count;
				for (let i = 0; i < n; i++) {
					if (this.relative.shapes[i].name == this.relative.active_obj.name)
						active_obj_idx = i;
				}
			}
			return this.offset[active_obj_idx];
		}
	}

	get_rel_idx() {
		if (this.relative.is_list) {
			let active_obj_idx = 0;
			if (this.relative.active_obj) {
				let n = this.relative.count;
				for (let i = 0; i < n; i++) {
					if (this.relative.shapes[i].name == this.relative.active_obj.name)
						active_obj_idx = i;
				}
			}
			// console.log('get_rel_idx: ', active_obj_idx, this.rel_idx);
			return this.rel_idx[active_obj_idx];
		}
	}

	remove() {
		let p = this.property;
		let s = this.sub_prop;

		// Remove inbound constraint
		delete this.relative.c_inbound[p][s][this.reference.name];

		// Remove outbound constraint
		delete this.reference.c_outbound[p][s][this.relative.name];

		// If constraint removed applies to all subprops, remove corresponding
		// constraints
		if (s == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				let sub = s_list[i];

				// Remove inbound constraint
				delete this.relative.c_inbound[p][sub][this.reference.name];

				// Remove outbound constraint
				delete this.reference.c_outbound[p][sub][this.relative.name];

			}
		}

		this.relative.editor.update_constraint();
		this.reference.editor.update_constraint();
	}

	static update_constraint_offsets(p, s, obj, cycle) {
		let c_inbounds = obj.c_inbound[p][s];
		let c_outbounds = obj.c_outbound[p][s];

		// If this is the original update
		if (!cycle) {
			// Get a unique identifier to prevent cycle propagation
			let prev_cycles = [];
			for (let i in c_inbounds) {
				prev_cycles.push(c_inbounds[i].cycle);
			}
			for (let i in c_outbounds) {
				prev_cycles.push(c_outbounds[i].cycle);
			}
			cycle = Math.floor(Math.random() * 1000 + 1);
			while (cycle in prev_cycles) cycle = Math.floor(Math.random() * 1000 + 1);
			for (let i in c_inbounds) {
				c_inbounds[i].cycle = cycle;
			}
		}

		// Inbound: update offsets
		for (let i in c_inbounds) {
			let c_in = c_inbounds[i];
			// If constraint is not bidrectional update offset or in a list
			if (!c_in.reference.c_inbound[p][s][obj.name] && c_in.is_manual_constraint) {
				let r_name = c_in.reference.name;
				// Update offsets for child properties
				if (s == "all") {
					let s_list = utils.SUB_PROPS[p];
					for (let i in s_list) {
						let sub = s_list[i];
						c_in = obj.c_inbound[p][sub][r_name];
						if (c_in) {
							c_in.cycle = cycle;
							c_in.calculate_offset();
						}
					}
				} else {
					c_in.calculate_offset();
					c_in.cycle = cycle;
				}
			}

		}

		this.update_outbound_offsets(p, s, obj, cycle);
	}

	static update_outbound_offsets(p, s, obj, cycle) {
		// console.log(obj.name, p, s, cycle, c_outbounds);

		// Outbound: update values
		// For 'all' update outbound constraints for child properties
		let c_outbounds = Object.values(obj.c_outbound[p][s]);
		if (s == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				let sub = s_list[i];
				c_outbounds = c_outbounds.concat(Object.values(obj.c_outbound[p][sub]));
			}
		} else {
			c_outbounds = obj.c_outbound[p][s];
		}

		// Update outbound constraint values
		for (let idx in c_outbounds) {
			let c_out = c_outbounds[idx];
			if (c_out.cycle != cycle) {
				c_out.cycle = cycle;
				c_out.calculate_offset();

				// And recurse to handle constraint chains
				this.update_outbound_offsets(p, s, c_out.relative, cycle);
			}
		}

		obj.editor.update_constraint();
	}

	static update_constraints(p, s, obj, cycle) {

		// Get inbound and outbound constraints

		let c_inbounds = obj.c_inbound[p][s];
		let c_outbounds = obj.c_outbound[p][s];
		console.log(obj, c_inbounds, c_outbounds);

		// console.log("updating", obj, p, s);

		// Cycle detection...
		// If this is the original update
		if (!cycle) {
			// Get a unique identifier to prevent cycle propagation
			let prev_cycles = [];
			for (let i in c_inbounds) {
				prev_cycles.push(c_inbounds[i].cycle);
			}
			for (let i in c_outbounds) {
				prev_cycles.push(c_outbounds[i].cycle);
			}
			cycle = Math.floor(Math.random() * 1000 + 1);
			while (cycle in prev_cycles) cycle = Math.floor(Math.random() * 1000 + 1);
			for (let i in c_inbounds) {
				c_inbounds[i].cycle = cycle;
			}

		}
		// console.log(obj.name, p, s, cycle, c_outbounds);

		// Inbound: update offsets
		for (let i in c_inbounds) {
			let c_in = c_inbounds[i];
			// If constraint is not bidrectional update offset or the constraint is not in a self-referencing list...
			if (c_in.is_self_referencing) console.log("self referencing inbound constraint");
			if (!c_in.reference.c_inbound[p][s][obj.name] && !c_in.is_self_referencing) {
				let r_name = c_in.reference.name;

				// Update offsets for child properties
				if (s == "all") {
					let s_list = utils.SUB_PROPS[p];
					for (let i in s_list) {
						let sub = s_list[i];
						c_in = obj.c_inbound[p][sub][r_name];
						if (c_in) {
							c_in.cycle = cycle;
							c_in.calculate_offset();
						}
					}
				} else {
					c_in.cycle = cycle;
					c_in.calculate_offset();
				}
			}
		}


		// Outbound: update values
		// For 'all' update outbound constraints for child properties
		c_outbounds = Object.values(obj.c_outbound[p][s]);
		if (s == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				let sub = s_list[i];
				c_outbounds = c_outbounds.concat(Object.values(obj.c_outbound[p][sub]));
			}
		}

		// Update outbound constraint values
		for (let idx in c_outbounds) {
			let c_out = c_outbounds[idx];
			if (c_out.cycle != cycle) {
				c_out.cycle = cycle;
				// Update offset or value & recurse to handle constraint chains
				if (c_out.offset_mode) {
					c_out.calculate_offset();
					this.update_outbound_offsets(p, s, c_out.relative, cycle);
				}
				else {
					// console.log("should not be here");
					c_out.update_value();
					// Recurse
					this.update_constraints(p, s, c_out.relative, cycle);
				}



			}
		}

		if (obj.editor) obj.editor.update_constraint();
	}

}
