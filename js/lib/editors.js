"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Collection_Editor = exports.AMES_Shape_Editor = exports.AMES_Transformation_Editor = void 0;

var _utils = require("./utils.js");

var _artwork = require("./artwork.js");

var _collection = require("./collection.js");

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
  function AMES_Editor(obj, opt) {
    var _this = this;

    _classCallCheck(this, AMES_Editor);

    _defineProperty(this, "box", void 0);

    _defineProperty(this, "obj", void 0);

    _defineProperty(this, "is_visible", false);

    _defineProperty(this, "pos_is_set", false);

    var box = new Group();
    opt = opt || {}; // Add background rectangle

    var e_width = 167.5;
    this.box_width = e_width;
    var e_height = opt.e_height || 150;
    var rect = new Shape.Rectangle({
      point: [0, 0],
      size: [e_width, e_height],
      // fillColor: utils.INACTIVE_COLOR,
      strokeWidth: 1,
      radius: 5,
      strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
      opacity: 0.5
    });
    box.addChild(rect);
    this.box_rect = rect; // Add obj name

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
      // if (this.pos_is_set) return;
      // this.pos_is_set = true;
      // let pos = this.obj.get_pos();
      // let b = this.obj.get_bbox();
      // if (b) {
      // 	b.strokeColor = 'green';
      // 	b.strokeWidth = 2;
      // 	b.visible - true;
      // } else {
      // 	this.box.position = pos; return;
      // }
      // let c = ames.canvas_view.bounds.center;
      //
      // let x = b.width/2 + this.box.bounds.width/2 + 3*utils.ICON_OFFSET;
      //
      // // Adjust horizontal posiiton
      // let d_left = b.leftCenter.getDistance(c, true);
      // let d_right = b.rightCenter.getDistance(c, true);
      // if (d_left < d_right) {
      // 	x *= -1;
      // }
      //
      // // Adjust position;
      // this.box.position = pos.add(new Point(x, -20));
      var bounds = this.box.bounds;
      var w = bounds.width / 2 + _utils.AMES_Utils.ICON_OFFSET * 3 + 12.5;
      var x = ames.toolbar.get_position().x + w;
      var h = ames.canvas_view.size.height - 2 * _utils.AMES_Utils.ICON_OFFSET - bounds.height / 2;
      this.box.position = new Point(x, h);
    } // open: if true show editor; otherwise close

  }, {
    key: "show",
    value: function show(bool) {
      // Update editor position
      if (bool && !this.is_visible) {
        this.set_editor_position();
      }

      this.is_visible = bool;
      this.box.visible = bool;
      if (this.editor_close_cleanup) this.editor_close_cleanup(); // if (!bool) {
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

var AMES_Transformation_Editor = /*#__PURE__*/function (_AMES_Editor) {
  _inherits(AMES_Transformation_Editor, _AMES_Editor);

  var _super = _createSuper(AMES_Transformation_Editor);

  function AMES_Transformation_Editor(obj) {
    var _this2;

    _classCallCheck(this, AMES_Transformation_Editor);

    _this2 = _super.call(this, obj, {
      "e_height": AMES_Transformation_Editor.e_height
    });
    var box = _this2.box;
    var by = _utils.AMES_Utils.LAYER_HEIGHT;
    _this2.box_width = 167.5; // Make geometry link button for artwork

    _this2.geometry_field_info = {};
    var x_off = 4 * _utils.AMES_Utils.ICON_OFFSET;
    var y_off = _utils.AMES_Utils.LAYER_HEIGHT * 6.5;

    _this2.make_link_button([x_off, y_off], 'target');

    _this2.make_link_button([x_off, y_off + _utils.AMES_Utils.LAYER_HEIGHT * 1.5], 'input');

    _this2.make_button(0, "axes", "toggle_show_tf", {
      "deactivate_required": true
    });

    _this2.make_button(0, "brush", "change_transformation_property");

    _this2.make_button(0, "play", "transform");

    _this2.make_button(0, "loop", "toggle_loop", {
      "deactivate_required": true
    });

    _this2.make_dropdown([x_off, _utils.AMES_Utils.LAYER_HEIGHT * 1.5], 'mapping', 'change_mapping');

    _this2.make_dropdown([x_off, _utils.AMES_Utils.LAYER_HEIGHT * 3], 'behavior', 'set_mapping_behavior');

    _this2.make_dropdown([x_off, _utils.AMES_Utils.LAYER_HEIGHT * 4.5], 'mode', 'set_mapping_mode'); // Add playback points UX and button


    _this2.create_playback_points_editor();

    _this2.make_playback_point_btn([x_off - _utils.AMES_Utils.ICON_OFFSET, _utils.AMES_Utils.LAYER_HEIGHT * 11]); // Initialize editor position


    _this2.set_editor_position();

    return _this2;
  }

  _createClass(AMES_Transformation_Editor, [{
    key: "set_editor_position",
    value: function set_editor_position() {
      _get(_getPrototypeOf(AMES_Transformation_Editor.prototype), "set_editor_position", this).call(this);

      this.playback_box.position.x = this.box.position.x + this.box_width + 4 * _utils.AMES_Utils.ICON_OFFSET;
      this.playback_box.position.y = this.box.position.y + AMES_Transformation_Editor.e_height / 2 - this.playback_box.bounds.height / 2;
    }
  }, {
    key: "editor_close_cleanup",
    value: function editor_close_cleanup() {
      this.playback_editor_close_cleanup();

      for (var f in this.dropdown) {
        if (this.dropdown[f].drop_opts) {
          this.dropdown[f].drop_opts.remove();
        }
      }
    }
  }, {
    key: "make_playback_point_btn",
    value: function make_playback_point_btn(editor_loc) {
      var _this3 = this;

      var x_off = editor_loc[0];
      var y_off = editor_loc[1];
      var playback_pt_btn = new Group();
      var box = new Path.Rectangle({
        point: new Point(x_off - 5, y_off),
        size: new Size(150, _utils.AMES_Utils.LAYER_HEIGHT * .75),
        fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        strokeWidth: 1,
        radius: 1.25
      });
      var label = new PointText({
        point: [3.25 * _utils.AMES_Utils.ICON_OFFSET + x_off, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET + 10],
        content: 'Edit Playback Points',
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      playback_pt_btn.addChildren([box, label]);

      playback_pt_btn.onClick = function (e) {
        console.log("Edit Playback Points");
        _this3.playback_box.visible = true;
      };

      this.box.addChild(playback_pt_btn);
    }
  }, {
    key: "playback_editor_close_cleanup",
    value: function playback_editor_close_cleanup() {
      this.playback_box.visible = false;
    }
  }, {
    key: "load_playback_points",
    value: function load_playback_points() {
      var _this4 = this;

      var triggers = this.obj.transformation_functions_to_trigger;
      if (!triggers) return;
      var x_off = this.playback_box.position.x - this.playback_box.bounds.width / 2 + 2 * _utils.AMES_Utils.ICON_OFFSET;
      var y_off = this.playback_box.position.y - this.playback_box.bounds.height / 2 + 5.5 * _utils.AMES_Utils.LAYER_HEIGHT;

      if (!this.playback_pt_ux) {
        this.playback_pt_ux = [];
      } else {
        for (var i in this.playback_pt_ux) {
          this.playback_pt_ux[i].remove();
        }

        this.playback_pt_ux = [];
      }

      console.log("load_playback_points", triggers);

      var _loop = function _loop(_i) {
        console.log(_i, triggers[_i]);
        var trigger = triggers[_i];
        var condition = trigger.condition;
        var tf = trigger.tf;
        var q = trigger.q;
        var playback_pt = new Group(); // Delete button

        var del_button = ames.icons["close"].clone();
        del_button.scaling = 0.75;
        var del_w = del_button.bounds.width;
        del_button.position = new Point(x_off + del_w / 2, y_off);
        del_button.visible = true; // Label for trigger condition

        var trigger_name = tf.name ? tf.name : tf;
        var str_playback_pt = condition[0].toUpperCase() + condition.substr(1) + ": " + trigger_name[0].toUpperCase() + trigger_name.substr(1);
        var label_text = new PointText({
          point: [x_off + del_w / 2 + 2 * _utils.AMES_Utils.ICON_OFFSET, y_off],
          content: str_playback_pt,
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });
        label_text.position.y += label_text.bounds.height / 4; // Box for trigger transformation function
        // Label for trigger transformation function
        // Enable deleting playback points

        del_button.onClick = function (e) {
          console.log("remove playback point");

          _this4.obj.remove_playback_point(trigger);

          _this4.load_playback_points();
        };

        playback_pt.addChildren([del_button, label_text]);

        _this4.playback_box.addChild(playback_pt);

        _this4.playback_pt_ux.push(playback_pt); // Increment y_off


        y_off += 15;
      };

      for (var _i = triggers.length - 1; _i >= 0; _i--) {
        _loop(_i);
      }
    }
  }, {
    key: "create_playback_points_editor",
    value: function create_playback_points_editor() {
      var _this5 = this;

      var playback_box = new Group();
      var by = _utils.AMES_Utils.LAYER_HEIGHT;
      var e_height = AMES_Transformation_Editor.e_height * 3 / 4;
      var box = new Shape.Rectangle({
        point: [0, 0],
        size: [this.box_width, e_height],
        // fillColor: utils.INACTIVE_COLOR,
        strokeWidth: 1,
        radius: 5,
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        opacity: 0.5
      });
      playback_box.addChild(box);
      var n_text = new PointText({
        point: [2 * _utils.AMES_Utils.ICON_OFFSET, by / 2 + _utils.AMES_Utils.FONT_SIZE / 2],
        content: "Playback Points" + " :\n" + this.obj.name,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      }); // Add close icon

      var close_button = ames.icons["close"].clone();
      close_button.scaling = 0.75;
      var close_w = close_button.bounds.width;
      close_button.position = new Point(this.box_width - _utils.AMES_Utils.ICON_OFFSET - close_w / 2, by / 2 - close_w / 2);
      close_button.visible = true;

      close_button.onClick = function (e) {
        _this5.playback_box.visible = false;
        _this5.pos_is_set = false;
        if (_this5.editor_close_cleanup) _this5.editor_close_cleanup();
      }; // Create buttons to add playback pt


      var plus_button = ames.icons["plus"].clone();
      plus_button.scaling = 0.75;
      var plus_w = close_button.bounds.width;
      plus_button.position = new Point(2 * _utils.AMES_Utils.ICON_OFFSET + plus_w / 2, n_text.position.y + n_text.bounds.height + 2 * _utils.AMES_Utils.ICON_OFFSET);
      plus_button.visible = true;

      plus_button.onClick = function (e) {
        console.log("Add playback point");
      };

      this.make_dropdown([plus_button.position.x, plus_button.position.y], 'condition', 'set_new_playback_condition', playback_box);
      this.dropdown['condition'].field_label.position.x += plus_w;
      this.make_link_button([plus_button.position.x + _utils.AMES_Utils.ICON_OFFSET, plus_button.position.y + 1.75 * _utils.AMES_Utils.LAYER_HEIGHT], 'playback transformation', playback_box);

      plus_button.onClick = function (e) {
        var c = _this5.obj.new_playback_condition;
        var tf = _this5.obj.new_playback_transformation;
        if (!tf) tf = "remove";
        console.log(c, tf);
        var q = _this5.obj.new_playback_q;

        if (c && tf) {
          _this5.obj.use_playback_points_to_trigger_transformation({
            'tf': tf,
            'condition': c,
            'q': q
          });
        }

        _this5.load_playback_points();
      }; // Make editor draggable


      var dragging = false;
      var drag_offset = 0;

      box.onMouseDown = function (e) {
        var n_children = playback_box.children.length;

        for (var idx = 1; idx < n_children; idx++) {
          var c = playback_box.children[idx];

          if (c.contains(e.point)) {
            dragging = false;
            return;
          }
        }

        drag_offset = e.point.subtract(playback_box.position);
        dragging = true;
      };

      box.onMouseDrag = function (e) {
        if (dragging) playback_box.position = e.point.subtract(drag_offset);
      };

      box.onMouseUp = function (e) {
        if (dragging) dragging = false;
      };

      playback_box.addChildren([n_text, close_button, plus_button]);
      playback_box.position = ames.canvas_view.center;
      this.playback_box = playback_box;
      this.playback_box.visible = false;
    }
  }, {
    key: "make_dropdown",
    value: function make_dropdown(editor_location, field, dropdown_function, parent, args) {
      var _this6 = this;

      // this.obj[btn_function](args);
      if (!this.dropdown) this.dropdown = {};
      this.dropdown[field] = {};
      var x_off = editor_location[0];
      var y_off = editor_location[1];
      var dropdown = new Group();
      var label = new PointText({
        point: [3 * _utils.AMES_Utils.ICON_OFFSET, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET],
        content: field[0].toUpperCase() + field.substring(1) + ":",
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      this.dropdown[field].field_label = label;
      y_off += 10;
      var box = new Path.Rectangle({
        point: new Point(x_off - 5, y_off),
        size: new Size(150, _utils.AMES_Utils.LAYER_HEIGHT * .75),
        fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        strokeWidth: 1,
        radius: 1.25
      });
      var caret_a = ames.icons['caret-down'].clone();
      caret_a.scaling = .625;
      caret_a.position = new Point(x_off + 2.5, y_off + 12.5);
      caret_a.visible = true;
      var caret_b = caret_a.clone();
      caret_b.position = new Point(x_off + 2.5, y_off + 5);
      caret_b.rotation = 180;
      var opts = this.obj.get_dropdown_opts(field);
      this.dropdown[field].selected_opt = this.obj.get_mapping_opt(field);
      var selected_label = new PointText({
        point: [x_off + 25, y_off + 12.5],
        content: this.dropdown[field].selected_opt,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      this.dropdown[field].label = selected_label;
      this.dropdown[field].opts_visible = false;

      var set_dropdown_selected = function set_dropdown_selected(field, opt) {
        console.log("editor dropdown selection: ", field, opt);

        _this6.obj[dropdown_function](opt);

        _this6.dropdown[field].label.content = opt;
        _this6.dropdown[field].selected_opt = opt;

        if (_this6.dropdown[field].drop_opts) {
          _this6.dropdown[field].drop_opts.remove();
        }

        _this6.dropdown[field].opts_visible = false;
      };

      var get_dropdown_position = function get_dropdown_position() {
        var position = dropdown.position;
        return {
          "x_off": position.x,
          "y_off": position.y
        };
      }; // On click show menu with remaining options that enable selection


      this.dropdown[field].drop_opts;

      dropdown.onMouseDown = function (e) {
        console.log("Clicked on dropdown");
        e.stopPropagation();

        if (_this6.dropdown[field].opts_visible) {
          // Click on same opt resets the menu and hides the visible options
          set_dropdown_selected(field, _this6.dropdown[field].selected_opt);
        } else {
          _this6.dropdown[field].opts_visible = true; // console.log("Show drop opts")
          // Show the visible options so the user can select them

          _this6.dropdown[field].drop_opts = new Group();
          var p = get_dropdown_position();
          p.x_off -= 69;

          var _loop2 = function _loop2(i) {
            var opt = opts[i];

            if (opt != _this6.dropdown[field].selected_opt) {
              // console.log(opt, p);
              var opt_group = new Group();
              p.y_off += box.bounds.height;
              var opt_box = new Path.Rectangle({
                point: new Point(p.x_off - 5, p.y_off - 0.25),
                size: new Size(150, _utils.AMES_Utils.LAYER_HEIGHT * .75),
                fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
                strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
                strokeWidth: 1,
                radius: 1.25
              });
              var opt_label = new PointText({
                point: [p.x_off + 25, p.y_off + 12.5],
                content: opt,
                fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
                fontFamily: _utils.AMES_Utils.FONT,
                fontSize: _utils.AMES_Utils.FONT_SIZE
              });
              opt_group.addChildren([opt_box, opt_label]);

              _this6.dropdown[field].drop_opts.addChild(opt_group);

              opt_group.onMouseDown = function (e) {
                set_dropdown_selected(field, opt);
              };
            }
          };

          for (var i in opts) {
            _loop2(i);
          }
        }
      };

      dropdown.addChildren([label, box, caret_a, caret_b, selected_label]);
      if (!parent) parent = this.box;
      parent.addChild(dropdown);
    }
  }, {
    key: "make_button",
    value: function make_button(btn_row, icon_name, btn_function, args) {
      var _this7 = this;

      args = args || {};
      var btn = ames.icons[icon_name].clone();
      var bw = btn.bounds.width;
      var by = 4.5 * _utils.AMES_Utils.LAYER_HEIGHT + bw * btn_row + 10;
      if (!this.n_btns) this.n_btns = {};
      if (!this.n_btns[btn_row]) this.n_btns[btn_row] = 0;
      btn.position = new Point(3.5 * _utils.AMES_Utils.ICON_OFFSET + this.n_btns[btn_row] * (_utils.AMES_Utils.ICON_OFFSET + bw) + bw / 2, by * 2);
      btn.visible = true;
      btn.active = false;
      args.btn = btn;

      btn.deactivate = function () {
        btn.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        btn.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;

        if (args.deactivate_required) {
          args.deactivate = true;

          _this7.obj[btn_function](args);
        }

        btn.active = false;
      };

      btn.onClick = function (e) {
        if (btn.active) {
          btn.deactivate();
        } else {
          btn.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
          btn.fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;

          _this7.obj[btn_function](args);

          btn.active = true;
        }
      };

      this.n_btns[btn_row] += 1;
      this.box.addChild(btn);
    }
  }, {
    key: "make_link_button",
    value: function make_link_button(editor_location, field, parent) {
      var _this8 = this;

      var x_off = editor_location[0];
      var y_off = editor_location[1];
      var field_label = new PointText({
        point: [3 * _utils.AMES_Utils.ICON_OFFSET, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET],
        content: field[0].toUpperCase() + field.substring(1) + ":",
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      y_off += 15;
      var link = ames.icons['link'].clone();
      link.scaling = 1.25;
      link.position = new Point(x_off + _utils.AMES_Utils.ICON_OFFSET, y_off);
      link.visible = true;
      link.strokeWidth = .25;
      var link_remove = ames.icons['link-remove'].clone();
      link_remove.scaling = 1.25;
      link_remove.position = link.position;
      link_remove.visible = false;
      link_remove.strokeWidth = .25;
      this.geometry_field_info[field] = {};
      var field_name;
      if (this.obj[field]) field_name = this.obj[field].name;
      field_name = field_name || field;
      if (field_name == "playback transformation") field_name = "remove";
      var label = new PointText({
        point: [3.25 * _utils.AMES_Utils.ICON_OFFSET + x_off, y_off + .75 * _utils.AMES_Utils.ICON_OFFSET],
        content: field_name,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      });
      this.geometry_field_info[field].label = label; // When the link button is clicked activate constraint tool

      link.onMouseDown = function (e) {
        console.log("click animation link button", field);
        ames.active_linking_transformation = _this8.obj;
        ames.transformation_active_field = field;
        ames.tools['Animation_Link'].activate(); // Little workaround... to start drawing line that defines constraint

        link.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        ames.tools['Animation_Link'].onMouseDown(e);
        ames.tools['Animation_Link'].onMouseDrag(e);
      };

      link_remove.onMouseDown = function (e) {
        // Remove obj field
        _this8.obj.set_geometry_field(field, null);

        _this8.geometry_field_info[field].label.content = field;

        if (field == "playback transformation") {
          _this8.geometry_field_info[field].label.content = "remove";
        }

        link.visible = true;
        link_remove.visible = false;
      };

      this.geometry_field_info[field].link = link;
      this.geometry_field_info[field].link_remove = link_remove;
      if (!parent) parent = this.box;
      parent.addChild(field_label);
      parent.addChild(label);
      parent.addChild(link);
      parent.addChild(link_remove);
    }
  }]);

  return AMES_Transformation_Editor;
}(AMES_Editor);

exports.AMES_Transformation_Editor = AMES_Transformation_Editor;

_defineProperty(AMES_Transformation_Editor, "e_height", 305);

var AMES_Shape_Editor = /*#__PURE__*/function (_AMES_Editor2) {
  _inherits(AMES_Shape_Editor, _AMES_Editor2);

  var _super2 = _createSuper(AMES_Shape_Editor);

  function AMES_Shape_Editor(obj) {
    var _this9;

    _classCallCheck(this, AMES_Shape_Editor);

    _this9 = _super2.call(this, obj);

    _defineProperty(_assertThisInitialized(_this9), "props", {});

    _defineProperty(_assertThisInitialized(_this9), "subprops", {});

    _defineProperty(_assertThisInitialized(_this9), "constraint_info", {});

    _defineProperty(_assertThisInitialized(_this9), "selected_subprop", void 0);

    _defineProperty(_assertThisInitialized(_this9), "selected_prop", void 0);

    var box = _this9.box;
    var by = _utils.AMES_Utils.LAYER_HEIGHT;
    var e_width = _this9.box_width;
    var props = _utils.AMES_Utils.VIS_PROPS; // create all sub-property box

    _this9._make_subprop('all', 0, box); // Create property buttons


    var properties = [];

    for (var p in _utils.AMES_Utils.VIS_PROPS) {
      properties.push(_utils.AMES_Utils.VIS_PROPS[p]);
    } // Add nsides for Polygon


    if (obj.artwork_type == "Polygon") {
      properties.push("nsides");
    }

    var b_w;

    var _loop3 = function _loop3(idx) {
      var p = properties[idx];
      var button = ames.icons[p].clone();
      b_w = button.bounds.width;
      button.position = new Point(2 * _utils.AMES_Utils.ICON_OFFSET + idx * (_utils.AMES_Utils.ICON_OFFSET + b_w) + b_w / 2, by * 2);
      button.visible = true; // create subproperty boxes

      var p_subprops = _utils.AMES_Utils.SUB_PROPS[p]; // note: index is incremented to account for all subproperty box

      for (var s_idx = 1; s_idx <= p_subprops.length; s_idx++) {
        var s = p_subprops[s_idx - 1]; // Make a new subproperty box if necessary

        _this9._make_subprop(s, s_idx, box);
      } // Clicking enables intearctivity on selected trait


      button.onClick = function (e) {
        obj.manipulate(p, 'all');
      }; // Add button to editor


      box.addChild(button);
      _this9.props[p] = button;
    };

    for (var idx in properties) {
      _loop3(idx);
    } // Add special slider for polygon (nsides)


    if (obj.artwork_type == "Polygon") {
      var p_text = new Point(2 * _utils.AMES_Utils.ICON_OFFSET + properties.length * (_utils.AMES_Utils.ICON_OFFSET + b_w) + b_w / 2, by * 2);
      _this9.nsides = new PointText({
        point: [p_text.x, p_text.y + _utils.AMES_Utils.ICON_OFFSET],
        content: obj.sides,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        visible: false
      });
      var total_drag = 0;

      _this9.nsides.onMouseDown = function (e) {
        ames.canvas.style.cursor = 'move';
      };

      _this9.nsides.onMouseDrag = function (e) {
        // ames.canvas.style.cursor = null;
        total_drag += e.event.movementX;

        if (total_drag < 0) {
          if (total_drag > 0) total_drag = 0;
          ames.canvas.style.cursor = 'w-resize';
        }

        if (total_drag > 0) {
          if (total_drag < 0) total_drag = 0;
          ames.canvas.style.cursor = 'e-resize';
        }

        if (total_drag < -5) {
          // Decrement nsides
          if (obj.sides > 3) {
            obj.set_number_of_sides(Number(obj.sides) - 1);
            _this9.nsides.content = obj.sides;
          }

          total_drag = 0;
        }

        if (total_drag > 5) {
          // Increase nsides
          obj.set_number_of_sides(Number(obj.sides) + 1);
          _this9.nsides.content = obj.sides;
          total_drag = 0;
        }
      };

      _this9.nsides.onMouseUp = function (e) {
        ames.canvas.style.cursor = null;
        total_drag = 0;
      };

      box.addChild(_this9.nsides);
    }

    _this9.box = box; // Initialize editor

    _this9.set_editor_position();

    return _this9;
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
      var _this10 = this;

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
        box.addChild(subprop_line); // // Make and hide link and unlink buttons
        // let link = ames.icons['link'].clone();
        // link.scaling = 1.25;
        // link.position = new Point(3.5*utils.ICON_OFFSET, utils.LAYER_HEIGHT*3.75);
        // link.visible = true;
        // link.strokeWidth = .25;
        // let link_remove = ames.icons['link-remove'].clone();
        // link_remove.scaling = 1.25;
        // link_remove.position = link.position;
        // link_remove.visible = false;
        // link_remove.strokeWidth = .25;
        // // When the link button is clicked activate constraint tool
        // link.onMouseDown = (e) => {
        // 	ames.c_relative = this.obj;
        // 	ames.tools['Constraint'].activate();
        // 	// Little workaround... to start drawing line that defines constraint
        // 	link.strokeColor = utils.ACTIVE_S_COLOR;
        // 	ames.tools['Constraint'].onMouseDown(e);
        // 	ames.tools['Constraint'].onMouseDrag(e);
        // }
        // link_remove.onMouseDown = (e) => {
        // 	let p = this.obj.active_prop;
        // 	let s = this.obj.active_sub_p;
        // 	console.log("link remove constraint", p, s);
        // 	if (!s) s = "all";
        // 	let c_ins = this.obj.c_inbound[p][s];
        // 	let c = null;
        // 	for (let i in c_ins) {
        // 		if (c_ins[i].is_manual_constraint)
        // 			c = c_ins[i];
        // 	}
        // 	if (c) {
        // 		console.log(c);
        // 		c.remove();
        // 	}
        // }
        // this.constraint_info.link = link;
        // this.constraint_info.link_remove = link_remove;
        // // Name of relative that defines the constraint
        // let link_name = new PointText({
        // 	point: [link.position.x + 3*utils.ICON_OFFSET, link.position.y + link.bounds.height/4],
        // 	content: 'Constraint',
        // 	fillColor: utils.INACTIVE_S_COLOR,
        // 	fontFamily: utils.FONT,
        // 	fontSize: utils.FONT_SIZE,
        // });
        // this.constraint_info.link_name = link_name;
        // let offset_label = new PointText({
        // 	point: [subline_start.x + utils.ICON_OFFSET, link.position.y + 5*utils.ICON_OFFSET],
        // 	content: 'relative offset',
        // 	fillColor: utils.INACTIVE_S_COLOR,
        // 	fontFamily: utils.FONT,
        // 	fontSize: utils.FONT_SIZE,
        // });
        // this.constraint_info.offset_label = offset_label;
        // let offset_val = new PointText({
        // 	point: [subline_start.x + offset_label.bounds.width + 2.5*utils.ICON_OFFSET, link.position.y + 5*utils.ICON_OFFSET],
        // 	content: '10',
        // 	fillColor: utils.INACTIVE_S_COLOR,
        // 	fontFamily: utils.FONT,
        // 	fontSize: utils.FONT_SIZE,
        // });
        // this.constraint_info.offset_val = offset_val;
        // // Make offset val draggable
        // this.constraint_info.offset_val.onMouseDown = (e) => {
        // 	console.log("mouse down on offset val")
        // 	ames.canvas.style.cursor = 'move';
        // }
        // let offset_val_drag = 0;
        // this.constraint_info.offset_val.onMouseDrag = (e) => {
        // 	offset_val_drag += e.event.movementX;
        // 	if (offset_val_drag < 0) ames.canvas.style.cursor = 'w-resize';
        // 	if (offset_val_drag > 0) ames.canvas.style.cursor = 'e-resize';
        // 	let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
        // 	if (offset_val_drag < -5) {
        // 		// Manipulate active constraint
        // 		for (let i in c_ins) {
        // 			if (c_ins[i].is_manual_constraint) {
        // 				c_ins[i].change_offset(-1);
        // 			}
        //
        // 		}
        // 		offset_val_drag = 0;
        // 	}
        // 	if (offset_val_drag > 5) {
        // 		// Manipulate active constraint
        // 		for (let i in c_ins) {
        // 			if (c_ins[i].is_manual_constraint) {
        // 				c_ins[i].change_offset(1);
        // 			}
        // 		}
        // 		offset_val_drag = 0;
        // 	}
        // }
        // this.constraint_info.offset_val.onMouseUp = (e) => {
        // 	ames.canvas.style.cursor = null;
        // }
        // let ox = offset_val.position.x; let oy = offset_val.position.y + offset_val.bounds.height/2;
        // let offset_line = new Path.Line(new Point(ox - 1.25*utils.ICON_OFFSET, oy), new Point(ox + 6*utils.ICON_OFFSET, oy));
        // offset_line.strokeColor = utils.INACTIVE_S_COLOR;
        // offset_line.strokeWidth = 1;
        // offset_line.opacity = 0.5;
        // this.constraint_info.offset_line = offset_line;
        // box.addChildren([link, link_name, offset_label, offset_val, offset_line, link_remove]);
        // this.show_constraint(false);
      } // When the subproperty is clicked enable editing on it


      subprop_box.onClick = function (e) {
        if (!_this10.obj.active_prop) return;

        _this10.select_subprop(s, true);

        _this10.obj.manipulate_helper(s);
      };

      subprop_text.onClick = function (e) {
        if (!_this10.obj.active_prop) return;

        _this10.select_subprop(s, true);

        _this10.obj.manipulate_helper(s);
      };

      box.addChild(subprop_text);
      box.addChild(subprop_box);
      this.subprops[s] = [subprop_text, subprop_box];
    } // // _show_constraint
    // show_constraint(bool, p, sub_p) {
    // 	if (p == 'path') { bool = false;}
    // 	if (p == 'nsides') { bool = false; }
    //
    // 	for (let k in this.constraint_info) {
    // 		this.constraint_info[k].visible = bool;
    // 	}
    // 	// Hide link remove button
    // 	this.constraint_info.link_remove.visible = false;
    // 	// Show link remove button if there is an active constraint
    // 	if (bool && this.obj) {
    // 		let s = sub_p;
    // 		if (!s) s = "all";
    // 		let c_ins = this.obj.c_inbound[p][s];
    // 		let c = null;
    // 		for (let i in c_ins) {
    // 			if (c_ins[i].is_manual_constraint)
    // 				c = c_ins[i];
    // 		}
    // 		if (c) {
    // 			this.constraint_info.link_remove.visible = true;
    // 			this.constraint_info.link.visible = false;
    // 		}
    // 	}
    //
    // 	if (sub_p == 'all') {
    // 		this.constraint_info['offset_label'].visible = false;
    // 		this.constraint_info['offset_val'].visible = false;
    // 		this.constraint_info['offset_line'].visible = false;
    // 	}
    //
    // 	// Update property value
    // 	if (bool) this.update_constraint(p, sub_p);
    // }
    //
    // update_constraint(p, s) {
    // 	if (!p) p = this.obj.active_prop;
    // 	if (!s) s = this.obj.active_sub_p;
    // 	if (!s) s = "all"
    //
    // 	let link_name = 'Unconstrained';
    // 	let offset_val = 0;
    //
    // 	let c = null;
    // 	if (p) {
    // 		let c_ins = this.obj.c_inbound[p][s];
    // 		// console.log(c_ins);
    // 		for (let i in c_ins) {
    // 			if (c_ins[i].is_manual_constraint)
    // 				c = c_ins[i];
    // 		}
    // 		if (c) {
    // 			link_name = c.reference.name;
    //
    // 			if (s != "all") {
    // 				let offset = c.get_offset();
    // 				offset_val = offset.toFixed(2);
    // 			}
    // 			// Show unlink button
    // 			this.constraint_info.link.visible = false;
    // 			this.constraint_info.link_remove.visible = true;
    // 		} else {
    // 			// Show link button
    // 			this.constraint_info.link.visible = true;
    // 			this.constraint_info.link_remove.visible = false;
    // 		}
    // 	}
    //
    // 	this.constraint_info.link_name.content = link_name;
    // 	this.constraint_info.offset_val.content = offset_val;
    // }
    // _select_subprop: Activate subproperty including display if true; deselect otherwise

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

var AMES_Collection_Editor = /*#__PURE__*/function (_AMES_Shape_Editor) {
  _inherits(AMES_Collection_Editor, _AMES_Shape_Editor);

  var _super3 = _createSuper(AMES_Collection_Editor);

  function AMES_Collection_Editor(obj) {
    var _this11;

    _classCallCheck(this, AMES_Collection_Editor);

    _this11 = _super3.call(this, obj); // this.add_relative_index_to_constraint_info();

    _defineProperty(_assertThisInitialized(_this11), "rel_idx_val", void 0);

    _defineProperty(_assertThisInitialized(_this11), "e_height", 175);

    return _this11;
  } // add_relative_index_to_constraint_info() {
  // 	// Group relative coords
  // 	let bx = this.constraint_info.offset_label.position.x - this.constraint_info.offset_label.bounds.width/2;
  // 	let by = this.constraint_info.offset_label.position.y;
  //
  // 	// Add obj name
  // 	let uy = utils.LAYER_HEIGHT;
  // 	let rel_idx_label = new PointText({
  // 		point: [bx, by + 5*utils.ICON_OFFSET],
  // 		content: 'relative index',
  // 		fillColor: utils.INACTIVE_S_COLOR,
  // 		fontFamily: utils.FONT,
  // 		fontSize: utils.FONT_SIZE
  // 	});
  // 	let rel_idx_val = new PointText({
  // 		point: [this.constraint_info.offset_val.position.x - this.constraint_info.offset_val.bounds.width/2, rel_idx_label.position.y + 3],
  // 		content: '0',
  // 		fillColor: utils.INACTIVE_S_COLOR,
  // 		fontFamily: utils.FONT,
  // 		fontSize: utils.FONT_SIZE
  // 	});
  // 	let ox = this.constraint_info.offset_line.position.x - this.constraint_info.offset_line.bounds.width/2;
  // 	let oy = rel_idx_val.position.y + rel_idx_val.bounds.height/2;
  // 	let rel_idx_line = new Path.Line(new Point(ox, oy), new Point(this.constraint_info.offset_val.position.x+ 6*utils.ICON_OFFSET, oy));
  // 	rel_idx_line.strokeColor = utils.INACTIVE_S_COLOR;
  // 	rel_idx_line.strokeWidth = 1;
  // 	rel_idx_line.opacity = 0.5;
  // 	rel_idx_line.visible = true;
  //
  // 	// switch y position
  // 	let y1_label = rel_idx_label.position.y;
  // 	let y1_val = rel_idx_val.position.y;
  // 	let y1_line = rel_idx_line.position.y;
  //
  // 	let y2_label = this.constraint_info.offset_label.position.y;
  // 	let y2_val = this.constraint_info.offset_val.position.y;
  // 	let y2_line = this.constraint_info.offset_line.position.y;
  //
  // 	this.constraint_info.offset_label.position.y = y1_label;
  // 	this.constraint_info.offset_val.position.y = y1_val;
  // 	this.constraint_info.offset_line.position.y = y1_line;
  //
  // 	rel_idx_label.position.y = y2_label;
  // 	rel_idx_val.position.y = y2_val;
  // 	rel_idx_line.position.y = y2_line;
  //
  // 	rel_idx_label.visible = false;
  // 	rel_idx_val.visible = false;
  // 	rel_idx_line.visible = false;
  //
  // 	// Add to constraint info
  // 	this.constraint_info.rel_idx_label = rel_idx_label;
  // 	this.constraint_info.rel_idx_val = rel_idx_val;
  // 	this.constraint_info.rel_idx_line = rel_idx_line;
  //
  // 	// Add to editor box
  // 	this.box.addChildren([rel_idx_label, rel_idx_val, rel_idx_line]);
  //
  // 	// Draggable editability to change rel idx value
  // 	this.constraint_info.rel_idx_val.onMouseDown = (e) => {
  // 		ames.canvas.style.cursor = 'move';
  // 	}
  // 	let rel_idx_drag = 0;
  // 	this.constraint_info.rel_idx_val.onMouseDrag = (e) => {
  // 		rel_idx_drag += e.event.movementX;
  // 		if (rel_idx_drag < 0) ames.canvas.style.cursor = 'w-resize';
  // 		if (rel_idx_drag > 0) ames.canvas.style.cursor = 'e-resize';
  // 		if (rel_idx_drag < -5) {
  //
  // 			let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
  // 			for (let i in c_ins) {
  // 				if (c_ins[i].is_manual_constraint) c_ins[i].change_rel_idx(-1)
  // 			}
  // 			console.log("drag left", c_ins);
  // 			rel_idx_drag = 0;
  // 		}
  // 		if (rel_idx_drag > 5) {
  //
  // 			let c_ins = this.obj.c_inbound[this.obj.active_prop][this.obj.active_sub_p];
  // 			for (let i in c_ins) {
  // 				if (c_ins[i].is_manual_constraint) c_ins[i].change_rel_idx(1);
  // 			}
  // 			console.log("drag right", c_ins);
  // 			rel_idx_drag = 0;
  // 		}
  // 	}
  // 	this.constraint_info.rel_idx_val.onMouseUp = (e) => {
  // 		ames.canvas.style.cursor = null;
  // 	}
  // }
  // update_constraint(p, s) {
  // 	if (!p) p = this.obj.active_prop;
  // 	if (!s) s = this.obj.active_sub_p;
  // 	if (!s) s = "all";
  // 	super.update_constraint(p, s);
  //
  // 	let c = null; let rel_idx;
  // 	let c_ins = this.obj.c_inbound[p][s];
  // 	// console.log(c_ins);
  // 	for (let i in c_ins) {
  // 		if (c_ins[i].is_manual_constraint)
  // 			c = c_ins[i];
  // 	}
  // 	if (c) {
  // 		rel_idx = c.get_rel_idx();
  // 		rel_idx = rel_idx.toFixed(0);
  // 	}
  //
  // 	this.constraint_info.rel_idx_val.content = rel_idx;
  // }
  // // show_constraint: also include relative index information
  // show_constraint(bool, p, sub_p) {
  // 	super.show_constraint(bool, p, sub_p);
  //
  // 	// if (sub_p == 'all') {
  // 	// 	this.constraint_info['rel_idx_label'].visible = false;
  // 	// 	this.constraint_info['rel_idx_val'].visible = false;
  // 	// 	this.constraint_info['rel_idx_line'].visible = false;
  // 	// }
  //
  // 	// Update property value
  // 	if (bool) this.update_constraint(p, sub_p);
  // }


  _createClass(AMES_Collection_Editor, [{
    key: "show",
    value: function show(bool) {
      // Show / hide list highlight box
      this.obj.show_box(bool);

      _get(_getPrototypeOf(AMES_Collection_Editor.prototype), "show", this).call(this, bool);
    }
  }]);

  return AMES_Collection_Editor;
}(AMES_Shape_Editor);

exports.AMES_Collection_Editor = AMES_Collection_Editor;