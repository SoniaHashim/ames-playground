"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_List_Editor = exports.AMES_Shape_Editor = exports.AMES_Animation_Editor = void 0;

var _utils = require("./utils.js");

var _shapes = require("./shapes.js");

var _lists = require("./lists.js");

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

// AMES_Editor
// ----------------------------------------------------------------------------
// Base editor that creates named editor for the specified object
var AMES_Editor = /*#__PURE__*/function () {
  // Display properties
  function AMES_Editor(obj) {
    var _this = this;

    _classCallCheck(this, AMES_Editor);

    _defineProperty(this, "box", void 0);

    _defineProperty(this, "obj", void 0);

    _defineProperty(this, "is_visible", false);

    _defineProperty(this, "pos_is_set", false);

    var box = new Group(); // Add background rectangle

    var e_width = 150;
    this.box_width = e_width;
    var e_height = this.e_height || 150;
    var rect = new Shape.Rectangle({
      point: [0, 0],
      size: [e_width, e_height],
      fillColor: _utils.AMES_Utils.INACTIVE_COLOR,
      strokeWidth: 1,
      strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
      opacity: 0.5
    });
    box.addChild(rect); // Add obj name

    var by = _utils.AMES_Utils.LAYER_HEIGHT;
    var n_text = new PointText({
      point: [2 * _utils.AMES_Utils.ICON_OFFSET, by / 2 + _utils.AMES_Utils.FONT_SIZE / 2],
      content: obj.name,
      fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
      fontFamily: _utils.AMES_Utils.FONT,
      fontSize: _utils.AMES_Utils.FONT_SIZE
    });
    box.addChild(n_text); // Add close icon

    var close_button = ames.icons["close"].clone();
    close_button.scaling = 0.75;
    var close_w = close_button.bounds.width;
    close_button.position = new Point(e_width - _utils.AMES_Utils.ICON_OFFSET - close_w / 2, by / 2 - close_w / 2);
    close_button.visible = true;

    close_button.onClick = function (e) {
      _this.show(false);

      _this.pos_is_set = false;
      if (_this.editor_close_cleanup) _this.editor_close_cleanup();
    };

    box.addChild(close_button); // Make editor draggable

    var dragging = false;
    var drag_offset = 0;

    box.onMouseDown = function (e) {
      var n_children = box.children.length;

      for (var idx = 1; idx < n_children; idx++) {
        var c = box.children[idx];

        if (c.contains(e.point)) {
          dragging = false;
          return;
        }
      }

      drag_offset = e.point.subtract(box.position);
      dragging = true;
    };

    box.onMouseDrag = function (e) {
      if (dragging) box.position = e.point.subtract(drag_offset);
    };

    box.onMouseUp = function (e) {
      if (dragging) dragging = false;
    };

    this.box = box;
    this.obj = obj;
    obj.editor = this;
  }

  _createClass(AMES_Editor, [{
    key: "set_editor_position",
    value: function set_editor_position() {
      if (this.pos_is_set) return;
      this.pos_is_set = true;
      var pos = this.obj.get_pos();
      var b = this.obj.get_bbox();

      if (b) {
        b.strokeColor = 'green';
        b.strokeWidth = 2;
        b.visible - true;
      } else {
        this.box.position = pos;
        return;
      }

      var c = ames.canvas_view.bounds.center;
      var x = b.width / 2 + this.box.bounds.width / 2 + 3 * _utils.AMES_Utils.ICON_OFFSET; // Adjust horizontal posiiton

      var d_left = b.leftCenter.getDistance(c, true);
      var d_right = b.rightCenter.getDistance(c, true);

      if (d_left < d_right) {
        x *= -1;
      } // Adjust position;


      this.box.position = pos.add(new Point(x, -20));
    } // open: if true show editor; otherwise close

  }, {
    key: "show",
    value: function show(bool) {
      // Update editor position
      if (bool && !this.is_visible) {
        this.set_editor_position();
      }

      this.is_visible = bool;
      this.box.visible = bool; // if (!bool) {
      // 	// Disable property interactivity if any
      // 	if (this.obj.active_prop) {
      // 		this.obj.manipulate(this.obj.active_prop)
      // 	}
      // 	// Deselect any active properties
      // 	if (this.selected_prop) this.select_prop(this.selected_prop, false);
      // 	if (this.selected_subprop) this.select_subprop(this.selected_subprop, false);
      // }
    }
  }]);

  return AMES_Editor;
}();

var AMES_Animation_Editor = /*#__PURE__*/function (_AMES_Editor) {
  _inherits(AMES_Animation_Editor, _AMES_Editor);

  var _super = _createSuper(AMES_Animation_Editor);

  function AMES_Animation_Editor(obj) {
    var _this2;

    _classCallCheck(this, AMES_Animation_Editor);

    _this2 = _super.call(this, obj);

    _defineProperty(_assertThisInitialized(_this2), "box_width", void 0);

    _defineProperty(_assertThisInitialized(_this2), "e_height", 175);

    var box = _this2.box;
    var by = _utils.AMES_Utils.LAYER_HEIGHT;
    var e_width = _this2.box_width; // Make geometry link button for artwork

    _this2.geometry_field_info = {};
    var x_off = 4 * _utils.AMES_Utils.ICON_OFFSET;
    var y_off = _utils.AMES_Utils.LAYER_HEIGHT * 3.5;

    _this2.make_link_button([x_off, y_off], 'artwork');

    _this2.make_link_button([x_off, y_off + _utils.AMES_Utils.LAYER_HEIGHT * 1.5], 'transformation'); // Create a play button


    _this2.make_button(0, "play", "play");

    _this2.make_button(0, "pause", "pause");

    _this2.make_button(0, "rewind", "rewind");

    _this2.make_button(0, "loop", "loop");

    _this2.make_button(1, "axes", "set_transformation_axes");

    _this2.make_button(1, "brush", "change_animation_property"); // Initialize editor position


    _this2.set_editor_position();

    return _this2;
  }

  _createClass(AMES_Animation_Editor, [{
    key: "make_button",
    value: function make_button(btn_row, icon_name, btn_function, args) {
      var _this3 = this;

      args = args || {};
      var btn = ames.icons[icon_name].clone();
      var bw = btn.bounds.width;
      var by = _utils.AMES_Utils.LAYER_HEIGHT + bw * btn_row;
      if (!this.n_btns) this.n_btns = {};
      if (!this.n_btns[btn_row]) this.n_btns[btn_row] = 0;
      btn.position = new Point(2 * _utils.AMES_Utils.ICON_OFFSET + this.n_btns[btn_row] * (_utils.AMES_Utils.ICON_OFFSET + bw) + bw / 2, by * 2);
      btn.visible = true;

      btn.onClick = function (e) {
        btn.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        btn.fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;

        _this3.obj[btn_function](args);
      };

      this.n_btns[btn_row] += 1;
      this.box.addChild(btn);
    }
  }, {
    key: "make_link_button",
    value: function make_link_button(editor_location, field) {
      var _this4 = this;

      var x_off = editor_location[0];
      var y_off = editor_location[1];
      var field_label = new PointText({
        point: [2 * _utils.AMES_Utils.ICON_OFFSET, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET],
        content: field[0].toUpperCase() + field.substring(1) + ":",
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      y_off += 15;
      var link = ames.icons['link'].clone();
      link.scaling = 1.25;
      link.position = new Point(x_off, y_off);
      link.visible = true;
      link.strokeWidth = .25;
      var link_remove = ames.icons['link-remove'].clone();
      link_remove.scaling = 1.25;
      link_remove.position = link.position;
      link_remove.visible = false;
      link_remove.strokeWidth = .25;
      this.geometry_field_info[field] = {};
      var label = new PointText({
        point: [2.25 * _utils.AMES_Utils.ICON_OFFSET + x_off, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET],
        content: field,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      this.geometry_field_info[field].label = label; // When the link button is clicked activate constraint tool

      link.onMouseDown = function (e) {
        console.log("click animation link button", field);
        ames.active_linking_animation = _this4.obj;
        ames.animation_active_field = field;
        ames.tools['Animation_Link'].activate(); // Little workaround... to start drawing line that defines constraint

        link.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        ames.tools['Animation_Link'].onMouseDown(e);
        ames.tools['Animation_Link'].onMouseDrag(e);
      };

      link_remove.onMouseDown = function (e) {
        // Remove obj field
        _this4.obj.remove_geometry_field(field);

        _this4.geometry_field_info[field].label.content = field;
        link.visible = true;
        link_remove.visible = false;
      };

      this.geometry_field_info[field].link = link;
      this.geometry_field_info[field].link_remove = link_remove;
      this.box.addChild(field_label);
      this.box.addChild(label);
      this.box.addChild(link);
      this.box.addChild(link_remove);
    }
  }]);

  return AMES_Animation_Editor;
}(AMES_Editor);

exports.AMES_Animation_Editor = AMES_Animation_Editor;

var AMES_Shape_Editor = /*#__PURE__*/function (_AMES_Editor2) {
  _inherits(AMES_Shape_Editor, _AMES_Editor2);

  var _super2 = _createSuper(AMES_Shape_Editor);

  function AMES_Shape_Editor(obj) {
    var _this5;

    _classCallCheck(this, AMES_Shape_Editor);

    _this5 = _super2.call(this, obj);

    _defineProperty(_assertThisInitialized(_this5), "props", {});

    _defineProperty(_assertThisInitialized(_this5), "subprops", {});

    _defineProperty(_assertThisInitialized(_this5), "constraint_info", {});

    _defineProperty(_assertThisInitialized(_this5), "selected_subprop", void 0);

    _defineProperty(_assertThisInitialized(_this5), "selected_prop", void 0);

    var box = _this5.box;
    var by = _utils.AMES_Utils.LAYER_HEIGHT;
    var e_width = _this5.box_width;
    var props = _utils.AMES_Utils.VIS_PROPS; // create all sub-property box

    _this5._make_subprop('all', 0, box); // Create property buttons


    var properties = _utils.AMES_Utils.VIS_PROPS;

    var _loop = function _loop(idx) {
      var p = properties[idx];
      var button = ames.icons[p].clone();
      var b_w = button.bounds.width;
      button.position = new Point(2 * _utils.AMES_Utils.ICON_OFFSET + idx * (_utils.AMES_Utils.ICON_OFFSET + b_w) + b_w / 2, by * 2);
      button.visible = true; // create subproperty boxes

      var p_subprops = _utils.AMES_Utils.SUB_PROPS[p]; // note: index is incremented to account for all subproperty box

      for (var s_idx = 1; s_idx <= p_subprops.length; s_idx++) {
        var s = p_subprops[s_idx - 1]; // Make a new subproperty box if necessary

        _this5._make_subprop(s, s_idx, box);
      } // Clicking enables intearctivity on selected trait


      button.onClick = function (e) {
        obj.manipulate(p, 'all');
      }; // Add button to editor


      box.addChild(button);
      _this5.props[p] = button;
    };

    for (var idx in properties) {
      _loop(idx);
    }

    _this5.box = box; // Initialize editor

    _this5.set_editor_position();

    return _this5;
  }

  _createClass(AMES_Shape_Editor, [{
    key: "editor_close_cleanup",
    value: function editor_close_cleanup() {
      // Disable property interactivity if any
      if (this.obj.active_prop) {
        this.obj.manipulate(this.obj.active_prop);
      } // Deselect any active properties


      if (this.selected_prop) this.select_prop(this.selected_prop, false);
      if (this.selected_subprop) this.select_subprop(this.selected_subprop, false);
    } // show_subprops: if true, show subproperty boxes for a given property; otherwise hide

  }, {
    key: "show_subprops",
    value: function show_subprops(p, bool) {
      var p_subprops = _utils.AMES_Utils.SUB_PROPS[p]; // open appropriate subproperty boxes

      for (var s_idx in p_subprops) {
        var s = p_subprops[s_idx];
        var sub = this.subprops[s];

        if (sub) {
          var s_text = sub[0];
          var s_box = sub[1];
          s_text.visible = bool;
          s_box.visible = bool; // If the subproperties are not being shown, deselect them if selected

          if (!bool) {
            if (this.selected_subprop == s) {
              this.select_subprop(s, false);
            }
          }
        }
      } // If the subprops are being shown, select & activate 'all'


      this.select_subprop('all', bool);
    } // _make_subprop: makes a subproperty box for the appropriate element

  }, {
    key: "_make_subprop",
    value: function _make_subprop(s, s_idx, box) {
      var _this6 = this;

      // Calculate offset for property boxes after all
      var offset = 0;

      if (s != 'all') {
        var all_box = this.subprops['all'][1];
        var x = all_box.position.x;
        var w = all_box.bounds.width;
        offset = s_idx * 2.25 * _utils.AMES_Utils.ICON_OFFSET + s_idx * 3.5 * _utils.AMES_Utils.ICON_OFFSET;
      }

      var subprop_text = new PointText({
        point: [2.25 * _utils.AMES_Utils.ICON_OFFSET + offset, _utils.AMES_Utils.LAYER_HEIGHT * 3],
        content: s,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      var t_width = subprop_text.bounds.width;
      var t_height = subprop_text.bounds.height;
      var subprop_box = new Shape.Rectangle({
        point: [subprop_text.position.x - .5 * (t_width + _utils.AMES_Utils.ICON_OFFSET), subprop_text.position.y - t_height + _utils.AMES_Utils.ICON_OFFSET / 2],
        size: [Math.max(t_width, t_height) + _utils.AMES_Utils.ICON_OFFSET, t_height + _utils.AMES_Utils.ICON_OFFSET],
        strokeWidth: .5,
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR
      }); // Center text for subproperty boxes after all and hide the subproperty box

      if (s != 'all') {
        var _x = subprop_text.position.x;
        if (s == 'w') _x -= 2.5; // svg text alignment is challenging

        if (s == 't') _x += 2.5; // svg text alignment is challenging

        subprop_text.point.x = _x;
        subprop_text.visible = false;
        subprop_box.visible = false;
      } // Additional visual elements should be created once


      if (s == 'all') {
        // Make subproperty line after making first subproperty box
        var subline_start = subprop_box.bounds.bottomLeft;
        var subline_end = subline_start.add(new Point(this.box_width - 2 * subline_start.x, 0));
        this.underline_width = subline_end - subline_start;
        var subprop_line = new Path.Line(subline_start, subline_end);
        subprop_line.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        subprop_line.strokeWidth = 1;
        subprop_line.opacity = 0.5;
        box.addChild(subprop_line); // Make and hide link and unlink buttons

        var link = ames.icons['link'].clone();
        link.scaling = 1.25;
        link.position = new Point(3.5 * _utils.AMES_Utils.ICON_OFFSET, _utils.AMES_Utils.LAYER_HEIGHT * 3.75);
        link.visible = true;
        link.strokeWidth = .25;
        var link_remove = ames.icons['link-remove'].clone();
        link_remove.scaling = 1.25;
        link_remove.position = link.position;
        link_remove.visible = false;
        link_remove.strokeWidth = .25; // When the link button is clicked activate constraint tool

        link.onMouseDown = function (e) {
          ames.c_relative = _this6.obj;
          ames.tools['Constraint'].activate(); // Little workaround... to start drawing line that defines constraint

          link.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
          ames.tools['Constraint'].onMouseDown(e);
          ames.tools['Constraint'].onMouseDrag(e);
        };

        link_remove.onMouseDown = function (e) {
          var p = _this6.obj.active_prop;
          var s = _this6.obj.active_sub_p;
          console.log("link remove constraint", p, s);
          if (!s) s = "all";
          var c_ins = _this6.obj.c_inbound[p][s];
          var c = null;

          for (var i in c_ins) {
            if (c_ins[i].is_manual_constraint) c = c_ins[i];
          }

          if (c) {
            console.log(c);
            c.remove();
          }
        };

        this.constraint_info.link = link;
        this.constraint_info.link_remove = link_remove; // Name of relative that defines the constraint

        var link_name = new PointText({
          point: [link.position.x + 3 * _utils.AMES_Utils.ICON_OFFSET, link.position.y + link.bounds.height / 4],
          content: 'Constraint',
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });
        this.constraint_info.link_name = link_name;
        var offset_label = new PointText({
          point: [subline_start.x + _utils.AMES_Utils.ICON_OFFSET, link.position.y + 5 * _utils.AMES_Utils.ICON_OFFSET],
          content: 'relative offset',
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });
        this.constraint_info.offset_label = offset_label;
        var offset_val = new PointText({
          point: [subline_start.x + offset_label.bounds.width + 2.5 * _utils.AMES_Utils.ICON_OFFSET, link.position.y + 5 * _utils.AMES_Utils.ICON_OFFSET],
          content: '10',
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });
        this.constraint_info.offset_val = offset_val; // Make offset val draggable

        this.constraint_info.offset_val.onMouseDown = function (e) {
          console.log("mouse down on offset val");
          ames.canvas.style.cursor = 'move';
        };

        var offset_val_drag = 0;

        this.constraint_info.offset_val.onMouseDrag = function (e) {
          offset_val_drag += e.event.movementX;
          if (offset_val_drag < 0) ames.canvas.style.cursor = 'w-resize';
          if (offset_val_drag > 0) ames.canvas.style.cursor = 'e-resize';
          var c_ins = _this6.obj.c_inbound[_this6.obj.active_prop][_this6.obj.active_sub_p];

          if (offset_val_drag < -5) {
            // Manipulate active constraint
            for (var i in c_ins) {
              if (c_ins[i].is_manual_constraint) {
                c_ins[i].change_offset(-1);
              }
            }

            offset_val_drag = 0;
          }

          if (offset_val_drag > 5) {
            // Manipulate active constraint
            for (var _i in c_ins) {
              if (c_ins[_i].is_manual_constraint) {
                c_ins[_i].change_offset(1);
              }
            }

            offset_val_drag = 0;
          }
        };

        this.constraint_info.offset_val.onMouseUp = function (e) {
          ames.canvas.style.cursor = null;
        };

        var ox = offset_val.position.x;
        var oy = offset_val.position.y + offset_val.bounds.height / 2;
        var offset_line = new Path.Line(new Point(ox - 1.25 * _utils.AMES_Utils.ICON_OFFSET, oy), new Point(ox + 6 * _utils.AMES_Utils.ICON_OFFSET, oy));
        offset_line.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        offset_line.strokeWidth = 1;
        offset_line.opacity = 0.5;
        this.constraint_info.offset_line = offset_line;
        box.addChildren([link, link_name, offset_label, offset_val, offset_line, link_remove]);
        this.show_constraint(false);
      } // When the subproperty is clicked enable editing on it


      subprop_box.onClick = function (e) {
        if (!_this6.obj.active_prop) return;

        _this6.select_subprop(s, true);

        _this6.obj.manipulate_helper(s);
      };

      subprop_text.onClick = function (e) {
        if (!_this6.obj.active_prop) return;

        _this6.select_subprop(s, true);

        _this6.obj.manipulate_helper(s);
      };

      box.addChild(subprop_text);
      box.addChild(subprop_box);
      this.subprops[s] = [subprop_text, subprop_box];
    } // _show_constraint

  }, {
    key: "show_constraint",
    value: function show_constraint(bool, p, sub_p) {
      if (p == 'path') {
        console.log("here");
        bool = false;
      }

      for (var k in this.constraint_info) {
        this.constraint_info[k].visible = bool;
      } // Hide link remove button


      this.constraint_info.link_remove.visible = false; // Show link remove button if there is an active constraint

      if (bool && this.obj) {
        var s = sub_p;
        if (!s) s = "all";
        var c_ins = this.obj.c_inbound[p][s];
        var c = null;

        for (var i in c_ins) {
          if (c_ins[i].is_manual_constraint) c = c_ins[i];
        }

        if (c) {
          this.constraint_info.link_remove.visible = true;
          this.constraint_info.link.visible = false;
        }
      }

      if (sub_p == 'all') {
        this.constraint_info['offset_label'].visible = false;
        this.constraint_info['offset_val'].visible = false;
        this.constraint_info['offset_line'].visible = false;
      } // Update property value


      if (bool) this.update_constraint(p, sub_p);
    }
  }, {
    key: "update_constraint",
    value: function update_constraint(p, s) {
      if (!p) p = this.obj.active_prop;
      if (!s) s = this.obj.active_sub_p;
      if (!s) s = "all";
      var link_name = 'Unconstrained';
      var offset_val = 0;
      var c = null;

      if (p) {
        var c_ins = this.obj.c_inbound[p][s]; // console.log(c_ins);

        for (var i in c_ins) {
          if (c_ins[i].is_manual_constraint) c = c_ins[i];
        }

        if (c) {
          link_name = c.reference.name;

          if (s != "all") {
            var offset = c.get_offset();
            offset_val = offset.toFixed(2);
          } // Show unlink button


          this.constraint_info.link.visible = false;
          this.constraint_info.link_remove.visible = true;
        } else {
          // Show link button
          this.constraint_info.link.visible = true;
          this.constraint_info.link_remove.visible = false;
        }
      }

      this.constraint_info.link_name.content = link_name;
      this.constraint_info.offset_val.content = offset_val;
    } // _select_subprop: Activate subproperty including display if true; deselect otherwise

  }, {
    key: "select_subprop",
    value: function select_subprop(s, bool) {
      var sub;
      var s_text;
      var s_box;

      if (bool) {
        // Indicate that the previously selected subproperty selector is inactive
        if (this.selected_subprop) {
          this.select_subprop(this.selected_subprop, false);
        } // Indicate that the selected subproperty box is active


        sub = this.subprops[s];
        s_text = sub[0];
        s_box = sub[1];
        s_box.fillColor = _utils.AMES_Utils.ACTIVE_COLOR;
        s_box.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        s_text.fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        s_text.bringToFront();
        this.selected_subprop = s;
      } else {
        // Deactivate the property
        sub = this.subprops[s];
        s_text = sub[0];
        s_box = sub[1];
        s_box.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        s_box.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        s_text.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        s_text.bringToFront();
        this.selected_subprop = null;
      }
    } // _select_prop: Select property including display if true; deselect otherwise

  }, {
    key: "select_prop",
    value: function select_prop(p, bool) {
      var prop;

      if (bool) {
        // Indicate previously selected property is inactive
        if (this.selected_prop) {
          this.select_prop(this.selected_prop, false);
        }

        prop = this.props[p];
        prop.fillColor = _utils.AMES_Utils.ACTIVE_COLOR;
        prop.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
      } else {
        prop = this.props[p]; // console.log(p, prop);

        prop.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        prop.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        this.selected_prop = null;
      }
    }
  }]);

  return AMES_Shape_Editor;
}(AMES_Editor);

exports.AMES_Shape_Editor = AMES_Shape_Editor;

var AMES_List_Editor = /*#__PURE__*/function (_AMES_Shape_Editor) {
  _inherits(AMES_List_Editor, _AMES_Shape_Editor);

  var _super3 = _createSuper(AMES_List_Editor);

  function AMES_List_Editor(obj) {
    var _this7;

    _classCallCheck(this, AMES_List_Editor);

    _this7 = _super3.call(this, obj);

    _defineProperty(_assertThisInitialized(_this7), "rel_idx_val", void 0);

    _defineProperty(_assertThisInitialized(_this7), "e_height", 175);

    _this7.add_relative_index_to_constraint_info();

    return _this7;
  }

  _createClass(AMES_List_Editor, [{
    key: "add_relative_index_to_constraint_info",
    value: function add_relative_index_to_constraint_info() {
      var _this8 = this;

      // Group relative coords
      var bx = this.constraint_info.offset_label.position.x - this.constraint_info.offset_label.bounds.width / 2;
      var by = this.constraint_info.offset_label.position.y; // Add obj name

      var uy = _utils.AMES_Utils.LAYER_HEIGHT;
      var rel_idx_label = new PointText({
        point: [bx, by + 5 * _utils.AMES_Utils.ICON_OFFSET],
        content: 'relative index',
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      var rel_idx_val = new PointText({
        point: [this.constraint_info.offset_val.position.x - this.constraint_info.offset_val.bounds.width / 2, rel_idx_label.position.y + 3],
        content: '0',
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      var ox = this.constraint_info.offset_line.position.x - this.constraint_info.offset_line.bounds.width / 2;
      var oy = rel_idx_val.position.y + rel_idx_val.bounds.height / 2;
      var rel_idx_line = new Path.Line(new Point(ox, oy), new Point(this.constraint_info.offset_val.position.x + 6 * _utils.AMES_Utils.ICON_OFFSET, oy));
      rel_idx_line.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      rel_idx_line.strokeWidth = 1;
      rel_idx_line.opacity = 0.5;
      rel_idx_line.visible = true; // switch y position

      var y1_label = rel_idx_label.position.y;
      var y1_val = rel_idx_val.position.y;
      var y1_line = rel_idx_line.position.y;
      var y2_label = this.constraint_info.offset_label.position.y;
      var y2_val = this.constraint_info.offset_val.position.y;
      var y2_line = this.constraint_info.offset_line.position.y;
      this.constraint_info.offset_label.position.y = y1_label;
      this.constraint_info.offset_val.position.y = y1_val;
      this.constraint_info.offset_line.position.y = y1_line;
      rel_idx_label.position.y = y2_label;
      rel_idx_val.position.y = y2_val;
      rel_idx_line.position.y = y2_line;
      rel_idx_label.visible = false;
      rel_idx_val.visible = false;
      rel_idx_line.visible = false; // Add to constraint info

      this.constraint_info.rel_idx_label = rel_idx_label;
      this.constraint_info.rel_idx_val = rel_idx_val;
      this.constraint_info.rel_idx_line = rel_idx_line; // Add to editor box

      this.box.addChildren([rel_idx_label, rel_idx_val, rel_idx_line]); // Draggable editability to change rel idx value

      this.constraint_info.rel_idx_val.onMouseDown = function (e) {
        ames.canvas.style.cursor = 'move';
      };

      var rel_idx_drag = 0;

      this.constraint_info.rel_idx_val.onMouseDrag = function (e) {
        rel_idx_drag += e.event.movementX;
        if (rel_idx_drag < 0) ames.canvas.style.cursor = 'w-resize';
        if (rel_idx_drag > 0) ames.canvas.style.cursor = 'e-resize';

        if (rel_idx_drag < -5) {
          var c_ins = _this8.obj.c_inbound[_this8.obj.active_prop][_this8.obj.active_sub_p];

          for (var i in c_ins) {
            if (c_ins[i].is_manual_constraint) c_ins[i].change_rel_idx(-1);
          }

          console.log("drag left", c_ins);
          rel_idx_drag = 0;
        }

        if (rel_idx_drag > 5) {
          var _c_ins = _this8.obj.c_inbound[_this8.obj.active_prop][_this8.obj.active_sub_p];

          for (var _i2 in _c_ins) {
            if (_c_ins[_i2].is_manual_constraint) _c_ins[_i2].change_rel_idx(1);
          }

          console.log("drag right", _c_ins);
          rel_idx_drag = 0;
        }
      };

      this.constraint_info.rel_idx_val.onMouseUp = function (e) {
        ames.canvas.style.cursor = null;
      };
    }
  }, {
    key: "update_constraint",
    value: function update_constraint(p, s) {
      if (!p) p = this.obj.active_prop;
      if (!s) s = this.obj.active_sub_p;
      if (!s) s = "all";

      _get(_getPrototypeOf(AMES_List_Editor.prototype), "update_constraint", this).call(this, p, s);

      var c = null;
      var rel_idx;
      var c_ins = this.obj.c_inbound[p][s]; // console.log(c_ins);

      for (var i in c_ins) {
        if (c_ins[i].is_manual_constraint) c = c_ins[i];
      }

      if (c) {
        rel_idx = c.get_rel_idx();
        rel_idx = rel_idx.toFixed(0);
      }

      this.constraint_info.rel_idx_val.content = rel_idx;
    }
  }, {
    key: "set_editor_position",
    value: function set_editor_position() {
      _get(_getPrototypeOf(AMES_List_Editor.prototype), "set_editor_position", this).call(this); // Adjust to be beneath shape editor


      var px = this.obj.list_box.position.x + this.box.bounds.width / 2 + this.obj.list_box.bounds.width / 2 + 3 * _utils.AMES_Utils.ICON_OFFSET;
      var py = this.obj.list_box.position.y + this.obj.list_box.bounds.height / 2 + 40;
      this.box.position = new Point(px, py);
    } // show_constraint: also include relative index information

  }, {
    key: "show_constraint",
    value: function show_constraint(bool, p, sub_p) {
      _get(_getPrototypeOf(AMES_List_Editor.prototype), "show_constraint", this).call(this, bool, p, sub_p); // if (sub_p == 'all') {
      // 	this.constraint_info['rel_idx_label'].visible = false;
      // 	this.constraint_info['rel_idx_val'].visible = false;
      // 	this.constraint_info['rel_idx_line'].visible = false;
      // }
      // Update property value


      if (bool) this.update_constraint(p, sub_p);
    }
  }, {
    key: "show",
    value: function show(bool) {
      // Show / hide list highlight box
      this.obj.show_box(bool);

      _get(_getPrototypeOf(AMES_List_Editor.prototype), "show", this).call(this, bool);
    }
  }]);

  return AMES_List_Editor;
}(AMES_Shape_Editor);

exports.AMES_List_Editor = AMES_List_Editor;