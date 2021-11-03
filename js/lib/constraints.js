"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Constraint = void 0;

var _utils = require("./utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AMES_Constraint = /*#__PURE__*/function () {
  // Visual aids
  function AMES_Constraint(rel, ref, p, sub_p, opt) {
    _classCallCheck(this, AMES_Constraint);

    _defineProperty(this, "reference", void 0);

    _defineProperty(this, "relative", void 0);

    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "rel_idx", void 0);

    _defineProperty(this, "property", void 0);

    _defineProperty(this, "sub_prop", void 0);

    _defineProperty(this, "is_manual_constraint", false);

    _defineProperty(this, "is_self_referencing", false);

    _defineProperty(this, "c_rel_box", void 0);

    _defineProperty(this, "c_ref_box", void 0);

    _defineProperty(this, "rel_idx", void 0);

    _defineProperty(this, "cycle", 1);

    _defineProperty(this, "offset_mode", false);

    console.log('Making constraint between ', rel.name, ref.name, p, sub_p); // if (!((rel.is_shape && ref.is_shape) || (rel.is_list))) return;

    if (rel.is_list) {
      var n = rel.count;
      var m = ref.count;
      if (ref.is_shape) m = 0; // Add to relative's list_constraints
      // rel.list_constraints.push(this);
      // Initialize rel_idx

      this.rel_idx = [];

      for (var i = 0; i < n; i++) {
        this.rel_idx[i] = i;
      }

      if (n == 1) this.rel_idx[0] = 0.5;

      if (ref.is_list) {
        for (var _i = 0; _i < n; _i++) {
          var s1 = rel.shapes[_i].name;

          for (var j = 0; j < m; j++) {
            var s2 = ref.shapes[j].name; // If they are the same object...

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
    if (!sub_p) sub_p = 'all';
    this.sub_prop = sub_p;
    opt = opt || {};
    if (opt.c_rel_box) this.c_rel_box = opt.c_rel_box.clone(false);
    if (opt.c_ref_box) this.c_ref_box = opt.c_ref_box.clone(false);
    if (opt.is_manual_constraint) this.is_manual_constraint = true;
    var root = !opt.overwrite;
    if (sub_p != 'all') this.calculate_offset();
    console.log(this.relative, p, sub_p);
    this.relative.c_inbound[p][sub_p][ref.name] = this;
    this.reference.c_outbound[p][sub_p][rel.name] = this; // console.log("making constraint for", p, sub_p);
    // console.log("relative constraints", this.relative.c_inbound[p][sub_p]);
    // console.log('reference constraints', this.reference.c_outbound[p][sub_p]);
    // Handle constraint overwrites

    if (sub_p == 'all') {
      // Make constraints (recurse) on subproperties
      // console.log('utils sub props', utils.SUB_PROPS[p]);
      var s_list = _utils.AMES_Utils.SUB_PROPS[p];

      for (var _i2 in s_list) {
        var s = s_list[_i2];
        var c = new AMES_Constraint(rel, ref, p, s, {
          'c_rel_box': this.c_rel_box,
          'c_ref_box': this.c_ref_box,
          'overwrite': true,
          'is_manual_constraint': this.is_manual_constraint
        });
      }
    } else {
      // All constraint is not applicable anymore since an individual
      // subproperty is constrained
      if (root) this._remove_all_constraint();
    }

    console.log("constructor... self-referencing?", this.is_self_referencing);
  } // TO DO: child properties??


  _createClass(AMES_Constraint, [{
    key: "_remove_all_constraint",
    value: function _remove_all_constraint() {
      var p = this.property; // Remove the relative's inbound all constraint on property

      delete this.relative.c_inbound[p]['all'][this.reference.name]; // Remove the reference's outbound all constraint on object property

      var all_list = this.reference.c_outbound[p]['all'];
      delete this.reference.c_outbound[p]['all'][this.relative.name];
    }
  }, {
    key: "_lookup",
    value: function _lookup(s) {
      if (s == 'h') return 'hue';
      if (s == 's') return 'saturation';
      if (s == 'v') return 'brightness';
      if (s == 'a') return 'alpha';
      return s;
    }
  }, {
    key: "calculate_offset",
    value: function calculate_offset() {
      // For now static offset
      var p = this.property;

      var s = this._lookup(this.sub_prop);

      var ol = this.get_data(this.relative, p, s);
      var of = this.get_data(this.reference, p, s); // Case #1: relative & reference are a shape

      if (this.relative.is_shape && this.reference.is_shape) {
        this.offset = ol - of;

        if (p == 'scale') {
          this.offset = ol / of;
        }

        if (!this.offset) this.offset = 0;
      } // Case #2: relative is a list & reference is a shape


      if (this.relative.is_list && this.reference.is_shape) {
        if (!this.offset) this.offset = []; // ol is y values of relative; of is y values of reference
        // Assume only mode for now is interpolate

        var n = this.relative.count;
        var m = 1; // Create Lagrangian representation of reference values by
        // evenly distributing them across the relative indices

        var data = [];
        if (n % 2 == 0) data[0] = [(n - 1) / 2, of];else data[0] = [(n - 1) / 2 - 1, of];

        for (var i = 0; i < n; i++) {
          var ov = _utils.AMES_Utils.interpolate(data, this.rel_idx[i]);

          var off = ol[i] - ov;
          if (p == 'scale') off = ov / ol[i];
          if (!off) off = 0;
          this.offset[i] = off;
        }
      } // Case #3: relative is a shape & reference is a list


      if (this.relative.is_shape && this.reference.is_list) {
        // ol is y values of relative; of is y values of reference
        // Assume only mode for now is interpolate
        var _m = this.reference.count; // Create Lagrangian representation of reference values by
        // evenly distributing them across the relative indices

        var _data = [];

        for (var _i3 = 0; _i3 < _m; _i3++) {
          _data[_i3] = [_i3 / (_m - 1), of[_i3]];
        }

        var _ov = _utils.AMES_Utils.interpolate(_data, 0.5);

        var _off = ol - _ov;

        if (p == 'scale') _off = _ov / ol;
        if (!_off) _off = 0;
        this.offset = _off;
      } // Case #4: relative & reference are lists


      if (this.relative.is_list & this.reference.is_list) {
        if (!this.offset) this.offset = [];
        if (!this.exempt) this.exempt = []; // ol is y values of relative; of is y values of reference
        // Assume only mode for now is interpolate

        var _n = this.relative.count;
        var _m2 = this.reference.count; // Create Lagrangian representation of reference values by
        // evenly distributing them across the relative indices

        var _data2 = [];
        var k = _n - 1;
        if (_n == 1) k = 1;

        for (var _i4 = 0; _i4 < _m2; _i4++) {
          _data2[_i4] = [_i4 * (k / (_m2 - 1)), of[_i4]];
        }

        if (_m2 == 1) {
          if (_n % 2 == 0) _data2[0] = [(_n - 1) / 2, of[0]];else _data2[0] = [(_n - 1) / 2 - 1, of[0]];
        }

        console.log("list to list constraint", this.relative.shapes, this.reference.shapes); // For the objects in the relative list in the reference list...

        for (var _i5 = 0; _i5 < _n; _i5++) {
          var s1 = this.relative.shapes[_i5].name;
          var match = false;

          for (var j = 0; j < _m2; j++) {
            var s2 = this.reference.shapes[j].name; // If they are the same object...

            if (s1 == s2) {
              match = true;
            }
          }

          if (match) this.exempt[_i5] = true;else this.exempt[_i5] = false;
        } //


        for (var _i6 = 0; _i6 < _n; _i6++) {
          var _ov2 = _utils.AMES_Utils.interpolate(_data2, this.rel_idx[_i6]);

          var _off2 = ol[_i6] - _ov2;

          if (p == 'scale') _off2 = _ov2 / ol[_i6];
          if (!_off2) _off2 = 0;
          this.offset[_i6] = _off2;
        }

        console.log('check list to list constraint is correct', _data2, this.rel_idx, this.offset);
      }
    }
  }, {
    key: "process_data",
    value: function process_data(y) {
      if (this.reference.is_shape) return [[0, y]];
      var n = this.relative.count;
      if (this.relative.is_shape) n = 1;
      var m = this.reference.count;
      var data = [];
      var k = n - 1;
      if (n == 1) k = 1;

      for (var i = 0; i < m; i++) {
        data[i] = [i * (k / (m - 1)), y[i]];
      }

      if (m == 1) {
        if (n % 2 == 0) data[0] = [(n - 1) / 2, y[0]];else data[0] = [(n - 1) / 2 - 1, y[0]];
      }

      return data;
    } // get_data(obj, p, s): Returns the value of the obj specified by either
    // fetching data from a list or getting the necessary value from the shape

  }, {
    key: "get_data",
    value: function get_data(obj, p, s) {
      var data = [];
      var x;
      var y;

      if (obj.is_list) {
        for (var i in obj.shapes) {
          x = i;
          y = obj.shapes[i].poly[p][s];

          if (p == "rotation") {
            y = obj.shapes[i].rotation;
          }

          if (p == "scale") {
            y = obj.shapes[i].scale[s];
          }

          if (p == "strokeWidth") {
            y = obj.shapes[i].poly.strokeWidth;
          }

          if (!y) y = 0;
          data[i] = y;
        }

        return data;
      } else {
        y = obj.poly[p][s];

        if (p == "rotation") {
          y = obj.rotation;
        }

        if (p == "scale") {
          y = obj.scale[s];
        }

        if (p == "strokeWidth") {
          y = obj.poly.strokeWidth;
        }

        if (!y) y = 0;
        return y;
      }
    } // change_offset: changes the offset by the amount specified by x

  }, {
    key: "change_offset",
    value: function change_offset(x) {
      console.log("change_offset");

      if (this.relative.is_shape) {
        this.offset += x;
        this.update_value();
        this.relative.update_constraints();
      }

      if (this.relative.is_list) {
        var n = this.relative.count;
        var active_obj_idx = 0; // If in list mode, update offsets for all items in the list

        if (!this.relative.offset_mode) {
          for (var i = 0; i < n; i++) {
            this.offset[i] += x;
          }
        } else {
          // Otherwise only update the offset for the active object
          for (var _i7 = 0; _i7 < n; _i7++) {
            if (this.relative.shapes[_i7].name == this.relative.active_obj.name) active_obj_idx = _i7;
          }

          this.offset[active_obj_idx] += x;
        }

        this.update_value();
        this.relative.update_constraints();
      }
    }
  }, {
    key: "change_rel_idx",
    value: function change_rel_idx(x) {
      var constraints_to_update = [this]; // If they exist update relative value of subproperty constraints

      if (this.sub_prop == "all") {
        var p = this.property;
        var s_list = _utils.AMES_Utils.SUB_PROPS[p];

        for (var s_idx in s_list) {
          var s = s_list[s_idx];
          var c_s = this.relative.c_inbound[p][s][this.reference.name];
          if (c_s) constraints_to_update.push(c_s);
        }
      } // Iterate through all necessary constraints...


      for (var idx in constraints_to_update) {
        var c = constraints_to_update[idx];

        if (c.relative.is_list) {
          var active_obj_idx = 0;
          var n = this.relative.count;

          for (var i = 0; i < n; i++) {
            if (c.relative.shapes[i].name == c.relative.active_obj.name) active_obj_idx = i;
          }

          c.rel_idx[active_obj_idx] += x;
          c.update_value();
          c.relative.update_constraints();
        }
      }
    }
  }, {
    key: "update_value",
    value: function update_value() {
      var p = this.property;
      var s; // console.log("updating constraint between rel / ref", this.relative.name, this.reference.name, this.property, this.sub_prop);
      // Update all subproperty values if necessary

      if (this.sub_prop == "all") {
        var s_list = _utils.AMES_Utils.SUB_PROPS[p];

        for (var i in s_list) {
          s = s_list[i];
          var c = this.relative.c_inbound[p][s][this.reference.name];
          if (c) c.update_value();
        }
      } else {
        // Or just update value for given subproperty
        s = this._lookup(this.sub_prop);

        if (p == 'position') {
          var pt;

          if (this.relative.is_shape) {
            var nv;
            if (this.reference.is_shape) nv = this.reference.poly[p][s];
            if (this.reference.is_list) nv = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
            if (s == 'x') pt = new Point(nv + this.offset - this.relative.poly.position.x, 0);
            if (s == 'y') pt = new Point(0, nv + this.offset - this.relative.poly.position.y);
            if (pt) this.relative.set_pos(pt, true);
          }

          if (this.relative.is_list) {
            var n = this.relative.count;

            var _nv;

            var data = this.process_data(this.get_data(this.reference, p, s));

            for (var _i8 = 0; _i8 < n; _i8++) {
              if (!this.exempt[_i8]) {
                _nv = _utils.AMES_Utils.interpolate(data, this.rel_idx[_i8]);
                if (s == 'x') pt = new Point(_nv + this.offset[_i8] - this.relative.shapes[_i8].poly.position.x, 0);
                if (s == 'y') pt = new Point(0, _nv + this.offset[_i8] - this.relative.shapes[_i8].poly.position.y);
                if (pt) this.relative.shapes[_i8].set_pos(pt, true);
              }
            }
          }
        }

        if (p == "rotation") {
          var r0;

          if (this.relative.is_shape) {
            var _nv2;

            if (this.reference.is_shape) _nv2 = this.reference.rotation;
            if (this.reference.is_list) _nv2 = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
            r0 = this.relative.rotation;
            this.relative.set_rotation(-r0 + _nv2 + this.offset);
          }

          if (this.relative.is_list) {
            var _n2 = this.relative.count;

            var _nv3;

            var _data3 = this.process_data(this.get_data(this.reference, p, s));

            console.log(_data3, this.rel_idx);

            for (var _i9 = 0; _i9 < _n2; _i9++) {
              r0 = this.relative.shapes[_i9].rotation;
              _nv3 = _utils.AMES_Utils.interpolate(_data3, this.rel_idx[_i9]);

              this.relative.shapes[_i9].set_rotation(-r0 + _nv3 + this.offset[_i9]);
            }
          }
        } else if (p == "scale") {
          var fx;
          var fy;

          if (this.relative.is_shape) {
            var nv_x;
            var nv_y;

            if (this.reference.is_shape) {
              nv_x = this.reference.scale.x;
              nv_y = this.reference.scale.y;
            }

            if (this.reference.is_list) {
              nv_x = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, 'x')), 0.5);
              nv_y = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, 'y')), 0.5);
            }

            fx = this.reference.scale.x;
            fy = this.reference.scale.y;
            if (s == 'x') this.relative.set_scale(fx * this.offset, null);
            if (s == 'y') this.relative.set_scale(null, fy * this.offset);
          }

          if (this.relative.is_list) {
            var _n3 = this.relative.count;

            var _nv_x;

            var _nv_y;

            var data_x = this.process_data(this.get_data(this.reference, p, "x"));
            var data_y = this.process_data(this.get_data(this.reference, p, "y"));

            for (var _i10 = 0; _i10 < _n3; _i10++) {
              fx = _utils.AMES_Utils.interpolate(data_x, this.rel_idx[_i10]);
              fy = _utils.AMES_Utils.interpolate(data_y, this.rel_idx[_i10]);
              if (s == 'x') this.relative.shapes[_i10].set_scale(fx * this.offset[_i10], null);
              if (s == 'y') this.relative.shapes[_i10].set_scale(null, fy * this.offset[_i10]);
            }
          }
        } else if (p == "strokeWidth") {
          if (this.relative.is_shape) {
            var _nv4;

            if (this.reference.is_shape) _nv4 = this.reference.poly.strokeWidth;
            if (this.reference.is_list) _nv4 = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);
            this.relative.poly.strokeWidth = this.reference.poly.strokeWidth + this.offset;
          }

          if (this.relative.is_list) {
            var _n4 = this.relative.count;

            var _nv5;

            var _data4 = this.process_data(this.get_data(this.reference, p, s));

            for (var _i11 = 0; _i11 < _n4; _i11++) {
              _nv5 = _utils.AMES_Utils.interpolate(_data4, this.rel_idx[_i11]);
              this.relative.shapes[_i11].poly.strokeWidth = _nv5 + this.offset[_i11];
            }
          }
        } else {
          if (this.relative.is_shape) {
            var _nv6;

            if (this.reference.is_shape) _nv6 = this.reference.poly[p][s];
            if (this.reference.is_list) _nv6 = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, s)), 0.5);

            if (s == "hue" && this.relative.poly.fillColor.saturation == 0) {
              if (this.reference.is_shape) _nv6 = this.reference.poly.fillColor.saturation;
              if (this.reference.is_list) _nv6 = _utils.AMES_Utils.interpolate(this.process_data(this.get_data(this.reference, p, "saturation")), 0.5);
              this.relative.poly.fillColor.saturation = _nv6;
            }

            this.relative.poly[p][s] = _nv6 + this.offset;
          }

          if (this.relative.is_list) {
            var _n5 = this.relative.count;

            var _nv7;

            var _data5 = this.process_data(this.get_data(this.reference, p, s));

            var data_hue = this.process_data(this.get_data(this.reference, p, "hue"));
            var reset_sat = true;

            if (s == "hue") {
              for (var _i12 = 0; _i12 < _n5; _i12++) {
                if (this.relative.shapes[_i12].poly.saturation != 0) {
                  reset_sat = false;
                }
              }
            }

            for (var _i13 = 0; _i13 < _n5; _i13++) {
              if (s == "hue") {
                if (reset_sat) {
                  _nv7 = _utils.AMES_Utils.interpolate(data_hue, this.rel_idx[_i13]);
                  this.relative.shapes[_i13].poly.saturation = _nv7;
                }
              }

              _nv7 = _utils.AMES_Utils.interpolate(_data5, this.rel_idx[_i13]);
              this.relative.shapes[_i13].poly[p][s] = _nv7 + this.offset[_i13];
            }
          }
        }
      }

      if (this.relative.is_shape) {
        this.relative.update_control_shapes();
      }

      if (this.relative.is_list) {
        var _n6 = this.relative.count;

        for (var _i14 = 0; _i14 < _n6; _i14++) {
          this.relative.shapes[_i14].update_control_shapes();
        }

        this.relative.update_show_box_bounds();
        AMES_Constraint.update_list_constraints(this.relative, this.property, this.sub_prop, this);
      }
    }
  }, {
    key: "get_offset",
    value: function get_offset() {
      if (this.relative.is_shape) {
        return this.offset;
      }

      if (this.relative.is_list) {
        var active_obj_idx = 0;

        if (this.relative.active_obj) {
          var n = this.relative.count;

          for (var i = 0; i < n; i++) {
            if (this.relative.shapes[i].name == this.relative.active_obj.name) active_obj_idx = i;
          }
        }

        return this.offset[active_obj_idx];
      }
    }
  }, {
    key: "get_rel_idx",
    value: function get_rel_idx() {
      if (this.relative.is_list) {
        var active_obj_idx = 0;

        if (this.relative.active_obj) {
          var n = this.relative.count;

          for (var i = 0; i < n; i++) {
            if (this.relative.shapes[i].name == this.relative.active_obj.name) active_obj_idx = i;
          }
        } // console.log('get_rel_idx: ', active_obj_idx, this.rel_idx);


        return this.rel_idx[active_obj_idx];
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      var p = this.property;
      var s = this.sub_prop; // Remove inbound constraint

      delete this.relative.c_inbound[p][s][this.reference.name]; // Remove outbound constraint

      delete this.reference.c_outbound[p][s][this.relative.name]; // If constraint removed applies to all subprops, remove corresponding
      // constraints

      if (s == "all") {
        var s_list = _utils.AMES_Utils.SUB_PROPS[p];

        for (var i in s_list) {
          var sub = s_list[i]; // Remove inbound constraint

          delete this.relative.c_inbound[p][sub][this.reference.name]; // Remove outbound constraint

          delete this.reference.c_outbound[p][sub][this.relative.name];
        }
      }

      this.relative.editor.update_constraint();
      this.reference.editor.update_constraint();
    }
  }], [{
    key: "update_list_constraints",
    value: function update_list_constraints(obj, p, s, constraint) {
      if (obj.is_list) {
        var active_obj_idx = 0; // Iterate through all the shapes in the list starting w/ active list object
        // Update constraints that define the list on the same property

        for (var j in obj.list_constraints) {
          var c = obj.list_constraints[j];

          if (c != constraint && c.property == p && c.sub_prop == s) {
            c.calculate_offset();
            c.update_value();
          }
        } // If list defines duplicator update list constraints for the duplicator
        // controls


        if (obj.first_last) {
          for (var i in obj.first_last.list_constraints) {
            var _c = obj.first_last.list_constraints[i];

            if (_c.property == p && _c.sub_prop == s) {
              _c.calculate_offset();

              _c.update_value();
            }
          }
        }
      }
    }
  }, {
    key: "update_constraint_offsets",
    value: function update_constraint_offsets(p, s, obj, cycle) {
      var c_inbounds = obj.c_inbound[p][s];
      var c_outbounds = obj.c_outbound[p][s]; // If this is the original update

      if (!cycle) {
        // Get a unique identifier to prevent cycle propagation
        var prev_cycles = [];

        for (var i in c_inbounds) {
          prev_cycles.push(c_inbounds[i].cycle);
        }

        for (var _i15 in c_outbounds) {
          prev_cycles.push(c_outbounds[_i15].cycle);
        }

        cycle = Math.floor(Math.random() * 1000 + 1);

        while (cycle in prev_cycles) {
          cycle = Math.floor(Math.random() * 1000 + 1);
        }

        for (var _i16 in c_inbounds) {
          c_inbounds[_i16].cycle = cycle;
        }
      } // Inbound: update offsets


      for (var _i17 in c_inbounds) {
        var c_in = c_inbounds[_i17]; // If constraint is not bidrectional update offset or in a list

        if (!c_in.reference.c_inbound[p][s][obj.name] && c_in.is_manual_constraint) {
          var r_name = c_in.reference.name; // Update offsets for child properties

          if (s == "all") {
            var s_list = _utils.AMES_Utils.SUB_PROPS[p];

            for (var _i18 in s_list) {
              var sub = s_list[_i18];
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
  }, {
    key: "update_outbound_offsets",
    value: function update_outbound_offsets(p, s, obj, cycle) {
      // console.log(obj.name, p, s, cycle, c_outbounds);
      // Outbound: update values
      // For 'all' update outbound constraints for child properties
      var c_outbounds = Object.values(obj.c_outbound[p][s]);

      if (s == "all") {
        var s_list = _utils.AMES_Utils.SUB_PROPS[p];

        for (var i in s_list) {
          var sub = s_list[i];
          c_outbounds = c_outbounds.concat(Object.values(obj.c_outbound[p][sub]));
        }
      } else {
        c_outbounds = obj.c_outbound[p][s];
      } // Update outbound constraint values


      for (var idx in c_outbounds) {
        var c_out = c_outbounds[idx];

        if (c_out.cycle != cycle) {
          c_out.cycle = cycle;
          c_out.calculate_offset(); // And recurse to handle constraint chains

          this.update_outbound_offsets(p, s, c_out.relative, cycle);
        }
      }

      obj.editor.update_constraint();
    }
  }, {
    key: "update_constraints",
    value: function update_constraints(p, s, obj, cycle) {
      // Get inbound and outbound constraints
      var c_inbounds = obj.c_inbound[p][s];
      var c_outbounds = obj.c_outbound[p][s];
      console.log(obj, c_inbounds, c_outbounds); // console.log("updating", obj, p, s);
      // Cycle detection...
      // If this is the original update

      if (!cycle) {
        // Get a unique identifier to prevent cycle propagation
        var prev_cycles = [];

        for (var i in c_inbounds) {
          prev_cycles.push(c_inbounds[i].cycle);
        }

        for (var _i19 in c_outbounds) {
          prev_cycles.push(c_outbounds[_i19].cycle);
        }

        cycle = Math.floor(Math.random() * 1000 + 1);

        while (cycle in prev_cycles) {
          cycle = Math.floor(Math.random() * 1000 + 1);
        }

        for (var _i20 in c_inbounds) {
          c_inbounds[_i20].cycle = cycle;
        }
      } // console.log(obj.name, p, s, cycle, c_outbounds);
      // Inbound: update offsets


      for (var _i21 in c_inbounds) {
        var c_in = c_inbounds[_i21]; // If constraint is not bidrectional update offset or the constraint is not in a self-referencing list...

        if (c_in.is_self_referencing) console.log("self referencing inbound constraint");

        if (!c_in.reference.c_inbound[p][s][obj.name] && !c_in.is_self_referencing) {
          var r_name = c_in.reference.name; // Update offsets for child properties

          if (s == "all") {
            var s_list = _utils.AMES_Utils.SUB_PROPS[p];

            for (var _i22 in s_list) {
              var sub = s_list[_i22];
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
      } // Outbound: update values
      // For 'all' update outbound constraints for child properties


      c_outbounds = Object.values(obj.c_outbound[p][s]);

      if (s == "all") {
        var _s_list = _utils.AMES_Utils.SUB_PROPS[p];

        for (var _i23 in _s_list) {
          var _sub = _s_list[_i23];
          c_outbounds = c_outbounds.concat(Object.values(obj.c_outbound[p][_sub]));
        }
      } // Update outbound constraint values


      for (var idx in c_outbounds) {
        var c_out = c_outbounds[idx];

        if (c_out.cycle != cycle) {
          c_out.cycle = cycle; // Update offset or value & recurse to handle constraint chains

          if (c_out.offset_mode) {
            c_out.calculate_offset();
            this.update_outbound_offsets(p, s, c_out.relative, cycle);
          } else {
            // console.log("should not be here");
            c_out.update_value(); // Recurse

            this.update_constraints(p, s, c_out.relative, cycle);
          }
        }
      }

      if (obj.editor) obj.editor.update_constraint();
    }
  }]);

  return AMES_Constraint;
}();

exports.AMES_Constraint = AMES_Constraint;