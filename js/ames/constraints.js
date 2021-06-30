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
	property;
	sub_prop;
	// Visual aids
	c_rel_box;
	c_ref_box;

	constructor(rel, ref, p, sub_p, opt) {
		this.relative = rel;
		this.reference = ref;
		this.property = p;
		if (!sub_p) sub_p = 'all'
		this.sub_prop = sub_p;

		if (opt.c_rel_box) this.c_rel_box = opt.c_rel_box;
		if (opt.c_ref_box) this.c_ref_box = opt.c_ref_box;
		let root = !opt.overwrite;

		if (sub_p != 'all') this.calculate_offset();

		// console.log("making constraint for sub_p", sub_p);
		this.relative.c_inbound[p][sub_p] = this;
		this.reference.c_outbound[p][sub_p].push(this);
		// console.log('reference constraints', this.reference.c_outbound);

		// Handle constraint overwrites
		if (sub_p == 'all') {
			// Make constraints (recurse) on subproperties
			console.log('utils sub props', utils.SUB_PROPS[p]);
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				let s = s_list[i];
				let c = new AMES_Constraint(rel, ref, p, s, {
					'c_rel_box': this.c_rel_box,
					'c_ref_box': this.c_ref_box,
					'overwrite': true,
				 });
			}
		} else {
			// All constraint is not applicable anymore since an individual
			// subproperty is constrained
			if (root) this._remove_all_constraint()
		}

	}

	_remove_all_constraint() {
		let p = this.property;
		// Remove the relative's inbound all constraint on property
		this.relative.c_inbound[p]['all'] = null;
		// Remove the reference's outbound all constraint on object property
		let all_list = this.reference.c_outbound[p]['all'];
		this.reference.c_outbound[p]['all'].splice(all_list.indexOf(this.relative.name), 1);
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

		if (this.sub_prop == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				s = s_list[i];
				let c = this.relative.c_inbound[p][s];
				c.update_value();
			}
		} else {
			let ol = this.relative.poly[p][s];
			let of = this.reference.poly[p][s];

			if (p == "rotation") {
				ol = this.relative.rotation;
				of = this.reference.rotation;
			}
			if (p == "scale") {
				ol = this.relative.scale[s];
				of = this.reference.scale[s];
			}
			if (p == "strokeWidth") {
				ol = this.relative.poly.strokeWidth;
				of = this.relative.poly.strokeWidth;
			}

			this.offset = ol - of;

			if (p == 'scale') {
				this.offset = ol / of;
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
				let c = this.relative.c_inbound[p][s];
				c.update_value();
			}
		} else {
			// Or just update value for given subproperty
			s = this._lookup(this.sub_prop);
			if (p == "rotation") {
				let r0 = this.relative.rotation;
				this.relative.set_rotation(-r0 + this.reference.rotation + this.offset);
			} else if (p == "scale") {
				let fx = this.reference.scale.x;
				let fy = this.reference.scale.y;
				if (s == 'x') this.relative.set_scale(fx*this.offset, null);
				if (s == 'y') this.relative.set_scale(null, fy*this.offset);
			} else if (p == "strokeWidth") {
				this.relative.poly.strokeWidth = this.reference.poly.strokeWidth + this.offset;
			} else {
				this.relative.poly[p][s] = this.reference.poly[p][s] + this.offset;
			}

		}

		// this.relative.editor.update_constraint(p, this.sub_prop);
	}

	get_constraint_ref_label() {
		return this.reference.name;
	}

	get_constraint_offset() {
		return this.offset;
	}

	// preview() {
	// 	// Show reference and relative boxes
	// }

	static update_constraints(p, s, obj) {
		// Inbound: update offset
		let c_in = obj.c_inbound[p][s];
		if (c_in) c_in.calculate_offset();

		// Outbound: update values
		let c_outbounds = obj.c_outbound[p][s];
		for (let idx in c_outbounds) {
			let c_out = c_outbounds[idx];
			c_out.update_value();
			// Recurse
			this.update_constraints(p, s, c_out.relative);
		}

		obj.editor.update_constraint();
	}






}
