"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Path = exports.AMES_Circle = exports.AMES_Square = exports.AMES_Shape = void 0;

var _utils = require("./utils.js");

var _constraints = require("./constraints.js");

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
// Class: Shape
// ----------------------------------------------------------------------------
// Description: Basic shape representation with visual & temporal properties
var AMES_Shape = /*#__PURE__*/function () {
  function AMES_Shape() {
    _classCallCheck(this, AMES_Shape);

    _defineProperty(this, "name", "Shape");

    _defineProperty(this, "is_geometry", true);

    _defineProperty(this, "is_shape", true);

    _defineProperty(this, "obj_type", "shape");

    _defineProperty(this, "visible", false);

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
  }

  _createClass(AMES_Shape, [{
    key: "add_list",
    value: // add_list: adds list to track which lists the shape is in so updates to the shape
    // can update the list helper shapes
    function add_list(list) {
      this.lists[list.name] = list;
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
    key: "get_pos",
    value: // get_pos: returns the position of this shape
    function get_pos() {
      return this.poly.position;
    } // is_inside(p)
    // Description: Checks if the point p is within the bounding box of shape

  }, {
    key: "contains",
    value: function contains(p) {
      if (this.poly) {
        var bounds = this.poly.strokeBounds;
        if (!bounds) bounds = this.poly.bounds;
        return p.isInside(bounds);
      }

      return;
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
        this.editor.select_prop(this.active_prop, false);
        this.editor.show_constraint(false);
      } // If the new propety is not the property just turned off, turn it on


      if (this.active_prop != p) {
        // Turn off selection toggle and hide path control shapes
        this.attach_interactivity(false);
        this.show_path_control_shapes(false);
        this.active_prop = p;
        var sub_p = 'all';
        this.active_sub_p = sub_p;

        if (p == 'strokeColor' || p == 'fillColor') {
          if (!ames.colorpicker.visible) ames.colorpicker.visible = true;
        } else {
          if (ames.colorpicker.visible) ames.colorpicker.visible = false;
        } // Indicate active property and show subproperty buttons


        this.editor.show_subprops(p, true);
        this.editor.select_prop(p, true);
        this.editor.show_constraint(true, p, sub_p); // Activate new propety callback

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
      this.editor.select_subprop(sub, true);
      this.editor.show_constraint(true, this.active_prop, sub);
      this.cbs[this.active_prop](this, this.cb_helpers, sub);
    }
  }, {
    key: "update_constraints",
    value: function update_constraints() {
      var p = this.active_prop;
      var s = this.active_sub_p;
      if (!s) s = 'all';

      _constraints.AMES_Constraint.update_constraints(p, s, this);

      for (var i in this.lists) {
        this.lists[i].update_constraints();
      }

      for (var _i in ames.lists) {
        ames.lists[_i].update_show_box_bounds();
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
    }
  }, {
    key: "_position_cb",
    value: function _position_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape);
          shape.show_all_editors();
          shape.notify_lists_shape_is_active();
          var pos = shape.poly.position;
          var offset = pos.subtract(e.point);
          if (sub && sub == 'x') cb_helpers['y'] = pos.y;
          if (sub && sub == 'y') cb_helpers['x'] = pos.x;
          cb_helpers['offset'] = offset;
        };

        shape.poly.onMouseDrag = function (e) {
          var offset = cb_helpers['offset'];
          var point = e.point.add(offset);
          if (sub && sub == 'x') point.y = cb_helpers['y'];
          if (sub && sub == 'y') point.x = cb_helpers['x'];
          if (offset) shape.set_pos(point); // Update constraints

          shape.update_constraints();
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

          shape.poly.onMouseDown = function (e) {
            ames.hide_editors(shape);
            shape.show_all_editors();
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

            d.onMouseDown = function (e) {
              shape.notify_lists_shape_is_active();
              pf = 1;
              scale_start_x = shape.scale.x;
              scale_start_y = shape.scale.y; // Set relative scale to 1 (current size is scale 1)

              var b = shape.poly.position.subtract(d.position);
              bf = b.length;
              if (sub == 'x') bf = b.x;
              if (sub == 'y') bf = b.y;
            };

            d.onMouseDrag = function (e) {
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
              } // Update constraints


              shape.update_constraints();
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
        var da = shape.rotation_control_shapes.da;
        var dt = shape.rotation_control_shapes.dt;
        var anchor = da.position;
        var x_base = dt.position.subtract(da.position);
        var prev_ro = 0;

        var get_rotation_a = function get_rotation_a(p, anchor) {
          var r_vec = p.subtract(anchor);
          var total_ro = x_base.getDirectedAngle(r_vec);
          var a = total_ro - prev_ro;
          prev_ro = prev_ro + a;
          return a;
        };

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape);
          shape.show_all_editors();
        }; // Update anchor point for rotation


        da.onMouseDrag = function (e) {
          da.position = e.point; // Update line

          line.firstSegment.point = e.point; // Update x_base and total rotation using new reference

          anchor = da.position;
          x_base = dt.position.subtract(anchor);
          prev_ro = 0;
          shape.rotation_control_shapes.a_offset = e.point.subtract(shape.poly.position);
          console.log(shape.rotation_control_shapes.a_offset);
          console.log(da.position);
        }; // Rotate based on angle between subsequent rays created by dragging


        var ro;
        var asum = 0;

        dt.onMouseDown = function (e) {
          shape.notify_lists_shape_is_active();
          ro = dt.position;
          prev_ro = shape.poly.rotation;
          x_base = dt.position.subtract(da.position);
        }; // Update rotation


        dt.onMouseDrag = function (e) {
          anchor = shape.rotation_control_shapes.da.position;
          var a = get_rotation_a(e.point, anchor);
          shape.set_rotation(a, anchor); // shape.poly.rotate(a, anchor);
          // Rotate line
          // line.rotate(a, anchor);
          // asum += a;
          // console.log(asum);
          // Update line segment to match dt

          dt.position = e.point;
          line.lastSegment.point = dt.position; // Update constraints

          shape.update_constraints();
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
          color_function(c);
          shape.update_constraints();
        };

        ames.colorpicker.color_target = shape_color_target;

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape);
          shape.show_all_editors();
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
          ames.hide_editors(shape);
          shape.show_all_editors();
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
          } // Update constraints


          shape.update_constraints();
        };
      }
    }
  }, {
    key: "_strokecolor_cb",
    value: function _strokecolor_cb(shape, cb_helpers, sub) {
      if (shape.poly) {
        var p = ames.colorpicker.get_position();
        ames.colorpicker.position = p;
        ames.colorpicker.visible = true;
        if (shape.poly) ames.colorpicker.load_color(shape.poly.strokeColor);

        var color_function = function color_function(c) {
          shape.poly.strokeColor = c;
        };

        if (sub == 'h') {
          color_function = function color_function(c) {
            if (shape.poly.fillColor.saturation == 0) shape.poly.fillColor.saturation = 1;
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
          color_function(c);
          shape.update_constraints();
        };

        ames.colorpicker.color_target = shape_color_target;

        shape.poly.onMouseDown = function (e) {
          ames.hide_editors(shape);
          shape.show_all_editors();
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
          ames.hide_editors(shape);
          shape.show_all_editors();
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
      for (var i in this.path_control_shapes) {
        var controls = this.path_control_shapes[i];
        var s = this.poly.segments[i];

        if (controls) {
          // update & show path control shapes
          var d = controls[0];
          var d_h1 = controls[1];
          var d_h2 = controls[2];
          var p1 = controls[3];
          var p2 = controls[4]; // update visual aids

          d.position = s.point;
          var n_h1 = s.handleIn.add(s.point);
          var n_h2 = s.handleOut.add(s.point);
          d_h1.position = n_h1;
          d_h2.position = n_h2;
          p1.firstSegment.point = n_h1;
          p1.lastSegment.point = s.point;
          p2.firstSegment.point = s.point;
          p2.lastSegment.point = n_h2;

          for (var _i2 in controls) {
            this._redraw_above_poly(controls[_i2]);
          }
        }
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
      if (this.poly) {
        var bbox = this.get_bbox();
        return _utils.AMES_Utils.make_rect(bbox, color);
      }

      return null;
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
      return this.shape_type;
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
      console.log("To do -- Shape.remove()");
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
      var _this2 = this;

      if (this.poly) {
        if (bool) {
          this.poly.onMouseDown = function (e) {
            // Show only editors for this object
            ames.hide_editors(_this2);

            _this2.show_all_editors();
          }; // select and de-select on click


          this.poly.onClick = function (e) {
            var toggle = !_this2.is_selected;

            _this2.select(toggle); // this.open_editor(toggle);

          };
        } else {
          this.poly.onClick = null;
          this.poly.onMouseDown = null;
        } // make all other handlers void;


        this.poly.onMouseDrag = null;
        console.log("attaching interactivity?");

        if (this.is_ames_path) {
          this.poly.onMouseDrag = function (e) {
            var nearest_point_on_path = _this2.poly.getNearestPoint(e.point);

            var path_offset = _this2.poly.getOffsetOf(nearest_point_on_path);

            console.log("event point / point on path / path offset / path length:", e.point, nearest_point_on_path, path_offset, _this2.poly.length);
            console.log("path offset at point:", path_offset / _this2.poly.length);
            console.log("path curvature at point:", _this2.poly.getCurvatureAt(path_offset));
          };
        }
      }
    }
  }]);

  return AMES_Shape;
}(); // Class: Square
// ---------------------------------------------------------------------------
// Description: Implementation of a square / rectangle


exports.AMES_Shape = AMES_Shape;

_defineProperty(AMES_Shape, "count", 1);

var AMES_Square = /*#__PURE__*/function (_AMES_Shape) {
  _inherits(AMES_Square, _AMES_Shape);

  var _super = _createSuper(AMES_Square);

  function AMES_Square() {
    var _this3;

    _classCallCheck(this, AMES_Square);

    _this3 = _super.call(this);

    _defineProperty(_assertThisInitialized(_this3), "name", "Rectangle");

    _defineProperty(_assertThisInitialized(_this3), "shape_type", "Rectangle");

    _defineProperty(_assertThisInitialized(_this3), "is_ames_rectangle", true);

    _this3.poly = new Shape.Rectangle({
      center: [_this3.pos.x, _this3.pos.y],
      radius: 2,
      fillColor: 'lavender',
      visible: true,
      strokeWidth: 1,
      strokeColor: 'darkgray'
    });
    return _this3;
  }

  return AMES_Square;
}(AMES_Shape); // Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle / ellipse


exports.AMES_Square = AMES_Square;

var AMES_Circle = /*#__PURE__*/function (_AMES_Shape2) {
  _inherits(AMES_Circle, _AMES_Shape2);

  var _super2 = _createSuper(AMES_Circle);

  function AMES_Circle() {
    var _this4;

    _classCallCheck(this, AMES_Circle);

    _this4 = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this4), "name", "Ellipse");

    _defineProperty(_assertThisInitialized(_this4), "shape_type", "Ellipse");

    _defineProperty(_assertThisInitialized(_this4), "is_ames_ellipse", true);

    _this4.poly = new Shape.Circle({
      center: [_this4.pos.x, _this4.pos.y],
      radius: 2,
      fillColor: 'lavender',
      visible: true,
      strokeWidth: 1,
      strokeColor: 'darkgray'
    });
    return _this4;
  }

  return AMES_Circle;
}(AMES_Shape); // Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path


exports.AMES_Circle = AMES_Circle;

var AMES_Path = /*#__PURE__*/function (_AMES_Shape3) {
  _inherits(AMES_Path, _AMES_Shape3);

  var _super3 = _createSuper(AMES_Path);

  function AMES_Path() {
    var _this5;

    _classCallCheck(this, AMES_Path);

    _this5 = _super3.call(this);

    _defineProperty(_assertThisInitialized(_this5), "name", "Path");

    _defineProperty(_assertThisInitialized(_this5), "shape_type", "Path");

    _defineProperty(_assertThisInitialized(_this5), "bbox", void 0);

    _defineProperty(_assertThisInitialized(_this5), "is_ames_path", true);

    _this5.poly = new Path({
      strokeColor: 'darkgray',
      strokeWidth: 1,
      visible: true,
      fillColor: 'rgba(255, 0, 0, 0)' // fullySelected: true

    });
    return _this5;
  }

  _createClass(AMES_Path, [{
    key: "update_bbox",
    value: function update_bbox() {
      this.bbox = new Path.Rectangle(this.poly.strokeBounds);
      this.bbox.visible = true;
      this.bbox.sendToBack();
      this.bbox.fillColor = "lavender";
      this.bbox.opacity = 0;
    }
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

  return AMES_Path;
}(AMES_Shape);

exports.AMES_Path = AMES_Path;