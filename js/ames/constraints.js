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

		console.log("making constraint for sub_p", sub_p);
		this.relative.c_inbound[p][sub_p] = this;
		this.reference.c_outbound[p][sub_p].push(this);
		console.log('reference constraints', this.reference.c_outbound);

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
		return s;
	}

	calculate_offset() {
		// For now static offset
		let p = this.property;
		let s = this._lookup(this.sub_prop);

		console.log("calculating offset for ", p, s);
		
		let ol = this.relative.poly[p][s];
		let of = this.reference.poly[p][s];
		if (p == "rotation") {
			ol = this.relative.poly.rotation;
			of = this.reference.poly.rotation;
		}
		if (p == "scale") {
			ol = this.relative.scale[s];
			of = this.reference.scale[s];
			console.log('scale ol and of', ol, of, ol - of);
		}
		if (p == "strokeWidth") {
			ol = this.relative.poly.strokeWidth;
			of = this.relative.poly.strokeWidth;
		}
		// console.log("calculate offset for ", p, s);
		// // console.log(this.relative.poly.p);
		// console.log('rel', this.relative.poly[p]);
		// console.log('rel', this.relative.poly[p][s]);
		// console.log('ref', this.reference.poly[p]);
		// console.log('ref', this.reference.poly[p][s]);
		// console.log(this.relative.poly);

		this.offset = ol - of;
	}

	update_value() {
		let p = this.property;
		let s;
		// Update all subproperty values if necessary
		if (this.sub_prop == "all") {
			let s_list = utils.SUB_PROPS[p];
			for (let i in s_list) {
				s = s_list[i];
				let c = this.relative.c_inbound[p][s]
				c.update_value();
			}
		} else {
			// Or just update value for given subproperty
			s = this._lookup(this.sub_prop);
			if (p == "rotation") {
				this.relative.poly.rotation = this.reference.poly.rotation + this.offset;
			} else if (p == "scale") {
				if (s == 'x') this.relative.set_scale(this.reference.scale.x + this.offset, 1);
				if (s == 'y') this.relative.set_scale(1, this.reference.scale.y + this.offset);
			} else if (p == "strokeWidth") {
				this.relative.poly.strokeWidth = this.reference.poly.strokeWidth + this.offset;
			}
			else {
				this.relative.poly[p][s] = this.reference.poly[p][s] + this.offset;
			}

		}
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




}
