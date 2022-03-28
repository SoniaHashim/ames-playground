"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Artwork_Path = exports.AMES_Ellipse = exports.AMES_Polygon = exports.AMES_Artwork = void 0;

var _utils = require("./utils.js");

var _editors = require("./editors.js");

var _constraints = require("./constraints.js");

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// let cb_canvas_crosshair = (e) => {
// 	ames.canvas.style.cursor = 'crosshair';
// }
// Class: Artwork
// ----------------------------------------------------------------------------
// Description: Basic artwork representation with visual & temporal properties
var AMES_Artwork = /*#__PURE__*/function () {
  // Display properties including name, visibility, layer
  // Visual Properties: position, scale, rotate, stroke w, stroke c, fill
  // Shape geoemtry
  // State
  function AMES_Artwork() {
    _classCallCheck(this, AMES_Artwork);

    _defineProperty(this, "name", "Shape");

    _defineProperty(this, "is_geometry", true);

    _defineProperty(this, "is_shape", true);

    _defineProperty(this, "is_artwork", true);

    _defineProperty(this, "obj_type", "shape");

    _defineProperty(this, "visible", false);

    _defineProperty(this, "number", 0);

    _defineProperty(this, "pos", {
      x: ames.canvas_cy,
      y: ames.canvas_cy
    });

    _defineProperty(this, "scale", {
      x: 1,
      y: 1
    });

    _defineProperty(this, "rotation", 0);

    _defineProperty(this, "visual_props", {
      'Position': this.pos,
      'Scale': this.scale
    });

    _defineProperty(this, "poly", void 0);

    _defineProperty(this, "is_selected", false);

    _defineProperty(this, "selection_opts", []);

    _defineProperty(this, "path_control_shapes", []);

    _defineProperty(this, "scale_control_shapes", {
      'scale_box': null,
      'scale_dots': null
    });

    _defineProperty(this, "rotation_control_shapes", {});

    _defineProperty(this, "vis_control_shapes", {
      'path': false
    });

    _defineProperty(this, "cbs", {
      'position': this._position_cb,
      'scale': this._scale_cb,
      'rotation': this._rotation_cb,
      'fillColor': this._fill_cb,
      'strokeWidth': this._strokewidth_cb,
      'strokeColor': this._strokecolor_cb,
      'path': this._path_cb
    });

    _defineProperty(this, "cb_helpers", {
      'shapes': []
    });

    _defineProperty(this, "collections", []);

    _defineProperty(this, "transformations", []);

    _defineProperty(this, "lists", {});

    _defineProperty(this, "c_inbound", {
      "position": {
        "all": {},
        "x": {},
        "y": {}
      },
      "scale": {
        "all": {},
        "x": {},
        "y": {}
      },
      "rotation": {
        "all": {},
        "t": {}
      },
      "fillColor": {
        "all": {},
        "h": {},
        "s": {},
        "v": {},
        "a": {}
      },
      "strokeWidth": {
        "all": {},
        "w": {}
      },
      "strokeColor": {
        "all": {},
        "h": {},
        "s": {},
        "v": {},
        "a": {}
      },
      "path": {}
    });

    _defineProperty(this, "c_outbound", {
      "position": {
        "all": {},
        "x": {},
        "y": {}
      },
      "scale": {
        "all": {},
        "x": {},
        "y": {}
      },
      "rotation": {
        "all": {},
        "t": {}
      },
      "fillColor": {
        "all": {},
        "h": {},
        "s": {},
        "v": {},
        "a": {}
      },
      "strokeWidth": {
        "all": {},
        "w": {}
      },
      "strokeColor": {
        "all": {},
        "h": {},
        "s": {},
        "v": {},
        "a": {}
      },
      "path": {}
    });

    this.number = AMES_Artwork.count;
    AMES_Artwork.count += 1;
  } // add_list: adds list to track which lists the shape is in so updates to the shape
  // can update the list helper shapes


  _createClass(AMES_Artwork, [{
    key: "add_list",
    value: function add_list(list) {
      this.lists[list.name] = list;
    }
  }, {
    key: "add_collection",
    value: function add_collection(collection) {
      var missing = true;

      for (var i in this.collections) {
        if (this.collections[i] == collection) missing = false;
      }

      if (missing) this.collections.push(collection);
      if (missing) console.log("add collection", this.collections, collection);
    }
  }, {
    key: "add_transformation",
    value: function add_transformation(transformation) {
      var missing = true;

      for (var i in this.transformations) {
        if (this.transformations[i] == transformation) missing = false;
      }

      if (missing) this.transformations.push(transformation);
    }
  }, {
    key: "remove_collection",
    value: function remove_collection(collection) {
      var idx = -1;

      for (var i in this.collections) {
        if (this.collections[i] == collection) {
          idx = i;
          break;
        }
      }

      if (idx >= 0) this.collections.splice(idx, 1);
    }
  }, {
    key: "remove_transformation",
    value: function remove_transformation(transformation) {
      var idx = -1;

      for (var i in this.transformations) {
        if (this.transformations[i] == transformation) {
          idx = i;
          break;
        }
      }

      if (idx >= 0) this.transformations.splice(idx, 1);
    } // set_pos(pt, is_delta)
    // Description: Updates the position of the shape to the pt specified or by
    // the vector specified if is_delta is true

  }, {
    key: "set_pos",
    value: function set_pos(p, is_delta) {
      if (is_delta) {
        this.pos.x += p.x;
        this.pos.y += p.y;
        if (this.poly) this.poly.position.add(p);

        if (this.rotation_control_shapes.line) {
          this.rotation_control_shapes.line.position = this.rotation_control_shapes.line.position.add(p);
        }
      } else {
        this.pos.x = p.x;
        this.pos.y = p.y;
        var npos = new Point(p.x, p.y);
        if (this.poly) this.poly.position = new Point(this.pos.x, this.pos.y);

        if (this.rotation_control_shapes.line) {
          this.rotation_control_shapes.line.segments[0].point = this.poly.position.add(this.rotation_control_shapes.a_offset);
        }
      }
    }
  }, {
    key: "set_scaling",
    value: function set_scaling(x) {
      this.poly.scaling = x;
    } // set_scale(f)
    // Description: Updates the scale of the shape by the given amount

  }, {
    key: "set_scale",
    value: function set_scale(fx, fy) {
      // this.scale.x = fx*this.scale.x;
      // this.scale.y = fy*this.scale.y;
      var sx = 1;
      var sy = 1;

      if (fx) {
        sx = fx / this.scale.x;
        this.scale.x = fx;
      }

      if (fy) {
        sy = fy / this.scale.y;
        this.scale.y = fy;
      }

      if (this.poly) this.poly.scale(sx, sy);

      if (this.rotation_control_shapes.line) {
        this.rotation_control_shapes.a_offset = this.rotation_control_shapes.a_offset.multiply(sx, sy);
      }
    }
  }, {
    key: "set_rotation",
    value: function set_rotation(theta, anchor) {
      this.rotation += theta;

      if (this.poly) {
        // if (this.rotation_control_shapes.da) {
        // 	anchor = this.rotation_control_shapes.da.position;
        // }
        if (!anchor) anchor = this.rotation_control_shapes.line.segments[0].point;

        if (anchor) {
          this.poly.rotate(theta, anchor);
          if (this.rotation_control_shapes.line) this.rotation_control_shapes.line.rotate(theta, anchor);
        } else {
          this.poly.rotate(theta);
        }
      }
    } // draw_shape()
    // Description: Default shows not implemented

  }, {
    key: "draw_shape",
    value: function draw_shape() {
      console.log("draw_shape not implemented for " + this.name);
    }
  }, {
    key: "get_bbox",
    value: function get_bbox() {
      if (this.poly) {
        var bbox = this.poly.bounds;
        if (this.poly.strokeBounds) bbox = this.poly.strokeBounds;
        return bbox;
      }

      ;
      return;
    }
  }, {
    key: "get_large_bbox",
    value: function get_large_bbox() {
      var r = this.get_bbox();
      this.update_selection_opts();
      var h_min = this.selection_opt_names.length * _utils.AMES_Utils.LAYER_HEIGHT * .75;
      var w_min = 20;
      var h = r.height;
      if (r.height < h_min) h = h_min;
      if (h < 30) h = 30;
      var w = r.width;
      if (w < w_min) w = w_min;
      var bbox = new Rectangle(r.point, new Size(w, h));
      bbox.center = r.center;
      return bbox;
    }
  }, {
    key: "update_bbox",
    value: function update_bbox() {
      this.bbox = this.get_bbox();
    } // get_pos: returns the position of this shape

  }, {
    key: "get_pos",
    value: function get_pos() {
      return this.poly.position;
    } // is_inside(p)
    // Description: Checks if the point p is within the bounding box of shape

  }, {
    key: "contains",
    value: function contains(p) {
      if (this.poly) {
        var bounds = this.get_large_bbox();
        return p.isInside(bounds);
      }

      return;
    }
  }, {
    key: "get_distance_from_bbox_center_to_point",
    value: function get_distance_from_bbox_center_to_point(p) {
      var c = this.get_large_bbox().center;
      var x = c.x - p.x;
      var y = c.y - p.y;
      return Math.sqrt(x * x + y * y);
    } // manipulate: enable interaction on a given property with opt sub properties

  }, {
    key: "manipulate",
    value: function manipulate(p, sub) {
      // Change active property in lists containing shape to match
      for (var i in this.lists) {
        if (this.lists[i].active_prop != p) {
          if (!this.lists[i].is_list_control) {
            this.lists[i].manipulate(p, sub);
            return;
          }
        } else {
          if (sub && this.lists[i].active_sub_p != sub) {
            if (!this.lists[i].is_list_control) {
              this.lists[i].manipulate_helper(sub);
              return;
            }
          }
        }
      }

      this._clear_cb_helpers(); // Turn off the active property


      if (this.active_prop) {
        // Remove subproperty buttons
        this.editor.show_subprops(this.active_prop, false);
        this.editor.select_prop(this.active_prop, false); // this.editor.show_constraint(false);
      } // If the new propety is not the property just turned off, turn it on


      if (this.active_prop != p) {
        // Turn off selection toggle and hide path control shapes
        // this.attach_interactivity(false);
        this.show_path_control_shapes(false);
        this.active_prop = p;
        var sub_p = 'all';
        this.active_sub_p = sub_p;

        if (p == 'strokeColor' || p == 'fillColor') {
          if (!ames.colorpicker.visible) ames.colorpicker.visible = true;
        } else {// if (ames.colorpicker.visible) ames.colorpicker.visible = false;
        } // Indicate active property and show subproperty buttons


        this.editor.show_subprops(p, true);
        this.editor.select_prop(p, true); // this.editor.show_constraint(true, p, sub_p);
        // Activate new propety callback

        this.cbs[p](this, this.cb_helpers);
      } else {
        // Turn selection toggle back on
        this.attach_interactivity(true); // Deactivate property and subproperty

        this.active_prop = null;
        this.active_sub_p = null;
      }
    }
  }, {
    key: "manipulate_helper",
    value: function manipulate_helper(sub) {
      // Change active property in lists containing shape to match
      for (var i in this.lists) {
        if (this.lists[i].active_prop != this.active_prop) {
          this.lists[i].manipulate(this.active_prop, sub);
          return;
        } else {
          if (sub && this.lists[i].active_sub_p != sub) {
            this.lists[i].manipulate_helper(sub);
            return;
          }
        }
      }

      this._clear_cb_helpers();

      this.active_sub_p = sub;
      this.editor.select_subprop(sub, true); // this.editor.show_constraint(true, this.active_prop, sub);

      this.cbs[this.active_prop](this, this.cb_helpers, sub);
    } // Update helpers after a transformation that changes the artwork
    // If the transformation is geometric (changes the scale, position, rotation,
    // stroke width of the shape)... ie anything that can change its bbox the
    // bbox for the artwork is updated as well as the bbox for any collections
    // that it belongs to and the transformation space bounds of any transformation
    // spaces where it is an input

  }, {
    key: "update_helpers",
    value: function update_helpers(artwork, is_geometric) {
      console.log(artwork); // artwork.update_constraints();

      if (is_geometric) {
        artwork.update_bbox();
        artwork.update_collections();
        artwork.update_transformations();
      }
    }
  }, {
    key: "update_constraints",
    value: function update_constraints() {
      var p = this.active_prop;
      var s = this.active_sub_p;
      if (!s) s = 'all'; // constraints.update_constraints(p, s, this);

      for (var i in this.lists) {// this.lists[i].update_constraints();
      }

      for (var _i in ames.lists) {
        ames.lists[_i].update_show_box_bounds();
      }
    }
  }, {
    key: "update_collections",
    value: function update_collections() {
      for (var i in this.collections) {
        this.collections[i].update_show_box();

        for (var j in this.collections[i].tranformations) {
          this.collections[i].transformations[j].update_tf_space();
        }
      }
    }
  }, {
    key: "update_transformations",
    value: function update_transformations() {
      for (var i in this.transformations) {
        this.transformations[i].update_tf_space();
      }
    }
  }, {
    key: "notify_lists_shape_is_active",
    value: function notify_lists_shape_is_active() {
      for (var i in this.lists) {
        this.lists[i].set_active_obj(this);
      }
    }
  }, {
    key: "_clear_cb_helpers",
    value: function _clear_cb_helpers() {
      var shapes = this.cb_helpers['shapes'];
      var n_shapes = this.cb_helpers['shapes'].length;

      for (var idx = 0; idx < n_shapes; idx++) {
        var s = shapes[idx];
        s.remove();
      }

      if (this.cb_helpers['color_target']) {
        var f = this.cb_helpers['color_target'];
        ames.colorpicker.color_target = null;
      }

      if (this.cb_helpers['path']) this.show_path_control_shapes(false);
      if (this.cb_helpers['scale']) this.show_scale_control_shapes(false);
      if (this.cb_helpers['rotation']) this.show_rotation_control_shapes(false);
      this.cb_helpers = {};
      this.cb_helpers['shapes'] = [];
      this.attach_interactivity(true);
    }
  }, {
    key: "_apply_cb_to_collections",
    value: function _apply_cb_to_collections(cb, e) {
      for (var i in this.collections) {
        var c = this.collections[i];

        if (c.active_prop == this.active_prop) {
          if (c.active_sub_p == this.active_sub_p) {
            for (var j in c.shapes) {
              var s = c.shapes[j];

              if (s != this) {
                console.log(s.name);
                s.poly[cb](e, true);
              }
            }
          }
        }
      }
    }
  }, {
    key: "_position_cb",
    value: function _position_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        shape.poly.onMouseDown = function (e, in_chain) {
          // ames.hide_editors(shape);
          // shape.show_all_editors();
          console.log(shape.name, 'onMouseDown', e, in_chain);
          shape.notify_lists_shape_is_active();
          var pos = shape.poly.position;
          var offset = pos.subtract(e.point);
          if (sub && sub == 'x') cb_helpers['y'] = pos.y;
          if (sub && sub == 'y') cb_helpers['x'] = pos.x;
          cb_helpers['offset'] = offset;
          if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);
        };

        shape.poly.onMouseDrag = function (e, in_chain) {
          var offset = cb_helpers['offset'];
          var point = e.point.add(offset);
          if (sub && sub == 'x') point.y = cb_helpers['y'];
          if (sub && sub == 'y') point.x = cb_helpers['x'];
          if (offset) shape.set_pos(point); // Update helpers

          shape.update_helpers(shape, true);
          if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
        };
      }
    }
  }, {
    key: "_scale_cb",
    value: function _scale_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        (function () {
          shape.update_scale_control_shapes();
          shape.show_scale_control_shapes(true);
          cb_helpers['scale'] = true;
          var scale_box = shape.scale_control_shapes.scale_box;
          var scale_dots = shape.scale_control_shapes.scale_dots;

          shape.poly.onMouseDown = function (e) {// ames.hide_editors(shape);
            // shape.show_all_editors();
          };

          var bbox = shape.get_bbox();
          var corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
          var TL = 1;
          var TR = 2;
          var BR = 3;
          var BL = 0;
          var dot_pairs = [TR, BR, BL, TL];
          var bf = 1;
          var pf = 1;

          var _loop = function _loop(d_idx) {
            var d = scale_dots[d_idx];
            d.replaceWith(d.insertBelow(scale_box));
            var d_pair = scale_dots[dot_pairs[d_idx]];
            var scale_start_x = 1;
            var scale_start_y = 1;

            d.onMouseDown = function (e, in_chain) {
              shape.notify_lists_shape_is_active();
              pf = 1;
              scale_start_x = shape.scale.x;
              scale_start_y = shape.scale.y; // Set relative scale to 1 (current size is scale 1)

              var b = shape.poly.position.subtract(d.position);
              bf = b.length;
              if (sub == 'x') bf = b.x;
              if (sub == 'y') bf = b.y;
              if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);
            };

            d.onMouseDrag = function (e, in_chain) {
              var p = shape.poly.position.subtract(e.point);
              var f = p.length / bf;
              var fx = scale_start_x * p.x / bf;
              var fy = scale_start_y * p.y / bf; // Scale shape and box

              if (sub == 'x') {
                f = p.x / bf; // shape.set_scale((1/pf)*f, 1);

                shape.set_scale(fx, null);
                scale_box.scale(1 / pf * f, 1);
              } else if (sub == 'y') {
                f = p.y / bf; // shape.set_scale(1, (1/pf)*f);

                shape.set_scale(null, fy);
                scale_box.scale(1, 1 / pf * f);
              } else {
                // shape.set_scale((1/pf)*f, (1/pf)*f);
                shape.set_scale(scale_start_x * f, scale_start_y * f); // console.log(f);

                scale_box.scale(1 / pf * f, 1 / pf * f);
              } // console.log(f);


              pf = f; // Update dot position and scale_box

              d.position = scale_box.segments[d_idx].point;

              for (var n = 0; n < 4; n++) {
                scale_dots[n].position = scale_box.segments[n].point;
              } // Update helpers


              shape.update_helpers(shape, true);
              if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
            };
          };

          for (var d_idx = 0; d_idx < 4; d_idx++) {
            _loop(d_idx);
          }
        })();
      }
    }
  }, {
    key: "_rotation_cb",
    value: function _rotation_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        // Draw rotation guide
        shape.update_rotation_control_shapes(); // Set dt to be at the top of the current bounding box of the shape

        var bbox = shape.get_bbox();
        shape.rotation_control_shapes.line.segments[1].point = bbox.topCenter;
        shape.rotation_control_shapes.dt.position = bbox.topCenter;
        shape.show_rotation_control_shapes(true);
        cb_helpers['rotation'] = true;
        var line = shape.rotation_control_shapes.line;
        shape.da = shape.rotation_control_shapes.da;
        var dt = shape.rotation_control_shapes.dt;
        var anchor = shape.da.position;
        var x_base = dt.position.subtract(shape.da.position);
        var prev_ro = 0;

        var get_rotation_a = function get_rotation_a(p, anchor) {
          var r_vec = p.subtract(anchor);
          var total_ro = x_base.getDirectedAngle(r_vec);
          var a = total_ro - prev_ro;
          prev_ro = prev_ro + a;
          return a;
        };

        shape.poly.onMouseDown = function (e) {// ames.hide_editors(shape);
          // shape.show_all_editors();
        }; // Update anchor point for rotation


        shape.da.onMouseDrag = function (e, in_chain) {
          shape.da.position = e.point; // Update line

          line.firstSegment.point = e.point; // Update x_base and total rotation using new reference

          anchor = shape.da.position;
          x_base = dt.position.subtract(anchor);
          prev_ro = 0;
          shape.rotation_control_shapes.a_offset = e.point.subtract(shape.poly.position);
          console.log(shape.rotation_control_shapes.a_offset);
          console.log(shape.da.position);
        }; // Rotate based on angle between subsequent rays created by dragging


        var ro;
        var asum = 0;

        dt.onMouseDown = function (e, in_chain) {
          shape.notify_lists_shape_is_active();
          ro = dt.position;
          prev_ro = shape.poly.rotation;
          x_base = dt.position.subtract(shape.da.position);
          if (!in_chain) shape._apply_cb_to_collections("onMouseDown", e);
        }; // Update rotation


        dt.onMouseDrag = function (e, in_chain) {
          anchor = shape.rotation_control_shapes.da.position;
          var a = get_rotation_a(e.point, anchor);
          shape.set_rotation(a, anchor); // shape.poly.rotate(a, anchor);
          // Rotate line
          // line.rotate(a, anchor);
          // asum += a;
          // console.log(asum);
          // Update line segment to match dt

          dt.position = e.point;
          line.lastSegment.point = dt.position; // Update helpers

          shape.update_helpers(shape, true);
          if (!in_chain) shape._apply_cb_to_collections("onMouseDrag", e);
        };
      }
    }
  }, {
    key: "_fill_cb",
    value: function _fill_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        if (shape.poly) ames.colorpicker.load_color(shape.poly.fillColor);

        var color_function = function color_function(c) {
          shape.poly.fillColor = c;
        };

        if (sub == 'h') {
          color_function = function color_function(c) {
            if (shape.poly.fillColor.saturation == 0) shape.poly.fillColor.saturation = 1;
            shape.poly.fillColor.hue = c.hue;
          };
        }

        if (sub == 's') {
          color_function = function color_function(c) {
            shape.poly.fillColor.saturation = c.saturation;
          };
        }

        if (sub == 'v') {
          color_function = function color_function(c) {
            shape.poly.fillColor.brightness = c.brightness;
          };
        }

        if (sub == 'a') {
          color_function = function color_function(c) {
            shape.poly.fillColor.alpha = c.alpha;
          };
        }

        var shape_color_target = function shape_color_target(c) {
          color_function(c); // Update helpers

          shape.update_helpers(shape);
        };

        ames.colorpicker.color_target = shape_color_target;

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape); // shape.show_all_editors();

          shape.notify_lists_shape_is_active();
          ames.colorpicker.color_target = shape_color_target;
        };

        cb_helpers['color_target'] = ames.colorpicker.color_target;
      }
    }
  }, {
    key: "_strokewidth_cb",
    value: function _strokewidth_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        var yo;
        var w;

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape); // shape.show_all_editors();

          shape.notify_lists_shape_is_active();
          yo = e.point.y;
          w = shape.poly.strokeWidth;
        };

        shape.poly.onMouseDrag = function (e) {
          // console.log(.1*(yo - e.point.y));
          var nw = w + .1 * (yo - e.point.y);

          if (nw <= 0) {
            shape.poly.strokeWidth = 0;
          } else {
            shape.poly.strokeWidth = nw;
          } // Update helpers


          shape.update_helpers(shape, true);
        };
      }
    }
  }, {
    key: "_strokecolor_cb",
    value: function _strokecolor_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        if (shape.poly) ames.colorpicker.load_color(shape.poly.strokeColor);

        var color_function = function color_function(c) {
          shape.poly.strokeColor = c;
        };

        if (sub == 'h') {
          color_function = function color_function(c) {
            if (shape.poly.strokeColor.saturation == 0) shape.poly.strokeColor.saturation = 1;
            shape.poly.strokeColor.hue = c.hue;
          };
        }

        if (sub == 's') {
          color_function = function color_function(c) {
            shape.poly.strokeColor.saturation = c.saturation;
          };
        }

        if (sub == 'v') {
          color_function = function color_function(c) {
            shape.poly.fillColor.brightness = c.brightness;
          };
        }

        if (sub == 'a') {
          color_function = function color_function(c) {
            shape.poly.fillColor.alpha = c.alpha;
          };
        }

        var shape_color_target = function shape_color_target(c) {
          color_function(c); // Update helpers

          shape.update_helpers(shape);
        };

        ames.colorpicker.color_target = shape_color_target;

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape); // shape.show_all_editors();

          shape.notify_lists_shape_is_active();
          ames.colorpicker.color_target = shape_color_target;
        };

        cb_helpers['color_target'] = ames.colorpicker.color_target;
      }
    }
  }, {
    key: "_path_cb",
    value: function _path_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        shape.update_path_control_shapes();
        shape.show_path_control_shapes(true);
        cb_helpers['path'] = true;

        shape.onMouseDown = function (e) {
          ames.hide_editors(shape); // shape.show_all_editors();
        };
      }
    } // create_control_shapes: create all control shapes

  }, {
    key: "create_control_shapes",
    value: function create_control_shapes() {
      this._create_path_control_shapes();

      this._create_scale_box();

      this._create_rotation_shapes();
    } // create_rotation_shapes: create rotation control shapes

  }, {
    key: "_create_rotation_shapes",
    value: function _create_rotation_shapes() {
      var shape = this;

      if (shape.poly) {
        var tc = shape.poly.bounds.topCenter;
        if (shape.strokeBounds) tc = shape.poly.strokeBounds.topCenter;

        var line = _utils.AMES_Utils.make_line(shape.poly.position, tc);

        var da = _utils.AMES_Utils.make_dot(shape.poly.position);

        var dt = _utils.AMES_Utils.make_dot(tc);

        da.scaling = 1.5;
        da.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        da.strokeColor = _utils.AMES_Utils.SHAPE_PATH_COLOR;
        da.strokeWidth = 2;
        line.visible = false;
        da.visible = false;
        dt.visible = false;
        this.rotation_control_shapes.line = line;
        this.rotation_control_shapes.da = da;
        this.rotation_control_shapes.a_offset = new Point(0, 0);
        this.rotation_control_shapes.dt = dt;
      }
    } // create_scale_box: scale control shapes

  }, {
    key: "_create_scale_box",
    value: function _create_scale_box() {
      var shape = this;

      if (shape.poly) {
        var bbox = shape.get_bbox();

        var scale_box = _utils.AMES_Utils.make_rect(bbox, _utils.AMES_Utils.SHAPE_PATH_COLOR); // cb_helpers['shapes'].push(scale_box)


        var corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
        var TL = 1;
        var TR = 2;
        var BR = 3;
        var BL = 0;
        var dot_pairs = [TR, BR, BL, TL];
        var scale_dots = [];

        for (var c in corners) {
          var d = _utils.AMES_Utils.make_dot(corners[c]);

          scale_dots.push(d.clone());
          d.remove();
        }

        scale_box.visible = false;

        for (var i = 0; i < 4; i++) {
          scale_dots[i].visible = false;
        }

        this.scale_control_shapes.scale_box = scale_box;
        this.scale_control_shapes.scale_dots = scale_dots;
      }
    } // create_path_control_shapes: create path control objects

  }, {
    key: "_create_path_control_shapes",
    value: function _create_path_control_shapes() {
      var _this = this;

      var _loop2 = function _loop2(i) {
        var s = _this.poly.segments[i]; // Create manipulable dots on the anchor point and handle endpoints
        // as well as handles connecting the anchor to the handle points

        var h1 = s.handleIn.add(s.point);
        var h2 = s.handleOut.add(s.point);

        var p1 = _utils.AMES_Utils.make_line(h1, s.point);

        var p2 = _utils.AMES_Utils.make_line(s.point, h2);

        var d = _utils.AMES_Utils.make_square_dot(s.point);

        var d_h1 = _utils.AMES_Utils.make_dot(h1);

        var d_h2 = _utils.AMES_Utils.make_dot(h2); // Edit the path by dragging the anchor point


        d.onMouseDrag = function (e) {
          s.point = e.point; // update the manipulable dots and visual aids

          d.position = e.point;
          var n_h1 = s.handleIn.add(e.point);
          var n_h2 = s.handleOut.add(e.point);
          d_h1.position = n_h1;
          d_h2.position = n_h2;
          p1.firstSegment.point = n_h1;
          p1.lastSegment.point = e.point;
          p2.firstSegment.point = e.point;
          p2.lastSegment.point = n_h2;
        }; // create handles with manipulable dots at endpoints to manipulate the path


        d_h1.onMouseDrag = function (e) {
          s.handleIn = e.point.subtract(s.point);
          p1.firstSegment.point = e.point;
          d_h1.position = e.point;
        };

        d_h2.onMouseDrag = function (e) {
          s.handleOut = e.point.subtract(s.point);
          p2.lastSegment.point = e.point;
          d_h2.position = e.point;
        };

        var controls = [d, d_h1, d_h2, p1, p2];

        for (var x in controls) {
          controls[x].visible = false;
        }

        _this.path_control_shapes.push(controls);
      };

      // for every segment in the path
      for (var i in this.poly.segments) {
        _loop2(i);
      }
    } // show_editor: if true open editor; otherwise close;

  }, {
    key: "show_editor",
    value: function show_editor(bool) {
      if (this.editor) {
        this.editor.show(bool);

        if (!bool) {
          if (this.active_prop) this.manipulate(this.active_prop);
        }
      }
    }
  }, {
    key: "show_all_editors",
    value: function show_all_editors() {
      if (this.editor && !this.editor.is_visible) {
        this.editor.show(true);
      }

      for (var i in this.lists) {
        if (this.lists[i].editor && !this.lists[i].editor.is_visible) this.lists[i].editor.show(true);
      }
    } // select: if true, select object and opens editor; otherwise deselect and close

  }, {
    key: "select",
    value: function select(bool) {
      if (this.poly) {
        // this.poly.fullySelected = bool;
        this.is_selected = bool;
      }
    }
  }, {
    key: "update_control_shapes",
    value: function update_control_shapes() {
      if (this.vis_control_shapes.path) this.update_path_control_shapes();
      if (this.vis_control_shapes.scale) this.update_scale_control_shapes();
      if (this.vis_control_shapes.rotation) this.update_rotation_control_shapes();
    }
  }, {
    key: "_redraw_above_poly",
    value: function _redraw_above_poly(s) {
      s = s.insertAbove(this.poly);
    }
  }, {
    key: "update_rotation_control_shapes",
    value: function update_rotation_control_shapes() {
      this.rotation_control_shapes.dt.position = this.rotation_control_shapes.line.segments[1].point;
      this.rotation_control_shapes.da.position = this.rotation_control_shapes.line.segments[0].point;

      this._redraw_above_poly(this.rotation_control_shapes.line);

      this._redraw_above_poly(this.rotation_control_shapes.dt);

      this._redraw_above_poly(this.rotation_control_shapes.da);
    }
  }, {
    key: "update_scale_control_shapes",
    value: function update_scale_control_shapes() {
      var TL = 1;
      var TR = 2;
      var BR = 3;
      var BL = 0; // update scale dot positions and corners of scale box

      var bbox = this.get_bbox();
      var sbox_tl = this.scale_control_shapes.scale_box.segments[TL].point;
      var sbox_tr = this.scale_control_shapes.scale_box.segments[TR].point;
      var sbox_bl = this.scale_control_shapes.scale_box.segments[BL].point;
      var sbox_br = this.scale_control_shapes.scale_box.segments[BR].point; // If not flipped in x...

      var l;
      var r;
      var t;
      var b;

      if (sbox_tl.x <= sbox_tr.x) {
        // Set left and right coord to bbox left and right
        l = bbox.topLeft.x;
        r = bbox.topRight.x;
      } else {
        // Otherwise flip in x
        l = bbox.topRight.x;
        r = bbox.topLeft.x;
      } // If not flipped in y...


      if (sbox_tl.y <= sbox_bl.y) {
        // Set top and bottom coord to bbox top and bottom
        t = bbox.topLeft.y;
        b = bbox.bottomLeft.y;
      } else {
        // Otherwise flip
        t = bbox.bottomLeft.y;
        b = bbox.topLeft.y;
      }

      this.scale_control_shapes.scale_box.segments[TL].point = new Point(l, t);
      this.scale_control_shapes.scale_box.segments[TR].point = new Point(r, t);
      this.scale_control_shapes.scale_box.segments[BL].point = new Point(l, b);
      this.scale_control_shapes.scale_box.segments[BR].point = new Point(r, b);

      this._redraw_above_poly(this.scale_control_shapes.scale_box);

      for (var n = 0; n < 4; n++) {
        this.scale_control_shapes.scale_dots[n].position = this.scale_control_shapes.scale_box.segments[n].point;

        this._redraw_above_poly(this.scale_control_shapes.scale_dots[n]);
      }
    }
  }, {
    key: "update_path_control_shapes",
    value: function update_path_control_shapes() {
      var _this2 = this;

      var _loop3 = function _loop3(i) {
        var controls = _this2.path_control_shapes[i];
        var s = _this2.poly.segments[i];

        if (controls) {
          // update & show path control shapes
          var d = controls[0];
          var d_h1 = controls[1];
          var d_h2 = controls[2];
          var p1 = controls[3];
          var p2 = controls[4]; // update visual aids

          d.position = s.point;
          var n_h1 = s.handleIn.add(s.point);

          if (s.handleIn.x == 0 && s.handleIn.y == 0) {
            var previous = s.previous;
            if (!previous) previous = s;
            n_h1 = n_h1.add(previous.point.subtract(s.point).normalize().multiply(8));
          }

          var n_h2 = s.handleOut.add(s.point);

          if (s.handleOut.x == 0 && s.handleOut.y == 0) {
            var next = s.next;
            if (!next) next = s;
            n_h2 = n_h2.add(next.point.subtract(s.point).normalize().multiply(8));
          }

          d_h1.position = n_h1;
          d_h2.position = n_h2;
          p1.firstSegment.point = n_h1;
          p1.lastSegment.point = s.point;
          p2.firstSegment.point = s.point;
          p2.lastSegment.point = n_h2; // Edit the path by dragging the anchor point

          d.onMouseDrag = function (e) {
            s.point = e.point; // update the manipulable dots and visual aids

            d.position = e.point;
            var n_h1 = s.handleIn.add(e.point);
            var n_h2 = s.handleOut.add(e.point);

            if (s.handleIn.x == 0 && s.handleIn.y == 0) {
              n_h1 = n_h1.add(s.previous.point.subtract(s.point).normalize().multiply(8));

              if (s.previous.handleOut.length == 0) {
                var prev_idx = i - 1;
                if (i == 0) prev_idx = _this2.poly.segments.length - 1;
                var prev_controls = _this2.path_control_shapes[prev_idx];
                var prev_d_h2 = prev_controls[2];
                var prev_p2 = prev_controls[4];
                var prev_h2 = s.previous.point.add(s.point.subtract(s.previous.point).normalize().multiply(8));
                prev_d_h2.position = prev_h2;
                prev_p2.lastSegment.point = prev_h2;
              }
            }

            if (s.handleOut.x == 0 && s.handleOut.y == 0) {
              n_h2 = n_h2.add(s.next.point.subtract(s.point).normalize().multiply(8));

              if (s.next.handleIn.length == 0) {
                var nxt_idx = i * 1.0 + 1;
                if (i == _this2.poly.segments.length - 1) nxt_idx = 0;
                var nxt_controls = _this2.path_control_shapes[nxt_idx];
                var nxt_d_h1 = nxt_controls[1];
                var nxt_p1 = nxt_controls[3];
                var nxt_h1 = s.next.point.add(s.point.subtract(s.next.point).normalize().multiply(8));
                nxt_d_h1.position = nxt_h1;
                nxt_p1.firstSegment.point = nxt_h1;
              }
            }

            d_h1.position = n_h1;
            d_h2.position = n_h2;
            p1.firstSegment.point = n_h1;
            p1.lastSegment.point = e.point;
            p2.firstSegment.point = e.point;
            p2.lastSegment.point = n_h2;
          }; // create handles with manipulable dots at endpoints to manipulate the path


          d_h1.onMouseDrag = function (e) {
            s.handleIn = e.point.subtract(s.point);
            p1.firstSegment.point = e.point;
            d_h1.position = e.point;
          };

          d_h2.onMouseDrag = function (e) {
            s.handleOut = e.point.subtract(s.point);
            p2.lastSegment.point = e.point;
            d_h2.position = e.point;
          };

          for (var _i2 in controls) {
            _this2._redraw_above_poly(controls[_i2]);
          }
        }
      };

      for (var i in this.path_control_shapes) {
        _loop3(i);
      }
    }
  }, {
    key: "show_rotation_control_shapes",
    value: function show_rotation_control_shapes(bool) {
      this.vis_control_shapes['rotation'] = bool;
      this.rotation_control_shapes.line.visible = bool;
      this.rotation_control_shapes.da.visible = bool;
      this.rotation_control_shapes.dt.visible = bool;
    }
  }, {
    key: "show_scale_control_shapes",
    value: function show_scale_control_shapes(bool) {
      this.vis_control_shapes['scale'] = bool;
      this.scale_control_shapes.scale_box.visible = bool;

      for (var d in this.scale_control_shapes.scale_dots) {
        this.scale_control_shapes.scale_dots[d].visible = bool;
      }
    } // show_path_control_shapes: if true show shapes; otherwise hide

  }, {
    key: "show_path_control_shapes",
    value: function show_path_control_shapes(bool) {
      this.vis_control_shapes['path'] = bool;

      for (var i in this.path_control_shapes) {
        var controls = this.path_control_shapes[i];

        if (controls) {
          for (var j in controls) {
            controls[j].visible = bool;
          }
        }
      }
    }
  }, {
    key: "highlight",
    value: function highlight(color) {
      this.show_selection_opts();

      if (this.poly) {
        var bbox = this.get_large_bbox();
        return _utils.AMES_Utils.make_rect(bbox, color);
      }

      return null;
    }
  }, {
    key: "update_selection_opts",
    value: function update_selection_opts() {
      var opts = {};
      var opt_names = [];
      this.selection_opt_names = null;
      this.selection_opt_references = null;

      if (ames.transformation_active_field != 'playback_transformation') {
        opt_names.push(this.name);
        opts[this.name] = this;

        for (var i in this.collections) {
          var c = this.collections[i];
          opt_names.push(c.name);
          opts[c.name] = c;
        }
      }

      if (ames.transformation_active_field != "input") {
        for (var _i3 in this.transformations) {
          var t = this.transformations[_i3];
          var mapping = t.get_mapping();
          mapping = mapping[0].toUpperCase() + mapping.substr(1);
          var str = t.name + " : (" + t.input.name + ": " + mapping + ")";
          opt_names.push(str);
          opts[str] = t;
        }

        for (var _i4 in this.collections) {
          var _c = this.collections[_i4];

          for (var j in _c.transformations) {
            var _t = _c.transformations[j];

            var _mapping = _t.get_mapping();

            _mapping = _mapping[0].toUpperCase() + _mapping.substr(1);

            var _str = _t.name + " : (" + _t.input.name + ": " + _mapping + ")";

            opt_names.push(_str);
            opts[_str] = _t;
          }
        }
      }

      this.selection_opt_names = opt_names;
      this.selection_opt_references = opts;
    }
  }, {
    key: "show_selection_opts",
    value: function show_selection_opts() {
      var _this3 = this;

      this.update_selection_opts();
      var opt_names = this.selection_opt_names;
      var opts = this.selection_opt_references;
      console.log(opt_names, opts);
      var box = this.get_large_bbox();
      var bx = box.topRight.x;
      var by = box.topRight.y;
      var selected_opt_box;
      var a_opt_box;

      var _loop4 = function _loop4(i) {
        var opt = new Group();
        var opt_box = new Path.Rectangle({
          point: new Point(bx - 7.5, by - 0.25),
          size: new Size(225, _utils.AMES_Utils.LAYER_HEIGHT * .75),
          fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
          strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          strokeWidth: 0,
          radius: 1.25
        });
        var opt_label = new PointText({
          point: [bx + 15, by + 12.5],
          content: opt_names[i],
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });
        opt_box.bringToFront();
        opt_label.bringToFront();

        if (opt_names[i] == _this3.name) {
          opt_box.strokeWidth = 1;
          ames.selected_obj = _this3;
          a_opt_box = opt_box;
          selected_opt_box = opt_box;
          ames.selected_obj = _this3;
        }

        by += opt_box.bounds.height;
        opt.addChildren([opt_box, opt_label]);
        opt.bringToFront();

        opt.onMouseEnter = function (e) {
          selected_opt_box = opt_box;
          if (opt_box != a_opt_box) a_opt_box.strokeWidth = 0;
          selected_opt_box.strokeWidth = 1;
          ames.selected_obj = opts[opt_names[i]];
        };

        opt.onMouseLeave = function (e) {
          selected_opt_box.strokeWidth = 0;
          selected_opt_box = null;
          setTimeout(function () {
            if (!selected_opt_box) {
              a_opt_box.strokeWidth = 1;
              selected_opt_box = a_opt_box;
              ames.selected_obj = _this3;
            }
          }, 250);
        };

        opt.onMouseUp = function (e) {
          ames.selected_obj = opts[opt_names[i]];
          console.log("mouse up on", opt_names[i]);

          _this3.hide_selection_opts();
        };

        _this3.selection_opts.push(opt);
      };

      for (var i in opt_names) {
        _loop4(i);
      }

      console.log(opts);
    }
  }, {
    key: "hide_selection_opts",
    value: function hide_selection_opts() {
      for (var i in this.selection_opts) {
        this.selection_opts[i].remove();
      }
    }
  }, {
    key: "get_closest_bbox_corner",
    value: function get_closest_bbox_corner(p) {
      if (this.poly) {
        var bbox = this.poly.bounds;
        if (this.poly.strokeBounds) bbox = this.poly.strokeBounds;
        var bbox_corners = [bbox.topLeft, bbox.topRight, bbox.bottomLeft, bbox.bottomRight];
        var min_d = Number.MAX_VALUE;
        var min_idx = 0;

        for (var idx = 0; idx < 4; idx++) {
          var d = _utils.AMES_Utils.lengthsq(bbox_corners[idx], p);

          if (d < min_d) {
            min_d = d;
            min_idx = idx;
          }
        }

        return bbox_corners[min_idx];
      }
    }
  }, {
    key: "to_path",
    value: function to_path() {
      if (this.poly) {
        var p = this.poly.toPath();
        this.poly.remove();
        this.poly = p;
      }
    }
  }, {
    key: "get_name",
    value: function get_name() {
      return this.name;
    }
  }, {
    key: "get_type",
    value: function get_type() {
      return this.artwork_type;
    }
  }, {
    key: "set_name",
    value: function set_name(n) {
      this.name = n;
    } // show: if true, show; otherwise hide

  }, {
    key: "show",
    value: function show(bool) {
      this.show_editor(bool);
      this.visible = bool;
      this.poly.visible = bool;
      if (bool && !this.pos_is_set) this.pos_is_set = bool; // Ensure consistency if object is selected
      // if (this.is_selected) {
      // 	this.show_path_control_shapes(bool);
      // }
    }
  }, {
    key: "remove",
    value: function remove() {
      // this.editor.remove();
      var idx = -1; // Remove from all collections
      // Remove from all transformations

      this.poly.remove();
      ames.update_layers({
        "remove": true,
        "box": this.obj_box
      });
    } // make_interactive: if true, enable interacitivty & open editor; otherwise disable and close

  }, {
    key: "make_interactive",
    value: function make_interactive(bool) {
      this.select(bool);
      this.attach_interactivity(bool);
    } // attach_interactivity: if true, enable interactivity; otherwise disable

  }, {
    key: "attach_interactivity",
    value: function attach_interactivity(bool) {
      var _this4 = this;

      if (this.poly) {
        if (bool) {
          this.poly.onMouseDown = function (e) {
            // Show only editors for this object
            ames.hide_editors(_this4);

            _this4.editor.show(true);
          }; // select and de-select on click


          this.poly.onClick = function (e) {
            var toggle = !_this4.is_selected;

            _this4.select(toggle); // this.open_editor(toggle);

          };
        } else {
          this.poly.onClick = null;
          this.poly.onMouseDown = null;
        } // make all other handlers void;


        this.poly.onMouseDrag = null; // console.log("attaching interactivity?")
        // if (this.is_ames_path) {
        // 	this.poly.onMouseDrag = (e) => {
        // 		let nearest_point_on_path = this.poly.getNearestPoint(e.point);
        // 		let path_offset = this.poly.getOffsetOf(nearest_point_on_path);
        // 		console.log("event point / point on path / path offset / path length:", e.point, nearest_point_on_path, path_offset, this.poly.length);
        // 		console.log("path offset at point:", path_offset / this.poly.length);
        // 		console.log("path curvature at point:", this.poly.getCurvatureAt(path_offset))
        // 	}
        // }
      }
    }
  }, {
    key: "create_in_ames",
    value: function create_in_ames() {
      this.name = this.get_type() + " (" + this.get_type_count() + ")";
      this.increment_type_count();
      this.create_control_shapes();
      this.create_editor();
      ames.add_obj(this);
      this.make_interactive(true);
    }
  }, {
    key: "create_editor",
    value: function create_editor() {
      this.editor = new _editors.AMES_Shape_Editor(this);
      var bounds = this.editor.box.bounds;
      var w = bounds.width / 2 + _utils.AMES_Utils.ICON_OFFSET * 3 + 12.5;
      var x = ames.toolbar.get_position().x + w;
      var h = ames.canvas_view.size.height - 2 * _utils.AMES_Utils.ICON_OFFSET - bounds.height / 2;
      this.editor.box.position = new Point(x, h);
    }
  }, {
    key: "clone",
    value: function clone(obj) {
      obj = Object.assign(obj, this);
      obj.poly = this.poly.clone({
        insert: false
      });
      obj.create_in_ames();
      return obj;
    }
  }]);

  return AMES_Artwork;
}(); // // Class: Square
// // ---------------------------------------------------------------------------
// // Description: Implementation of a square / rectangle
// export class AMES_Square extends AMES_Artwork {
// 	name = "Rectangle";
// 	shape_type = "Rectangle";
// 	is_ames_rectangle = true;
//
// 	constructor() {
// 		super();
// 		this.poly = new Shape.Rectangle({
// 			center: [this.pos.x, this.pos.y],
// 			radius: 2,
// 			fillColor: 'lavender',
// 			visible: true,
// 			strokeWidth: 1,
// 			strokeColor: 'darkgray'
// 		});
// 	}
// }


exports.AMES_Artwork = AMES_Artwork;

_defineProperty(AMES_Artwork, "count", 1);

var AMES_Polygon = /*#__PURE__*/function (_AMES_Artwork) {
  _inherits(AMES_Polygon, _AMES_Artwork);

  var _super = _createSuper(AMES_Polygon);

  function AMES_Polygon(opt) {
    var _this5;

    _classCallCheck(this, AMES_Polygon);

    _this5 = _super.call(this);

    _defineProperty(_assertThisInitialized(_this5), "name", "Polygon");

    _defineProperty(_assertThisInitialized(_this5), "shape_type", "Polygon");

    _defineProperty(_assertThisInitialized(_this5), "artwork_type", "Polygon");

    _defineProperty(_assertThisInitialized(_this5), "sides", void 0);

    _defineProperty(_assertThisInitialized(_this5), "radius", void 0);

    _defineProperty(_assertThisInitialized(_this5), "centroid", void 0);

    opt = opt || {};
    if (!opt.centroid) opt.centroid = ames.canvas_view.center;
    if (!opt.nsides) opt.nsides = 3;
    if (!opt.radius) opt.radius = 25;
    _this5.sides = opt.nsides;
    _this5.radius = opt.radius;
    _this5.centroid = opt.centroid;

    if (!opt.clone) {
      _this5.poly = new Path.RegularPolygon(opt.centroid, opt.nsides, _this5.radius);
      _this5.poly.strokeWidth = 1;
      _this5.poly.strokeColor = 'darkgray';

      _this5.to_path();

      _this5.create_in_ames();
    }

    _this5.cbs['nsides'] = _this5._nsides_cb;
    return _this5;
  }

  _createClass(AMES_Polygon, [{
    key: "_clear_cb_helpers",
    value: function _clear_cb_helpers() {
      _get(_getPrototypeOf(AMES_Polygon.prototype), "_clear_cb_helpers", this).call(this);

      this.editor.nsides.visible = false;
    }
  }, {
    key: "_nsides_cb",
    value: function _nsides_cb(shape, cb_helpers, sub) {
      shape.editor.nsides.visible = true;
    }
  }, {
    key: "clone",
    value: function clone() {
      var opt = {
        "clone": true
      };
      var obj = new AMES_Polygon(opt);
      return _get(_getPrototypeOf(AMES_Polygon.prototype), "clone", this).call(this, obj);
    }
  }, {
    key: "get_type_count",
    value: function get_type_count() {
      return AMES_Polygon.type_count;
    }
  }, {
    key: "increment_type_count",
    value: function increment_type_count() {
      AMES_Polygon.type_count += 1;
    }
  }, {
    key: "set_number_of_sides",
    value: function set_number_of_sides(nsides) {
      var style = this.poly.style;
      var position = this.poly.position;
      var radius; // Find the radius (the distance between the centroid and the farthest)

      var n = this.poly.segments.length;
      var x_sum = 0;
      var y_sum = 0;

      for (var i = 0; i < n; i++) {
        x_sum += this.poly.segments[i].point.x;
        y_sum += this.poly.segments[i].point.y;
      }

      var centroid = new Point(x_sum / n, y_sum / n);
      var max_dist = 0;

      for (var _i5 = 0; _i5 < n; _i5++) {
        var p = this.poly.segments[_i5].point;
        var x = p.x - centroid.x;
        var y = p.y - centroid.y;
        var dist = Math.sqrt(x * x + y * y);
        if (dist > max_dist) radius = dist;
      }

      var new_poly = new Path.RegularPolygon(position, nsides, radius);
      new_poly.remove();
      this.poly = this.poly.replaceWith(new_poly); // console.log("replaced?", replaced);

      this.poly.style = style;

      if (nsides == 6 || nsides == 9) {
        this.poly.rotate(-90);
      }

      this.poly.position = position;
      this.sides = nsides;
    }
  }, {
    key: "get_radius_from_side_length",
    value: function get_radius_from_side_length(side_length, nsides) {
      return side_length / 2 * Math.sin(180 / nsides * Math.PI / 180);
    }
  }]);

  return AMES_Polygon;
}(AMES_Artwork); // Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle / ellipse


exports.AMES_Polygon = AMES_Polygon;

_defineProperty(AMES_Polygon, "type_count", 1);

var AMES_Ellipse = /*#__PURE__*/function (_AMES_Artwork2) {
  _inherits(AMES_Ellipse, _AMES_Artwork2);

  var _super2 = _createSuper(AMES_Ellipse);

  function AMES_Ellipse(opt) {
    var _this6;

    _classCallCheck(this, AMES_Ellipse);

    _this6 = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this6), "name", "Ellipse");

    _defineProperty(_assertThisInitialized(_this6), "shape_type", "Ellipse");

    _defineProperty(_assertThisInitialized(_this6), "artwork_type", "Ellipse");

    _defineProperty(_assertThisInitialized(_this6), "is_ames_ellipse", true);

    opt = opt || {};
    if (!opt.centroid) opt.centroid = ames.canvas_view.center;
    if (!opt.r) opt.r = 2;
    if (!opt.rx) opt.rx = opt.r;
    if (!opt.ry) opt.ry = opt.rx;

    if (!opt.clone) {
      _this6.poly = new Shape.Ellipse({
        center: [opt.centroid.x, opt.centroid.y],
        radius: [opt.rx, opt.ry],
        visible: true,
        strokeWidth: 1,
        strokeColor: 'darkgray'
      });
      _this6.poly.visible = true;

      _this6.to_path();

      _this6.poly.rotate(-90);

      _this6.create_in_ames();
    }

    return _this6;
  }

  _createClass(AMES_Ellipse, [{
    key: "clone",
    value: function clone() {
      var opt = {
        "clone": true
      };
      var obj = new AMES_Ellipse(opt);
      return _get(_getPrototypeOf(AMES_Ellipse.prototype), "clone", this).call(this, obj);
    }
  }, {
    key: "get_type_count",
    value: function get_type_count() {
      return AMES_Ellipse.type_count;
    }
  }, {
    key: "increment_type_count",
    value: function increment_type_count() {
      AMES_Ellipse.type_count += 1;
    }
  }]);

  return AMES_Ellipse;
}(AMES_Artwork); // Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path


exports.AMES_Ellipse = AMES_Ellipse;

_defineProperty(AMES_Ellipse, "type_count", 1);

var AMES_Artwork_Path = /*#__PURE__*/function (_AMES_Artwork3) {
  _inherits(AMES_Artwork_Path, _AMES_Artwork3);

  var _super3 = _createSuper(AMES_Artwork_Path);

  function AMES_Artwork_Path(opt) {
    var _this7;

    _classCallCheck(this, AMES_Artwork_Path);

    _this7 = _super3.call(this);

    _defineProperty(_assertThisInitialized(_this7), "name", "Path");

    _defineProperty(_assertThisInitialized(_this7), "shape_type", "Path");

    _defineProperty(_assertThisInitialized(_this7), "artwork_type", "Path");

    _defineProperty(_assertThisInitialized(_this7), "bbox", void 0);

    _defineProperty(_assertThisInitialized(_this7), "is_ames_path", true);

    opt = opt || {};

    if (!opt.clone) {
      _this7.poly = new Path({
        strokeColor: 'darkgray',
        strokeWidth: 1,
        visible: true,
        fillColor: 'rgba(255, 0, 0, 0)'
      });
    }

    return _this7;
  }

  _createClass(AMES_Artwork_Path, [{
    key: "clone",
    value: function clone() {
      var opt = {
        "clone": true
      };
      var obj = new AMES_Artwork_Path(opt);
      return _get(_getPrototypeOf(AMES_Artwork_Path.prototype), "clone", this).call(this, obj);
    }
  }, {
    key: "finish_creating_path",
    value: function finish_creating_path() {
      console.log("finished path", this.name, this.poly);
      this.create_in_ames();
    }
  }, {
    key: "get_type_count",
    value: function get_type_count() {
      return AMES_Artwork_Path.type_count;
    }
  }, {
    key: "increment_type_count",
    value: function increment_type_count() {
      AMES_Artwork_Path.type_count += 1;
    }
  }, {
    key: "add_points",
    value: function add_points(points) {
      for (var i in points) {
        this.poly.add(points[i]);
      }
    } // update_bbox() {
    // 	this.bbox = new Path.Rectangle(this.poly.strokeBounds);
    // 	this.bbox.visible = true;
    // 	this.bbox.sendToBack();
    // 	this.bbox.fillColor = "lavender";
    // 	this.bbox.opacity = 0;
    // }

  }, {
    key: "make_path_helper",
    value: function make_path_helper() {
      // If last point is very close to the previous point close the path
      var thresh = 144; // 1f first and last pts are within 12px, seal curve

      var n_segs = this.poly.segments.length;

      if (n_segs > 2) {
        // Check there are at least 2 points in the line
        var a = this.poly.segments[n_segs - 1].point;
        var b = this.poly.segments[0].point;
        if (_utils.AMES_Utils.lengthsq(a.x, a.y, b.x, b.y) < thresh) this.poly.closed = true;
      } // Simplify, smooth & select path


      this.poly.simplify();
      this.poly.smooth();
      this.poly.fullySelected = false;
      this.pos = {
        'x': this.poly.position.x,
        'y': this.poly.position.y
      };
      console.log(this.poly.strokeBounds); // on double tap open visual props

      this.update_bbox();
    }
  }]);

  return AMES_Artwork_Path;
}(AMES_Artwork);

exports.AMES_Artwork_Path = AMES_Artwork_Path;

_defineProperty(AMES_Artwork_Path, "type_count", 1);