(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES = void 0;

var _utils = require("./utils.js");

var _viewfoil = require("./viewfoil.js");

var _artwork = require("./artwork.js");

var _editors = require("./editors.js");

var _constraints = require("./constraints.js");

var _lists = require("./lists.js");

var _collection = require("./collection.js");

var _animations = require("./animations.js");

var _transformation = require("./transformation.js");

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Globals for ames
// ames.canvas_cx;
// ames.canvas_cy;
// ames.animations;
var AMES = /*#__PURE__*/function () {
  // loop() {
  // 	this.is_looping = !this.is_looping;
  // }
  // get_time_from_scrubber() {
  // 	let sc_x = this.scrubber.position.x;
  // 	let t = (sc_x - this.min_sc) / (this.max_sc - this.min_sc);
  // 	return t;
  // }
  //
  // update_scrubber_to_time() {
  // 	let sc_x = (this.time * (this.max_sc - this.min_sc)) + this.min_sc;
  // 	return sc_x;
  // }
  //
  // set_time(t) {
  // 	this.time = t;
  // 	this.adjust_t_delta;
  // }
  //
  // get_duration(x) {
  // 	return 1000;
  // }
  // Constructor for ames (empty)
  function AMES() {// Warning: ames is not defined here

    _classCallCheck(this, AMES);

    _defineProperty(this, "active_shape_btn", void 0);

    _defineProperty(this, "active_objs", {});

    _defineProperty(this, "objs", {});

    _defineProperty(this, "lists", {});

    _defineProperty(this, "aobjs", {});

    _defineProperty(this, "n_shapes", 0);

    _defineProperty(this, "n_lists", 0);

    _defineProperty(this, "n_aobjs", 0);

    _defineProperty(this, "n_shapes", 1);

    _defineProperty(this, "l_shape_idx", 1);

    _defineProperty(this, "n_lists", 1);

    _defineProperty(this, "l_list_idx", 1);

    _defineProperty(this, "n_aobjs", 1);

    _defineProperty(this, "l_aobj_idx", 1);

    _defineProperty(this, "canvas_view", void 0);

    _defineProperty(this, "controls_view", void 0);

    _defineProperty(this, "layers_view", void 0);

    _defineProperty(this, "obj_boxes", {});

    _defineProperty(this, "idx_boxes", void 0);

    _defineProperty(this, "tools", {});

    _defineProperty(this, "icons", {});

    _defineProperty(this, "scrubber", void 0);

    _defineProperty(this, "fps", 60);

    _defineProperty(this, "time", 0);

    _defineProperty(this, "t_delta", 0);

    _defineProperty(this, "dur", 10);

    _defineProperty(this, "animations", void 0);

    _defineProperty(this, "is_playing", false);

    _defineProperty(this, "is_looping", false);

    _defineProperty(this, "reset_time", false);

    _defineProperty(this, "offset_mode", false);

    _defineProperty(this, "ux", []);
  }

  _createClass(AMES, [{
    key: "init",
    value: // controls
    // Views & controls
    // Scrubber
    // State & Timing
    // frames per second used by transformations
    // time in system
    // time between elapsed frames
    // in seconds
    // State
    // Testing
    // UX
    // layers = {};
    // Iniitalize AMES app properties after window loads
    function init() {
      // Get references to canvas objects
      var canvas = document.getElementById('animation-canvas'); // Store animation canvas properties

      window.ames.canvas = canvas;
      window.ames.canvas_cx = canvas.width / 2;
      window.ames.canvas_cy = canvas.height / 2;
      window.ames.animations = {}; // Set up project & view for animation canvas

      paper.setup(canvas);
      this.init_canvas(canvas); // Make drawing tools

      this.tools['inactive_tool'] = new Tool();
      this.tools['Path'] = this.init_path_tool();
      this.tools['Circle'] = this.init_circle_tool();
      this.tools['Square'] = this.init_square_tool();
      this.tools['List'] = this.init_list_tool();
      this.tools['Collection'] = this.init_list_tool({
        'is_para_style_list': false
      });
      this.tools['Duplicator'] = this.init_list_tool({
        'is_para_style_list': false,
        'is_duplicator': true
      });
      this.tools['Constraint'] = this.init_constraint_tool();
      this.tools['Transformation'] = this.init_create_transformation_tool();
      this.tools['Animation_Link'] = this.init_animation_link_tool(); // Activate canvas

      this.canvas_view._project.activate(); // Set up sidebar


      this.idx_boxes = new Array(); // this.setup_layers();
      // Import icons

      this.create_toolbar();
      this.create_sidebar();
      this.import_icons();
    }
  }, {
    key: "test",
    value: function test() {// let line1 = new AMES_Artwork_Path();
      // let line2 = new AMES_Artwork_Path();
      // line1.add_points([new Point(75, 100), new Point(75, 90)]);
      // line1.finish_creating_path();
      // line2.add_points([new Point(100, 100), new Point(100, 110)]);
      // line2.finish_creating_path();
      //
      // let line3 = new AMES_Artwork_Path();
      // line3.add_points([new Point(500, 525), new Point(500, 500)]);
      // line3.finish_creating_path();
      //
      // let lines = new AMES_Collection([line1, line2]);
      // console.log(line1.poly);
      // let e = new AMES_Ellipse({
      // 	"centroid": new Point(150, 150),
      // });
      // let p = new AMES_Polygon({
      // 	"centroid": new Point(300, 300),
      // 	 "nsides": 12,
      // 	 "radius": 50
      //  });
      // let t = new AMES_Transformation({
      // 	"input": lines,
      // 	"target": p,
      // });
      // t.set_mapping({"type": "Vertex", "mapping": "relative position"});
      // t.set_mapping_behavior("alternate");
      // t.tf_space_absolute = false;
      // t.show(true);
      // a.poly.strokeColor = "pink";
      // let b = new AMES_Ellipse();
      // b.poly.sendToBack();
      // let a_triangle = new AMES_Polygon();
      // let a_square = new AMES_Polygon({centroid: new Point(200, 200), nsides: 4, radius: 50});
      // let a_dot = new AMES_Ellipse({centroid: new Point(500, 500), rx: 5, ry: 5});
      // let a_ellipse = new AMES_Ellipse({centroid: new Point(750, 500), rx: 50, ry: 150});
      // let c = new AMES_Collection([a_dot]);
      // for (let i = 0; i < 9; i++) {
      // 	c.duplicate();
      // }
      // let t = new AMES_Transformation({input: a_ellipse, mapping: "position"});
      // t.set_target(c);
      // ames.starfield(6)
    }
  }, {
    key: "create_toolbar",
    value: function create_toolbar() {
      var _this = this;

      var toolbar = new Group();
      toolbar.n_btns = 0;
      toolbar.active_btn = null;
      toolbar.btns = {};

      toolbar.get_position = function () {
        var cw = -ames.canvas_view.size.width / 2 + 5 * _utils.AMES_Utils.ICON_OFFSET;
        var ch = ames.canvas_view.size.height / 2 - 5 * _utils.AMES_Utils.ICON_OFFSET;
        var csize = new Point(-toolbar.bounds.width / 2, toolbar.bounds.height / 2);
        var p = ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
        return p;
      };

      toolbar.activate_btn = function (btn_name) {
        _this.toolbar.active_btn = btn_name;
        _this.toolbar.btns[btn_name].children[0].fillColor = "black"; // console.log(this.toolbar.active_btn);
      };

      toolbar.deactivate_btn = function (btn_name) {
        // console.log("deactivate button", this.toolbar.active_btn);
        if (_this.toolbar.active_btn == btn_name) _this.toolbar.active_btn = null;
        _this.toolbar.btns[btn_name].children[0].fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      };

      toolbar.create_btn = function (btn_name, i_name, cb) {
        var btn = new Group();
        var btn_i = ames.icons[i_name].clone();
        var p = ames.toolbar.get_position();
        btn_i.position = new Point(p.x, p.y - 27.5 * ames.toolbar.n_btns);
        btn_i.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
        btn_i.scaling = 1.25;
        btn_i.visible = true;
        var btn_position = btn_i.position;
        var btn_r = new Path.Rectangle({
          position: ames.canvas_view.center,
          size: new Size(25, 25),
          radius: 15
        });
        btn_r.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        btn_r.position = btn_i.position;
        btn_r.strokeWidth = 1;
        btn_r.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
        btn.addChildren([btn_r, btn_i]);
        btn.position = btn_i.position;

        btn.onClick = function (e) {
          cb();
        };

        ames.toolbar.n_btns += 1;
        ames.toolbar.btns[btn_name] = btn;
        toolbar.position = toolbar.get_position();
        ames.ux.push(btn);
      };

      toolbar.create_tool_btn = function (btn_name, i_name) {
        var tool_cb = function tool_cb() {
          ames.switch_tool({
            b: btn_name
          });
        };

        ames.toolbar.create_btn(btn_name, i_name, tool_cb);
      };

      toolbar.position = toolbar.get_position();
      ames.toolbar = toolbar;
    }
  }, {
    key: "create_sidebar",
    value: function create_sidebar() {
      var _this2 = this;

      var sidebar = new Group();
      this.create_color_picker();
      var w = _utils.AMES_Utils.SIDEBAR_WIDTH;
      var h = _utils.AMES_Utils.SIDEBAR_HEIGHT;
      var r = new Path.Rectangle({
        position: ames.canvas_view.center,
        size: new Size(w, h),
        radius: 5
      });
      r.position = new Point(0, 0);
      r.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      this.ux.push(r);
      var ames_text = new PointText({
        point: [0, 0],
        content: "Animating Multiple Elements Simultaneously",
        fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: 12,
        visible: true,
        position: [r.position.x, r.position.y - r.bounds.height / 2]
      });
      ames_text.position = new Point(0, -h / 2 + 1.5 * ames_text.bounds.height);
      var ames_box = new Path.Rectangle({
        position: r.position,
        size: new Size(w, 3 * ames_text.bounds.height),
        radius: 0
      });
      ames_box.position = ames_text.position;
      console.log("ames_box", ames_box.bounds.height, _utils.AMES_Utils.SIDEBAR_WIDTH);
      ames_box.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      ames_box.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR; // Add ux show / hide carets

      sidebar.add_caret = function (i_name) {
        var button = ames.icons[i_name].clone();
        var caret_position = new Point(ames_text.position.x - ames_text.bounds.width / 2 - 3 * _utils.AMES_Utils.ICON_OFFSET, ames_text.position.y);
        button.position = caret_position;
        button.scaling = 1.125;
        button.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
        button.fillColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR; // Show

        if (i_name == "caret-right") {
          button.visible = false;

          button.onClick = function (e) {
            _this2.show_ux(true);

            button.visible = false;
            sidebar.children[_utils.AMES_Utils.UX_HIDE_IDX].visible = true;
          };

          sidebar.insertChild(_utils.AMES_Utils.UX_SHOW_IDX, button);
        } // Hide


        if (i_name == "caret-down") {
          button.visible = true;

          button.onClick = function (e) {
            _this2.show_ux(false);

            button.visible = false;
            sidebar.children[_utils.AMES_Utils.UX_SHOW_IDX].visible = true;
          };

          sidebar.insertChild(_utils.AMES_Utils.UX_HIDE_IDX, button);
        }
      };

      sidebar.addChildren([r, ames_box, ames_text]);

      var get_position = function get_position() {
        var cw = ames.canvas_view.size.width / 2 - .5 * _utils.AMES_Utils.ICON_OFFSET;
        var ch = -ames.canvas_view.size.height / 2 + 2 * _utils.AMES_Utils.ICON_OFFSET;
        var csize = new Point(-sidebar.bounds.width / 2, sidebar.bounds.height / 2);
        return ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
      };

      sidebar.position = get_position();
      sidebar.visible = true;
      this.sidebar = sidebar;
      var label_x = ames.canvas_view.size.width / 2;
      var label_y = -ames.canvas_view.size.height / 2;
      var save_label = new PointText({
        point: [sidebar.position.x - sidebar.bounds.width / 2 + 5 * _utils.AMES_Utils.ICON_OFFSET, sidebar.position.y],
        content: "Save",
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        visible: true
      });
      var save_btn = new Path.Rectangle({
        position: [save_label.position.x, save_label.position.y],
        size: [save_label.bounds.width + 5 * _utils.AMES_Utils.ICON_OFFSET, save_label.bounds.height + 2.5 * _utils.AMES_Utils.ICON_OFFSET],
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        radius: 5
      });
      var import_label = new PointText({
        point: [sidebar.position.x - sidebar.bounds.width / 2 + save_label.bounds.width + 12 * _utils.AMES_Utils.ICON_OFFSET, sidebar.position.y],
        content: "Import",
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        visible: true
      });
      var import_btn = new Path.Rectangle({
        position: [import_label.position.x, import_label.position.y],
        size: [import_label.bounds.width + 5 * _utils.AMES_Utils.ICON_OFFSET, import_label.bounds.height + 2.5 * _utils.AMES_Utils.ICON_OFFSET],
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        radius: 5
      });

      var sidebar_btn_click = function sidebar_btn_click(btn) {
        if (btn == "import") {
          document.getElementById('file_input').click();
          import_btn.fillColor = "lightgray";
          setTimeout(function () {
            import_btn.fillColor = null;
          }, 250);
        }

        if (btn == "save") {
          save_btn.fillColor = "lightgray";
          setTimeout(function () {
            save_btn.fillColor = null;
          }, 250); // TO DO: Save an ames file
        }
      };

      import_btn.onMouseDown = function (e) {
        sidebar_btn_click("import");
      };

      import_label.onMouseDown = function (e) {
        sidebar_btn_click("import");
      };

      save_btn.onMouseDown = function (e) {
        sidebar_btn_click("save");
      };

      save_btn.onMouseDown = function (e) {
        sidebar_btn_click("save");
      };

      this.ux.push(import_btn, import_label, save_btn, save_label);
      this.sidebar.addChildren[(save_label, save_btn, import_label, import_btn)];
      var layers = new Group();
      var scrollbar_top = sidebar.position.y + save_btn.bounds.height / 2 + 3 * _utils.AMES_Utils.ICON_OFFSET;
      var scrollbar_x = sidebar.position.x + sidebar.bounds.width / 2 - 1.25 * _utils.AMES_Utils.ICON_OFFSET;
      var scrollbar_bottom = sidebar.position.y + r.bounds.height / 2 - 3 * _utils.AMES_Utils.ICON_OFFSET;

      layers.scroll = function (e) {
        layers.sendToBack();
        layers.position.y += -e.event.movementY;

        for (var i in _this2.layers.children) {
          var lbox = _this2.layers.children[i];
          lbox.sendToBack();
          lbox.visible = true;
          if (lbox.position.y < scrollbar_top) lbox.visible = false;
          if (lbox.position.y > scrollbar_bottom) lbox.visible = false;
        }
      };

      var scrollbar = new Path.Line({
        from: [scrollbar_x, scrollbar_top],
        to: [scrollbar_x, scrollbar_bottom],
        strokeColor: "lightgray",
        strokeWidth: 4,
        strokeCap: 'round'
      });

      scrollbar.onMouseDrag = function (e) {
        layers.scroll(e);
      };

      var r_top = new Path.Rectangle({
        point: [100, 100],
        size: [sidebar.bounds.width + 2, 22] // fillColor: "white"

      });
      r_top.position = new Point(sidebar.position.x, scrollbar_top - 10.25);
      var r_btm = r_top.clone();
      r_btm.position = new Point(sidebar.position.x, scrollbar_bottom + 10.25);
      r_top.sendToBack();
      r_btm.sendToBack();
      r_top.visible = false;
      r_btm.visible = false;
      scrollbar.top = scrollbar_top;
      scrollbar.bottom = scrollbar_bottom;
      sidebar.addChild(scrollbar);
      layers.scrollbar = scrollbar;
      this.layers = layers;
      this.ux.push(scrollbar);
      this.ux.push(layers);
    }
  }, {
    key: "import_file",
    value: function import_file(filename) {
      var file_name_parts = filename.split(".");
      var name = file_name_parts[0];
      var ext = file_name_parts[1];

      if (ext == "ames") {// TO DO: load an ames file
      }

      if (ext == "svg") {
        project.importSVG(filename, {
          onError: function onError() {
            console.log("Error: unable to import svg file.");
          },
          onLoad: function onLoad(i, s) {
            console.log(i, s);
            i.visible = true; // create new artwork type to support
          }
        });
      }
    }
  }, {
    key: "show_ux",
    value: function show_ux(bool) {
      for (var i in this.objs) {
        if (this.objs[i].is_transformation) {
          this.objs[i].toggle_show_tf({
            'deactivate': true
          });
        }
      }

      for (var idx in this.ux) {
        this.ux[idx].visible = bool;
      }
    } // import_icon: imports *.svg from local dir ../svg/

  }, {
    key: "import_icons",
    value: function import_icons() {
      var icons = ["eye", "eye-slash", "trash", "caret-down", "caret-right", "position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "close", "link", "link-remove", "path", "play", "axes", "brush", "pause", "rewind", "loop", "arrow", "dotted-circle", "dotted-square", "vector-pen", "card-list", "nsides", "asterisk", "plus", "arrow-right"];

      for (var idx in icons) {
        this.import_icon(icons[idx]);
      }
    } // import_icon: import_icon helper for formatting and storage

  }, {
    key: "import_icon",
    value: function import_icon(n) {
      project.importSVG('../svg/' + n + '.svg', function (i, s) {
        i.visible = false;
        i.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        i.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        i.strokeWidth = 0.5;
        i.scaling = 0.65;
        ames.icons[n] = i.clone();
        if (n == 'caret-down' || n == 'caret-right') ames.icon_caret(n);
        if (n == 'dotted-circle') ames.toolbar.create_tool_btn('Circle', n);
        if (n == 'dotted-square') ames.toolbar.create_tool_btn('Square', n);
        if (n == 'vector-pen') ames.toolbar.create_tool_btn('Path', n);
        if (n == 'card-list') ames.toolbar.create_tool_btn('Collection', n);
        if (n == 'asterisk') ames.toolbar.create_tool_btn('Transformation', n);
      });
    } // icon_caret: use caret to expand & contract layers controls

  }, {
    key: "icon_caret",
    value: function icon_caret(i_name) {
      var _this3 = this;

      ames.sidebar.add_caret(i_name); // CHANGE - Delete everything below this line

      var by = _utils.AMES_Utils.LAYER_HEIGHT;

      var _loop = function _loop(idx) {
        var n = _utils.AMES_Utils.L_CONTROLS[idx];
        var box = ames.obj_boxes[n];

        var caret = _this3.icons[i_name].clone();

        var caret_w = caret.bounds.width;
        var box_y = box.position.y;
        var caret_p = new Point(caret_w / 2 + _utils.AMES_Utils.ICON_OFFSET, box_y + 1);
        caret.position = caret_p;
        var expand_idx = _utils.AMES_Utils.L_EXPAND_IDX;
        var collapse_idx = _utils.AMES_Utils.L_CONTRACT_IDX;

        if (i_name == 'caret-right') {
          box.insertChild(expand_idx, caret);
          caret.visible = true;

          caret.onClick = function (e) {
            _this3.expand_layers(n, true);

            caret.visible = false;
            box.children[collapse_idx].visible = true;
          };
        }

        if (i_name == 'caret-down') {
          box.insertChild(collapse_idx, caret);
          caret.visible = false;

          caret.onClick = function (e) {
            _this3.expand_layers(n, false);

            caret.visible = false;
            box.children[expand_idx].visible = true;
          };
        }
      };

      for (var idx in _utils.AMES_Utils.L_CONTROLS) {
        _loop(idx);
      }
    } // expand_layers: expand & contract helpers to control layers view

  }, {
    key: "expand_layers",
    value: function expand_layers(t_obj, bool) {
      // adjust caret if necessary
      var control_box = this.obj_boxes[t_obj];
      var expand_idx = _utils.AMES_Utils.L_EXPAND_IDX;
      var collapse_idx = _utils.AMES_Utils.L_CONTRACT_IDX;
      var adjust_pos = true; // If already expanded / contracted, return

      if (control_box.children[expand_idx].visible == !bool) return;

      if (bool) {
        // If expanding, show contract caret
        control_box.children[collapse_idx].visible = true;
        control_box.children[expand_idx].visible = false;
      } else {
        // If contracting, show expand caret
        control_box.children[collapse_idx].visible = false;
        control_box.children[expand_idx].visible = true;
      } // Determine start and end indices to collapse


      var start_idx = 1;
      var end_idx = 1;

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[0]) {
        end_idx = this.l_shape_idx;
      }

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[1]) {
        start_idx = 1 + this.l_shape_idx;
        end_idx = this.l_shape_idx + this.l_list_idx;
      }

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[2]) {
        start_idx = 1 + this.l_shape_idx + this.list_idx;
        end_idx = this.l_shape_idx + this.l_list_idx + this.l_aobjs_idx;
      }

      var count = end_idx - start_idx; // Show or hide

      for (var i = start_idx; i < end_idx; i++) {
        var n = this.idx_boxes[i];
        var box = this.obj_boxes[n];
        box.visible = bool;
      } // Adjust position of subsequent boxes


      var by = _utils.AMES_Utils.LAYER_HEIGHT;
      var n_boxes = this.idx_boxes.length;

      for (var _i = end_idx; _i < n_boxes; _i++) {
        var _n = this.idx_boxes[_i];
        var _box = this.obj_boxes[_n];

        if (bool) {
          // Expand
          _box.position.y += count * (by + .5);
        } else {
          // Contract
          _box.position.y -= count * (by + .5);
        }
      }
    } // DELETE - old code

  }, {
    key: "init_controls",
    value: function init_controls(controls) {
      // Import & set-up control over play, pause & loop buttons
      // nb: loading 24 x 24 px icons
      var i_off = 12;
      var w = view.size._width;
      project.importSVG('../svg/ames-i-play.svg', function (i, s) {
        var play_btn = i._children[1];

        play_btn.onClick = function (e) {
          ames.play();
        };
      });
      project.importSVG('../svg/ames-i-play.svg', function (i, s) {
        i.position = new Point(3 * i_off, i_off);
        var pause_btn = i._children[1];

        pause_btn.onClick = function (e) {
          ames.pause();
        };
      });
      project.importSVG('../svg/ames-i-play.svg', function (i, s) {
        i.position = new Point(5 * i_off, i_off);
        var loop_btn = i._children[1];

        loop_btn.onClick = function (e) {
          ames.loop();
        };
      }); // Create scrubber

      var timeline = new Path.Line(new Point(6 * i_off + i_off / 2, i_off), new Point(w - i_off / 2, i_off));
      timeline.strokeColor = 'grey';
      var min_scrub = 6 * i_off + i_off / 2 + 4;
      var max_scrub = w - i_off / 2 - 4;
      var scrubber = new Path.Circle(new Point(min_scrub, 12), 4);
      scrubber.fillColor = 'lightgrey';
      scrubber.strokeColor = 'grey'; // Allow the user to change the system time by moving the scrubber

      scrubber.onMouseDrag = function (e) {
        var new_x = scrubber.position.x + e.delta.x;

        if (new_x > min_scrub && new_x < max_scrub) {
          scrubber.position.x = new_x;
          ames.set_time(ames.get_time_from_scrubber());
        }
      };

      scrubber.onMouseUp = function (e) {
        ames.set_time(ames.get_time_from_scrubber());
      }; // Update the position of the scrubber as the animation progresses


      scrubber.onFrame = function (e) {
        scrubber.position.x = ames.update_scrubber_to_time();
      };

      this.scrubber = scrubber;
      this.controls_view = view;
      this.min_sc = min_scrub;
      this.max_sc = max_scrub;

      this.controls_view.onClick = function (e) {// this._project.activate();
      };
    }
  }, {
    key: "init_layers",
    value: function init_layers() {
      this.layers_view = view;

      this.layers_view.onClick = function (e) {// this._project.activate();
      };
    }
  }, {
    key: "setup_layers",
    value: function setup_layers() {
      // Add control boxes for shapes, lists, animations
      var controls = _utils.AMES_Utils.L_CONTROLS;
      var w = 250; // CHANGE

      for (var i in controls) {
        var c_name = controls[i]; // Create box with dropdown control

        var box = new Group();
        box.position = new Point(0, 0);
        var by = _utils.AMES_Utils.LAYER_HEIGHT; // Background rectangle

        var rect = new Shape.Rectangle({
          point: [0, 0],
          size: [w, by],
          strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          strokeWidth: 1,
          fillColor: _utils.AMES_Utils.INACTIVE_DARK_COLOR,
          opacity: 1
        }); // Object name

        var n_text = new PointText({
          point: [20, by / 2 + 5],
          content: c_name,
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: 10
        }); // Contract glyph

        box.addChild(rect);
        box.addChild(n_text);
        box.visible = true; // box.addChild(caret_r);
        // box.addChild(caret_d);
        // Adjust position of box

        var n_boxes = ames.idx_boxes.length;
        var ny = n_boxes * by + by / 2 + n_boxes * .5;
        box.position = new Point(w / 2, ny); // Add box to ames controls

        this.idx_boxes[n_boxes] = c_name;
        this.obj_boxes[c_name] = box;
      }
    }
  }, {
    key: "init_canvas",
    value: function init_canvas(canvas) {
      this.canvas_view = view;
      var frame_trigger_dur = 1 / ames.fps;
      var eps = frame_trigger_dur / 10;
      var trigger_frame = true;
      ames.t_delta = 0;

      this.canvas_view.onFrame = function (e) {
        // If playing...
        if (ames.is_playing) {
          // If reset time is true, time should be set to 0
          if (ames.reset_time) {
            ames.time = 0;
            trigger_frame = true;
            ames.reset_time = false;
          } // Calculate progression based on elapsed time and duration


          ames.t_delta += e.delta; // If complete, complete the animation and either stop or loop

          if (ames.time + (ames.t_delta - eps) / ames.dur >= 1) {
            ames.t_delta = (1 - ames.time) * ames.dur;
            ames.time = 1; // If not looping, stop the animation

            if (!ames.is_looping) {
              ames.is_playing = false;
            } else {
              ames.reset_time = true;
            }
          } // If sufficient time has elapsed to trigger a frame, update time


          if (ames.t_delta >= frame_trigger_dur - eps) {
            ames.time += ames.t_delta / ames.dur;
            trigger_frame = true;
          }

          if (trigger_frame) {
            ames.update_animations();
            trigger_frame = false;
            ames.t_delta = 0;
          }
        }
      };
    }
  }, {
    key: "create_color_picker",
    value: function create_color_picker() {
      // ames.layers_view._project.activate();
      var colorwheel = new Raster('colorwheel'); // ames.canvas_view._project.activate();

      colorwheel.on('load', function () {
        // ames.layers_view._project.activate();
        colorwheel.scaling = 0.18;
        ames.colorwheel = colorwheel; // Create color picker

        var colorpicker = new Group();
        var cpicker_origin = new Point(200, 200);
        colorpicker.position = cpicker_origin; // Create symbol from color wheel raster

        var cwheel = new SymbolItem(ames.colorwheel, view.center);
        cwheel.position = colorpicker.position;

        var get_colorpicker_drift = function get_colorpicker_drift() {
          return colorpicker.position.subtract(cpicker_origin);
        }; // Create color swatch


        var r_dim = 100;
        var r = new Path.Rectangle({
          position: colorpicker.position,
          size: new Size(r_dim, r_dim),
          radius: 2.5
        });
        r.position = colorpicker.position.add(new Point(140, -12));
        r.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        r.fillColor = 'white';
        var cname = new PointText({
          point: [0, 0],
          content: r.fillColor.toCSS(true),
          fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE
        });

        var get_bound = function get_bound(isStart) {
          var p = r.position;
          if (isStart) return p.x - r_dim / 2;else return p.x + r_dim / 2;
        }; // Set position of color name above swatch


        var c_x = r.position.x + r.bounds.width / 2 - cname.bounds.width;
        var c_y = r.position.y - r.bounds.height / 2 - 2 * _utils.AMES_Utils.ICON_OFFSET;
        cname.position = new Point(c_x, c_y); // start and end points of sliders

        var start = r.position.x - r.bounds.width / 2;
        var end = r.position.x + r.bounds.width / 2; // utility function to make slider

        var make_slider = function make_slider(y, label_text, cb, dot_start) {
          var slider = new Path.Line({
            from: [start, y + 2 * _utils.AMES_Utils.ICON_OFFSET],
            to: [end, y + 2 * _utils.AMES_Utils.ICON_OFFSET],
            strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR
          });

          var dot = _utils.AMES_Utils.make_dot(new Point(dot_start, y + 2 * _utils.AMES_Utils.ICON_OFFSET), null, 4);

          dot.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;

          dot.onMouseDrag = function (e) {
            // define function for start / end based on colorpicker position
            // or colorpicker position drift
            var range_s = get_bound(true);
            var range_e = get_bound(false);

            if (e.point.x >= range_s && e.point.x <= range_e) {
              dot.position.x = e.point.x;
              cb(e.point);
            }

            ;
          };

          var label = new PointText({
            point: [start, y + 0.25 * _utils.AMES_Utils.ICON_OFFSET],
            content: label_text,
            fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
            fontFamily: _utils.AMES_Utils.FONT,
            fontSize: _utils.AMES_Utils.FONT_SIZE
          });
          return [dot, slider, label];
        }; // Make alpha slider & define function to calculate alpha


        var alpha_y = r.position.y + r.bounds.height / 2 + 3.5 * _utils.AMES_Utils.ICON_OFFSET;

        var get_slider_value = function get_slider_value(p) {
          var range_s = get_bound(true);
          return (p.x - range_s) / r.bounds.width;
        };

        var update_dot_x = function update_dot_x(v, dot) {
          var range_s = get_bound(true);
          dot.position.x = v * r.bounds.width + range_s;
        };

        var set_alpha = function set_alpha(p) {
          r.fillColor.alpha = get_slider_value(p);
          cname.content = r.fillColor.toCSS(true); // Update color of color target if any

          if (ames.colorpicker.color_target) {
            ames.colorpicker.color_target(r.fillColor);
          }
        };

        var alpha = make_slider(alpha_y, 'alpha', set_alpha, end);
        var alpha_dot = alpha[0];
        var alpha_slider = alpha[1];
        var alpha_label = alpha[2]; // Make lightness slider & define function to set lightness

        var lightness_y = alpha_y + 5.5 * _utils.AMES_Utils.ICON_OFFSET;

        var set_lightness = function set_lightness(p) {
          var v = get_slider_value(p);
          r.fillColor.brightness = v;
          cname.content = r.fillColor.toCSS(true);
          gwheel.fillColor.opacity = 1 - v;
          gwheel.opacity = 1 - v; // Update color of color target if any

          if (ames.colorpicker.color_target) {
            ames.colorpicker.color_target(r.fillColor);
          }
        };

        var lightness = make_slider(lightness_y, 'brightness', set_lightness, end);
        var lightness_dot = lightness[0];
        var lightness_slider = lightness[1];
        var lightness_label = lightness[2]; // Color wheel radius is 65

        var radius = 65;
        var gwheel = new Path.Circle({
          center: [cwheel.position.x, cwheel.position.y - 1],
          radius: 66,
          fillColor: 'black',
          opacity: 0
        });

        gwheel.onClick = function (e) {
          // Calculate relative pixel position
          // Note: account for scale factor of colorwheel
          var offset = e.point.subtract(cwheel.bounds.topLeft).multiply(5); // radius is 70

          var e_rad = e.point.getDistance(cwheel.position);

          if (e_rad < radius) {
            var color = ames.colorwheel.getPixel(offset);
            var v = 0;
            if (gwheel.fillColor.opacity) v = gwheel.fillColor.opacity;
            color.brightness = 1 - v; // console.log(color.saturation);

            color.alpha = get_slider_value(alpha_dot.position); // color.lightness = get_slider_value(lightness_dot.position);

            var range_s = get_bound(true);
            r.fillColor = color;
            cname.content = color.toCSS(true); // Set color of color target if any

            if (ames.colorpicker.color_target) {
              ames.colorpicker.color_target(color);
            }
          }
        };

        colorpicker.load_color = function (c) {
          if (!c) c = new Color(_utils.AMES_Utils.INACTIVE_COLOR); // update swatch

          r.fillColor = c; // update color label

          cname.content = r.fillColor.toCSS(true); // update alpha slider dot

          update_dot_x(c.alpha, alpha_dot); // match colorwheel brightness

          var v = c.brightness;
          gwheel.fillColor.opacity = 1 - v;
          gwheel.opacity = 1 - v; // update lightness slider dot

          update_dot_x(v, lightness_dot);
        };

        colorpicker.addChildren([r, cwheel, cname, gwheel]);
        colorpicker.addChildren([alpha_dot, alpha_slider, alpha_label]);
        colorpicker.addChildren([lightness_dot, lightness_slider, lightness_label]); // close icon and surrounding box

        var get_position = function get_position(e) {
          var x = ames.sidebar.position.x - _utils.AMES_Utils.OFFSET * 2;
          var y = ames.sidebar.bounds.topLeft.y + .85 * colorpicker.bounds.height;
          return new Point(x, y);
        }; // Make colorpicker draggable
        // let dragging = false;
        // let drag_offset = 0;
        // colorpicker.onMouseDown = (e) => {
        // 	let n_children = colorpicker.children.length;
        // 	for (let idx = 1; idx < n_children; idx++) {
        // 		let c = colorpicker.children[idx];
        // 		if (c.contains(e.point)) {
        // 			dragging = false;
        // 			return;
        // 		}
        // 	}
        // 	drag_offset = e.point.subtract(colorpicker.position);
        // 	dragging = true;
        // }
        // colorpicker.onMouseDrag = (e) => {
        // 	if (dragging) colorpicker.position = e.point.subtract(drag_offset);
        // }
        // colorpicker.onMouseUp = (e) => {
        // 	if (dragging) dragging = false;
        // }
        // utils.make_dot(ames.canvas_view.center);


        colorpicker.position = get_position();
        ames.sidebar.addChild(colorpicker);
        ames.colorpicker = colorpicker;
        ames.ux.push(colorpicker); // ames.colorpicker.visible = false;
        // this.canvas_view._project.activate();
      }); // ames.canvas_view._project.activate();
    }
  }, {
    key: "adjust_t_delta",
    value: function adjust_t_delta() {
      var x = this.time * this.dur * this.fps;
      this.t_delta = (x - Math.floor(x)) * 1 / this.fps;
    }
  }, {
    key: "update_animations",
    value: function update_animations() {// Takes this.time and updates the animations accordingly
    }
  }, {
    key: "play",
    value: function play() {
      // Start playing and reset system time
      if (!this.is_playing) {
        if (ames.time != 0) this.adjust_t_delta();
        this.is_playing = true;
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      var _this4 = this;

      this.is_playing = false; // Pause animations

      var _loop2 = function _loop2(k) {
        var a = _this4.animations[k];
        a.curr_tw.stop();
        setTimeout(function () {
          a.curr_tw.start();
          a.curr_tw.update(.2);
        }, 500); // a.curr_tw.object.opacity = 1;
      };

      for (var k in this.animations) {
        _loop2(k);
      }
    }
  }, {
    key: "example",
    value: function example(str) {
      if (str == "ngon") this.ngon();
      if (str == "starfield") this.starfield();
    }
  }, {
    key: "starfield",
    value: function starfield(step) {
      if (step == null) step = 5;
      console.log("---AMES STARFIELD EXAMPLE LOG---------------------------");

      if (step == -1) {
        var line1 = new _artwork.AMES_Artwork_Path();
        var line2 = new _artwork.AMES_Artwork_Path();
        line1.add_points([new Point(75, 100), new Point(75, 90)]);
        line2.add_points([new Point(100, 100), new Point(100, 110)]);

        var _lines_perturb = new _collection.AMES_Collection([line1, line2]);
      }

      var lines_collection;

      if (step == 0) {
        var _line = new _artwork.AMES_Artwork_Path();

        var _line2 = new _artwork.AMES_Artwork_Path();

        _line.add_points([new Point(75, 100), new Point(75, 90)]);

        _line2.add_points([new Point(100, 100), new Point(100, 110)]);

        lines_collection = new _collection.AMES_Collection([_line, _line2]);
      } // if (step != 5) project.activeLayer.removeChildren();


      var oct;

      if (step >= 0) {
        oct = new _artwork.AMES_Polygon({
          "nsides": 12
        });
        oct.poly.strokeColor = "silver";
        oct.poly.fillColor = "black";
        oct.poly.scaling = 0.8;
        oct.poly.strokeWidth = 2;
      }

      var poly_collection;

      if (step >= 1) {
        poly_collection = new _collection.AMES_Collection([oct]);
        poly_collection.set_count(12);
      }

      var tf_position;
      var line_position;

      if (step >= 2) {
        line_position = new _artwork.AMES_Artwork_Path();
        line_position.add_points([new Point(300, 550), new Point(1050, 50)]);
        tf_position = new _transformation.AMES_Transformation({
          "input": line_position,
          "target": poly_collection,
          "mapping": "position"
        });
        tf_position.transform();
        poly_collection.show_box(false);
      }

      var tf_point_perturb;
      var lines_perturb;

      if (step >= 3) {
        var _line3 = new _artwork.AMES_Artwork_Path();

        var _line4 = new _artwork.AMES_Artwork_Path();

        _line3.add_points([new Point(75, 100), new Point(75, 90)]);

        _line4.add_points([new Point(100, 100), new Point(100, 110)]);

        lines_perturb = new _collection.AMES_Collection([_line3, _line4]);
        tf_point_perturb = new _transformation.AMES_Transformation({
          "input": lines_perturb,
          "target": poly_collection
        });
        tf_point_perturb.set_mapping({
          "type": "Vertex",
          "mapping": "relative position"
        });
        tf_point_perturb.set_mapping_behavior("alternate");
        tf_point_perturb.tf_space_absolute = false;
        tf_position.show_tf_space(false);
        line_position.poly.visible = false;
        if (step == 3) tf_point_perturb.transform();
      }

      var tf_nsides;

      if (step >= 4) {
        // let line_nsides = new AMES_Artwork_Path();
        // line_nsides.add_points([new Point(50, 300), new Point(150, 200)]);
        // tf_nsides = new AMES_Transformation();
        // tf_nsides.set_target(poly_collection);
        // tf_nsides.set_input(line_nsides);
        // tf_nsides.set_mapping({"type": "Polygon", "mapping": "number of sides"});
        // tf_nsides.set_tf_space({"my1": 10, "my2": 28});
        // tf_nsides.show_tf_space(true);
        // tf_nsides.transform();
        tf_point_perturb.transform();
      }

      var tf_point_perturb_animation; // let lines_perturb_animated;

      if (step >= 5) {
        // let line1 = new AMES_Artwork_Path();
        // let line2 = new AMES_Artwork_Path();
        // line1.add_points([new Point(275, 100), new Point(275, 95)]);
        // line2.add_points([new Point(300, 100), new Point(300, 105)]);
        // lines_perturb_animated = new AMES_Collection([line1, line2]);
        tf_point_perturb_animation = new _transformation.AMES_Transformation({
          "input": lines_perturb,
          "target": poly_collection,
          "mapping": {
            "type": "Vertex",
            "mapping": "relative animation"
          }
        });
        tf_point_perturb_animation.set_mapping_behavior("alternate");
        tf_point_perturb_animation.tf_space_absolute = false; // tf_point_perturb_animation.tf_space_path_nsegments = 250;
        // tf_point_perturb_animation.tf_space_speed_factor = 1;
        // tf_point_perturb_animation.loop_max_count = 1;
        // tf_point_perturb_animation.loop = true;

        tf_point_perturb.show_tf_space(false);
        if (step == 5) tf_point_perturb_animation.transform();
      }

      if (step >= 6) {
        var playback_loop1 = new _artwork.AMES_Ellipse({
          "centroid": new Point(200, 150),
          "rx": 25,
          "ry": 25
        }); // let playback_loop2 = new AMES_Ellipse({"centroid": new Point(200, 150), "rx": 50, "ry": 25});
        // let playback_loop_collection = new AMES_Collection([playback_loop1, playback_loop2])

        var tf_playback = new _transformation.AMES_Transformation({
          "input": playback_loop1,
          "target": tf_point_perturb_animation,
          "mapping": {
            "type": "Transformation",
            "mapping": "playback"
          }
        });
        tf_playback.tf_space_path_nsegments = 10; // tf_playback.loop_max_count = 10;

        tf_playback.loop = true; // if (step == 6) tf_point_perturb_animation.transform();
        // if (step >= 6) tf_playback.transform();
      }
    }
  }, {
    key: "ngon",
    value: function ngon(step) {
      if (step == null) step = 15;
      console.log("---AMES NGON EXAMPLE LOG--------------------------------"); // for example walkthrough - strips all other

      project.activeLayer.removeChildren();
      var tri;

      if (step >= 0) {
        // Create polygon collection
        tri = new _artwork.AMES_Polygon();
        tri.poly.strokeWidth = 2;
      }

      var poly_collection;

      if (step >= 1) {
        poly_collection = new _collection.AMES_Collection([tri]);
        poly_collection.set_count(6);
      }

      var dot;
      var dot_collection;

      if (step >= 2) {
        // Create dot collection
        dot = new _artwork.AMES_Ellipse({
          r: 5
        });
        dot.poly.strokeWidth = 3;
        dot_collection = new _collection.AMES_Collection([dot]);
        dot_collection.set_count(6);
      }

      var tf_motion_path;

      if (step >= 3) {
        // Create motion path transformation function
        tf_motion_path = new _transformation.AMES_Transformation({
          "input": poly_collection,
          "target": dot_collection,
          "mapping": "motion path"
        }); // tf_motion_path.tf_space_speed_factor = 1;

        if (step == 3) tf_motion_path.transform();

        if (step > 3) {
          dot_collection.align();
          poly_collection.align();
          tf_motion_path.show_tf_space(false);
          dot_collection.show_box(false);
          poly_collection.show_box(false);
        }
      }

      var line2;
      var tf_scale_tri;

      if (step >= 4) {
        // Create static scaling transformation function using a line
        line2 = new _artwork.AMES_Artwork_Path();
        line2.add_points([new Point(100, 450), new Point(200, 350)]); // line2.add_points([new Point(100, 450), new Point(200, 250)]);
        // line2.add_points([new Point(100, 300), new Point(200, 250)]);

        tf_scale_tri = new _transformation.AMES_Transformation({
          "input": line2,
          "target": poly_collection,
          "mapping": "static scale"
        });
        tf_scale_tri.tf_my1 = 1;
        tf_scale_tri.tf_my2 = 3;
        tf_scale_tri.transform();
        if (step == 4) tf_motion_path.transform();
      }

      var line1;
      var tf_nsides_tri;

      if (step >= 5) {
        // Create number of sides transformation function using a line
        line1 = new _artwork.AMES_Artwork_Path();
        line1.add_points([new Point(100, 200), new Point(200, 100)]);
        tf_nsides_tri = new _transformation.AMES_Transformation();
        tf_nsides_tri.set_target(poly_collection);
        tf_nsides_tri.set_input(line1);
        tf_nsides_tri.set_mapping({
          "type": "Polygon",
          "mapping": "number of sides"
        });
        tf_nsides_tri.transform();
        if (step == 5) tf_motion_path.transform();
      }

      if (step >= 6) {
        // tf_motion_path.tf_space_speed_factor = 1;
        // tf_motion_path.tf_space_speed = tf_motion_path.SPEED_LINEAR;
        if (step == 6) tf_motion_path.transform();
      }

      var line3;
      var tf_duplicate_dots;

      if (step >= 7) {
        line3 = new _artwork.AMES_Artwork_Path();
        line3.add_points([new Point(100, 550), new Point(100, 545)]);
        tf_duplicate_dots = new _transformation.AMES_Transformation({
          "input": line3,
          "target": dot_collection,
          "mapping": "duplicate each"
        });
        tf_duplicate_dots.loop = false;
        tf_motion_path.use_playback_points_to_trigger_transformation({
          "tf": tf_duplicate_dots,
          "condition": "slope change"
        });
        if (step == 7) tf_motion_path.transform();
      }

      var circle;
      var quick_flare;
      var tf_scale_dots;

      if (step >= 8) {
        // Create scaling animation using a cirlce in image space (ease in and out)
        circle = new _artwork.AMES_Ellipse({
          "centroid": new Point(325, 150),
          "r": 10
        });
        quick_flare = new _artwork.AMES_Artwork_Path();
        quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);
        tf_scale_dots = new _transformation.AMES_Transformation({
          "input": circle,
          "target": dot_collection,
          "mapping": "scale animation"
        });
        tf_scale_dots.loop = false;
        tf_scale_dots.tf_space_path_nsegments = 100; // tf_scale_dots.tf_space_speed = tf_scale_dots.SPEED_XAXIS;

        tf_duplicate_dots.use_playback_points_to_trigger_transformation({
          "tf": tf_scale_dots,
          "condition": "new instance"
        });
        if (step == 8) tf_motion_path.transform();
      }

      if (step >= 9) {
        tf_scale_dots.use_playback_points_to_trigger_transformation({
          "tf": "remove",
          "condition": "end"
        });
        tf_motion_path.loop = true;
        if (step == 9) tf_motion_path.transform();
      }

      if (step >= 10) {
        // Create hue transformation function
        var line0 = new _artwork.AMES_Artwork_Path();
        line0.add_points([new Point(275, 350), new Point(375, 275)]);
        var tf_hue_dots = new _transformation.AMES_Transformation({
          "input": line0,
          "target": dot_collection,
          "mapping": "hue"
        });
        tf_hue_dots.transform();
        var tf_hue_poly = new _transformation.AMES_Transformation({
          "input": line0,
          "target": poly_collection,
          "mapping": "hue"
        });
        tf_hue_poly.transform();
        tf_motion_path.transform();
      }

      if (step == -1) {
        // Create scaling animation demo pt 1
        var p1 = new _artwork.AMES_Ellipse({
          "centroid": ames.canvas_view.center,
          "r": 25
        });
        p1.poly.fillColor = "pink";
        p1.poly.position = p1.poly.position.subtract(400, 0);
        p1.poly.strokeWidth = 0;
        circle = new _artwork.AMES_Ellipse({
          "centroid": new Point(325, 150),
          "r": 50
        });
        circle.poly.strokeColor = "pink";
        var tf_scale_test1 = new _transformation.AMES_Transformation({
          "input": circle,
          "target": p1,
          "mapping": "scale animation"
        });
        tf_scale_test1.tf_space_path_nsegments = 100;
        tf_scale_test1.transform();
      }

      if (step == -2) {
        // Create scaling animation demo pt 2
        var p2 = new _artwork.AMES_Ellipse({
          "centroid": ames.canvas_view.center,
          "r": 25
        });
        p2.poly.fillColor = "orange";
        p2.poly.position = p2.poly.position.add(400, 0);
        p2.poly.strokeWidth = 0;
        quick_flare = new _artwork.AMES_Artwork_Path();
        quick_flare.poly.strokeColor = "orange";
        quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);
        var tf_scale_test2 = new _transformation.AMES_Transformation({
          "input": quick_flare,
          "target": p2,
          "mapping": "scale animation"
        });
        tf_scale_test2.tf_space_path_nsegments = 100;
        tf_scale_test2.transform();
      }

      if (step == -3) {
        // Create scaling animation using a cirlce in image space (ease in and out)
        var _p = new _artwork.AMES_Ellipse({
          "centroid": ames.canvas_view.center,
          "r": 25
        });

        _p.poly.fillColor = "pink";
        _p.poly.position = _p.poly.position.subtract(400, 0);
        _p.poly.strokeWidth = 0;

        var _p2 = new _artwork.AMES_Ellipse({
          "centroid": ames.canvas_view.center,
          "r": 25
        });

        _p2.poly.fillColor = "orange";
        _p2.poly.position = _p2.poly.position.add(400, 0);
        _p2.poly.strokeWidth = 0;
        circle = new _artwork.AMES_Ellipse({
          "centroid": new Point(325, 150),
          "r": 50
        });
        circle.poly.strokeColor = "pink";
        quick_flare = new _artwork.AMES_Artwork_Path();
        quick_flare.poly.strokeColor = "orange";
        quick_flare.add_points([new Point(325, 200), new Point(325, 100), new Point(275, 100), new Point(325, 200)]);

        var _tf_scale_test = new _transformation.AMES_Transformation({
          "input": circle,
          "target": _p,
          "mapping": "scale animation"
        });

        var _tf_scale_test2 = new _transformation.AMES_Transformation({
          "input": quick_flare,
          "target": _p2,
          "mapping": "scale animation"
        });

        _tf_scale_test.tf_space_path_nsegments = 100;
        _tf_scale_test2.tf_space_path_nsegments = 100;

        _tf_scale_test.transform();

        _tf_scale_test2.transform();
      }
    } // add_shape: adds given object as a shape

  }, {
    key: "add_shape",
    value: function add_shape(x) {
      x.create_control_shapes();
      x.poly.fillColor = new Color({
        hue: 90,
        brightness: 1,
        saturation: 0,
        alpha: 1
      });
      if (x.poly.fillColor) x.poly.fillColor.brightness = 1;
      this.expand_layers(_utils.AMES_Utils.L_CONTROLS[0], true);
      this.n_shapes += 1;
      var n_shape = this.n_shapes - 1;
      x.name = "Shape " + n_shape + " (" + x.get_type() + ")";
      x.editor = new _editors.AMES_Shape_Editor(x);
      this.add_obj(x, _utils.AMES_Utils.L_CONTROLS[0]);
    } // add_list: adds given object as a list

  }, {
    key: "add_list",
    value: function add_list(x) {
      this.n_lists += 1; // let n_list = this.n_lists - 1;
      // x.name = "List " + n_list;
      // console.log("list name set to", x.name);

      x.editor = new AMES_List_Editor(x);
      this.add_obj(x, _utils.AMES_Utils.L_CONTROLS[1]);
      x.show(true);
      this.lists[x.name] = x;
    }
  }, {
    key: "add_animation",
    value: function add_animation(x) {
      this.n_aobjs += 1; // x.editor = new AMES_Animation_Editor(x);

      this.add_obj(x, _utils.AMES_Utils.L_CONTROLS[2]);
      this.aobjs[x.name] = x;
    }
  }, {
    key: "hide_editors",
    value: function hide_editors(obj, force) {
      obj = obj || {};

      for (var i in this.objs) {
        if (this.objs[i].name != obj.name) {
          if (force) {
            this.objs[i].editor.show(false);

            this.objs[i]._clear_cb_helpers();
          } else {
            if (!(obj.is_artwork && this.objs[i].is_collection && this.objs[i].has_shape(obj))) {
              this.objs[i].editor.show(false);

              this.objs[i]._clear_cb_helpers();
            }
          }
        }
      } // ames.colorpicker.visible = false;
      // if (obj.active_prop == 'strokeColor' || obj.active_prop == 'fillColor') ames.colorpicker.visible = true;

    }
  }, {
    key: "update_layers",
    value: function update_layers(opt) {
      opt = opt || {};
      var box;
      if (opt.box) box = opt.box;else return; // Insert box into layers box

      if (opt.insert) {
        this.layers.insertChild(0, box);
        box.sendToBack();
      } // Delete box from layers box


      if (opt.remove) {
        var idx = box.index;
        this.layers.removeChildren(idx, idx + 1);
      } // Parent box to another box (change order of boxes)


      if (opt.parent) {// let parent_idx = opt.parent_box.index;
        // console.log(box);
        // let box_idx = box.index;
        // box.children[1].content = '    ' + box.children[1].content;
        // this.layers.removeChildren(box_idx, box_idx+1);
        // this.layers.insertChild(parent_idx, box);
        // let str = "";
        // for (let i in this.layers.children) {
        // 	str += this.layers.children[i].children[1].content
        // }
        // console.log("layers: ", str);
      } // TO DO: Keep all transformation functions without a target at the top
      // Update view for layers box


      this.layers.sendToBack();
      var nchildren = this.layers.children.length;

      for (var i = 0; i < nchildren; i++) {
        var lbox = this.layers.children[i];
        lbox.position.x = ames.sidebar.position.x - _utils.AMES_Utils.SCROLLBAR_WIDTH;
        lbox.position.y = i * lbox.bounds.height;
      }

      var layers_ypos = this.layers.scrollbar.top + this.layers.bounds.height / 2 + _utils.AMES_Utils.ICON_OFFSET / 2;
      this.layers.position = new Point(ames.sidebar.position.x - _utils.AMES_Utils.SCROLLBAR_WIDTH, layers_ypos);

      for (var _i2 = 0; _i2 < nchildren; _i2++) {
        var _lbox = this.layers.children[_i2];
        _lbox.visible = true;
        if (_lbox.position.y < this.layers.scrollbar.top) _lbox.visible = false;
        if (_lbox.position.y > this.layers.scrollbar.bottom) _lbox.visible = false;
      }

      var str = "";

      for (var _i3 in this.layers.children) {
        str += this.layers.children[_i3].children[1].content;
      }
    }
  }, {
    key: "create_layers_box",
    value: function create_layers_box(obj) {
      var obj_box = new Group();
      obj.obj_box = obj_box; // Create a box in the side panel

      var ypos = 450;
      var box = new Path.Rectangle({
        point: [500, 450],
        size: [_utils.AMES_Utils.SIDEBAR_WIDTH - 2 * _utils.AMES_Utils.SCROLLBAR_WIDTH, 20],
        // fillColor: "white",
        strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        radius: 3,
        strokeWidth: .75,
        position: [ames.sidebar.position.x - _utils.AMES_Utils.SCROLLBAR_WIDTH, ypos]
      }); // box.sendToBack();

      var box_label = new PointText({
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        visible: true,
        point: [box.position.x - _utils.AMES_Utils.SIDEBAR_WIDTH / 2 + 5 * _utils.AMES_Utils.ICON_OFFSET, box.position.y + _utils.AMES_Utils.ICON_OFFSET]
      });
      var name;

      obj_box.change_name = function () {
        name = obj.name;

        if (obj instanceof _transformation.AMES_Transformation) {
          var obj_name_parts = obj.name.split(" ");
          var mapping = obj.get_mapping();
          var input = "input";
          if (obj.input) input = obj.input.name;

          if (mapping) {
            mapping = mapping[0].toUpperCase() + mapping.substr(1);
            input = input[0].toUpperCase() + input.substr(1);
            name = obj.name + ": (" + input + ": " + mapping + ")";
          }
        }

        box_label.content = name;
      };

      obj_box.change_name(); // Remove btn to remove obj

      var trash = ames.icons['trash'].clone();
      var trash_w = trash.bounds.width;
      trash.scaling = .825;
      trash.visible = true;
      trash.position = new Point(box.position.x + box.bounds.width / 2 - trash_w, box.position.y);
      trash.bringToFront();

      trash.onClick = function (e) {
        obj.remove();
      };

      obj_box.addChildren([box, box_label, trash]); // Visibility btns to toggle visibility

      var eye = ames.icons['eye'].clone();
      var eye_slash = ames.icons['eye-slash'].clone();
      var eye_w = eye.bounds.width;
      eye.visible = true;
      eye_slash.visible = false;
      var eye_pos = new Point(trash.position.x - eye_w - _utils.AMES_Utils.ICON_OFFSET, box.position.y);
      eye.position = eye_pos;
      eye_slash.position = eye_pos;
      eye.bringToFront();
      eye_slash.bringToFront();

      eye.onClick = function (e) {
        eye.visible = false;
        eye_slash.visible = true;
        obj.show(false);
      };

      eye_slash.onClick = function (e) {
        eye_slash.visible = false;
        eye.visible = true;
        ames.hide_editors(obj, true);
        obj.show(true);
      };

      box_label.onClick = function (e) {
        ames.hide_editors(obj, true);
        obj.show(true);
        eye.visible = false;
        eye_slash.visible = true;
      };

      obj_box.addChildren([eye, eye_slash]);

      if (obj instanceof _transformation.AMES_Transformation) {
        // For a transformation toggle whether or not the transformation space is visible
        var axes = ames.icons['axes'].clone();
        var axes_w = axes.bounds.width;
        axes.position = new Point(eye_pos.x - axes_w - _utils.AMES_Utils.ICON_OFFSET, box.position.y);
        axes.active = obj.tf_space_visible;

        if (axes.active) {
          axes.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
          axes.fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
        }

        axes.onClick = function (e) {
          if (axes.active) {
            axes.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
            axes.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
            obj.toggle_show_tf({
              "deactivate": true
            });
            axes.active = false;
          } else {
            axes.strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
            axes.fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
            obj.toggle_show_tf();
            axes.active = true;
          }
        };

        axes.visible = true;
        axes.bringToFront();
        obj_box.addChild(axes);
      }

      this.update_layers({
        insert: true,
        box: obj_box
      });
      if (!this.obj_boxes_dict) this.obj_boxes_dict = {};
      this.obj_boxes_dict[obj.name] = obj_box;
    }
  }, {
    key: "add_obj",
    value: function add_obj(x, t_obj) {
      this.objs[x.name] = x; // Hide all open editors

      this.hide_editors(x);
      this.create_layers_box(x); // let n = x.name;
      // let box_idx;
      // if (t_obj == utils.L_CONTROLS[0]) {
      // 	box_idx = this.l_shape_idx;
      // 	this.l_shape_idx += 1;
      // }
      // if (t_obj == utils.L_CONTROLS[1]) {
      // 	// this.n_lists += 1;
      // 	// let n_list = this.n_lists - 1;
      // 	// n = "List " + n_list + " (" + x.get_name() + ") ";
      // 	box_idx = this.l_shape_idx + this.l_list_idx;
      // 	this.l_list_idx += 1;
      // }
      // if (t_obj == utils.L_CONTROLS[2]) {
      // 	box_idx = this.l_shape_idx + this.l_list_idx + this.l_aobj_idx;
      // 	this.l_aobj_idx += 1;
      // }
      //
      // // Add obj
      // this.objs[n] = x;
      //
      // // Create obj box in layers view
      //
      // // Activate layers project
      // let w = 250;
      //
      // // Create a new layers ui box
      // let box = new Group();
      // box.position = new Point(0,0);
      // let by = utils.LAYER_HEIGHT;
      // // Background rectangle
      // let rect = new Shape.Rectangle({
      // 	point: [0, 0],
      // 	size: [w, by],
      // 	strokeColor: utils.INACTIVE_S_COLOR,
      // 	strokeWidth: 1,
      // 	fillColor: utils.INACTIVE_DARK_COLOR,
      // 	opacity: 1
      // });
      // // Object name
      // let n_text = new PointText({
      // 	point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
      // 	content: n,
      // 	fillColor: utils.INACTIVE_S_COLOR,
      // 	fontFamily: utils.FONT,
      // 	fontSize: utils.FONT_SIZE
      // });
      //
      // // Remove icon
      // let trash = ames.icons['trash'].clone();
      // let trash_w = trash.bounds.width;
      // trash.visible = true;
      // trash.position = new Point(w-trash_w/2-utils.ICON_OFFSET, by/2);
      //
      // // Visibility icons
      // let eye = ames.icons['eye'].clone();
      // let eye_slash = ames.icons['eye-slash'].clone();
      // let eye_w = eye.bounds.width;
      // eye.visible = true;
      // eye_slash.visible = false;
      // let eye_pos = new Point(w-trash_w-eye_w/2-2*utils.ICON_OFFSET, by/2);
      // eye.position = eye_pos;
      // eye_slash.position = eye_pos;
      //
      // // Add children to box
      // box.addChild(rect);
      // box.addChild(n_text);
      // box.addChild(trash);
      // box.addChild(eye);
      // box.addChild(eye_slash);
      //
      // // Set active box to false
      // box.is_active_box = true;
      //
      // // Add box to ames controls
      // this.idx_boxes.splice(box_idx, 0, n);
      // this.obj_boxes[n] = box;
      // if (t_obj == utils.L_CONTROLS[2]) console.log("adding animation box?", box_idx, box);
      //
      // // Insert box & update the locations of the other boxes
      // let ny = box_idx*by + by/2 + box_idx*.5;
      // box.position = new Point(w/2, ny);
      // let n_boxes = this.idx_boxes.length;
      // for (let i = box_idx + 1; i < n_boxes; i++) {
      // 	let b_name = this.idx_boxes[i];
      // 	this.obj_boxes[b_name].position.y += (by+.5);
      // }
      //
      // // Click on layers obj box selects the object
      // box.onClick = (e) => {
      // 	// if the point is not a click on the children return .
      // 	for (let idx in box.children) {
      // 		if (idx != 0 && box.children[idx].bounds.contains(e.point)) return;
      // 	}
      // 	if (box.is_active_box) {
      // 		// deactivate object
      // 		this.deactivate_obj(n);
      // 		delete this.active_objs[n];
      // 	} else {
      // 		// activate object
      // 		this.activate_obj(n);
      // 		this.active_objs[n] = x;
      // 	}
      // 	box.is_active_box = !box.is_active_box;
      // };
      //
      // // Remove object on clicking the trash can
      // trash.onClick = (e) => {
      // 	// Box has to be active to delete an object
      // 	if (box.is_active_box) {
      // 		this.remove_obj(n, t_obj);
      // 	}
      // };
      //
      // // Toggle visibility on clicking the eye
      // eye.onClick = (e) => {
      // 	// Box has to be active to toggle visibility
      // 	if (!box.is_active_box) return;
      // 	eye.visible = false;
      // 	eye_slash.visible = true;
      // 	x.show(false);
      // 	// Remove from active objs until visible
      // 	delete this.active_objs[x.name];
      // }
      // eye_slash.onClick = (e) => {
      // 	// Box has to be active to toggle visibility
      // 	if (!box.is_active_box) return;
      // 	eye_slash.visible = false;
      // 	eye.visible = true;
      // 	x.show(true);
      // 	// Add back to active objs
      // 	// Remove from active objects
      // 	this.active_objs[x.name] = x;
      // }
      //
      // // start objects as active
      // this.activate_obj(n);
      // this.active_objs[n] = x;
    } // // active_obj: Activates layers box and enables object selection
    // activate_obj(n) {
    // 	let x = this.objs[n];
    // 	x.make_interactive(true);
    // 	x.show_editor(true);
    //
    // 	// // Activate layers box
    // 	// let box = this.obj_boxes[n];
    // 	// box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_COLOR;
    // 	// box.children[utils.L_IDX_BOX].strokeColor = utils.ACTIVE_S_COLOR;
    // 	// box.children[utils.L_IDX_NAME].fillColor = utils.ACTIVE_S_COLOR;
    // 	// for (let idx in utils.L_IDX_ICONS) {
    // 	// 	box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.ACTIVE_S_COLOR;
    // 	// }
    // }
    //
    // // deactivate_obj: Deactivates layers box and disables object selection
    // deactivate_obj(n) {
    // 	let x = this.objs[n];
    // 	x.make_interactive(false);
    // 	x.show_editor(false);
    //
    // 	// // Deactivate layers box
    // 	// let box = this.obj_boxes[n];
    // 	// box.children[utils.L_IDX_BOX].fillColor = utils.INACTIVE_DARK_COLOR;
    // 	// box.children[utils.L_IDX_BOX].strokeColor = utils.INACTIVE_S_COLOR;
    // 	// box.children[utils.L_IDX_NAME].fillColor = utils.INACTIVE_S_COLOR;
    // 	// for (let idx in utils.L_IDX_ICONS) {
    // 	// 	box.children[utils.L_IDX_ICONS[idx]].fillColor = utils.INACTIVE_S_COLOR;
    // 	// }
    // }

  }, {
    key: "remove_obj",
    value: function remove_obj(n, t_obj) {
      // Remove from objs in ames
      if (this.objs[n].is_list) {
        delete this.lists[n];
      }

      this.objs[n].show(false);
      this.objs[n].remove();
      delete this.objs[n]; // Remove from active objs if necessary

      if (this.active_objs[n]) {
        this.active_objs[n].remove();
        delete this.active_objs[n];
      }

      if (this.objs[n].is_list) {
        delete this.lists[n];
      } // Update length of entries for appropriate type of obj


      if (t_obj == _utils.AMES_Utils.L_CONTROLS[0]) this.l_shape_idx -= 1;
      if (t_obj == _utils.AMES_Utils.L_CONTROLS[1]) this.l_list_idx -= 1;
      if (t_obj == _utils.AMES_Utils.L_CONTROLS[2]) this.l_aobj_idx -= 1; // Remove layers box - first identify the correct box in the ordered list

      var idx = 0;

      for (var i in this.idx_boxes) {
        if (this.idx_boxes[i] === n) idx = i;
      } // Remove the old box


      this.idx_boxes.splice(idx, 1);
      this.obj_boxes[n].visible = false;
      delete this.obj_boxes[n]; // Then move up the other boxes

      var by = _utils.AMES_Utils.LAYER_HEIGHT;

      for (var _i4 = idx; _i4 < this.idx_boxes.length; _i4++) {
        var m = this.idx_boxes[_i4];
        var m_box = this.obj_boxes[m];
        var ny = _i4 * by + by / 2 + _i4 * .5;
        m_box.position = new Point(m_box.position.x, ny);
      }
    } // switch_shape_tool: toggles shape tool to enable drawing new shapes

  }, {
    key: "switch_tool",
    value: function switch_tool(opt) {
      opt = opt || {};
      var b = opt.b;

      if (ames.toolbar.active_btn == b || opt.deactivate) {
        if (b == 'Path') {
          this.tools[b].clean_tool(true);
        }

        ames.toolbar.deactivate_btn(b);
        ames.canvas.style.cursor = null;
        ames.toolbar.active_btn = null;
        this.tools['inactive_tool'].activate();
      } else {
        // Disable active shape button
        if (ames.toolbar.active_btn) {
          this.switch_tool({
            'b': ames.toolbar.active_btn,
            'deactivate': true
          });
        }

        ames.canvas.style.cursor = 'crosshair';
        this.active_shape_btn = b;
        ames.toolbar.activate_btn(b);
        var tool = this.tools[b];
        tool.activate();
      }
    } // init_square_tool: creates tool to draw squares / rectangles

  }, {
    key: "init_square_tool",
    value: function init_square_tool() {
      var _this5 = this;

      var square_tool = new Tool();
      var x; // Adjust the scale of the circle
      // Set center point of circle and scale to desired radius

      var cb_start_square = function cb_start_square(e) {
        if (_this5.on_ux(e)) return;
        x = new _artwork.AMES_Polygon();

        if (x.poly) {
          x.set_pos(e.point);
          x.poly.visible = true;
        }

        square_tool.onMouseDrag = cb_scale_circle;
      };

      var cb_scale_circle = function cb_scale_circle(e) {
        if (!x) return;
        var s = e.point.getDistance(x.poly.position) + 2;
        x.set_scale(s / 10, s / 10);
      };

      var cb_finish_square = function cb_finish_square(e) {
        if (!x) return;
        square_tool.onMouseDrag = null;
        x.to_path();
        x.poly.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        x.poly.fillColor.alpha = 0; // this.add_shape(x);

        x = null;
      };

      square_tool.onMouseDown = cb_start_square;
      square_tool.onMouseUp = cb_finish_square;
      return square_tool;
    } // init_circle_tool: creates tool to draw circles / ellipses

  }, {
    key: "init_circle_tool",
    value: function init_circle_tool() {
      var _this6 = this;

      var circle_tool = new Tool();
      var c; // Adjust the scale of the circle
      // Set center point of circle and scale to desired radius

      var cb_start_circle = function cb_start_circle(e) {
        if (_this6.on_ux(e)) return;
        c = new _artwork.AMES_Ellipse();

        if (c.poly) {
          c.set_pos(e.point);
          c.poly.visible = true;
        }

        circle_tool.onMouseDrag = cb_scale_circle;
      };

      var cb_scale_circle = function cb_scale_circle(e) {
        if (!c) return;
        var s = e.point.getDistance(c.poly.position) + 2;
        c.set_scale(s, s);
      };

      var cb_finish_circle = function cb_finish_circle(e) {
        if (!c) return;
        circle_tool.onMouseDrag = null;
        c.to_path();
        c.poly.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        c.poly.fillColor.alpha = 0.01; // this.add_shape(c);

        c = null;
      };

      circle_tool.onMouseDown = cb_start_circle;
      circle_tool.onMouseUp = cb_finish_circle;
      return circle_tool;
    } // init_path_tool: creates tool to draw paths

  }, {
    key: "init_path_tool",
    value: function init_path_tool() {
      var _this7 = this;

      var path_tool = new Tool();
      var x;
      var spt;
      var seg;
      var d_h1;
      var d_h2;
      var p1;
      var p2;
      var helper_shapes = [];

      var make_segment_controls = function make_segment_controls(s, e) {
        var h1 = s.handleIn.add(s.point);
        var h2 = s.handleOut.add(s.point);
        p1 = _utils.AMES_Utils.make_line(h1, s.point);
        p2 = _utils.AMES_Utils.make_line(s.point, h2);
        d_h1 = _utils.AMES_Utils.make_dot(h1);
        d_h2 = _utils.AMES_Utils.make_dot(h2);

        var d = _utils.AMES_Utils.make_square_dot(s.point); // Edit the path by dragging the anchor point


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

        helper_shapes.push(d_h1, d_h2, d, p1, p2);
      };

      path_tool.clean_tool = function (remove_path) {
        if (remove_path && x) x.poly.remove();
        x = null;
        seg = null;
        d_h1 = null;
        d_h2 = null;
        p1 = null;
        p2 = null;

        for (var i in helper_shapes) {
          helper_shapes[i].remove();
        }

        helper_shapes = [];
        path_tool.onMouseDown = cb_start_path;
        path_tool.onMouseDrag = null;
      }; // Initialize a new path


      var cb_start_path = function cb_start_path(e) {
        if (_this7.on_ux(e)) return;
        x = new _artwork.AMES_Artwork_Path();
        path_tool.onMouseDown = cb_add_point;
        path_tool.onMouseDrag = cb_adjust_handle;
        cb_add_point(e);
      };

      var thresh = 144; // within 12px
      // Add point to line

      var cb_add_point = function cb_add_point(e) {
        if (_this7.on_ux(e)) {
          path_tool.clean_tool(true);
          return;
        } // If point is close enough to previous point or first point
        // finish path and reset tool


        if (x.poly.segments.length >= 2) {
          // Make closed path and reset
          if (_utils.AMES_Utils.lengthsq(x.poly.firstSegment.point, e.point) < thresh) {
            console.log("closed path");
            x.poly.closed = true;
            x.finish_creating_path(); // this.add_shape(x);

            path_tool.clean_tool();
            return;
          } // Make open-ended path


          if (_utils.AMES_Utils.lengthsq(x.poly.lastSegment.point, e.point) < thresh) {
            console.log("open path");
            x.finish_creating_path(); // this.add_shape(x);

            path_tool.clean_tool();
            return;
          }
        }

        x.poly.add(e.point);
        seg = x.poly.lastSegment;
        make_segment_controls(seg, e);
      }; // Drag to manipulate handle


      var cb_adjust_handle = function cb_adjust_handle(e) {
        // Adjust handle of last point drawn
        if (seg != x.poly.firstSegment) {
          seg.handleIn = seg.point.subtract(e.point);
          p1.firstSegment.point = seg.handleIn.add(seg.point);
          d_h1.position = seg.handleIn.add(seg.point);
          seg.handleOut = e.point.subtract(seg.point);
          p2.firstSegment.point = seg.handleOut.add(seg.point);
          d_h2.position = seg.handleOut.add(seg.point);
        }
      }; // Add points to the path


      var cb_draw_path = function cb_draw_path(e) {
        if (!x) return;
        dist += e.event.movementX * e.event.movementX + e.event.movementY * e.event.movementY;
        console.log(dist);

        if (dist > 100) {
          x.poly.add(e.point);
          dist = 0;
        }
      };

      path_tool.onMouseDown = cb_start_path;
      return path_tool;
    } // init_list_tool: creates a list using underlying active shapes

  }, {
    key: "init_list_tool",
    value: function init_list_tool(opt) {
      var _this8 = this;

      opt = opt || {};
      var list_tool = new Tool();
      var TL = 1;
      var TR = 2;
      var BR = 3;
      var BL = 0;
      var lbox;
      var s_dot;
      var e_dot;
      var selected_shapes = {};
      var select_helpers = {}; // Start rectangle to make list

      var cb_start_list = function cb_start_list(e) {
        if (_this8.on_ux(e)) return;
        lbox = new Path.Rectangle(e.point, 10);
        lbox.strokeColor = _utils.AMES_Utils.ACTIVE_COLOR;
        lbox.strokeWidth = 1;
        lbox.dashArray = [3, 1]; // Create boundary dots

        s_dot = _utils.AMES_Utils.make_dot(lbox.segments[TL].point, _utils.AMES_Utils.ACTIVE_COLOR);
        e_dot = _utils.AMES_Utils.make_dot(lbox.segments[BR].point, _utils.AMES_Utils.ACTIVE_COLOR);
      }; // Increase rectangle size and highlight activated shapes that the
      // selection rectangle to make a list contains


      var cb_select_shapes = function cb_select_shapes(e) {
        console.log("select shapes");
        if (!lbox) return;
        lbox.segments[BR].point = e.point;
        lbox.segments[TR].point.x = e.point.x;
        lbox.segments[BL].point.y = e.point.y;
        e_dot.position = e.point; // From active shapes select shapes

        var lbox_bbox = lbox.strokeBounds;

        for (var i in _this8.objs) {
          var s = _this8.objs[i];

          if (s.is_artwork) {
            var s_bbox = s.get_bbox(); // If bbox contains shape...

            if (lbox_bbox.contains(s_bbox)) {
              // If shape is not in selected shape...
              if (!selected_shapes[s.name]) {
                // Add it to the selected shapes and highlight it
                selected_shapes[s.name] = s;
                select_helpers[s.name] = _utils.AMES_Utils.make_rect(s_bbox, _utils.AMES_Utils.ACTIVE_COLOR);
              }
            } else {
              // Otherwise if it was selected...
              if (selected_shapes[s.name]) {
                select_helpers[s.name].remove(); // Remove it from the selected shapes

                delete selected_shapes[s.name];
                delete select_helpers[s.name];
              }
            }
          }
        }
      }; // If active shapes are selected, make a list using those forms


      var cb_make_list = function cb_make_list(e) {
        console.log("make list", selected_shapes);
        var shapes = [];

        for (var k in selected_shapes) {
          shapes.push(selected_shapes[k]);
        }

        if (shapes.length != 0) {
          if (shapes.length == 1) {
            console.log("shapes length = 1", shapes);
            opt.is_duplicator = true;
          }

          var list = new _collection.AMES_Collection(shapes, opt);
        } // clean tool shapes


        for (var i in select_helpers) {
          var s = select_helpers[i];
          s.remove();
        }

        if (lbox) lbox.remove();
        if (s_dot) s_dot.remove();
        if (e_dot) e_dot.remove();
        lbox = null;
        s_dot = null;
        e_dot = null;
        selected_shapes = {};
        select_helpers = [];
      };

      list_tool.onMouseDown = cb_start_list;
      list_tool.onMouseDrag = cb_select_shapes;
      list_tool.onMouseUp = cb_make_list;
      return list_tool;
    } // // init_duplicator_tool: creates a duplicator using underlying active shapes
    // init_duplicator_tool() {
    // 	let list_tool = new Tool();
    // 	let TL = 1; let TR = 2; let BR = 3; let BL = 0;
    // 	let lbox; let s_dot; let e_dot;
    // 	let selected_shapes = {};
    // 	let select_helpers = {};
    //
    // 	// Start rectangle to make list
    // 	let cb_start_list = (e) => {
    // 		console.log("start list");
    //
    // 		lbox = new Path.Rectangle(e.point, 10);
    // 		lbox.strokeColor = utils.ACTIVE_COLOR;
    // 		lbox.strokeWidth = 1;
    // 		lbox.dashArray = [3,1];
    //
    // 		// Create boundary dots
    // 		s_dot = utils.make_dot(lbox.segments[TL].point, utils.ACTIVE_COLOR);
    // 		e_dot = utils.make_dot(lbox.segments[BR].point, utils.ACTIVE_COLOR);
    // 	}
    //
    // 	// Increase rectangle size and highlight activated shapes that the
    // 	// selection rectangle to make a list contains
    // 	let cb_select_shapes = (e) => {
    // 		console.log("select shapes");
    // 		if (!lbox) return;
    // 		lbox.segments[BR].point = e.point;
    // 		lbox.segments[TR].point.x = e.point.x;
    // 		lbox.segments[BL].point.y = e.point.y;
    // 		e_dot.position = e.point;
    //
    // 		// From active shapes select shapes
    // 		let lbox_bbox = lbox.strokeBounds;
    //
    // 		for (let i in this.active_objs) {
    // 			let s = this.active_objs[i];
    // 			if (s.is_shape) {
    // 				let s_bbox = s.get_bbox();
    // 				// If bbox contains shape...
    // 				if (lbox_bbox.contains(s_bbox)) {
    // 					// If shape is not in selected shape...
    // 					if (!selected_shapes[s.name]) {
    // 						// Add it to the selected shapes and highlight it
    // 						selected_shapes[s.name] = s;
    // 						select_helpers[s.name] = utils.make_rect(s_bbox, utils.ACTIVE_COLOR);
    // 					}
    // 				} else {
    // 					// Otherwise if it was selected...
    // 					if (selected_shapes[s.name]) {
    // 						select_helpers[s.name].remove();
    // 						// Remove it from the selected shapes
    // 						delete selected_shapes[s.name];
    // 						delete select_helpers[s.name];
    // 					}
    // 				}
    // 			}
    // 		}
    // 	}
    //
    // 	// If active shapes are selected, make a list using those forms
    // 	let cb_make_list = (e) => {
    // 		console.log("make list");
    // 		let shapes = [];
    // 		for (let k in selected_shapes) shapes.push(selected_shapes[k]);
    // 		if (shapes.length !=0 ) {
    // 			let list = new AMES_Duplicator(shapes);
    // 		}
    //
    // 		// clean tool shapes
    // 		for (let i in select_helpers) {
    // 			let s = select_helpers[i];
    // 			s.remove();
    // 		}
    // 		lbox.remove(); s_dot.remove(); e_dot.remove();
    // 		lbox = null; s_dot = null; e_dot = null;
    // 		selected_shapes = {}; select_helpers = [];
    // 	}
    //
    // 	list_tool.onMouseDown = cb_start_list;
    // 	list_tool.onMouseDrag = cb_select_shapes;
    // 	list_tool.onMouseUp = cb_make_list;
    // 	return list_tool;
    // }

  }, {
    key: "init_constraint_tool",
    value: function init_constraint_tool() {
      var _this9 = this;

      var constraint_tool = new Tool();
      var line;
      var line_start;
      var c_relative_box;
      var curr_obj;
      var c_reference_box;
      var point_in_box = false;

      var clean_constraint_tool = function clean_constraint_tool() {
        if (c_reference_box) {
          c_reference_box.remove(); //if (curr_obj && curr_obj.is_list) curr_obj.list_box.visible = true;
        }

        if (c_relative_box) {
          c_relative_box.remove();
          if (ames.c_relative && ames.c_relative.is_list) ames.c_relative.list_box.visible = true;
        }

        if (line) line.remove();
        c_reference_box = null;
        c_relative_box = null;
        line = null;
        line_start = null;
        curr_obj = null;
        point_in_box = false;
      };

      var cb_start_constraint = function cb_start_constraint(e) {
        clean_constraint_tool();
        if (!_this9.on_canvas(e)) return;

        if (!_this9.active_objs[_this9.c_relative.name]) {
          return;
        } // console.log("The relative is " + ames.c_relative.name);


        line_start = ames.c_relative.editor.constraint_info.link.position;
        console.log(line_start);
        line = new Path.Line(line_start, e.point);
        line.strokeWidth = 1;
        line.dashArray = [3, 1];
        line.strokeColor = _utils.AMES_Utils.ACTIVE_COLOR;
        c_relative_box = ames.c_relative.highlight(_utils.AMES_Utils.C_RELATIVE_COLOR);
        if (ames.c_relative.is_list) ames.c_relative.list_box.visible = false;
        curr_obj = null;
        c_reference_box = null;
        point_in_box = false;
      };

      var cb_select_obj = function cb_select_obj(e) {
        if (!_this9.active_objs[_this9.c_relative.name]) {
          clean_constraint_tool();
          return;
        }

        if (!line) {
          clean_constraint_tool();
          return;
        }

        point_in_box = false; // If end point is the bounding box of an active object

        for (var k in _this9.active_objs) {
          // Snap the endpoint to the closest bounding box corner
          var obj = _this9.active_objs[k];

          if (obj != ames.c_relative) {
            if (obj.contains(e.point)) {
              // Attach line to bbox corner with closest match
              var p = obj.get_closest_bbox_corner(line_start);
              if (p) line.lastSegment.point = p;else line.lastSegment.point = e.point;

              if (obj != curr_obj) {
                // Update highlighted object
                if (c_reference_box) {
                  c_reference_box.remove();
                }

                c_reference_box = obj.highlight(_utils.AMES_Utils.C_REFERENCE_HIGHLIGHT);
                curr_obj = obj; // If list, hide list box

                if (curr_obj.is_list) curr_obj.list_box.visible = false;
              }

              point_in_box = true;
            }
          }
        }

        if (!point_in_box) {
          line.lastSegment.point = e.point;

          if (c_reference_box) {
            c_reference_box.remove();
            c_reference_box = null;
          }

          curr_obj = null;
        }
      };

      var cb_enable_constraint = function cb_enable_constraint(e) {
        // Create & preview constraint
        var link = ames.c_relative.editor.constraint_info.link;
        var link_remove = ames.c_relative.editor.constraint_info.link_remove;

        if (curr_obj) {
          var rel = ames.c_relative;
          var p = ames.c_relative.active_prop;
          var sub_p = ames.c_relative.active_sub_p; // console.log("p and sub_p", p, sub_p);

          console.log("constrain", rel.name, curr_obj.name, p, sub_p);
          var constraint = new _constraints.AMES_Constraint(rel, curr_obj, p, sub_p, {
            'c_rel_box': c_relative_box,
            'c_ref_box': c_reference_box,
            'is_manual_constraint': true
          }); // console.log("made constraint", constraint);
          // console.log('p + sub_p', p, sub_p);

          ames.c_relative.update_constraints();
          link.visible = false;
          link_remove.visible = true;
        } // Turn off constraint tool


        ames.tools['inactive_tool'].activate();
        link.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        clean_constraint_tool();
      };

      constraint_tool.onMouseDown = cb_start_constraint;
      constraint_tool.onMouseDrag = cb_select_obj;
      constraint_tool.onMouseUp = cb_enable_constraint;
      return constraint_tool;
    }
  }, {
    key: "init_animation_link_tool",
    value: function init_animation_link_tool() {
      var _this10 = this;

      var animation_link_tool = new Tool();
      var line;
      var line_start;
      var c_relative_box;
      var curr_obj;
      var c_reference_box;
      var point_in_box = false;

      var clean_animation_link_tool = function clean_animation_link_tool() {
        if (c_reference_box) {
          c_reference_box.remove(); // if (curr_obj && curr_obj.is_list) curr_obj.list_box.visible = true;
        }

        if (line) line.remove();
        c_reference_box = null;
        line = null;
        line_start = null;
        curr_obj = null;
        point_in_box = false;
      };

      var cb_start_animation_link = function cb_start_animation_link(e) {
        if (_this10.on_ux(e)) return;
        clean_animation_link_tool();
        console.log("starting animation link connection?");
        line_start = _this10.active_linking_transformation.editor.geometry_field_info[_this10.transformation_active_field].link.position;
        console.log("line_start", line_start);
        line = new Path.Line(line_start, e.point);
        line.strokeWidth = 1;
        line.dashArray = [3, 1];
        line.strokeColor = _utils.AMES_Utils.ACTIVE_COLOR;
        curr_obj = null;
        c_reference_box = null;
        point_in_box = false;
      };

      var cb_select_obj = function cb_select_obj(e) {
        //line.lastSegment.point = e.point;
        if (!line) {
          clean_animation_link_tool();
          return;
        }

        point_in_box = false;
        var containing_objs = []; // If end point is the bounding box of an active object

        for (var k in _this10.objs) {
          // Snap the endpoint to the closest bounding box corner
          var obj = _this10.objs[k];

          if (obj.is_artwork) {
            if (obj.contains(e.point)) {
              containing_objs.push(obj);
              point_in_box = true;
            }
          }
        }

        if (point_in_box) {
          var min_dist = Number.MAX_SAFE_INTEGER;
          var closest_obj = null;

          for (var i in containing_objs) {
            var _obj = containing_objs[i];

            var d = _obj.get_distance_from_bbox_center_to_point(e.point);

            if (d < min_dist) {
              min_dist = d;
              closest_obj = _obj;
            }
          }

          if (curr_obj != closest_obj) {
            // Update highlighted object
            if (c_reference_box) {
              c_reference_box.remove();
            }

            if (curr_obj) curr_obj.hide_selection_opts();
            c_reference_box = closest_obj.highlight(_utils.AMES_Utils.C_REFERENCE_HIGHLIGHT);
            curr_obj = ames.selected_obj;
            console.log("Selected", curr_obj); // If list, hide list box

            if (curr_obj.is_list) curr_obj.list_box.visible = false;
          }
        } else {
          if (c_reference_box) {
            c_reference_box.remove();
            c_reference_box = null;
          }

          if (curr_obj) curr_obj.hide_selection_opts();
          curr_obj = null;
        }

        line.lastSegment.point = e.point;
      };

      var cb_enable_animation_link = function cb_enable_animation_link(e) {
        // Set animation geometry field as specified
        var geometry_field_info = ames.active_linking_transformation.editor.geometry_field_info[ames.transformation_active_field];
        var link = geometry_field_info.link;
        var link_remove = geometry_field_info.link_remove;

        if (curr_obj) {
          curr_obj.hide_selection_opts();
          var rel = ames.active_linking_transformation;
          ames.active_linking_transformation.set_geometry_field(ames.transformation_active_field, ames.selected_obj);
          ames.active_linking_transformation.editor.geometry_field_info[ames.transformation_active_field].label.content = ames.selected_obj.name;
          link.visible = false;
          link_remove.visible = true;
        } // Turn off constraint tool


        ames.tools['inactive_tool'].activate();
        link.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        clean_animation_link_tool();
      };

      animation_link_tool.onMouseDown = cb_start_animation_link;
      animation_link_tool.onMouseDrag = cb_select_obj;
      animation_link_tool.onMouseUp = cb_enable_animation_link;
      return animation_link_tool;
    }
  }, {
    key: "init_animation_tool",
    value: function init_animation_tool() {
      var _this11 = this;

      var animation_tool = new Tool();

      var create_animation_box = function create_animation_box() {// Create empty animation object
      };

      var cb_make_animation = function cb_make_animation(e) {
        if (_this11.on_canvas(e)) {
          // Create box and show animation editor
          var a = new _animations.AMES_Animation();
        }
      };

      var cb_deactivate_tool = function cb_deactivate_tool(e) {
        _this11.switch_tool({
          b: "Animation",
          deactivate: true
        });
      };

      animation_tool.onMouseDown = cb_make_animation;
      animation_tool.onMouseUp = cb_deactivate_tool;
      return animation_tool;
    }
  }, {
    key: "init_create_transformation_tool",
    value: function init_create_transformation_tool() {
      var _this12 = this;

      var create_transformation_tool = new Tool();

      var cb_make_transformation_function = function cb_make_transformation_function(e) {
        if (_this12.on_ux(e)) return;
        var tf = new _transformation.AMES_Transformation();
      };

      var cb_deactivate_tool = function cb_deactivate_tool(e) {
        _this12.switch_tool({
          b: "Transformation",
          deactivate: true
        });
      };

      create_transformation_tool.onMouseDown = cb_make_transformation_function;
      create_transformation_tool.onMouseUp = cb_deactivate_tool;
      return create_transformation_tool;
    } // on_canvas: determines if event fired is on the animation canvas

  }, {
    key: "on_canvas",
    value: function on_canvas(e) {
      var a = e.event.clientX;
      var b = e.event.clientY - 40;
      var p = new Point(a, b);
      return this.canvas_view.bounds.contains(p);
    }
  }, {
    key: "on_ux",
    value: function on_ux(e) {
      var on_ux = false;

      for (var idx in this.ux) {
        var x = this.ux[idx];
        var bounds = x.bounds;
        if (x.strokeBounds) bounds = x.strokeBounds;

        if (bounds.contains(e.point)) {
          on_ux = true;
        }
      }

      return on_ux;
    }
  }]);

  return AMES;
}();

exports.AMES = AMES;
},{"./animations.js":3,"./artwork.js":4,"./collection.js":5,"./constraints.js":6,"./editors.js":7,"./lists.js":8,"./transformation.js":10,"./utils.js":11,"./viewfoil.js":12,"regenerator-runtime":13}],2:[function(require,module,exports){
"use strict";

var _ames = require("./ames.js");

// ---------------------------------------------------------------------------
// ames_index.js
// Author: Sonia Hashim
//
// Description: Main execution space for ames on DOM load, attaches UX handler
// to global scope. Global scope includes paper object
// ---------------------------------------------------------------------------
console.log("Growth mindset & learning opportunities: I believe in this project and I believe in myself.");
paper.install(window);
window.ames;
// Set up before DOM is ready
window.ames = new _ames.AMES(); // Execute main function once DOM is ready

window.onload = function () {
  ames.init();
  var colorwheel = document.getElementById('colorwheel'); // Wait on load

  function sleep(time) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, time);
    });
  }

  sleep(500).then(function () {
    ames.test(); // let example = "starfield";
    // ames.example(example);
  });
};
},{"./ames.js":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Animation = exports.AMES_Animation_Test = void 0;

var _utils = require("./utils.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TOGGLE FOR BUILD
// import 'regenerator-runtime/runtime'
var AMES_Animation_Test = /*#__PURE__*/function () {
  function AMES_Animation_Test() {
    _classCallCheck(this, AMES_Animation_Test);

    _defineProperty(this, "key", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "keyframes", [0, 60, 300, 550, 680]);

    _defineProperty(this, "frames", 600);

    _defineProperty(this, "paths", []);

    _defineProperty(this, "states", []);

    _defineProperty(this, "animate_helper", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(path, state_idx) {
        var pathTo, pathFrom, state, duration, tw, nextPath;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(state_idx >= this.states.length - 1)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return");

              case 2:
                console.log('state_idx', state_idx + 1);
                pathTo = this.paths[state_idx + 1];
                pathFrom = path.clone({
                  insert: false
                });
                state = this.states[state_idx + 1];
                duration = (this.keyframes[state_idx + 1] - this.keyframes[state_idx]) / ames.fps * 1000;
                pathTo.visible = false; // state.opacity = 0;

                tw = path.tween(state, duration); // Enable pause handling: on puase event access current tween & store next state index

                this.state_idx = state_idx;
                this.curr_tw = tw;

                tw.onUpdate = function (event) {
                  path.interpolate(pathFrom, pathTo, event.factor);
                }; // Need to pass the new path that is drawn on the screen


                _context.next = 14;
                return tw;

              case 14:
                nextPath = _context.sent;
                this.animate_helper(nextPath, state_idx + 1);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    // Set key & add to ames animations
    this.key = AMES_Animation.count.toString();
    AMES_Animation.count += 1; // Test example

    var _path = new Path.Ellipse({
      fillColor: 'blue',
      center: [300, 40],
      size: [500, 100]
    });

    var pathTwo = new Path.Ellipse({
      position: [500, 500],
      size: [300, 700],
      insert: false
    });
    var pathThree = new Path.Ellipse({
      position: view.center,
      size: [50, 400],
      insert: false
    });
    var pathFour = new Path.Ellipse({
      position: view.center,
      size: [500, 200],
      insert: false
    }); // Loop / extend can be done with deep copies

    var pathFive = _path.clone({
      insert: false
    });

    pathFive.position = new Point(100, 100); // Path properties goe in path (includes scale / rotation / position)

    this.paths[0] = _path;
    this.paths[1] = pathTwo;
    this.paths[2] = pathThree;
    this.paths[3] = pathFour;
    this.paths[4] = pathFive; // Style properties go in state

    this.states[0] = {
      fillColor: 'blue'
    };
    this.states[1] = {
      fillColor: 'pink'
    };
    this.states[2] = {
      fillColor: 'green'
    };
    this.states[3] = {
      fillColor: 'orange'
    };
    this.states[4] = {
      fillColor: 'lightblue'
    }; // inserting a keyframe requires...
    // keyframe, path, state
  }

  _createClass(AMES_Animation_Test, [{
    key: "animate",
    value: function animate(t) {
      // Calculate animation state given system time
      // Fast-forward through tweens (not visible) to reach desired start state
      // Start animating from desired start state
      // First call to recursive async function to generate tweens
      this.animate_helper(this.paths[0], 0);
    }
  }, {
    key: "pause",
    value: function pause() {}
  }]);

  return AMES_Animation_Test;
}();
/* ----------------------------------------------------------------------------
 * AMES_Animation
 * Description: Class that takes in geometry representing a transformation and
 * geometry representing artwork as well as mapping information to animate
 * the artwork accordingly. In addition to mapping information, this class
 * contains playback control. An animation might also be composed of one or
 * more child animations.
 *
 * ----------------------------------------------------------------------------
 */


exports.AMES_Animation_Test = AMES_Animation_Test;

_defineProperty(AMES_Animation_Test, "count", 0);

var AMES_Animation = /*#__PURE__*/function () {
  // Default constructor
  // Defaults: a transformation is interpreted as a translation
  function AMES_Animation() {
    _classCallCheck(this, AMES_Animation);

    _defineProperty(this, "key", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "artwork", null);

    _defineProperty(this, "transformation", null);

    _defineProperty(this, "transformation_is_proportional", true);

    _defineProperty(this, "start_state_idx", 0);

    _defineProperty(this, "is_animation_playble", false);

    _defineProperty(this, "is_paused", false);

    _defineProperty(this, "is_looping", false);

    _defineProperty(this, "n_states", 100);

    _defineProperty(this, "time_scale_factor", 1);

    _defineProperty(this, "transformation_scale_factor", 1);

    _defineProperty(this, "animate_helper", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(path, state_idx) {
        var nextPath, STATE_IDX, DURATION_IDX, updates, n_artworks, artwork_idx, update, state, duration, artwork, tw;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.is_complete(state_idx)) {
                  _context2.next = 3;
                  break;
                }

                if (this.is_looping) {
                  // if (this.transformation_is_closed == false) this.rewind();
                  this.animate_helper(path, this.start_state_idx);
                }

                return _context2.abrupt("return");

              case 3:
                STATE_IDX = 0;
                DURATION_IDX = 1;
                updates = this.get_updates_from_state(state_idx); // console.log("retrieved updates for state", state_idx);

                if (this.artwork.is_shape) n_artworks = 1;
                if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;
                console.log(state_idx);
                artwork_idx = 0;

              case 10:
                if (!(artwork_idx < n_artworks)) {
                  _context2.next = 34;
                  break;
                }

                update = updates[artwork_idx];
                state = update[STATE_IDX];
                duration = update[DURATION_IDX];
                artwork = void 0;
                if (this.artwork.is_shape) artwork = this.artwork.poly;
                if (this.artwork.is_list) artwork = this.artwork.shapes[artwork_idx].poly;
                tw = artwork.tween(state, duration); // Capture state to support pausing and restarting playback

                if (this.artwork.is_shape) {
                  this.nxt_state_idx = state_idx;
                  this.curr_tw = tw;
                }

                if (this.artwork.is_list) {
                  if (!this.nxt_state_idx) this.nxt_state_idx = [];
                  if (!this.curr_tw) this.curr_tw = [];
                  this.nxt_state_idx[artwork_idx] = state_idx;
                  this.curr_tw[artwork_idx] = tw;
                } // TODO Will need to revisit to support path deformations


                tw.onUpdate = function (event) {//  path.interpolate(pathFrom, pathTo, event.factor)
                }; // Pass the new path that is drawn on the screen after the current tween
                // has completed and recurse


                if (!this.artwork.is_shape) {
                  _context2.next = 27;
                  break;
                }

                _context2.next = 24;
                return tw;

              case 24:
                nextPath = _context2.sent;
                _context2.next = 31;
                break;

              case 27:
                if (!nextPath) nextPath = [];
                _context2.next = 30;
                return tw;

              case 30:
                nextPath[artwork_idx] = _context2.sent;

              case 31:
                artwork_idx++;
                _context2.next = 10;
                break;

              case 34:
                this.animate_helper(nextPath, state_idx + 1);

              case 35:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
      };
    }());

    // Update name & add to layers view
    this.name = "Animation " + AMES_Animation.count;
    console.log("Setting animation name...", this.name);
    AMES_Animation.count += 1;
    if (!this.transformation_property) this.transformation_property = "position";
  } // For editors


  _createClass(AMES_Animation, [{
    key: "_clear_cb_helpers",
    value: function _clear_cb_helpers() {} // TODO returns position of the animation block

  }, {
    key: "get_pos",
    value: function get_pos() {
      return ames.canvas_view.bounds.center;
    } // TODO

  }, {
    key: "make_interactive",
    value: function make_interactive() {} // show_editor
    // ------------------------------------------------------------------------
    // @description: Shows the editor that can be used to control this animation.

  }, {
    key: "show_editor",
    value: function show_editor() {
      this.editor.show(true);
    } // TODO

  }, {
    key: "get_bbox",
    value: function get_bbox() {} // set_geometry_field
    // ------------------------------------------------------------------------
    // @description: Sets inputted geometery the artwork or transformation field.
    // @params: field - 'artwork' or 'transformation', geometry - svg object
    //

  }, {
    key: "set_geometry_field",
    value: function set_geometry_field(field, geometry) {
      this[field] = geometry;
      console.log("Animation.set_geometry_field", "params: ", field, geometry, "result: ", this[field]);
      if (this.transformation && this.artwork) this.interpret_transformation_geometry();
    } // interpret_transformation_geometry
    // ------------------------------------------------------------------------
    // @description: Precursor to animation after artwork and transformation have
    // been assigned. Determines that this animation is playable and stores a
    // copy of the original artwork to help in resetting the animation.
    //

  }, {
    key: "interpret_transformation_geometry",
    value: function interpret_transformation_geometry() {
      // TODO should store only the state corresponding to the transformation property
      if (this.transformation.is_shape) this.transformation_is_closed = this.transformation.poly.closed;

      if (this.transformation.is_list) {
        this.transformation_is_closed = [];
        var n = this.transformation.shapes.length;

        for (var i = 0; i < n; i++) {
          this.transformation_is_closed[i] = this.transformation.shapes[i].poly.closed;
        }
      }

      if (this.artwork.is_shape) this.artwork_copy = this.artwork.poly.clone({
        insert: false,
        deep: true
      });

      if (this.artwork_is_list) {
        this.artwork_copy = [];
        var _n = this.artwork.shapes.length;

        for (var _i = 0; _i < _n; _i++) {
          this.artwork_copy[_i] = this.artwork.shapes[_i];
        }
      }

      this.is_animation_playble = true;
    } // remove_geometry_field
    // ------------------------------------------------------------------------
    // @description: Unsets geometry assigned to the particular field and
    // specififes that this animation is no longer playable as either the
    // target artwork or transformation geometry is now missing.
    // @params: field - 'artwork' or 'transformation
    //

  }, {
    key: "remove_geometry_field",
    value: function remove_geometry_field(field) {
      this[field] = null;
      this.is_animation_playable = false;
      console.log("Animation.remove_geometry_field", "params: ", field, "result: ", this[field]);
    } // TODO

  }, {
    key: "set_transformation_axes",
    value: function set_transformation_axes() {
      if (!this.transformation) return;
      console.log("Setting axes for transformation geometry", this.transformation); // Create one or more axes objects

      var transformation_shape = this.transformation;

      if (this.transformation.is_shape) {
        this.create_axes(transformation_shape);
      } else if (this.transformation.is_list) {
        var n = this.transformation.shapes.length;

        for (var i = 0; i < n; i++) {
          transformation_shape = this.transformation.shapes[i];
          this.create_axes(transformation_shape, i);
        }
      }
    } // Creates an axis object for a specific transformation_shape

  }, {
    key: "create_axes",
    value: function create_axes(transformation_shape, transformation_idx) {
      this.axes = new AMES_Axes(this);
      console.log(this.axes);
      this.axes.make_axes_for_transformation_curve(transformation_shape, transformation_idx);
      this.axes.show_axes(true);
    } // TODO

  }, {
    key: "change_animation_property",
    value: function change_animation_property() {
      var property;
      var isValid = false;

      while (!isValid) {
        property = prompt("Enter the property that the transformation represents: position, scaling, rotation: ");
        console.log("entered...", property);
        if (property == "position" || property == "scaling" || property == "rotation") isValid = true;
      }

      console.log("Changing axes property to indicate ", property);
      this.transformation_property = property;
      if (property == "position") this.transformation_is_proprtional = true;else this.transformation_is_proprtional = false;
    } // play
    // ------------------------------------------------------------------------
    // @description: plays the animation from it's stored state or from the
    // beginning by calling a recursive function to animate each state.
    //

  }, {
    key: "play",
    value: function play() {
      console.log("hit play"); // If artwork and transformation aren't set return

      if (!this.transformation || !this.artwork) return; // Resume from pause state or play from beginning

      if (this.is_paused) {
        this.animate_helper(this.curr_tw, this.nxt_state_idx);
        this.is_paused = false;
      } else {
        // Reset animation
        this.is_at_open_path_end = false;
        var path;
        if (this.artwork.is_shape) path = this.artwork.poly;

        if (this.artwork.is_list) {
          path = [];
          var n_artworks = this.artwork.shapes.length;

          for (var i = 0; i < n_artworks; i++) {
            path[i] = this.artwork.shapes[i].poly;
          }
        }

        this.animate_helper(path, this.start_state_idx);
      }
    } // pause
    // ------------------------------------------------------------------------
    // @description: pauses the animation according to it's current stored state
    // and indicates that the animation is in a paused state.
    //

  }, {
    key: "pause",
    value: function pause() {
      if (!this.curr_tw) return;
      if (this.artwork.is_shape) this.curr_tw.stop();

      if (this.artwork.is_list) {
        var n_artworks = this.artwork.shapes.length;

        for (var i = 0; i < n_artworks; i++) {
          this.curr_tw[i].stop();
        }
      }

      this.is_paused = true;
    } // rewind
    // ------------------------------------------------------------------------
    // @description: pauses and rewinds the animation to it's starting state.
    //

  }, {
    key: "rewind",
    value: function rewind() {
      this.pause();
      this.is_paused = false;
      var tw = this.artwork.poly.tween({}, 1);
      var path = this.artwork.poly;
      var pathFrom = this.artwork.poly.clone({
        insert: false,
        deep: true
      });
      var pathTo = this.artwork_copy;

      tw.onUpdate = function (event) {
        path.interpolate(pathFrom, pathTo, event.factor);
      };
    } // loop
    // ------------------------------------------------------------------------
    // @description: toggles whether or not the playback of the animation loops.
    //

  }, {
    key: "loop",
    value: function loop() {
      this.is_looping = !this.is_looping;
    }
  }, {
    key: "get_path_offset_for_target",
    value: function get_path_offset_for_target(target_offset, transformation_geometry, transformation_idx) {
      // Initialize start_path_offset if necessary
      if (!this.start_path_offset) {
        if (this.transformation.is_shape) {
          this.start_path_offset = 0;
        }

        if (this.transformation.is_list) {
          this.start_path_offset = [];
          var n_transformations = this.transformation.shapes.length;

          for (var i = 0; i < n_transformations; i++) {
            this.start_path_offset[i] = 0;
          }
        }
      } // Access start_path_offset


      var start_path_offset = this.start_path_offset;

      if (this.transformation.is_list) {
        start_path_offset = this.start_path_offset[transformation_idx];
      } // Use offsets to determine appropriate path offset in the geomtry
      // to determine the next state


      var transformation_path_length = transformation_geometry.length;
      var path_offset = target_offset + start_path_offset;

      if (path_offset > transformation_path_length) {
        if (transformation_geometry.closed) {
          path_offset -= transformation_path_length;
        } else {
          path_offset = transformation_path_length; // Indicate that the animation has reached the end of the path

          if (this.transformation.is_shape) {
            this.is_at_open_path_end = true;
          }

          if (this.transformation.is_list) {
            this.is_at_open_path_end[transformation_idx] = true;
          }
        }
      }

      return path_offset;
    }
  }, {
    key: "get_delta_from_state",
    value: function get_delta_from_state(i, next_idx, transformation_idx) {
      var transformation_geometry = this.transformation.poly;
      if (this.transformation.is_list) transformation_geometry = this.transformation.shapes[transformation_idx].poly;
      var transformation_path_length = transformation_geometry.length;
      var prev_state_offset = this.get_path_offset_for_target(i / this.n_states * transformation_path_length, transformation_geometry, transformation_idx);
      var next_state_offset = this.get_path_offset_for_target(next_idx / this.n_states * transformation_path_length, transformation_geometry, transformation_idx);
      var prev_state = transformation_geometry.getPointAt(prev_state_offset);
      var next_state = transformation_geometry.getPointAt(next_state_offset);
      var delta; // For a translation,  use the difference in the transformation geometry
      // locations to calculate a position update

      if (this.transformation_property == "position") {
        delta = next_state.subtract(prev_state);
      } // For a scaling animation, use the difference in the transformation geometry
      // locations in y to calculate the change in scale factor


      if (this.transformation_property == "scaling") {
        delta = (next_state.y - prev_state.y) / (transformation_geometry.bounds.height / 2);
      } // For a rotation animation, use the difference in the transformation geometry
      // locations in y to calculate the change in rotation angle


      if (this.transformation_property == "rotation") {
        delta = next_state.y - prev_state.y;
      }

      return delta;
    } // get_update_for_state(state_idx)
    // ------------------------------------------------------------------------
    // @description: interprets the transformation goeometry to get the update
    // that will determine the tween given the state of the animation.
    // @params: state_idx
    //

  }, {
    key: "get_updates_from_state",
    value: function get_updates_from_state(state_idx) {
      // console.log("in get updates from state");
      // Indices to map to locations on the transformation path
      var i = state_idx;
      var next_idx = state_idx + 1; // Get states and calculate distance between states to set update value

      var delta = [];

      if (this.transformation.is_shape) {
        // console.log("transformation is shape");
        var d = this.get_delta_from_state(i, next_idx);

        var _n_artworks;

        if (this.artwork.is_shape) _n_artworks = 1;
        if (this.artwork.is_list) _n_artworks = this.artwork.shapes.length;

        for (var artwork_idx = 0; artwork_idx < _n_artworks; artwork_idx++) {
          delta[artwork_idx] = d;
        }
      } else if (this.transformation.is_list) {
        // Create interpolation using delta values
        var n = this.transformation.shapes.length;
        var _d = [];
        var _x5 = [];
        var _y = [];

        for (var transformation_idx = 0; transformation_idx < n; transformation_idx++) {
          _d[transformation_idx] = this.get_delta_from_state(i, next_idx, transformation_idx);

          if (this.transformation_property == "position") {
            _x5[transformation_idx] = _d[transformation_idx].x;
            _y[transformation_idx] = _d[transformation_idx].y;
          }
        } // console.log("collected path data", d, x, y);


        _d = _d.map(function (y, idx) {
          return [idx, y];
        });
        _x5 = _x5.map(function (i, idx) {
          return [idx, i];
        });
        _y = _y.map(function (j, idx) {
          return [idx, j];
        });

        var _n_artworks2;

        if (this.artwork.is_shape) _n_artworks2 = 1;
        if (this.artwork.is_list) _n_artworks2 = this.artwork.shapes.length;

        for (var _artwork_idx = 0; _artwork_idx < _n_artworks2; _artwork_idx++) {
          if (this.transformation_property == "position") {
            var d_x = _utils.AMES_Utils.interpolate(_x5, _artwork_idx);

            var d_y = _utils.AMES_Utils.interpolate(_y, _artwork_idx);

            delta[_artwork_idx] = {
              "x": d_x,
              "y": d_y
            };
          } else {
            delta[_artwork_idx] = _utils.AMES_Utils.interpolate(_d, _artwork_idx);
          }
        }
      } // console.log("our delta is:", delta);


      var result = []; // Special case: set starting point using relative displacement of transformation curves

      var x = [];
      var y = [];

      if (state_idx == 0) {
        if (this.transformation_property == "position") {
          var origin = this.transformation.shapes[0].poly.position;
          var n_transformations = this.transformation.shapes.length;

          for (var idx = 0; idx < n_transformations; idx++) {
            console.log(idx, this.transformation.shapes[idx].poly.position);
            var p = this.transformation.shapes[idx].poly.position.subtract(origin);
            x[idx] = p.x;
            y[idx] = p.y;
          }

          console.log("position displacement", x, y);
          x = x.map(function (i, idx) {
            return [idx, i];
          });
          y = y.map(function (j, idx) {
            return [idx, j];
          });
        }
      }

      var n_artworks;
      if (this.artwork.is_shape) n_artworks = 1;
      if (this.artwork.is_list) n_artworks = this.artwork.shapes.length;

      for (var _artwork_idx2 = 0; _artwork_idx2 < n_artworks; _artwork_idx2++) {
        // Create empty state update
        var state_update = {};
        var _d2 = delta[_artwork_idx2];

        if (state_idx == 0) {
          var _d_x = _utils.AMES_Utils.interpolate(x, _artwork_idx2 / n_artworks);

          var _d_y = _utils.AMES_Utils.interpolate(y, _artwork_idx2 / n_artworks);

          _d2.x += _d_x;
          _d2.y += _d_y;
        }

        switch (this.transformation_property) {
          case "position":
            _d2 = {
              "x": _d2.x * this.transformation_scale_factor,
              "y": _d2.y * this.transformation_scale_factor
            };
            break;

          default:
            _d2 *= this.transformation_scale_factor;
        } // Update the transformation property by the appropriate amount


        state_update[this.transformation_property] = ["+=", _d2];
        var duration = 1 * this.time_scale_factor;
        result[_artwork_idx2] = [state_update, duration];
      }

      return result;
    }
  }, {
    key: "is_complete",
    value: function is_complete(state_idx) {
      if (state_idx >= this.n_states) return true; // if (this.is_at_open_path_end == true) return true;

      return false;
    } // animate_helper
    // ------------------------------------------------------------------------
    // @description: a recursive function that tweens from one state to the next
    // until the animation is complete.
    // @params: path - the path to be animate, state_idx - the state of
    // the animation out of the total number of states
    //

  }, {
    key: "set_start_path_offset_at_point",
    value: function set_start_path_offset_at_point(point, transformation_idx) {
      if (transformation.is_shape) this.start_path_offset = this.transformation.poly.getOffsetOf(point);
      if (this.transformation.is_list) this.start_path_offset[transformation_idx] = this.transformation.shapes[transformation_idx].poly.getOffsetOf(point);
    } // set_animation_start_point(point) {
    // 	let transformation_geometry = this.transformation.poly;
    //
    // 	let target = transformation_geometry.getOffsetOf(point);
    // 	let offset = target - this.start_path_offset;
    // 	if (offset < 0) offset += transformation_geometry.length;
    // 	let new_start_state_idx = Math.round((offset/transformation_geometry.length)*99);
    //
    //
    // 	// Tween ahead to the new start state (otherwise you'll create a new animation)
    // 	let tw = this.artwork.poly.tween({
    // 		this.transformation_property: get_update_from_state_a_to_b(this.start_state_idx, new_start_state_idx)
    // 	},1);
    // 	let path = this.artwork.poly;
    // 	tw.onUpdate = function(event) {
    // 		//path.interpolate(pathFrom, pathTo, event.factor);
    // 	}
    //
    // 	this.start_state_idx = new_start_state_idx;
    // }

  }, {
    key: "set_transformation_scale_factor",
    value: function set_transformation_scale_factor(factor) {
      this.transformation_scale_factor = 1 / factor;
      console.log("transformation_scale_factor", this.transformation_scale_factor);
    }
  }, {
    key: "set_time_scale_factor",
    value: function set_time_scale_factor(factor) {
      this.time_scale_factor = 1 / factor;
      console.log("time_scale_factor", this.time_scale_factor);
    }
  }, {
    key: "update_name",
    value: function update_name(new_name) {
      this.name = new_name;
    }
  }]);

  return AMES_Animation;
}();

exports.AMES_Animation = AMES_Animation;

_defineProperty(AMES_Animation, "count", 1);

var AMES_Axes = /*#__PURE__*/function () {
  function AMES_Axes(animation) {
    _classCallCheck(this, AMES_Axes);

    _defineProperty(this, "origin", void 0);

    _defineProperty(this, "u_axis", void 0);

    _defineProperty(this, "v_axis", void 0);

    _defineProperty(this, "axes", void 0);

    _defineProperty(this, "animation", void 0);

    _defineProperty(this, "aesthetic_overhang", 10);

    _defineProperty(this, "transformation_idx", void 0);

    this.animation = animation;
    this.axes = new Group();
    console.log(ames.canvas_view.bounds); // Make dot at origin

    this.origin = _utils.AMES_Utils.make_dot(new Point(100, 100)); // Make lines extending along transformation bbox edges

    this.u_axis = _utils.AMES_Utils.make_line(new Point(100, 100), new Point(200, 100));
    this.v_axis = _utils.AMES_Utils.make_line(new Point(100, 100), new Point(100, 200)); // Make arrows to scale u and v axis

    this.u_axis_arrow_right = this.make_arrow(270);
    this.u_axis_arrow_left = this.make_arrow(90);
    this.v_axis_arrow_top = this.make_arrow(180);
    this.v_axis_arrow_bottom = this.make_arrow(0);
    this.axes.addChildren([this.origin, this.u_axis, this.v_axis]);
  }

  _createClass(AMES_Axes, [{
    key: "make_arrow",
    value: function make_arrow(angle) {
      var arrow = ames.icons["arrow"].clone();
      arrow.position = ames.canvas_view.center;
      arrow.visible = true;
      arrow.strokeColor = _utils.AMES_Utils.SHAPE_PATH_COLOR;
      arrow.rotate(angle);
      console.log("Making arrow", arrow);
      return arrow;
    }
  }, {
    key: "show_axes",
    value: function show_axes(bool) {
      this.u_axis.visible = bool;
      this.v_axis.visible = bool;
      var arrows = [this.u_axis_arrow_left, this.u_axis_arrow_right, this.v_axis_arrow_top, this.v_axis_arrow_bottom];

      for (var a in this.arrows) {
        a.visible = bool;
      }
    }
  }, {
    key: "make_axes_for_transformation_curve",
    value: function make_axes_for_transformation_curve(transformation_shape, transformation_idx) {
      var _this = this;

      // Update position of origin to be the start of the animation curve;
      var transformation_curve = transformation_shape.poly;
      var o = transformation_curve.getPointAt(0);
      this.origin.position = o;
      if (transformation_idx) this.transformation_idx = transformation_idx;
      var bbox = transformation_shape.get_bbox();
      var bbox_corners = [bbox.bottomLeft, bbox.topLeft, bbox.topRight, bbox.bottomRight];
      var TL = 1;
      var TR = 2;
      var BR = 3;
      var BL = 0;
      this.u_axis.segments[0].point = new Point(bbox_corners[BL].x - this.aesthetic_overhang, o.y);
      this.u_axis.segments[1].point = new Point(bbox_corners[BR].x + this.aesthetic_overhang, o.y);
      this.v_axis.segments[0].point = new Point(o.x, bbox_corners[BL].y + this.aesthetic_overhang);
      this.v_axis.segments[1].point = new Point(o.x, bbox_corners[TL].y - this.aesthetic_overhang);
      this.original_u_axis_length = this.u_axis.length;
      this.original_v_axis_length = this.v_axis.length;
      this.u_axis.position = o;
      this.v_axis.position = o;
      this.update_arrow_positions();
      this.show_axes(true); // Make origin draggable along path

      this.origin.onMouseDrag = function (e) {
        // Update origin to nearest point to cursor
        var new_origin = _this.animation.transformation.poly.getNearestPoint(e.point);

        _this.origin.position = new_origin; // Update animation start index using same underlying animation

        _this.animation.set_start_path_offset_at_point(new_origin, transformation_idx); // Update axis to sit at origin


        _this.u_axis.position = new_origin;
        _this.v_axis.position = new_origin; // Update arrows to follow axes

        _this.update_arrow_positions();
      }; // Make axes scalable
      // LEFT


      this.u_axis_arrow_left.onMouseDrag = function (e) {
        var companion_arrow = _this.u_axis_arrow_right;

        if (e.point.x < _this.origin.position.x && companion_arrow.position.x > _this.origin.position.x) {
          var delta = e.point.x - _this.u_axis_arrow_left.position.x;

          _this.update_axis(_this.u_axis, delta);
        }
      }; // RIGHT


      this.u_axis_arrow_right.onMouseDrag = function (e) {
        var companion_arrow = _this.u_axis_arrow_left;

        if (e.point.x > _this.origin.position.x && companion_arrow.position.x < _this.origin.position.x) {
          var delta = _this.u_axis_arrow_right.position.x - e.point.x;

          _this.update_axis(_this.u_axis, delta);
        }
      }; // TOP


      this.v_axis_arrow_top.onMouseDrag = function (e) {
        var companion_arrow = _this.v_axis_arrow_bottom;

        if (e.point.y < _this.origin.position.y && companion_arrow.position.y > _this.origin.position.y) {
          var delta = _this.v_axis_arrow_top.position.y - e.point.y;

          _this.update_axis(_this.v_axis, delta);
        }
      }; // BOTTOM


      this.v_axis_arrow_bottom.onMouseDrag = function (e) {
        var companion_arrow = _this.v_axis_arrow_top;

        if (e.point.y > _this.origin.position.y && companion_arrow.position.y < _this.origin.position.y) {
          var delta = e.point.y - _this.v_axis_arrow_bottom.position.y;

          _this.update_axis(_this.v_axis, delta);
        }
      };
    }
  }, {
    key: "update_arrow_positions",
    value: function update_arrow_positions() {
      this.u_axis_arrow_left.position = this.u_axis.segments[0].point;
      this.u_axis_arrow_right.position = this.u_axis.segments[1].point;
      this.v_axis_arrow_top.position = this.v_axis.segments[1].point;
      this.v_axis_arrow_bottom.position = this.v_axis.segments[0].point;
    }
  }, {
    key: "update_axis",
    value: function update_axis(axis, delta) {
      var is_v_axis = axis == this.v_axis ? true : false;
      var coordinate = is_v_axis ? "y" : "x";
      axis.segments[0].point[coordinate] += delta;
      axis.segments[1].point[coordinate] -= delta; // If the axis is an xy mapping (motion path) update the other axis as well

      if (this.animation.transformation_is_proprtional) {
        var opp_axis = is_v_axis ? this.u_axis : this.v_axis;
        var opp_coordinate = coordinate == "x" ? "y" : "x";
        opp_axis.segments[1].point[opp_coordinate] += delta;
        opp_axis.segments[0].point[opp_coordinate] -= delta;
        var original_axis_length = is_v_axis ? this.original_v_axis_length : this.original_u_axis_length;
        var factor = axis.length / original_axis_length;
        var v_factor = this.original_v_axis_length / this.v_axis.length;
        var u_factor = this.original_u_axis_length / this.u_axis.length;
        this.animation.set_transformation_scale_factor(v_factor);
        this.animation.set_time_scale_factor(u_factor);
      } else {
        // Otherwise scale the transformation according to the single set of axis
        // used to define this transformation
        var _original_axis_length = is_v_axis ? this.original_v_axis_length : this.original_u_axis_length;

        var _factor = axis.length / _original_axis_length;

        is_v_axis ? this.animation.set_transformation_scale_factor(_factor) : this.animation.set_time_scale_factor(_factor);
      }

      this.update_arrow_positions();
    }
  }]);

  return AMES_Axes;
}();
},{"./utils.js":11}],4:[function(require,module,exports){
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
},{"./constraints.js":6,"./editors.js":7,"./utils.js":11}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Collection = void 0;

var _utils = require("./utils.js");

var _constraints = require("./constraints.js");

var _shapes = require("./shapes.js");

var _editors = require("./editors.js");

var _artwork = require("./artwork.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AMES_Collection = /*#__PURE__*/function () {
  function AMES_Collection(artwork, opt) {
    var _this = this;

    _classCallCheck(this, AMES_Collection);

    _defineProperty(this, "name", "Collection");

    _defineProperty(this, "type", "Collection");

    _defineProperty(this, "is_geometry", true);

    _defineProperty(this, "is_list", true);

    _defineProperty(this, "is_collection", true);

    _defineProperty(this, "shapes", []);

    _defineProperty(this, "original", []);

    _defineProperty(this, "transformations", []);

    _defineProperty(this, "count", 1);

    _defineProperty(this, "box", void 0);

    _defineProperty(this, "editor", void 0);

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

    _defineProperty(this, "c_inbound", {
      "position": {
        "all": [],
        "x": [],
        "y": []
      },
      "scale": {
        "all": [],
        "x": [],
        "y": []
      },
      "rotation": {
        "all": [],
        "t": []
      },
      "fillColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "strokeWidth": {
        "all": [],
        "w": []
      },
      "strokeColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "path": {}
    });

    _defineProperty(this, "c_outbound", {
      "position": {
        "all": [],
        "x": [],
        "y": []
      },
      "scale": {
        "all": [],
        "x": [],
        "y": []
      },
      "rotation": {
        "all": [],
        "t": []
      },
      "fillColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "strokeWidth": {
        "all": [],
        "w": []
      },
      "strokeColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "path": {}
    });

    _defineProperty(this, "list_constraints", []);

    _defineProperty(this, "offset_mode", false);

    _defineProperty(this, "is_para_style_list", true);

    _defineProperty(this, "is_duplicator", false);

    opt = opt || {};
    if (opt.is_para_style_list) this.is_para_style_list = opt.is_para_style_list;
    if (opt.is_duplicator) this.is_duplicator = opt.is_duplicator;
    this.box = new Group();
    var n_list = ames.n_lists;
    this.name = "Collection " + ames.n_lists;

    if (Array.isArray(artwork) && artwork.length > 1) {
      this.count = artwork.length;
      this.is_duplicator = false; // Sort shapes by x_position

      artwork.sort(function (a, b) {
        return a.number - b.number;
      });

      for (var idx in artwork) {
        var s = artwork[idx];
        this.add_to_collection(s);
      }
    } else {
      this.is_duplicator = true;
      this.count = 1;
      this.add_to_collection(artwork[0]);
    }

    this.original = artwork;

    this._make_show_box();

    if (!ames.mode) ames.mode = 'list'; // TO DO: Make this touch screen friendly

    for (var i in this.shapes) {
      this.shapes[i].poly.on("doubleclick", function (e) {
        // Change offset mode for all lists that contain shape
        console.log(_this.name, "changed offset mode to", !_this.offset_mode);
        _this.offset_mode = !_this.offset_mode;

        _this.update_offset_mode();
      });
    }

    for (var _i in ames.lists) {
      console.log(ames.lists[_i].name, ames.lists[_i].box.children);
    }

    this.active_obj = this.shapes[0];
    this.create_in_ames();
  }

  _createClass(AMES_Collection, [{
    key: "sort_right_to_left",
    value: function sort_right_to_left() {
      // Sort shapes by x_position
      this.shapes = this.shapes.sort(function (a, b) {
        return b.poly.position.x - a.poly.position.x;
      });
    }
  }, {
    key: "get_type",
    value: function get_type() {
      return this.type;
    }
  }, {
    key: "get_type_count",
    value: function get_type_count() {
      return AMES_Collection.type_count;
    }
  }, {
    key: "increment_type_count",
    value: function increment_type_count() {
      AMES_Collection.type_count += 1;
    }
  }, {
    key: "create_in_ames",
    value: function create_in_ames() {
      this.name = this.get_type() + " (" + this.get_type_count() + ")";
      this.increment_type_count(); // this.create_control_shapes();

      this.create_editor();
      ames.add_obj(this);
      this.make_interactive(true);
    }
  }, {
    key: "create_editor",
    value: function create_editor() {
      this.editor = new _editors.AMES_Collection_Editor(this);
      var bounds = this.editor.box.bounds;
      var w = bounds.width / 2 + _utils.AMES_Utils.ICON_OFFSET * 3 + 12.5;
      var x = ames.toolbar.get_position().x + w;
      var h = ames.canvas_view.size.height - 2 * _utils.AMES_Utils.ICON_OFFSET - bounds.height / 2;
      this.editor.box.position = new Point(x, h);
    }
  }, {
    key: "update_offset_mode",
    value: function update_offset_mode() {// for (let i in this.list_constraints) {
      // 	this.list_constraints[i].offset_mode = this.offset_mode;
      // }
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
    } // show_editor: if true open editor; otherwise close;

  }, {
    key: "show_editor",
    value: function show_editor(bool) {
      if (this.editor) {
        this.editor.show(bool);
        this.show_box(bool);

        if (!bool) {
          if (this.active_prop) this.manipulate(this.active_prop);
        }
      }
    } // has_shape: returns whether or not the shape is in the list

  }, {
    key: "has_shape",
    value: function has_shape(x) {
      for (var i in this.shapes) {
        if (this.shapes[i] == x) return true;
      }

      return false;
    }
  }, {
    key: "duplicate",
    value: function duplicate() {
      var original_shape = this.shapes[0];

      if (this.is_duplicator) {
        // TO DO: insertion order bug. Having trouble changing relative ordering of shapes.
        var shape = original_shape.clone();
        var prev = this.shapes[this.shapes.length - 1];
        shape.poly.insertBelow(prev.poly);
        this.shapes.push(shape);
        shape.add_collection(this);
        ames.hide_editors(this);
        this.show(true);
      }
    }
  }, {
    key: "set_count",
    value: function set_count(n) {
      // // Count has to be greater than or equal to 1
      // if (n < 1) return;
      // if (this.shapes.length == 1) {
      // 	let og = this.shapes[0];
      // 	// this.shapes = [];
      // 	for (let i = 1; i < n; i++) {
      // 		let a = og.clone();
      // 		let c = i*10;
      // 		a.poly.position = new Point(og.poly.position.x + c, og.poly.position.y + c);
      // 		this.shapes.push(a);
      // 		a.add_collection(this);
      // 		// this.add_to_collection(a, true);
      // 		ames.hide_editors(this);
      // 		this.show(true);
      // 	}
      // 	console.log("setting count", );
      // } else {
      // 	// Increase copies using first and last
      // }
      for (var i = 0; i < n - 1; i++) {
        this.duplicate();
      }
    }
  }, {
    key: "align",
    value: function align() {
      var og = this.shapes[0];

      for (var i = 1; i < this.shapes.length; i++) {
        this.shapes[i].poly.position = og.poly.position;
      }
    }
  }, {
    key: "add_to_collection",
    value: function add_to_collection(s, use_constraints) {
      // if (use_constraints || (!this.is_para_style_list && this.shapes.length > 0)) {
      // 	let fs = this.shapes[0];
      // 	let ls = this.shapes[this.shapes.length - 1];
      // 	// Remove constraint connecting ls to fs
      // 	for (let i = 0; i < utils.VIS_PROPS.length; i++) {
      // 		let p = utils.VIS_PROPS[i];
      // 		if (p != 'path') {
      // 			if (this.shapes.length > 1) {
      // 				let oc;
      // 				for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
      // 					let sub = utils.SUB_PROPS[p][sub_idx];
      // 					// console.log(sub);
      // 					oc = ls.c_outbound[p][sub][fs.name];
      // 					this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
      // 					oc.remove();
      // 				}
      // 				oc = ls.c_outbound[p]['all'][fs.name];
      // 				this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
      // 				oc.remove();
      // 			}
      //
      // 			let c_append = new AMES_Constraint(s, ls, p, 'all');
      // 			let c_loop = new AMES_Constraint(fs, s, p, 'all');
      //
      // 			this.list_constraints.push(c_append);
      // 			this.list_constraints.push(c_loop);
      //
      // 			for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
      // 				let sub = utils.SUB_PROPS[p][sub_idx];
      // 				this.list_constraints.push(s.c_inbound[p][sub][ls.name]);
      // 				this.list_constraints.push(fs.c_inbound[p][sub][s.name]);
      // 			}
      // 		}
      // 	}
      // }
      this.shapes.push(s); // s.add_list(this);

      s.add_collection(this);
    }
  }, {
    key: "update_constraints",
    value: function update_constraints() {// AMES_Collection.update_constraints(this);
    }
  }, {
    key: "get_shape_names",
    value: function get_shape_names() {
      var str = "";

      for (var idx in this.shapes) {
        if (idx != 0 && idx != this.shapes.length) str += ", ";
        str += this.shapes[idx].name;
      }

      return str;
    } // show: if true, show; otherwise hide

  }, {
    key: "show",
    value: function show(bool) {
      this.show_editor(bool);
      this.update_show_box();

      if (bool) {
        // let prev = null; let res;
        this._update_list();
      }
    } // _update_list: updates the artwork that the list contains

  }, {
    key: "_update_list",
    value: function _update_list() {
      // Use functions based on self-referencing constraints to define
      // visual artwork in the list
      for (var idx = 0; idx < this.count; idx++) {// Create symbol using shape function
        // let s = this._get_shape(idx);
        // Set position
        // Set rotation
      }
    }
  }, {
    key: "remove_item",
    value: function remove_item() {
      if (this.count == 1) return;
      var shape = this.shapes[this.shapes.length - 1];
      shape.remove();
      this.shapes.pop();
      this.count = this.count - 1;
      this.update_show_box();
    }
  }, {
    key: "add_item",
    value: function add_item() {
      this.count = this.count + 1;
      this.duplicate();
      this.update_show_box();
    }
  }, {
    key: "show_box",
    value: function show_box(bool) {
      // Highlight list and update bbox if necessary
      this.list_box.visible = bool;
      if (this.label_box) this.label_box.visible = bool;
      if (this.label_count) this.label_count.visible = bool;
      if (this.text_count) this.text_count.visible = bool;
    }
  }, {
    key: "update_show_box",
    value: function update_show_box() {
      this.update_show_box_count();
      this.update_show_box_bounds();
    }
  }, {
    key: "update_show_box_bounds",
    value: function update_show_box_bounds() {
      var TL = 1;
      var BL = 0;
      var bbox = this.get_bbox(); // console.log(this.name, 'update_show_box', this.box.children);

      var x_off = 20 / (bbox.width + 20);
      var y_off = 20 / (bbox.height + 20);
      bbox = bbox.scale(1 + x_off, 1 + y_off);
      var is_visible = this.list_box.visible;
      this.list_box.remove();
      this.list_box = _utils.AMES_Utils.make_rect(bbox, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
      this.list_box.visible = is_visible;
      this.count_box.position = this.list_box.segments[BL].point.add(this.label_box_offset);
    } // update_show_box_count: updates count box value to match list count of items in list

  }, {
    key: "update_show_box_count",
    value: function update_show_box_count() {
      this.count = this.shapes.length;
      if (this.text_count) this.text_count.content = this.count;
    }
  }, {
    key: "_make_show_box",
    value: function _make_show_box() {
      var _this2 = this;

      var bbox = this.get_bbox();
      var x_off = 20 / (bbox.width + 20);
      var y_off = 20 / (bbox.height + 20);
      bbox = bbox.scale(1 + x_off, 1 + y_off);
      this.list_box = _utils.AMES_Utils.make_rect(bbox, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
      this.list_box.visible = true;

      if (this.is_duplicator) {
        this.label_count = new PointText({
          point: [bbox.bottomLeft.x + _utils.AMES_Utils.ICON_OFFSET, bbox.bottomLeft.y + _utils.AMES_Utils.ICON_OFFSET * 2.5],
          content: 'count:',
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE,
          fillColor: _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR
        });
        var x = this.label_count.bounds.bottomRight.x + _utils.AMES_Utils.ICON_OFFSET;
        this.text_count = new PointText({
          point: [x, bbox.bottomLeft.y + _utils.AMES_Utils.ICON_OFFSET * 2.5],
          content: this.count,
          fontFamily: _utils.AMES_Utils.FONT,
          fontSize: _utils.AMES_Utils.FONT_SIZE,
          fillColor: _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR
        });

        this.text_count.onMouseDown = function (e) {
          ames.canvas.style.cursor = 'move';
        };

        var total_drag = 0;

        this.text_count.onMouseDrag = function (e) {
          // ames.canvas.style.cursor = null;
          total_drag += e.event.movementX;
          if (total_drag < 0) ames.canvas.style.cursor = 'w-resize';
          if (total_drag > 0) ames.canvas.style.cursor = 'e-resize';

          if (total_drag < -5) {
            _this2.remove_item();

            total_drag = 0;
          }

          if (total_drag > 5) {
            _this2.add_item();

            total_drag = 0;
          }
        };

        this.text_count.onMouseUp = function (e) {
          ames.canvas.style.cursor = null;
          total_drag = 0;
        };

        var r_size = new Size(this.label_count.bounds.width + this.text_count.bounds.width + _utils.AMES_Utils.ICON_OFFSET * 5, this.label_count.bounds.height + _utils.AMES_Utils.ICON_OFFSET);
        var r_count = new Rectangle(bbox.bottomLeft, r_size);
        this.label_box = _utils.AMES_Utils.make_rect(r_count, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
        this.count_box = new Group();
        this.count_box.addChildren([this.label_count, this.text_count, this.label_box]);
        var TL = 1;
        this.label_box_offset = this.label_box.position.subtract(this.label_box.segments[TL].point);
      }
    }
  }, {
    key: "make_interactive",
    value: function make_interactive() {
      console.log("To do -- List.make_interactive()");
    }
  }, {
    key: "manipulate",
    value: function manipulate(p, sub) {
      this._clear_cb_helpers();

      for (var i in this.shapes) {
        this.shapes[i]._clear_cb_helpers();
      }

      console.log("Manipulate list", p, sub); // Turn off the active property

      if (this.active_prop) {
        // Remove subproperty buttons
        this.editor.show_subprops(this.active_prop, false);
        this.editor.select_prop(this.active_prop, false); // this.editor.show_constraint(false);

        for (var _i2 in this.shapes) {
          if (this.shapes[_i2].active_prop == p) this.shapes[_i2].manipulate(p);
        }
      } // If the new propety is not the property just turned off, turn it on


      if (this.active_prop != p) {
        // Turn off selection toggle and hide path control shapes
        this.attach_interactivity(false); // this.show_path_control_shapes(false);
        // Activate new propety callback

        this.active_prop = p;
        var sub_p = 'all';
        this.active_sub_p = sub_p;

        for (var _i3 in this.shapes) {
          console.log('...iterating over', this.shapes[_i3].name);

          if (this.shapes[_i3].active_prop == p) {
            this.shapes[_i3].manipulate_helper('all');
          } else {
            this.shapes[_i3].manipulate(p, sub);
          }
        } // this.cbs[p](this, this.cb_helpers);
        // Indicate active property and show subproperty buttons


        this.editor.show_subprops(p, true);
        this.editor.select_prop(p, true); // this.editor.show_constraint(true, p, sub_p);

        this.active_prop = p;
        this.active_sub_p = sub_p;
      } else {
        // Turn selection toggle back on
        this.attach_interactivity(true); // Deactivate property and subproperty

        this.active_prop = null;
        this.active_sub_p = null;
      }
    }
  }, {
    key: "set_active_obj",
    value: function set_active_obj(obj) {
      this.active_obj = obj; // this.editor.update_constraint(this.active_prop, this.active_sub_p);
    }
  }, {
    key: "manipulate_helper",
    value: function manipulate_helper(sub) {
      this._clear_cb_helpers();

      this.active_sub_p = sub; // this.editor.show_constraint(true, this.active_prop, sub);

      for (var i in this.shapes) {
        this.shapes[i].manipulate_helper(sub);
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
    } // attach_interactivity: if true, enable interactivity on child shapes; otherwise disable

  }, {
    key: "attach_interactivity",
    value: function attach_interactivity(bool) {
      var _this3 = this;

      for (var i in this.shapes) {
        if (this.shapes[i].poly) {
          if (bool) {
            this.shapes[i].poly.onClick = function (e) {
              var toggle = !_this3.is_selected;

              _this3.select(toggle);
            };
          } else {
            this.shapes[i].poly.onClick = null;
          }
        } // Make all other handlers void


        this.shapes[i].poly.onMouseDrag = null;
      }
    } // select: if true, select object and opens editor; otherwise deselect and close

  }, {
    key: "select",
    value: function select(bool) {
      if (this.poly) {
        // this.poly.fullySelected = bool;
        this.is_selected = bool;
      }
    } // contains: true if list contains point and point is not inside a shape of the list that
    // is currently active; false otherwise

  }, {
    key: "contains",
    value: function contains(p) {
      var b = this.list_box.strokeBounds;

      if (b) {
        var in_other_shape = false;

        if (p.isInside(b)) {
          for (var i in this.shapes) {
            var is_active = ames.active_objs[this.shapes[i].name];
            if (is_active && this.shapes[i].contains(p)) in_other_shape = true;
          }

          if (in_other_shape) return false;else return true;
        }
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove() {
      console.log("To do -- List.remove()");

      for (var i in this.shapes) {
        var a = this.shapes[i];
        a.remove_collection(this);
      }

      this.show(false);
      ames.update_layers({
        "remove": true,
        "box": ames.obj_boxes_dict[this.name]
      });
    } // make_list_group() {
    // 	let box = new Group();
    // 	for (let i in this.shapes) {
    // 		box.addChild(this.shapes[i].poly);
    // 	}
    // 	return box;
    // }
    //
    // empty_list_group(box) {
    // 	for (let i in box.children) {
    // 		box.children[i].addTo(ames.canvas_view._project);
    // 	}
    // }
    // get_bbox: returns the bounding box of the group containing the list items

  }, {
    key: "get_bbox",
    value: function get_bbox() {
      // let bbox;
      // let box = this.make_list_group();
      // if (box.strokeBounds) bbox = box.strokeBounds;
      // else bbox = box.bounds;
      // this.empty_list_group(box);
      var xmin = Number.MAX_VALUE;
      var ymin = Number.MAX_VALUE;
      var xmax = Number.MIN_VALUE;
      var ymax = Number.MIN_VALUE;

      for (var i in this.shapes) {
        var box = this.shapes[i].get_bbox();
        var TL = box.topLeft;
        var BR = box.bottomRight;
        if (TL.x < xmin) xmin = TL.x;
        if (TL.y < ymin) ymin = TL.y;
        if (BR.x > xmax) xmax = BR.x;
        if (BR.y > ymax) ymax = BR.y;
      }

      var bbox = new Rectangle(new Point(xmin, ymin), new Point(xmax, ymax));
      return bbox;
      ;
    }
  }, {
    key: "highlight",
    value: function highlight(color) {
      var r = _utils.AMES_Utils.make_rect(this.list_box.strokeBounds, color);

      r.insertBelow(this.list_box);
      return r;
    }
  }, {
    key: "get_closest_bbox_corner",
    value: function get_closest_bbox_corner(p) {
      return null; // nb: better UX
    } // get_pos: returns position of list

  }, {
    key: "get_pos",
    value: function get_pos() {
      var box = this.make_list_group();
      var p = box.position;
      console.log(p);
      this.empty_list_group(box);
      return p;
    }
  }, {
    key: "show_path_control_shapes",
    value: function show_path_control_shapes(bool) {}
  }], [{
    key: "update_constraints",
    value: function update_constraints(list) {
      var s = list.active_sub_p;
      if (!s) s = "all"; // AMES_Constraint.update_constraints(list.active_prop, s, list);
    }
  }]);

  return AMES_Collection;
}(); //
// export class AMES_Duplicator extends AMES_List {
// 	// Make control shapes list to control duplicator
// 	controls = {
// 		name: null,
// 		is_list: true,
// 		is_list_control: true,
// 		count: 0,
// 		shapes: [],
// 		parent: null,
// 		active_prop: null,
// 		active_sub_p: null,
// 		c_inbound: {
// 		   "position" : {"all": [], "x": [], "y": []},
// 		   "scale": {"all": [], "x": [], "y": []},
// 		   "rotation": {"all": [], "t": []},
// 		   "fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
// 		   "strokeWidth": {"all": [], "w": []},
// 		   "strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
// 		   "path" : {}
// 	   },
// 	   c_outbound: {
// 		   "position" : {"all": [], "x": [], "y": []},
// 		   "scale": {"all": [], "x": [], "y": []},
// 		   "rotation": {"all": [], "t": []},
// 		   "fillColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
// 		   "strokeWidth": {"all": [], "w": []},
// 		   "strokeColor": {"all": [], "h": [], "s": [], "v": [], "a": []},
// 		   "path" : {}
// 	   },
// 	   update_constraints: function() {
// 		   this.active_prop = this.parent.active_prop;
// 		   this.active_sub_p = this.parent.active_sub_p;
// 		   AMES_List.update_constraints(this);
// 		},
// 	   list_constraints: [],
// 	   update_list_constraints: function() { AMES.update_list_constraints(this) },
// 	   update_show_box_bounds: function() {},
// 	   manipulate: function(p, sub) { console.log("here..."); },
// 	   manipulate_helper: function(sub) { console.log("here..."); },
// 	   set_active_obj: function(s) { this.active_obj = s; }
// 	};
//
// 	constructor(shapes) {
// 		super(shapes);
//
// 		// AMES_List(controls);
//
// 		// Initialize control list (for now just first / last)
// 		// TO DO change to all original shapes
//
// 		this.controls.parent = this;
// 		this.controls.name = this.name + " Controls";
// 		this.add_to_control_list(shapes[0]);
// 		this.add_to_control_list(shapes[shapes.length-1]);
// 		console.log(this.controls.shapes);
//
// 		// // Self constrain child list with all duplicator shapes to parent
// 		// for (let i = 0; i < utils.VIS_PROPS.length; i++) {
// 		// 	let p = utils.VIS_PROPS[i];
// 		// 	if (p != 'path') {
// 		// 		let c = new AMES_Constraint(this, this.controls, p, 'all');
// 		// 	}
// 		// }
//
// 		let c = new AMES_Constraint(this, this.controls, 'position', 'all');
// 		console.log("is self-referencing?", c.is_self_referencing);
// 		c.is_manual_constraint = true;
// 		this.active_prop = 'position';
// 		super.update_constraints();
// 		this.active_prop = null;
// 	}
//
// 	add_to_control_list(s) {
// 		let controls = this.controls;
// 		if (controls.shapes.length > 0) {
// 			let fs = controls.shapes[0];
// 			let ls = controls.shapes[controls.shapes.length - 1];
// 			// Remove constraint connecting ls to fs
// 			for (let i = 0; i < utils.VIS_PROPS.length; i++) {
// 				let p = utils.VIS_PROPS[i];
// 				if (p != 'path') {
// 					if (controls.shapes.length > 1) {
// 						let oc;
// 						for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
// 							let sub = utils.SUB_PROPS[p][sub_idx];
// 							oc = ls.c_outbound[p][sub][fs.name];
// 							controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
// 							oc.remove();
// 						}
// 						oc = ls.c_outbound[p]['all'][fs.name];
// 						controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
// 						oc.remove();
// 					}
//
// 					let c_append = new AMES_Constraint(s, ls, p, 'all');
// 					let c_loop = new AMES_Constraint(fs, s, p, 'all');
//
// 					controls.list_constraints.push(c_append);
// 					controls.list_constraints.push(c_loop);
//
// 					for (let sub_idx = 0; sub_idx < utils.SUB_PROPS[p].length; sub_idx++) {
// 						let sub = utils.SUB_PROPS[p][sub_idx];
// 						controls.list_constraints.push(s.c_inbound[p][sub][ls.name]);
// 						controls.list_constraints.push(fs.c_inbound[p][sub][s.name]);
// 					}
// 				}
// 			}
// 		}
// 		controls.count += 1;
// 		controls.shapes.push(s);
// 		s.add_list(controls);
//
// 		// TO DO: Make this touch screen friendly
// 		s.poly.on("doubleclick", (e) => {
// 			// Change offset mode for all lists that contain shape
// 			console.log(this.name, "changed offset mode to", !controls.offset_mode);
// 			controls.offset_mode = !this.offset_mode;
// 			this.update_controls_offset_mode();
// 		})
// 	}
//
//
// 	update_offset_mode() {
// 		super.update_offset_mode();
// 		this.controls.offset_mode = this.offset_mode;
// 	}
//
// 	update_controls_offset_mode() {
//
// 	}
// }


exports.AMES_Collection = AMES_Collection;

_defineProperty(AMES_Collection, "type_count", 1);
},{"./artwork.js":4,"./constraints.js":6,"./editors.js":7,"./shapes.js":9,"./utils.js":11}],6:[function(require,module,exports){
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
},{"./utils.js":11}],7:[function(require,module,exports){
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
    box.addChild(n_text);
    this.name_label = n_text; // Add close icon

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
        // fillColor: utils.INACTIVE_DARK_COLOR,
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

    _this11 = _super3.call(this, obj);

    _defineProperty(_assertThisInitialized(_this11), "rel_idx_val", void 0);

    _defineProperty(_assertThisInitialized(_this11), "e_height", 175);

    _this11.name_label.onClick = function (e) {
      console.log("Click shortcut to sort right to left:", _this11.obj.name);
      console.log(_this11.obj.shapes);

      _this11.obj.sort_right_to_left();

      console.log(_this11.obj.shapes);
    }; // this.add_relative_index_to_constraint_info();


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
},{"./artwork.js":4,"./collection.js":5,"./utils.js":11}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Duplicator = exports.AMES_List = void 0;

var _utils = require("./utils.js");

var _constraints = require("./constraints.js");

var _shapes = require("./shapes.js");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AMES_List = /*#__PURE__*/function () {
  function AMES_List(shapes, opt) {
    var _this = this;

    _classCallCheck(this, AMES_List);

    _defineProperty(this, "name", "List");

    _defineProperty(this, "is_geometry", true);

    _defineProperty(this, "is_list", true);

    _defineProperty(this, "shapes", []);

    _defineProperty(this, "original_shapes", []);

    _defineProperty(this, "count", 1);

    _defineProperty(this, "box", void 0);

    _defineProperty(this, "editor", void 0);

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

    _defineProperty(this, "c_inbound", {
      "position": {
        "all": [],
        "x": [],
        "y": []
      },
      "scale": {
        "all": [],
        "x": [],
        "y": []
      },
      "rotation": {
        "all": [],
        "t": []
      },
      "fillColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "strokeWidth": {
        "all": [],
        "w": []
      },
      "strokeColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "path": {}
    });

    _defineProperty(this, "c_outbound", {
      "position": {
        "all": [],
        "x": [],
        "y": []
      },
      "scale": {
        "all": [],
        "x": [],
        "y": []
      },
      "rotation": {
        "all": [],
        "t": []
      },
      "fillColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "strokeWidth": {
        "all": [],
        "w": []
      },
      "strokeColor": {
        "all": [],
        "h": [],
        "s": [],
        "v": [],
        "a": []
      },
      "path": {}
    });

    _defineProperty(this, "list_constraints", []);

    _defineProperty(this, "offset_mode", false);

    _defineProperty(this, "is_para_style_list", true);

    opt = opt || {};
    if (opt.is_para_style_list) this.is_para_style_list = opt.is_para_style_list;
    if (opt.is_duplicator) this.is_duplicator = opt.is_duplicator;
    this.box = new Group();
    var n_list = ames.n_lists;
    this.name = "List " + ames.n_lists;
    console.log("Setting list name", this.name);
    this.count = shapes.length; // Sort shapes by x_position

    shapes.sort(function (a, b) {
      return a.pos.x - b.pos.x;
    });
    console.log(shapes);
    this.original_shapes = shapes;

    for (var idx in shapes) {
      var s = shapes[idx];
      this.add_to_list(s);
    }

    this._make_show_box();

    if (!ames.mode) ames.mode = 'list'; // TO DO: Make this touch screen friendly

    for (var i in this.shapes) {
      this.shapes[i].poly.on("doubleclick", function (e) {
        // Change offset mode for all lists that contain shape
        console.log(_this.name, "changed offset mode to", !_this.offset_mode);
        _this.offset_mode = !_this.offset_mode;

        _this.update_offset_mode();
      });
    }

    console.log("printing all ", ames.n_lists, " lists...");

    for (var _i in ames.lists) {
      console.log(ames.lists[_i].name, ames.lists[_i].box.children);
    }

    this.active_obj = this.shapes[0];
  }

  _createClass(AMES_List, [{
    key: "update_offset_mode",
    value: function update_offset_mode() {
      for (var i in this.list_constraints) {
        this.list_constraints[i].offset_mode = this.offset_mode;
      }
    } // show_editor: if true open editor; otherwise close;

  }, {
    key: "show_editor",
    value: function show_editor(bool) {
      if (this.editor) {
        this.editor.show(bool);
        this.show_box(bool);

        if (!bool) {
          if (this.active_prop) this.manipulate(this.active_prop);
        }
      }
    } // has_shape: returns whether or not the shape is in the list

  }, {
    key: "has_shape",
    value: function has_shape(x) {
      for (var i in this.shapes) {
        if (this.shapes[i] == x) return true;
      }

      return false;
    }
  }, {
    key: "duplicate",
    value: function duplicate() {
      console.log("duplicator: ", this.is_duplicator, this.shapes);
      var original_shape = this.original_shapes[0];

      if (this.is_duplicator) {
        var shape = new _shapes.AMES_Shape();
        Object.assign(shape, original_shape);
        shape.editor = null;
        shape.poly = original_shape.poly.clone();
        console.log("...made new shape: ", shape);
        ames.add_shape(shape);
        console.log("...new shape editor:", shape.editor);
        this.shapes.push(shape);
        console.log("...new list contains: ", this.shapes);
        shape.set_pos(new Point(10, 10), true);
        this.show(true);
      }
    }
  }, {
    key: "add_to_list",
    value: function add_to_list(s) {
      if (!this.is_para_style_list && this.shapes.length > 0) {
        var fs = this.shapes[0];
        var ls = this.shapes[this.shapes.length - 1]; // Remove constraint connecting ls to fs

        for (var i = 0; i < _utils.AMES_Utils.VIS_PROPS.length; i++) {
          var p = _utils.AMES_Utils.VIS_PROPS[i];

          if (p != 'path') {
            if (this.shapes.length > 1) {
              var oc = void 0;

              for (var sub_idx = 0; sub_idx < _utils.AMES_Utils.SUB_PROPS[p].length; sub_idx++) {
                var sub = _utils.AMES_Utils.SUB_PROPS[p][sub_idx]; // console.log(sub);

                oc = ls.c_outbound[p][sub][fs.name];
                this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
                oc.remove();
              }

              oc = ls.c_outbound[p]['all'][fs.name];
              this.list_constraints.splice(this.list_constraints.indexOf(oc), 1);
              oc.remove();
            }

            var c_append = new _constraints.AMES_Constraint(s, ls, p, 'all');
            var c_loop = new _constraints.AMES_Constraint(fs, s, p, 'all');
            this.list_constraints.push(c_append);
            this.list_constraints.push(c_loop);

            for (var _sub_idx = 0; _sub_idx < _utils.AMES_Utils.SUB_PROPS[p].length; _sub_idx++) {
              var _sub = _utils.AMES_Utils.SUB_PROPS[p][_sub_idx];
              this.list_constraints.push(s.c_inbound[p][_sub][ls.name]);
              this.list_constraints.push(fs.c_inbound[p][_sub][s.name]);
            }
          }
        }
      }

      this.shapes.push(s);
      s.add_list(this);
    }
  }, {
    key: "update_constraints",
    value: function update_constraints() {
      AMES_List.update_constraints(this);
    }
  }, {
    key: "get_shape_names",
    value: function get_shape_names() {
      var str = "";

      for (var idx in this.shapes) {
        if (idx != 0 && idx != this.shapes.length) str += ", ";
        str += this.shapes[idx].name;
      }

      return str;
    } // show: if true, show; otherwise hide

  }, {
    key: "show",
    value: function show(bool) {
      this.show_editor(bool);

      if (bool) {
        this._update_list();
      }
    } // _update_list: updates the artwork that the list contains

  }, {
    key: "_update_list",
    value: function _update_list() {
      // Use functions based on self-referencing constraints to define
      // visual artwork in the list
      for (var idx = 0; idx < this.count; idx++) {// Create symbol using shape function
        // let s = this._get_shape(idx);
        // Set position
        // Set rotation
      }
    }
  }, {
    key: "remove_item",
    value: function remove_item() {
      if (this.count == 1) return;
      this.count = this.count - 1;
      this.update_show_box();
    }
  }, {
    key: "add_item",
    value: function add_item() {
      this.count = this.count + 1;
      this.duplicate();
      this.update_show_box();
    }
  }, {
    key: "show_box",
    value: function show_box(bool) {
      // Highlight list and update bbox if necessary
      this.list_box.visible = bool;
      this.label_box.visible = bool;
      this.label_count.visible = bool;
      this.text_count.visible = bool;
    }
  }, {
    key: "update_show_box",
    value: function update_show_box() {
      this.update_show_box_count();
      this.update_show_box_bounds();
    }
  }, {
    key: "update_show_box_bounds",
    value: function update_show_box_bounds() {
      var TL = 1;
      var BL = 0;
      var bbox = this.get_bbox(); // console.log(this.name, 'update_show_box', this.box.children);

      var x_off = 20 / (bbox.width + 20);
      var y_off = 20 / (bbox.height + 20);
      bbox = bbox.scale(1 + x_off, 1 + y_off);
      var is_visible = this.list_box.visible;
      this.list_box.remove();
      this.list_box = _utils.AMES_Utils.make_rect(bbox, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
      this.list_box.visible = is_visible;
      this.count_box.position = this.list_box.segments[BL].point.add(this.label_box_offset);
    } // update_show_box_count: updates count box value to match list count of items in list

  }, {
    key: "update_show_box_count",
    value: function update_show_box_count() {
      this.text_count.content = this.count;
    }
  }, {
    key: "_make_show_box",
    value: function _make_show_box() {
      var _this2 = this;

      var bbox = this.get_bbox();
      var x_off = 20 / (bbox.width + 20);
      var y_off = 20 / (bbox.height + 20);
      bbox = bbox.scale(1 + x_off, 1 + y_off);
      this.list_box = _utils.AMES_Utils.make_rect(bbox, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
      this.list_box.visible = false;
      this.label_count = new PointText({
        point: [bbox.bottomLeft.x + _utils.AMES_Utils.ICON_OFFSET, bbox.bottomLeft.y + _utils.AMES_Utils.ICON_OFFSET * 2.5],
        content: 'count:',
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        fillColor: _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR
      });
      var x = this.label_count.bounds.bottomRight.x + _utils.AMES_Utils.ICON_OFFSET;
      this.text_count = new PointText({
        point: [x, bbox.bottomLeft.y + _utils.AMES_Utils.ICON_OFFSET * 2.5],
        content: this.count,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE,
        fillColor: _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR
      });

      this.text_count.onMouseDown = function (e) {
        ames.canvas.style.cursor = 'move';
      };

      var total_drag = 0;

      this.text_count.onMouseDrag = function (e) {
        // ames.canvas.style.cursor = null;
        total_drag += e.event.movementX;
        if (total_drag < 0) ames.canvas.style.cursor = 'w-resize';
        if (total_drag > 0) ames.canvas.style.cursor = 'e-resize';

        if (total_drag < -10) {
          _this2.remove_item();

          total_drag = 0;
        }

        if (total_drag > 10) {
          _this2.add_item();

          total_drag = 0;
        }
      };

      this.text_count.onMouseUp = function (e) {
        ames.canvas.style.cursor = null;
        total_drag = 0;
      };

      console.log('count', '' + this.count);
      var r_size = new Size(this.label_count.bounds.width + this.text_count.bounds.width + _utils.AMES_Utils.ICON_OFFSET * 5, this.label_count.bounds.height + _utils.AMES_Utils.ICON_OFFSET);
      var r_count = new Rectangle(bbox.bottomLeft, r_size);
      console.log(r_size);
      console.log(r_count);
      this.label_box = _utils.AMES_Utils.make_rect(r_count, _utils.AMES_Utils.LIST_HIGHLIGHT_COLOR);
      this.count_box = new Group();
      this.count_box.addChildren([this.label_count, this.text_count, this.label_box]);
      var TL = 1;
      this.label_box_offset = this.label_box.position.subtract(this.label_box.segments[TL].point);
    }
  }, {
    key: "make_interactive",
    value: function make_interactive() {
      console.log("To do -- List.make_interactive()");
    }
  }, {
    key: "manipulate",
    value: function manipulate(p, sub) {
      this._clear_cb_helpers();

      console.log("Manipulate list", p, sub); // Turn off the active property

      if (this.active_prop) {
        // Remove subproperty buttons
        this.editor.show_subprops(this.active_prop, false);
        this.editor.select_prop(this.active_prop, false);
        this.editor.show_constraint(false);

        for (var i in this.shapes) {
          if (this.shapes[i].active_prop == p) this.shapes[i].manipulate(p);
        }
      } // If the new propety is not the property just turned off, turn it on


      if (this.active_prop != p) {
        // Turn off selection toggle and hide path control shapes
        this.attach_interactivity(false); // this.show_path_control_shapes(false);
        // Activate new propety callback

        this.active_prop = p;
        var sub_p = 'all';
        this.active_sub_p = sub_p;

        for (var _i2 in this.shapes) {
          console.log('...iterating over', this.shapes[_i2].name);

          if (this.shapes[_i2].active_prop == p) {
            this.shapes[_i2].manipulate_helper('all');
          } else {
            this.shapes[_i2].manipulate(p, sub);
          }
        } // this.cbs[p](this, this.cb_helpers);
        // Indicate active property and show subproperty buttons


        this.editor.show_subprops(p, true);
        this.editor.select_prop(p, true);
        this.editor.show_constraint(true, p, sub_p);
        this.active_prop = p;
        this.active_sub_p = sub_p;
      } else {
        // Turn selection toggle back on
        this.attach_interactivity(true); // Deactivate property and subproperty

        this.active_prop = null;
        this.active_sub_p = null;
      }
    }
  }, {
    key: "set_active_obj",
    value: function set_active_obj(obj) {
      this.active_obj = obj;
      this.editor.update_constraint(this.active_prop, this.active_sub_p);
    }
  }, {
    key: "manipulate_helper",
    value: function manipulate_helper(sub) {
      this._clear_cb_helpers();

      this.active_sub_p = sub;
      this.editor.show_constraint(true, this.active_prop, sub);

      for (var i in this.shapes) {
        this.shapes[i].manipulate_helper(sub);
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
    } // attach_interactivity: if true, enable interactivity on child shapes; otherwise disable

  }, {
    key: "attach_interactivity",
    value: function attach_interactivity(bool) {
      var _this3 = this;

      for (var i in this.shapes) {
        if (this.shapes[i].poly) {
          if (bool) {
            this.shapes[i].poly.onClick = function (e) {
              var toggle = !_this3.is_selected;

              _this3.select(toggle);
            };
          } else {
            this.shapes[i].poly.onClick = null;
          }
        } // Make all other handlers void


        this.shapes[i].poly.onMouseDrag = null;
      }
    } // select: if true, select object and opens editor; otherwise deselect and close

  }, {
    key: "select",
    value: function select(bool) {
      if (this.poly) {
        // this.poly.fullySelected = bool;
        this.is_selected = bool;
      }
    } // contains: true if list contains point and point is not inside a shape of the list that
    // is currently active; false otherwise

  }, {
    key: "contains",
    value: function contains(p) {
      var b = this.list_box.strokeBounds;

      if (b) {
        var in_other_shape = false;

        if (p.isInside(b)) {
          for (var i in this.shapes) {
            var is_active = ames.active_objs[this.shapes[i].name];
            if (is_active && this.shapes[i].contains(p)) in_other_shape = true;
          }

          if (in_other_shape) return false;else return true;
        }
      }

      return false;
    }
  }, {
    key: "remove",
    value: function remove() {
      console.log("To do -- List.remove()");
    }
  }, {
    key: "make_list_group",
    value: function make_list_group() {
      var box = new Group();

      for (var i in this.shapes) {
        box.addChild(this.shapes[i].poly);
      }

      return box;
    }
  }, {
    key: "empty_list_group",
    value: function empty_list_group(box) {
      for (var i in box.children) {
        box.children[i].addTo(ames.canvas_view._project);
      }
    } // get_bbox: returns the bounding box of the group containing the list items

  }, {
    key: "get_bbox",
    value: function get_bbox() {
      var bbox;
      var box = this.make_list_group();
      if (box.strokeBounds) bbox = box.strokeBounds;else bbox = box.bounds;
      this.empty_list_group(box);
      return bbox;
      ;
    }
  }, {
    key: "highlight",
    value: function highlight(color) {
      var r = _utils.AMES_Utils.make_rect(this.list_box.strokeBounds, color);

      r.insertBelow(this.list_box);
      return r;
    }
  }, {
    key: "get_closest_bbox_corner",
    value: function get_closest_bbox_corner(p) {
      return null; // nb: better UX
    } // get_pos: returns position of list

  }, {
    key: "get_pos",
    value: function get_pos() {
      var box = this.make_list_group();
      var p = box.position;
      console.log(p);
      this.empty_list_group(box);
      return p;
    }
  }, {
    key: "show_path_control_shapes",
    value: function show_path_control_shapes(bool) {}
  }], [{
    key: "update_constraints",
    value: function update_constraints(list) {
      var s = list.active_sub_p;
      if (!s) s = "all";

      _constraints.AMES_Constraint.update_constraints(list.active_prop, s, list);
    }
  }]);

  return AMES_List;
}();

exports.AMES_List = AMES_List;

var AMES_Duplicator = /*#__PURE__*/function (_AMES_List) {
  _inherits(AMES_Duplicator, _AMES_List);

  var _super = _createSuper(AMES_Duplicator);

  // Make control shapes list to control duplicator
  function AMES_Duplicator(shapes) {
    var _thisSuper, _this4;

    _classCallCheck(this, AMES_Duplicator);

    _this4 = _super.call(this, shapes); // AMES_List(controls);
    // Initialize control list (for now just first / last)
    // TO DO change to all original shapes

    _defineProperty(_assertThisInitialized(_this4), "controls", {
      name: null,
      is_list: true,
      is_list_control: true,
      count: 0,
      shapes: [],
      parent: null,
      active_prop: null,
      active_sub_p: null,
      c_inbound: {
        "position": {
          "all": [],
          "x": [],
          "y": []
        },
        "scale": {
          "all": [],
          "x": [],
          "y": []
        },
        "rotation": {
          "all": [],
          "t": []
        },
        "fillColor": {
          "all": [],
          "h": [],
          "s": [],
          "v": [],
          "a": []
        },
        "strokeWidth": {
          "all": [],
          "w": []
        },
        "strokeColor": {
          "all": [],
          "h": [],
          "s": [],
          "v": [],
          "a": []
        },
        "path": {}
      },
      c_outbound: {
        "position": {
          "all": [],
          "x": [],
          "y": []
        },
        "scale": {
          "all": [],
          "x": [],
          "y": []
        },
        "rotation": {
          "all": [],
          "t": []
        },
        "fillColor": {
          "all": [],
          "h": [],
          "s": [],
          "v": [],
          "a": []
        },
        "strokeWidth": {
          "all": [],
          "w": []
        },
        "strokeColor": {
          "all": [],
          "h": [],
          "s": [],
          "v": [],
          "a": []
        },
        "path": {}
      },
      update_constraints: function update_constraints() {
        this.active_prop = this.parent.active_prop;
        this.active_sub_p = this.parent.active_sub_p;
        AMES_List.update_constraints(this);
      },
      list_constraints: [],
      update_list_constraints: function update_list_constraints() {
        AMES.update_list_constraints(this);
      },
      update_show_box_bounds: function update_show_box_bounds() {},
      manipulate: function manipulate(p, sub) {
        console.log("here...");
      },
      manipulate_helper: function manipulate_helper(sub) {
        console.log("here...");
      },
      set_active_obj: function set_active_obj(s) {
        this.active_obj = s;
      }
    });

    _this4.controls.parent = _assertThisInitialized(_this4);
    _this4.controls.name = _this4.name + " Controls";

    _this4.add_to_control_list(shapes[0]);

    _this4.add_to_control_list(shapes[shapes.length - 1]);

    console.log(_this4.controls.shapes); // // Self constrain child list with all duplicator shapes to parent
    // for (let i = 0; i < utils.VIS_PROPS.length; i++) {
    // 	let p = utils.VIS_PROPS[i];
    // 	if (p != 'path') {
    // 		let c = new AMES_Constraint(this, this.controls, p, 'all');
    // 	}
    // }

    var c = new _constraints.AMES_Constraint(_assertThisInitialized(_this4), _this4.controls, 'position', 'all');
    console.log("is self-referencing?", c.is_self_referencing);
    c.is_manual_constraint = true;
    _this4.active_prop = 'position';

    _get((_thisSuper = _assertThisInitialized(_this4), _getPrototypeOf(AMES_Duplicator.prototype)), "update_constraints", _thisSuper).call(_thisSuper);

    _this4.active_prop = null;
    return _this4;
  }

  _createClass(AMES_Duplicator, [{
    key: "add_to_control_list",
    value: function add_to_control_list(s) {
      var _this5 = this;

      var controls = this.controls;

      if (controls.shapes.length > 0) {
        var fs = controls.shapes[0];
        var ls = controls.shapes[controls.shapes.length - 1]; // Remove constraint connecting ls to fs

        for (var i = 0; i < _utils.AMES_Utils.VIS_PROPS.length; i++) {
          var p = _utils.AMES_Utils.VIS_PROPS[i];

          if (p != 'path') {
            if (controls.shapes.length > 1) {
              var oc = void 0;

              for (var sub_idx = 0; sub_idx < _utils.AMES_Utils.SUB_PROPS[p].length; sub_idx++) {
                var sub = _utils.AMES_Utils.SUB_PROPS[p][sub_idx];
                oc = ls.c_outbound[p][sub][fs.name];
                controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
                oc.remove();
              }

              oc = ls.c_outbound[p]['all'][fs.name];
              controls.list_constraints.splice(controls.list_constraints.indexOf(oc), 1);
              oc.remove();
            }

            var c_append = new _constraints.AMES_Constraint(s, ls, p, 'all');
            var c_loop = new _constraints.AMES_Constraint(fs, s, p, 'all');
            controls.list_constraints.push(c_append);
            controls.list_constraints.push(c_loop);

            for (var _sub_idx2 = 0; _sub_idx2 < _utils.AMES_Utils.SUB_PROPS[p].length; _sub_idx2++) {
              var _sub2 = _utils.AMES_Utils.SUB_PROPS[p][_sub_idx2];
              controls.list_constraints.push(s.c_inbound[p][_sub2][ls.name]);
              controls.list_constraints.push(fs.c_inbound[p][_sub2][s.name]);
            }
          }
        }
      }

      controls.count += 1;
      controls.shapes.push(s);
      s.add_list(controls); // TO DO: Make this touch screen friendly

      s.poly.on("doubleclick", function (e) {
        // Change offset mode for all lists that contain shape
        console.log(_this5.name, "changed offset mode to", !controls.offset_mode);
        controls.offset_mode = !_this5.offset_mode;

        _this5.update_controls_offset_mode();
      });
    }
  }, {
    key: "update_offset_mode",
    value: function update_offset_mode() {
      _get(_getPrototypeOf(AMES_Duplicator.prototype), "update_offset_mode", this).call(this);

      this.controls.offset_mode = this.offset_mode;
    }
  }, {
    key: "update_controls_offset_mode",
    value: function update_controls_offset_mode() {}
  }]);

  return AMES_Duplicator;
}(AMES_List);

exports.AMES_Duplicator = AMES_Duplicator;
},{"./constraints.js":6,"./shapes.js":9,"./utils.js":11}],9:[function(require,module,exports){
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
},{"./constraints.js":6,"./utils.js":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transformation_Space = exports.AMES_Transformation = void 0;

var _utils = require("./utils.js");

var _editors = require("./editors.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AMES_Transformation = /*#__PURE__*/function () {
  // artwork or collection of artwork impacted
  // artwork or collection driving the transformation
  // transformation function (e.g. translation or scale vs index)
  // many:many mapping behavior
  // coord space used to interpret the input artwork
  // supported transformations
  // TF space
  // The number of frames used to interpret the path
  // Scale factor using average length
  // # of segments to traverse per frame
  // How speed is represented (constant, linear, xaxis, yaxis, map)
  // opt
  // pointers to the cues that trigger this transformation
  // projection of transformation space onto the target artwork
  // points that are cues that trigger other transformations
  function AMES_Transformation(_opt) {
    _classCallCheck(this, AMES_Transformation);

    _defineProperty(this, "target", void 0);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "mapping", void 0);

    _defineProperty(this, "mapping_behavior", void 0);

    _defineProperty(this, "transformation_space", void 0);

    _defineProperty(this, "obj_box", null);

    _defineProperty(this, "is_transformation", true);

    _defineProperty(this, "mapping", 0);

    _defineProperty(this, "mapping_behavior", "interpolate");

    _defineProperty(this, "mappings", ["motion path", "static scale", "scale animation", "duplicate each", "hue", "position", "fill-hue", "duplicate"]);

    _defineProperty(this, "typed_mappings", [{
      "mapping_type": "Polygon",
      "mapping": "number of sides"
    }, {
      "mapping_type": "Vertex",
      "mapping": "relative position"
    }, {
      "mapping_type": "Vertex",
      "mapping": "relative animation"
    }, {
      "mapping_type": "Transformation",
      "mapping": "playback"
    }]);

    _defineProperty(this, "MOTION_PATH", 0);

    _defineProperty(this, "STATIC_SCALE", 1);

    _defineProperty(this, "SCALE", 2);

    _defineProperty(this, "DUPLICATE_EACH", 3);

    _defineProperty(this, "HUE", 4);

    _defineProperty(this, "POSITION", 5);

    _defineProperty(this, "FILL_HUE", 6);

    _defineProperty(this, "DUPLICATE", 7);

    _defineProperty(this, "NUMBER_OF_SIDES", -1);

    _defineProperty(this, "RELATIVE_POSITION", -2);

    _defineProperty(this, "RELATIVE_ANIMATION", -3);

    _defineProperty(this, "PLAYBACK", -4);

    _defineProperty(this, "tf_space_absolute", true);

    _defineProperty(this, "tf_mx", void 0);

    _defineProperty(this, "tf_mx_range", {
      "min": 0,
      "max": 1
    });

    _defineProperty(this, "tf_sx", 1);

    _defineProperty(this, "tf_my", void 0);

    _defineProperty(this, "tf_my_range", {
      "min": 0,
      "max": 1
    });

    _defineProperty(this, "tf_sy", 1);

    _defineProperty(this, "tf_mp", void 0);

    _defineProperty(this, "tf_space_path_nsegments", void 0);

    _defineProperty(this, "tf_space_path_length_relative_scale", void 0);

    _defineProperty(this, "tf_space_speed_factor", 1);

    _defineProperty(this, "tf_space_speed", void 0);

    _defineProperty(this, "SPEED_CONSTANT", 0);

    _defineProperty(this, "SPEED_LINEAR", 1);

    _defineProperty(this, "SPEED_XAXIS", 2);

    _defineProperty(this, "SPEED_YAXIS", 3);

    _defineProperty(this, "SPEED_MAP", 4);

    _defineProperty(this, "loop", false);

    _defineProperty(this, "LOOP_INFINITY", -1);

    _defineProperty(this, "loop_max_count", 100);

    _defineProperty(this, "check_playback_points", true);

    _defineProperty(this, "playback_triggers", void 0);

    _defineProperty(this, "transformed_space", void 0);

    _defineProperty(this, "playback_cues", void 0);

    _defineProperty(this, "start_state_idx", 0);

    _defineProperty(this, "play_helper", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(opt) {
        var _this = this;

        var state_idx, a, a_idx, a_smooth, v_idx, stop_state_idx, timing_factor, reverse, n_target, nxt_state_idx, sv, _sv, DELTA, DURATION;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                opt = opt || {};
                if (opt.state_idx != null) state_idx = Number(opt.state_idx);
                if (opt.a != null) a = opt.a;
                if (opt.a_idx != null) a_idx = Number(opt.a_idx);
                if (opt.a_smooth != null) a_smooth = opt.a_smooth;
                if (opt.v_idx != null) v_idx = Number(opt.v_idx);
                if (opt.stop_state_idx != null) stop_state_idx = Number(opt.stop_state_idx);else stop_state_idx = this.tf_space_path_nsegments;
                if (opt.timing_factor != null) timing_factor = Number(opt.timing_factor);else timing_factor = 1;
                if (opt.reverse != null) reverse = opt.reverse;else reverse = false;
                if (opt.n_target) n_target = opt.n_target;else n_target = this.n_target;
                nxt_state_idx = state_idx + 1;
                if (reverse) nxt_state_idx = state_idx - 1; // Base case with support for looping

                if (!(!reverse && state_idx >= stop_state_idx || reverse && state_idx <= stop_state_idx)) {
                  _context.next = 29;
                  break;
                }

                if (!(stop_state_idx == this.tf_space_path_nsegments)) {
                  _context.next = 28;
                  break;
                }

                if (this.mapping == this.PLAYBACK) {
                  console.log("end state for playback transformation of artwork: ", a_idx);
                  console.log(this.curr_remainder[a_idx], this.curr_state[a_idx], state_idx, stop_state_idx);
                }

                this.trigger_end(a, a_idx); // console.log(this.name, a.name, "play from state a to b", state_idx, nxt_state_idx, "reverse?", reverse);

                if (!(this.loop && (this.loop_max_count == this.LOOP_INFINITY || this.loop_count[a_idx] < this.loop_max_count))) {
                  _context.next = 24;
                  break;
                }

                // console.log("reset?");
                state_idx = 0;
                nxt_state_idx = 1;

                if (this.loop_max_count != this.LOOP_INFINITY) {
                  this.loop_count[a_idx] += 1;
                }

                if (this.target.is_transformation) this.target.setup_playback_trackers();

                if (this.tf_space_absolute) {
                  if (this.mapping == this.PLAYBACK) {
                    if (this.target.tf_space_absolute) {
                      console.log("looping playback function: ", this.target.n_target);
                      sv = this.target.get_value_at_target_index_for_path_offset(a_idx, 0, this.target.n_target);
                      this.target.set_artwork_value_to(a, sv);
                    }

                    this.curr_state[a_idx] = 0;
                    this.curr_remainder[a_idx] = 0;
                  } else {
                    _sv = this.get_value_at_target_index_for_path_offset(a_idx, 0, n_target);
                    this.set_artwork_value_to(a, _sv);
                  }
                }

                _context.next = 26;
                break;

              case 24:
                this.is_playing[a_idx] = 0;
                return _context.abrupt("return");

              case 26:
                _context.next = 29;
                break;

              case 28:
                return _context.abrupt("return");

              case 29:
                DELTA = 0;
                DURATION = 1; // For a vertex animation

                if (this.vertex_mapping) {
                  (function () {
                    var n_segments = a.poly.segments.length;
                    var time = [];
                    var vertex_delta = [];
                    var max_time = 0;

                    for (var _v_idx = 0; _v_idx < n_segments; _v_idx++) {
                      var vertex_update = _this.get_transform_artwork_at_state(state_idx, _v_idx, nxt_state_idx);

                      var d = vertex_update[DELTA];
                      time[_v_idx] = vertex_update[DURATION];
                      if (time[_v_idx] > max_time) max_time = time[_v_idx];
                      var n = _this.vertex_normals[a_idx][_v_idx];
                      var t = _this.vertex_tangents[a_idx][_v_idx]; // let npath = new Path({
                      // 	segments: [p, p.add(n.multiply(20))],
                      // 	strokeColor: "red",
                      // 	strokeWidth: 1
                      // });
                      // npath.visible = false;
                      //
                      // let tpath = new Path({
                      // 	segments: [p, p.add(t.multiply(20))],
                      // 	strokeColor: "green",
                      // 	strokeWidth: 1
                      // });
                      // tpath.visible = false;

                      var nx = d.y * n.x + d.x * t.x;
                      var ny = d.y * n.y + d.x * t.y;
                      vertex_delta[_v_idx] = new Point(nx, ny);
                    }

                    var t_frame = 1000 / ames.fps;
                    var nframes = Math.ceil(max_time / t_frame);

                    _this.tween(a_idx, a, vertex_delta, nframes, state_idx);

                    for (var _n = 1; _n < nframes; _n++) {
                      setTimeout(function () {
                        _this.tween(a_idx, a, vertex_delta, nframes, state_idx);
                      }, _n * t_frame);
                    } // TODO deal with vertex duplication??
                    // Tween the updates across all vertices
                    // let t_frame = 1000/ames.fps;
                    // for (let v_idx = 0; v_idx < n_segments; v_idx++) {
                    // 	let t = time[v_idx]; let nframes = Math.ceil(t / t_frame);
                    // 	this.tween(a_idx, a, vertex_delta, nframes, state_idx);
                    //
                    // 	for (let n = 1;  n < nframes; n++) {
                    // 		setTimeout(() => {
                    // 			this.tween(a_idx, a, vertex_delta, nframes, state_idx);
                    // 		}, n*t_frame);
                    // 	}
                    // }


                    setTimeout(function () {
                      _this.play_helper({
                        "state_idx": nxt_state_idx,
                        "a": a,
                        "a_idx": a_idx,
                        "a_smooth": a_smooth,
                        "v_idx": v_idx,
                        "stop_state_idx": stop_state_idx,
                        "reverse": reverse,
                        "n_target": n_target
                      });
                    }, max_time * timing_factor);
                  })();
                } else {
                  (function () {
                    var update = _this.get_transform_artwork_at_state(state_idx, a_idx, nxt_state_idx, n_target);

                    var d = update[DELTA];
                    var t = update[DURATION]; // if (this.mapping == this.DUPLICATE_EACH || this.mapping == this.DUPLICATE) {
                    // 	this.tween(a_idx, a, d, 1, state_idx)
                    // } else {

                    var t_frame = 1000 / ames.fps;
                    var nframes = Math.ceil(t / t_frame);

                    _this.tween(a_idx, a, d, nframes, state_idx);

                    for (var n = 1; n < nframes; n++) {
                      setTimeout(function () {
                        _this.tween(a_idx, a, d, nframes, state_idx);
                      }, n * t_frame);
                    } // }


                    setTimeout(function () {
                      _this.play_helper({
                        "state_idx": nxt_state_idx,
                        "a": a,
                        "a_idx": a_idx,
                        "stop_state_idx": stop_state_idx,
                        "reverse": reverse,
                        "n_target": n_target
                      });
                    }, t * timing_factor);
                  })();
                }

              case 32:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    this.name = "Transformation" + " (" + AMES_Transformation.count + ")";
    AMES_Transformation.count += 1;
    _opt = _opt || {};
    this.tf_space_setup_visuals();
    if (_opt.input) this.set_input(_opt.input);else this.input = null;
    if (_opt.target) this.set_target(_opt.target);else this.target = null;
    if (_opt.mapping) this.set_mapping(_opt.mapping);else this.set_mapping("motion path");
    this.create_in_ames();
  }

  _createClass(AMES_Transformation, [{
    key: "create_in_ames",
    value: function create_in_ames() {
      this.create_editor();
      ames.add_obj(this);
      if (this.target) ames.update_layers({
        parent: true,
        parent_box: this.target.obj_box,
        box: this.obj_box
      });
    }
  }, {
    key: "create_editor",
    value: function create_editor() {
      this.editor = new _editors.AMES_Transformation_Editor(this);
      var bounds = this.editor.box.bounds;
      var w = bounds.width / 2 + _utils.AMES_Utils.ICON_OFFSET * 3 + 12.5;
      var x = ames.toolbar.get_position().x + w;
      var h = ames.canvas_view.size.height - 2 * _utils.AMES_Utils.ICON_OFFSET - bounds.height / 2;
      this.editor.box.position = new Point(x, h);
    } // set_input_artwork
    // ------------------------------------------------------------------------
    // Modifies the input artwork, setting or unsetting it accordingly
    //
    // @param: input - artwork or collection that represents transformation
    // or null

  }, {
    key: "set_input",
    value: function set_input(input) {
      console.log("set input", input);
      if (this.input && this.input.remove_transformation) this.input.remove_transformation(this);
      this.input = input;

      if (input) {
        if (input.is_collection) this.update_count(input);else this.n_input = 1;

        if (input.is_artwork || input.is_collection) {
          input.add_transformation(this);
        }

        this.tf_space_speed = this.SPEED_CONSTANT; // # of segments in the path,
        // i.e. if speed is 1, # of frames at frame rate to traverse transform
        // this.tf_space_path_nsegments = 1000;
        // let avg_path_length;
        // if (input.is_artwork) avg_path_length = this.input.poly.length;
        // if (input.is_collection) {
        // 	let total_length = 0;
        // 	for (let idx = 0; idx < this.n_input; idx++) {
        // 		total_length += this.input.shapes[idx].poly.length;
        // 	}
        // 	avg_path_length = total_length/this.n_input;
        // }
        // this.avg_path_length = avg_path_length;
        // this.tf_space_path_nsegments = Math.round(avg_path_length);

        this.set_tf_space_path_nsegments(input); // if (this.target && this.input) this.transform();

        if (this.input && this.mapping) this.set_tf_space_to_defaults();
      } else {
        for (var x in this.tf_s) {
          this.tf_s[x].remove();
        }
      }

      if (this.obj_box) this.obj_box.change_name();
    }
  }, {
    key: "set_tf_space_path_nsegments",
    value: function set_tf_space_path_nsegments(input) {
      if (!input) input = this.input;
      var avg_path_length;
      if (input.is_artwork) avg_path_length = this.input.poly.length;

      if (input.is_collection) {
        var total_length = 0;

        for (var idx = 0; idx < this.n_input; idx++) {
          total_length += this.input.shapes[idx].poly.length;
        }

        avg_path_length = total_length / this.n_input;
      }

      this.avg_path_length = avg_path_length;
      this.tf_space_path_nsegments = Math.round(avg_path_length);
    } // set_target_artwork
    // ------------------------------------------------------------------------
    // Modifies the target artwork that the transformation affects
    //
    // @param: target - target artwork or collection to be impacted
    // or null

  }, {
    key: "set_target",
    value: function set_target(target) {
      var change_target = true;

      if (target) {
        // If the mapping is typed, check the target is of the correct type
        if (this.mapping < 0) {
          var mapping_type = this.typed_mappings[-1 * this.mapping].mapping_type;
          var valid_type = this.check_valid_target_for_typed_mapping(target, mapping_type);
          if (!valid_type) change_target = false;
        }
      } else {
        change_target = true;
      }

      if (change_target) {
        this.target = target;
        console.log("set target to", target);

        if (target) {
          if (target.is_collection) this.update_count(target);else this.n_target = 1;
          this.setup_playback_trackers();
          ames.update_layers({
            parent: true,
            parent_box: this.target.obj_box,
            box: this.obj_box
          });
        }
      }
    } // update_count
    // ------------------------------------------------------------------------
    // Updates the count of items to in the input or target to match the count
    // of the given collection if that collection is the input or target
    //
    // @param: the collection with the updated count

  }, {
    key: "update_count",
    value: function update_count(collection) {
      if (this.input == collection) this.n_input = collection.count;
      if (this.target == collection) this.n_target = collection.count;
    } // Returns text describing the mapping type

  }, {
    key: "get_mapping",
    value: function get_mapping() {
      var m = Number(this.mapping);

      if (m >= 0) {
        return this.mappings[m];
      } else {
        var typed_mapping = this.typed_mappings[-1 * m - 1];
        if (typed_mapping) return typed_mapping.mapping_type + ": " + typed_mapping.mapping;
      }
    } // set_property_mapping
    // ------------------------------------------------------------------------
    //
    // @param: mapping - defines the mapping function used to interpret the
    // transformation
    //

  }, {
    key: "set_mapping",
    value: function set_mapping(mapping) {
      var changed_mapping = false;

      if (!mapping) {
        this.mapping = this.MOTION_PATH;
        changed_mapping = true;
      } // Check for mappings applicable to all types (vertices, artwork, objects)


      for (var x in this.mappings) {
        if (this.mappings[x] == mapping) {
          this.mapping = x;
          changed_mapping = true;
        }
      }

      this.vertex_mapping = false; // Check for mappings applicable to specific types (polygon, etc)

      if (mapping && mapping.type) {
        for (var _x2 in this.typed_mappings) {
          if (this.typed_mappings[_x2].mapping == mapping.mapping) {
            // If all the objects match, set the mapping accordingly
            var mapping_type = this.typed_mappings[_x2].mapping_type;

            if (this.check_valid_target_for_typed_mapping(this.target, mapping_type)) {
              this.mapping = -(Number(_x2) + 1);
              changed_mapping = true;
            }
          }
        }
      } // If the mapping changed update the transfromation space or throw err


      if (!changed_mapping) {
        console.log("Transformation: Invalid mapping");
        return false;
      } else {
        if (this.input) this.set_tf_space_to_defaults();
      }

      if (this.obj_box) this.obj_box.change_name(); // Indicate if transformation property is a playbale mapping

      if (this.mapping == this.MOTION_PATH) this.is_playable = true;
      if (this.mapping == this.NUMBER_OF_SIDES) this.is_playable = false;
      if (this.mapping == this.STATIC_SCALE) this.is_playable = false;
      if (this.mapping == this.SCALE) this.is_playable = true;
      if (this.mapping == this.HUE) this.is_playable = false;
      if (this.mapping == this.FILL_HUE) this.is_playable = false;
      if (this.mapping == this.POSITION) this.is_playable = false;
      if (this.mapping == this.RELATIVE_POSITION) this.is_playable = false;
      if (this.mapping == this.RELATIVE_ANIMATION) this.is_playable = true;

      if (this.mapping == this.DUPLICATE_EACH || this.mapping == this.DUPLICATE) {
        this.is_playable = true;
      }

      if (this.mapping == this.PLAYBACK) this.is_playable = true;
      return true;
    } // check_valid_target_for_mapping
    // ------------------------------------------------------------------------
    // Returns bool indicating if target matches type necessary for a typed
    // mapping such as number of sides (target must contain only polygons)

  }, {
    key: "check_valid_target_for_typed_mapping",
    value: function check_valid_target_for_typed_mapping(target, mapping_type) {
      var valid_type = false;

      if (mapping_type == "Vertex") {
        this.vertex_mapping = true;
        valid_type = true;
        return valid_type;
      } // Check all of the items in the target match the mapping


      if (mapping_type == "Transformation") {
        if (!this.target || this.target.is_transformation) valid_type = true;
      }

      if (!target) return true;

      if (target.is_artwork) {
        if (target.artwork_type == mapping_type) {
          valid_type = true;
        }
      } else if (target.is_collection) {
        valid_type = true;

        for (var a_idx in target.shapes) {
          if (target.shapes[a_idx].artwork_type != mapping_type) {
            valid_type = false;
          }
        }
      }

      return valid_type;
    }
  }, {
    key: "set_tf_space_to_defaults",
    value: function set_tf_space_to_defaults() {
      // Default size of transformation space is the bounding box of the input
      var bbox = null;

      if (this.input) {
        if (this.input.is_artwork || this.input.is_collection) {
          bbox = this.input.get_bbox();
        }
      } else {
        bbox = new Rectangle(ames.canvas_view.center, new Size(200, 100));
      }

      var BL = bbox.bottomLeft;
      var TL = bbox.topLeft;
      var TR = bbox.topRight;
      var BR = bbox.bottomRight;
      var eps = 1;
      var w; // Support for flat lines...

      if (-eps <= BL.y - TL.y && BL.y - TL.y <= 0 || 0 <= BL.y - TL.y && BL.y - TL.y <= eps) {
        if (this.input.is_artwork) w = this.input.poly.length;
        if (this.input.is_collection) w = this.input.shapes[0].poly.length;
        bbox = new Rectangle(new Point(bbox.x, bbox.y), new Size(w, w));
        BL = bbox.bottomLeft;
        TL = bbox.topLeft;
        TR = bbox.topRight;
        BR = bbox.bottomRight;
      } // If an axis is n (the idx across a collection), set initial axis scale to 1 and length to n


      var n_target = this.target && this.target.is_collection ? this.target.shapes.length : 10;

      if (this.mapping == this.MOTION_PATH || this.mapping == this.RELATIVE_ANIMATION) {
        this.set_tf_space({
          "mx": "x",
          "mx1": TL.x,
          "mx2": TR.x,
          "my": "y",
          "my1": TL.y,
          "my2": BL.y,
          "mp": "time",
          "show": true,
          "yflip": false,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.POSITION || this.mapping == this.RELATIVE_POSITION) {
        this.set_tf_space({
          "mx": "x",
          "mx1": TL.x,
          "mx2": TR.x,
          "my": "y",
          "my1": TL.y,
          "my2": BL.y,
          "mp": "",
          "show": true,
          "yflip": false,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.NUMBER_OF_SIDES) {
        var my2 = this.linear_map(0, TR.x - TL.x, 0, n_target - 1, BL.y - TL.y);
        this.set_tf_space({
          "mx": "index",
          "mx1": 0,
          "mx2": n_target - 1,
          "my": "sides",
          "my1": 3,
          "my2": 3 + my2,
          "mp": null,
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.STATIC_SCALE) {
        var _my = this.linear_map(0, TR.x - TL.x, 0, n_target - 1, BL.y - TL.y);

        this.set_tf_space({
          "mx": "index",
          "mx1": 0,
          "mx2": n_target - 1,
          "my": "scaling",
          "my1": .5,
          "my2": 1 + _my,
          "mp": null,
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.SCALE) {
        var _my2 = this.linear_map(0, 25, 0, 1, BL.y - TL.y);

        this.set_tf_space({
          "mx": null,
          "mx1": null,
          "mx2": null,
          "my": "scaling",
          "my1": 1,
          "my2": 1 + _my2,
          "mp": "time",
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.DUPLICATE_EACH || this.mapping == this.DUPLICATE) {
        var _my3 = Math.abs(this.linear_map(0, 25, 0, 1, BL.y - TL.y));

        this.set_tf_space({
          "mx": null,
          "mx1": 0,
          "mx2": null,
          "my": "duplicates",
          "my1": 1,
          "my2": Math.ceil(1 + _my3),
          "mp": "time",
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.HUE || this.mapping == this.FILL_HUE) {
        var _my4 = this.linear_map(0, TR.x - TL.x, 0, 360, BL.y - TL.y);

        this.set_tf_space({
          "mx": "index",
          "mx1": 0,
          "mx2": n_target - 1,
          "my": "hue",
          "my1": 0,
          "my2": _my4,
          "mp": null,
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }

      if (this.mapping == this.PLAYBACK) {
        this.set_tf_space({
          "mx": null,
          "mx1": null,
          "mx2": null,
          "my": "iterations",
          "my1": 0,
          "my2": 1,
          "mp": "time",
          "show": true,
          "yflip": true,
          "sx1": TL.x,
          "sx2": TR.x,
          "sy1": TL.y,
          "sy2": BL.y
        });
        return;
      }
    }
  }, {
    key: "update_tf_space",
    value: function update_tf_space() {
      // For now see how this feels
      if (this.mapping) this.set_tf_space_to_defaults();
    }
  }, {
    key: "set_tf_space",
    value: function set_tf_space(opt) {
      console.log("set_tf_space", opt);
      opt = opt || {};
      if (opt.hasOwnProperty("mx")) this.tf_mx = opt.mx;
      if (opt.hasOwnProperty("my")) this.tf_my = opt.my;
      if (opt.hasOwnProperty("mp")) this.tf_mp = opt.mp;
      if (opt.hasOwnProperty("mx1")) this.tf_mx1 = opt.mx1;
      if (opt.hasOwnProperty("mx2")) this.tf_mx2 = opt.mx2;
      if (opt.hasOwnProperty("my1")) this.tf_my1 = opt.my1;
      if (opt.hasOwnProperty("my2")) this.tf_my2 = opt.my2;
      if (opt.hasOwnProperty("sx1")) this.tf_sx1 = opt.sx1;
      if (opt.hasOwnProperty("sx2")) this.tf_sx2 = opt.sx2;
      if (opt.hasOwnProperty("sy1")) this.tf_sy1 = opt.sy1;
      if (opt.hasOwnProperty("sy2")) this.tf_sy2 = opt.sy2;
      if (opt.hasOwnProperty("yflip")) this.tf_s_yflip = opt.yflip;
      if (opt.show) this.show_tf_space(opt.show);
    }
  }, {
    key: "tf_space_setup_visuals",
    value: function tf_space_setup_visuals() {
      var _this2 = this;

      var tf_s = {};
      var w = 200;
      var h = 100;
      var ox = ames.canvas_view.center.x;
      var oy = ames.canvas_view.center.y;
      tf_s["box"] = new Path.Rectangle(new Point(ox - w / 2, oy - h / 2), new Point(ox + w / 2, oy + h / 2));
      tf_s.box.strokeColor = 'lightgray';
      tf_s.box.strokeWidth = 0.5;
      tf_s.box.dashArray = [6, 2];
      tf_s["x_axis"] = _utils.AMES_Utils.make_line(new Point(ox - w / 2, oy), new Point(ox + w / 2, oy));
      tf_s["y_axis"] = _utils.AMES_Utils.make_line(new Point(ox, oy - h / 2), new Point(ox, oy + h / 2));
      tf_s.x_axis.strokeColor = 'lightgray';
      tf_s.y_axis.strokeColor = 'lightgray';
      tf_s.x_axis.strokeWidth = 0.5;
      tf_s.y_axis.strokeWidth = 0.5;
      tf_s.x_axis.dashArray = [6, 2];
      tf_s.y_axis.dashArray = [6, 2];
      tf_s["mx1_label"] = new PointText(tf_s.x_axis.segments[0].point);
      tf_s["mx2_label"] = new PointText(tf_s.x_axis.segments[1].point);
      tf_s["my1_label"] = new PointText(tf_s.y_axis.segments[0].point);
      tf_s["my2_label"] = new PointText(tf_s.y_axis.segments[1].point);
      tf_s["mp_label"] = new PointText(new Point(ox, oy));
      tf_s["mx_label"] = new PointText(tf_s.x_axis.segments[1].point.subtract(25, -10));
      tf_s["my_label"] = new PointText(tf_s.y_axis.segments[0].point.add(0, 10));

      _utils.AMES_Utils.style_label(tf_s.mx1_label);

      _utils.AMES_Utils.style_label(tf_s.mx2_label);

      _utils.AMES_Utils.style_label(tf_s.my1_label);

      _utils.AMES_Utils.style_label(tf_s.my2_label);

      _utils.AMES_Utils.style_label(tf_s.mx_label);

      _utils.AMES_Utils.style_label(tf_s.my_label);

      _utils.AMES_Utils.style_label(tf_s.mp_label);

      tf_s.mx1_label.content = "mx1_label";
      tf_s.mx2_label.content = "mx2_label";
      tf_s.my1_label.content = "my1_label";
      tf_s.my2_label.content = "my2_label";
      tf_s.mp_label.content = "path_label";
      tf_s.mx_label.content = "mx_label";
      tf_s.my_label.content = "my_label";

      for (var x in tf_s) {
        tf_s[x].visible = false;
      }

      this.tf_s = tf_s; // Add interactivity to axis labels

      var total_drag;

      var move_cursor_cb = function move_cursor_cb(e) {
        ames.canvas.style.cursor = 'move';
        total_drag = 0;
      };

      var drag_cursor_cb = function drag_cursor_cb(e, label, value, mode, check_mode, check_value) {
        console.log(total_drag);
        if (mode == "horizontal") total_drag += e.event.movementX;
        if (mode == "vertical") total_drag += e.event.movementY;

        if (total_drag < 0) {
          if (total_drag > 0) total_drag = 0;
          if (mode == "horizontal") ames.canvas.style.cursor = 'w-resize';
          if (mode == "vertical") ames.canvas.style.cursor = 'n-resize';
        }

        if (total_drag > 0) {
          if (total_drag < 0) total_drag = 0;
          if (mode == "horizontal") ames.canvas.style.cursor = 'e-resize';
          if (mode == "vertical") ames.canvas.style.cursor = 's-resize';
        }

        if (total_drag < -2.5) {
          // Decrement
          var min_check = false;

          if (mode == "vertical" && _this2.tf_s_yflip) {
            min_check = _this2[value] + .5 < _this2[check_value];
          } else {
            // min_check = (this[check_value] < this[value] - .5);
            min_check = true;
          }

          if (check_mode == "max" || check_mode == "min" && min_check) {
            if (mode == "vertical" && _this2.tf_s_yflip) {
              _this2[value] += .5;
            } else {
              _this2[value] -= .5;
            }
          }

          console.log("decrement", _this2[value], _this2[check_value], _this2[value]);
          _this2.tf_s[label].content = Math.round(_this2[value]);
          total_drag = 0;
        }

        if (total_drag > 2.5) {
          // Increment
          var max_check = false;

          if (mode == "vertical" && _this2.tf_s_yflip) {
            max_check = _this2[check_value] < _this2.value + .5;
          } else {
            max_check = _this2[check_value] > _this2[value] + .5;
          }

          if (check_mode == "min" || check_mode == "max" && max_check) {
            if (mode == "vertical" && _this2.tf_s_yflip) {
              _this2[value] -= .5;
            } else {
              _this2[value] += .5;
            }
          }

          console.log("increment", _this2[value]);
          _this2.tf_s[label].content = _this2[value].toFixed(1);
          total_drag = 0;
        }
      };

      var up_cursor_cb = function up_cursor_cb(e) {
        ames.canvas.style.cursor = null;
        total_drag = 0;
      };

      var labels = ["mx1_label", "mx2_label", "my1_label", "my2_label"];
      var values = ["tf_mx1", "tf_mx2", "tf_my1", "tf_my2"];
      var check_modes = ["max", "min", "max", "min"];
      var check_values = ["tf_sx2", "tf_sx1", "tf_sy2", "tf_sy1"];

      var _loop = function _loop(i) {
        var label = labels[i];
        var value = values[i];
        _this2.tf_s[label].onMouseDown = move_cursor_cb;
        var mode = void 0;

        if (i < 2) {
          mode = "horizontal";
        } else {
          mode = "vertical";
        }

        _this2.tf_s[label].onMouseDrag = function (e) {
          drag_cursor_cb(e, label, value, mode, check_modes[i], check_values[i]);
        };

        _this2.tf_s[label].onMouseUp = up_cursor_cb;
      };

      for (var i in labels) {
        _loop(i);
      }

      this.tf_s.mx1_label.onMouseDown = move_cursor_cb;
      this.tf_s.mx2_label.onMouseDown = move_cursor_cb;
      this.tf_s.my1_label.onMouseDown = move_cursor_cb;
      this.tf_s.my2_label.onMouseDown = move_cursor_cb;
    }
  }, {
    key: "show",
    value: function show(bool) {
      this.editor.show(bool);
    }
  }, {
    key: "show_tf_space",
    value: function show_tf_space(bool) {
      if (!this.input) return;
      if (bool == null) bool = true;

      if (bool) {
        // Update screen space rectangle
        var TL = 1;
        var BL = 0;
        var TR = 2;
        var BR = 3;
        this.tf_s.box.segments[TL].point = new Point(this.tf_sx1, this.tf_sy1);
        this.tf_s.box.segments[BL].point = new Point(this.tf_sx1, this.tf_sy2);
        this.tf_s.box.segments[TR].point = new Point(this.tf_sx2, this.tf_sy1);
        this.tf_s.box.segments[BR].point = new Point(this.tf_sx2, this.tf_sy2); // Find origin using reverse mapping or use bottom left corner

        var o = this.tf_space_reverse_map_x_y(0, 0);
        if (!this.tf_s.box.bounds.contains(o)) o = this.tf_s.box.segments[BL].point; // Update x-axis and y-axis

        this.tf_s.x_axis.segments[0].point = new Point(this.tf_sx1, o.y);
        this.tf_s.x_axis.segments[1].point = new Point(this.tf_sx2, o.y);
        this.tf_s.x_axis.strokeColor = "pink";
        this.tf_s.y_axis.segments[0].point = new Point(o.x, this.tf_sy1);
        this.tf_s.y_axis.segments[1].point = new Point(o.x, this.tf_sy2);
        this.tf_s.y_axis.strokeColor = "orange"; // Update label content and positions

        var loff = 10; // label offset

        this.tf_s.mx1_label.content = this.tf_mx1 ? this.tf_mx1.toFixed(1) : 0;
        this.tf_s.mx2_label.content = this.tf_mx2 ? this.tf_mx2.toFixed(1) : 0;
        this.tf_s.my1_label.content = this.tf_my1 ? this.tf_my1.toFixed(1) : 0;
        this.tf_s.my2_label.content = this.tf_my2 ? this.tf_my2.toFixed(1) : 0;
        this.tf_s.mp_label.content = this.tf_mp ? this.tf_mp : "";

        if (!this.tf_mx) {
          this.tf_s.mx1_label.content = "";
          this.tf_s.mx2_label.content = "";
        }

        if (!this.tf_my) {
          this.tf_s.my1_label.content = "";
          this.tf_s.my2_label.content = "";
        }

        this.tf_s.mx_label.content = this.tf_mx ? this.tf_mx : "";
        this.tf_s.my_label.content = this.tf_my ? this.tf_my : "";
        this.tf_s.mx1_label.position = this.tf_s.x_axis.segments[0].point.add(0, loff);
        this.tf_s.mx2_label.position = this.tf_s.x_axis.segments[1].point.add(0, loff);
        this.tf_s.my1_label.position = this.tf_s.y_axis.segments[0].point.add(-loff, 0);
        this.tf_s.my2_label.position = this.tf_s.y_axis.segments[1].point.add(-loff, 0);
        this.tf_s.mx_label.position = this.tf_s.x_axis.segments[1].point.subtract(2 * loff, -1.5 * loff);
        this.tf_s.my_label.position = this.tf_s.y_axis.segments[0].point.add(-1.5 * loff, loff);
        var first_path;
        if (this.input.is_artwork) first_path = this.input.poly;
        if (this.input.is_collection) first_path = this.input.shapes[0].poly;

        if (first_path) {
          this.tf_s.mp_label.position = first_path.getPointAt(0).add(0, -1.5 * loff);
        } else {
          this.tf_s.mp_label.position = this.tf_s.box.segments[TR].point.subtract(2 * loff, -2 * loff);
        } // Flip y label if needed


        if (this.tf_s_yflip) {
          var temp = this.tf_s.my1_label.position;
          this.tf_s.my1_label.position = this.tf_s.my2_label.position;
          this.tf_s.my2_label.position = temp;
        } // Show all items


        for (var x in this.tf_s) {
          this.tf_s[x].visible = true;
        }

        this.tf_space_visible = true;
      } else {
        // Hide all items
        for (var _x3 in this.tf_s) {
          this.tf_s[_x3].visible = false;
        }

        this.tf_space_visible = false;
      }
    }
  }, {
    key: "tf_space_map_x_y",
    value: function tf_space_map_x_y(x, y) {
      var tx = null;
      var ty = null;

      if (x != null) {
        tx = this.linear_map(this.tf_sx1, this.tf_sx2, this.tf_mx1, this.tf_mx2, x);
      }

      if (y != null) {
        if (!this.tf_s_yflip) ty = this.linear_map(this.tf_sy1, this.tf_sy2, this.tf_my1, this.tf_my2, y);
        if (this.tf_s_yflip) ty = this.linear_map(this.tf_sy1, this.tf_sy2, this.tf_my2, this.tf_my1, y);
      }

      return {
        "x": tx,
        "y": ty
      };
    }
  }, {
    key: "tf_space_reverse_map_x_y",
    value: function tf_space_reverse_map_x_y(x, y) {
      var tx = null;
      var ty = null;

      if (x != null) {
        tx = this.linear_map(this.tf_mx1, this.tf_mx2, this.tf_sx1, this.tf_sx2, x);
      }

      if (y != null) {
        if (!this.tf_s_yflip) ty = this.linear_map(this.tf_my1, this.tf_my2, this.tf_sy1, this.tf_sy2, y);
        if (this.tf_s_yflip) ty = this.linear_map(this.tf_my1, this.tf_my2, this.tf_sy2, this.tf_sy1, y);
      }

      return {
        "x": tx,
        "y": ty
      };
    }
  }, {
    key: "linear_map",
    value: function linear_map(in_s, in_f, out_s, out_f, v) {
      return out_s + (v - in_s) * (out_f - out_s) / (in_f - in_s);
    } // transform
    // ------------------------------------------------------------------------
    // Plays the transformation function if it represents an animation;
    // otherwise it applies the transformation function to the objects
    // properties

  }, {
    key: "transform",
    value: function transform(args) {
      console.log("transform: ", this.name);
      if (this.mapping == null) this.set_mapping();
      if (!this.input || !this.target) return;

      if (this.is_playable) {
        this.play();

        if (args && args.btn) {
          setTimeout(function () {
            args.btn.deactivate();
          }, 1000);
        }
      } else {
        this.apply();

        if (args && args.btn) {
          setTimeout(function () {
            args.btn.deactivate();
          }, 1000);
        }
      }
    }
  }, {
    key: "_clear_cb_helpers",
    value: function _clear_cb_helpers() {}
  }, {
    key: "get_dropdown_opts",
    value: function get_dropdown_opts(field) {
      if (field == "behavior") {
        // "interpolate", "alternate", "random"
        return ["interpolate", "alternate", "random"];
      }

      if (field == "mode") {
        // "absolute", "relative"
        return ["absolute", "relative"];
      }

      if (field == "mapping") {
        var mappings = [];
        var idx = 0;

        for (var i in this.mappings) {
          mappings[idx++] = this.mappings[i];
          idx++;
        }

        for (var _i in this.typed_mappings) {
          mappings[idx++] = this.typed_mappings[_i].mapping_type + ": " + this.typed_mappings[_i].mapping;
        }

        return mappings;
      }

      if (field == "condition") {
        // if (tf.Q) {
        // 	if (tf.condition == "f(x,y) == Q" && (v_prev < tf.Q && tf.Q < v_next)) trigger_tf = true;
        // 	if (tf.condition == "f(x) == Q" && (x_prev < tf.Q && tf.Q < x_next)) trigger_tf = true;
        // 	if (tf.condition == "f(y) == Q" && (y_prev < tf.Q && tf.Q < y_next)) trigger_tf = true;
        // } else {
        // 	if (tf.condition == "x direction change" && x_direction_change) trigger_tf = true;
        // 	if (tf.condition == "y direction change" && y_direction_change) trigger_tf = true;
        // 	if (tf.condition == "x or y direction change" && (x_direction_change || y_direction_change)) trigger_tf = true;
        // 	if (tf.condition == "x and y direction change" && (x_direction_change && y_direction_change)) trigger_tf = true;
        // 	if (tf.condition == "slope change" && slope_change) trigger_tf = true;
        // }
        return ["start", "end", "slope change", "x direction change", "y direction change", "f(x, y) == Q", "f(y) == Q", "new instance"];
      }
    }
  }, {
    key: "get_mapping_opt",
    value: function get_mapping_opt(field) {
      if (field == "behavior") {
        if (!this.mapping_behavior) return "interpolate";else return this.mapping_behavior;
      }

      if (field == "mode") {
        if (this.tf_space_absolute) return "absolute";else return "relative";
      }

      if (field == "mapping") {
        return this.get_mapping();
      }

      if (field == "condition") {
        if (!this.default_playback_condition) this.default_playback_condition = "slope change";
        this.new_playback_condition = this.default_playback_condition;
        return this.default_playback_condition;
      }
    }
  }, {
    key: "set_new_playback_condition",
    value: function set_new_playback_condition(condition) {
      this.new_playback_condition = condition;
    }
  }, {
    key: "set_new_playback_transformation",
    value: function set_new_playback_transformation(transformation) {
      this.new_playback_transformation = transformation;
    }
  }, {
    key: "set_mapping_behavior",
    value: function set_mapping_behavior(behavior) {
      var is_valid_behavior = false;
      if (behavior == "alternate") is_valid_behavior = true;
      if (behavior == "interpoalte") is_valid_behavior = true;
      if (behavior == "random") is_valid_behavior = true;
      if (is_valid_behavior) this.mapping_behavior = behavior;
    }
  }, {
    key: "set_mapping_mode",
    value: function set_mapping_mode(opt) {
      if (opt == "absolute") {
        this.tf_space_absolute = true;
      }

      if (opt == "relative") {
        this.tf_space_absolute = false;
      }

      console.log("Set mapping mode... absolute?", this.tf_space_absolute);
    }
  }, {
    key: "toggle_loop",
    value: function toggle_loop(args) {
      args = args || {};

      if (args.deactivate) {
        this.loop = false;
      } else {
        this.loop = true;
      }
    }
  }, {
    key: "toggle_show_tf",
    value: function toggle_show_tf(args) {
      args = args || {};

      if (args.deactivate) {
        this.show_tf_space(false);
      } else {
        if (!this.mapping) this.set_mapping("position");
        this.show_tf_space(true);
      }
    }
  }, {
    key: "set_geometry_field",
    value: function set_geometry_field(field, obj) {
      if (field == "input") {
        this.set_input(obj);
      }

      if (field == "target") {
        this.set_target(obj);
      }

      if (field == "playback transformation") {
        this.set_new_playback_transformation(obj);
      }
    }
  }, {
    key: "change_mapping",
    value: function change_mapping(property) {
      property = property.split(": ");

      if (property.length == 1) {
        this.set_mapping(property[0]);
      } else {
        this.set_mapping({
          "type": property[0],
          "mapping": property[1]
        });
      }
    }
  }, {
    key: "change_transformation_property",
    value: function change_transformation_property(args) {
      args = args || {};

      if (args.deactivate) {} else {
        var isValid = false;
        var str = "";

        for (var i in this.mappings) {
          str += this.mappings[i];
          str += ", ";
        }

        for (var _i2 in this.typed_mappings) {
          str += this.typed_mappings[_i2].mapping_type + ": " + this.typed_mappings[_i2].mapping;
          if (_i2 < this.typed_mappings.length - 1) str += ", ";
        }

        var property;

        while (!isValid) {
          property = prompt("Enter the property that the transformation represents: " + str); // No input, deactivate

          if (!property) {
            args.btn.deactivate();
            return;
          }

          property = property.split(": ");

          if (property.length == 1) {
            isValid = this.set_mapping(property[0]);
            args.btn.deactivate();
          } else {
            isValid = this.set_mapping({
              "type": property[0],
              "mapping": property[1]
            });
            args.btn.deactivate();
          }
        }
      }
    } // apply
    //
    // Applies a transformation that represents a procedural relationship in
    // a static context. I.e. if the artist makes a change to any artwork in
    // the target, the input constrains how that change is applied
    //
    // The property of the target artwork impacted by the transformation is
    // shifted to match the input value

  }, {
    key: "apply",
    value: function apply() {
      if (!this.target) return;
      if (this.target.is_collection) this.n_target = this.target.shapes.length;
      this.init_random_target_indices();

      for (var idx = 0; idx < this.n_target; idx++) {
        var a = void 0;
        if (this.target.is_artwork) a = this.target;
        if (this.target.is_collection) a = this.target.shapes[idx];

        if (this.vertex_mapping) {
          // Iterate over all the vertices in the artwork to transform them
          var n_segments = a.poly.segments.length;
          var a_smooth = a.poly.clone();
          a_smooth.smooth();
          a_smooth.visible = false; // TO DO Have to deal with tf space absolute

          var vertex_update = [];

          for (var v_idx = 0; v_idx < n_segments; v_idx++) {
            var v0 = this.get_value_at_target_index_for_path_offset(v_idx, 0, this.n_target);
            var v1 = this.get_value_at_target_index_for_path_offset(v_idx, "end", this.n_target);
            var v = {
              "x": v1.x - v0.x,
              "y": v1.y - v0.y,
              "v": v1.v.subtract(v0.v)
            };
            vertex_update[v_idx] = this.get_vertex_value_update_at(a, v_idx, v, a_smooth);
          }

          console.log(vertex_update);

          for (var _v_idx2 = 0; _v_idx2 < n_segments; _v_idx2++) {
            this.update_vertex_value_to(a, _v_idx2, vertex_update[_v_idx2]);
          }
        } else {
          // Transform the artwork
          if (this.tf_space_absolute) {
            var sv = void 0;
            if (this.mapping == this.POSITION) sv = this.get_value_at_target_index_for_path_offset(idx, 0, this.n_target);else {
              sv = this.get_value_at_target_index_for_axis_mapping(idx, 0, "index", this.n_target);
            }
            this.set_artwork_value_to(a, sv);
          }

          var _v = void 0;

          if (this.mapping == this.POSITION) {
            _v = this.get_value_at_target_index_for_path_offset(idx, null, this.n_target);
          } else {
            _v = this.get_value_at_target_index_for_axis_mapping(idx, idx, "index", this.n_target);
          }

          this.set_artwork_value_to(a, _v);
        }
      }
    }
  }, {
    key: "init_random_target_indices",
    value: function init_random_target_indices() {
      this.random_indices = [];
      if (this.target.is_artwork) this.random_indices = [0];

      if (this.target.is_collection) {
        var n = this.target.shapes.length;

        for (var i = 0; i < n; i++) {
          this.random_indices[i] = Math.random() * (n - 1);
        }
      }

      console.log("random_indices: ", this.random_indices);
    }
  }, {
    key: "setup_playback_trackers",
    value: function setup_playback_trackers() {
      var n = 1;
      console.log(this.target);
      if (this.target.is_artwork) n = 1;
      if (this.target.is_collection) n = this.n_target;

      if (this.mapping == this.PLAYBACK) {
        n = this.target.n_target;
      }

      this.dx_total = [];
      this.dy_total = [];
      this.v_total = [];
      this.dx_direction = [];
      this.dy_direction = [];
      this.slope = [];
      this.prev_slope_change = [];
      this.loop_count = [];
      this.is_playing = [];
      this.tween_helper_scale = [];
      this.n_clones = [];
      this.curr_state = [];
      this.curr_remainder = [];
      this.init_random_target_indices();

      for (var i = 0; i < n; i++) {
        this.loop_count[i] = 1;
        this.dx_total[i] = 0;
        this.dy_total[i] = 0;
        this.v_total[i] = 0;
        this.dx_direction[i] = 0;
        this.dy_direction[i] = 0;
        this.slope[i] = 1;
        this.prev_slope_change[i] = Date.now();
        this.tween_helper_scale[i] = 1;
        this.n_clones[i] = 0;
        this.curr_state[i] = 0;
        this.curr_remainder[i] = 0;
      }

      if (this.vertex_mapping) {
        this.vertex_normals = [];
        this.vertex_tangents = [];

        for (var idx = 0; idx < this.n_target; idx++) {
          var a = void 0;
          if (this.target.is_collection) a = this.target.shapes[idx];
          if (this.target.is_artwork) a = this.target;
          var n_segments = a.poly.segments.length;
          this.vertex_normals[idx] = [];
          this.vertex_tangents[idx] = [];
          var eps = 0.01;

          for (var _i3 = 0; _i3 < n_segments; _i3++) {
            var p = a.poly.segments[_i3].point;
            var o = a.poly.getOffsetOf(p);

            var _n2 = void 0;

            var t = void 0;
            var n1 = void 0;
            var n2 = void 0;
            var p1 = void 0;
            var p2 = void 0;
            var c = new PointText({
              point: p,
              content: _i3
            });
            c.visible = false;
            var o1 = o - eps;
            var o2 = o + eps;

            if (_i3 == 0) {
              o1 = a.poly.length - eps;
            }

            p1 = a.poly.getPointAt(o1);
            p2 = a.poly.getPointAt(o2);

            if (a.poly.segments[_i3].isSmooth()) {
              _n2 = a.poly.getNormalAt(o);
              t = a.poly.getTangentAt(o);
            } else {
              n1 = a.poly.getNormalAt(o1);
              n2 = a.poly.getNormalAt(o2);
              _n2 = n1.add(n2).normalize();
              var t1 = a.poly.getTangentAt(o1);
              var t2 = a.poly.getTangentAt(o2);
              t = t1.add(t2).normalize();
            }

            this.vertex_normals[idx][_i3] = _n2;
            this.vertex_tangents[idx][_i3] = t;
            var nPath = new Path.Line({
              segments: [p, p.add(_n2.multiply(20))],
              strokeColor: "pink",
              strokeWidth: 1
            });
            nPath.visible = false;
            var n1Path = new Path.Line({
              segments: [p1, p1.add(n1.multiply(20))],
              strokeColor: "red",
              strokeWidth: 1
            });
            n1Path.visible = false;
            var n2Path = new Path.Line({
              segments: [p2, p2.add(n2.multiply(20))],
              strokeColor: "lightblue",
              strokeWidth: 1
            });
            n2Path.visible = false;
            var tPath = new Path.Line({
              segments: [p, p.add(t.multiply(20))],
              strokeColor: "green",
              strokeWidth: 1
            });
            tPath.visible = false;
          }
        }
      }
    } // play
    // ------------------------------------------------------------------------
    // @description: If the transformation function represents an animation,
    // this plays the animation
    //
    // Note: the playback point also triggers this function

  }, {
    key: "play",
    value: function play() {
      var state_idx = 0;
      this.setup_playback_trackers();
      if (!this.target) return;
      if (this.target.is_collection) this.n_target = this.target.shapes.length;
      var n_target = this.n_target;

      if (this.mapping == this.PLAYBACK) {
        this.target.setup_playback_trackers();
        n_target = this.target.n_target; // this.tf_space_path_nsegments = 2*this.target.tf_space_path_nsegments;

        this.target.tf_space_path_nsegments = .75 * this.tf_space_path_nsegments;
        console.log("Playing playback transform to drive ", this.target.name);
        console.log("The parent transform has n segments:", this.tf_space_path_nsegments);
        console.log("The child transform has n segements: ", this.target.tf_space_path_nsegments);
      } else {
        this.set_tf_space_path_nsegments();
      }

      for (var idx = 0; idx < n_target; idx++) {
        var a = void 0;
        if (this.target.is_collection) a = this.target.shapes[idx];
        if (this.target.is_artwork) a = this.target;

        if (this.target.is_transformation) {
          if (this.target.target.is_artwork) a = this.target.target;
          if (this.target.target.is_collection) a = this.target.target.shapes[idx];
        }

        if (false) {
          this.loop_count[idx] = [];
          this.is_playing[idx] = [];
          var n_segments = a.poly.segments.length;

          for (var v_idx = 0; v_idx < n_segments; v_idx++) {
            if (this.tf_space_absolute) {
              var sv = this.get_value_at_target_index_for_path_offset(v_idx, 0, this.n_target); // set_vertex_value_to
            }

            this.loop_count[idx][v_idx] = 1;
            this.is_playing[idx][v_idx] = 1;
            var a_smooth = a.poly.clone();
            a_smooth.smooth();
            a_smooth.visible = false; //this.play_helper(state_idx, a, idx, a_smooth, v_idx);
          }
        } else {
          this.loop_count[idx] = 1;
          this.is_playing[idx] = 1; // Jump target to match transformation input start values

          if (this.tf_space_absolute) {
            if (this.mapping == this.PLAYBACK) {
              if (this.target.tf_space_absolute) {
                var _sv2 = this.target.get_value_at_target_index_for_path_offset(idx, 0, n_target);

                console.log(idx, 0, _sv2);
                this.target.set_artwork_value_to(a, _sv2);
              }
            } else {
              var _sv3 = this.get_value_at_target_index_for_path_offset(idx, 0, this.n_target);

              this.set_artwork_value_to(a, _sv3);
            }
          }

          this.play_helper({
            "state_idx": state_idx,
            "a": a,
            "a_idx": idx
          });
        }
      }
    } // TO DO update for vertex transformations

  }, {
    key: "trigger_function_for_target_idx",
    value: function trigger_function_for_target_idx(a, a_idx, n_target) {
      console.log("trigger ", this.name, "for ", a.name, "at ", a_idx);
      var idx = a_idx; // Play or apply transformation

      if (this.is_playable) {
        // Cannot trigger an animation that is already playing
        // if (this.is_playing[idx] == 1) return;
        // Reset playback trackers
        if (!this.dx_total) this.setup_playback_trackers();
        this.dx_total[a_idx] = 0;
        this.dy_total[a_idx] = 0;
        this.v_total[a_idx] = 0;
        this.loop_count[a_idx] = 1;
        this.is_playing[a_idx] = 1;
        this.slope[a_idx] = 1;
        this.prev_slope_change[a_idx] = Date.now();
        this.tween_helper_scale[a_idx] = 1;
        this.n_clones[a_idx] = 0;
        this.random_indices[a_idx] = Math.random() * (n_target - 1); // Jump target to match transformation input start values

        if (this.tf_space_absolute) {
          if (this.mapping == this.PLAYBACK) {
            if (this.target.tf_space_absolute) {
              var sv = this.target.get_value_at_target_index_for_path_offset(a_idx, 0, n_target);
              this.target.set_artwork_value_to(a, sv);
            }
          } else {
            var _sv4 = this.get_value_at_target_index_for_path_offset(a_idx, 0, n_target);

            this.set_artwork_value_to(a, _sv4);
          }
        }

        console.log('setup triggered transformation', this.name, 'for artwork', a, 'at ', a_idx);
        this.play_helper({
          "state_idx": 0,
          "a": a,
          "a_idx": a_idx,
          "n_target": n_target
        });
      } else {
        if (this.tf_space_absolute) {
          if (this.tf_space_absolute) {
            if (this.mapping == this.PLAYBACK) {
              if (this.target.tf_space_absolute) {
                var _sv5 = this.target.get_value_at_target_index_for_path_offset(a_idx, 0, this.target.n_target);

                this.target.set_artwork_value_to(a, _sv5);
              }
            } else {
              var _sv6 = this.get_value_at_target_index_for_path_offset(a_idx, 0, n_target);

              this.set_artwork_value_to(a, _sv6);
            }
          }

          var v = this.get_value_at_target_index_for_axis_mapping(a_idx, a_idx, "index", n_target);
          this.set_artwork_value_to(a, v);
        }
      }
    }
  }, {
    key: "tween",
    value: function tween(a_idx, a, d, f, state_idx, v_idx) {
      // Detect playback points
      if (this.check_playback_points) this.trigger_playback_points(a_idx, a, d, f, state_idx); // Tween property

      if (!f) f = 1;
      if (this.mapping == this.MOTION_PATH) a.poly.position = new Point(a.poly.position.x + d.x / f, a.poly.position.y + d.y / f);

      if (this.mapping == this.SCALE) {
        // a.poly.scaling = 1+d.y/f;
        var prev_sf = this.tween_helper_scale[a_idx];
        var sf = this.tf_my1 + this.dy_total[a_idx];

        if (sf >= .25) {
          a.poly.scaling = (this.tf_my1 + this.dy_total[a_idx]) / prev_sf;
          this.tween_helper_scale[a_idx] = sf;
        }
      }

      if (this.mapping == this.DUPLICATE_EACH || this.mapping == this.DUPLICATE) {
        var next_clone_num = this.n_clones[a_idx] + 1;
        var eps = .015;
        var inc = this.dy_total[a_idx] - next_clone_num; // if ((-eps <= inc && inc <= 0) || (0 <= inc && inc <= eps))

        var y_prev = this.dy_total[a_idx] - d.y / f; // console.log(next_clone_num, y_prev.toFixed(5), this.dy_total[a_idx].toFixed(5));

        if (y_prev <= next_clone_num && next_clone_num <= this.dy_total[a_idx]) {
          // let new_a = Object.create(a);
          // new_a.poly = a.poly.clone();
          this.n_clones[a_idx] += 1;
          var original = a;
          var dup_idx = a_idx; // if (this.mapping == this.DUPLICATE) {
          // 	let random_shape_idx = Math.floor(Math.random()*this.target.shapes.length);
          // 	original = this.target.shapes[random_shape_idx];
          // 	dup_idx = random_shape_idx;
          // 	console.log(random_shape_idx, original);
          // }

          var new_a = original.clone();
          new_a.poly.insertBelow(original.poly);
          if (this.mapping == this.DUPLICATE) this.target.add_to_collection(new_a); // this.dy_total[a_idx] = 0;
          // if (a_idx == 1) console.log("making new instance", a_idx);
          // if (this.mapping == this.DUPLICATE) {
          // 	let n_t = Math.round(this.tf_my2 - 1) * this.target.shapes.length-1;
          // 	this.trigger_new_instance(new_a, Math.floor(Math.random()*n_t), n_t);
          // } else {
          // 	this.trigger_new_instance(new_a, a_idx);
          // }

          this.trigger_new_instance(new_a, a_idx);
        }
      }

      if (this.mapping == this.RELATIVE_ANIMATION) {
        var n_segments = a.poly.segments.length;

        for (var _v_idx3 = 0; _v_idx3 < n_segments; _v_idx3++) {
          var idx = _v_idx3; // if (state_idx%2 == 0) idx = n_segments - v_idx - 1;

          var x = d[idx].x;
          var y = d[idx].y;
          var p = a.poly.segments[idx].point.add(new Point(x / f, y / f));
          a.poly.segments[idx].point = p;
        }

        a.poly.clearHandles();
      }

      if (this.mapping == this.PLAYBACK) {
        var reverse = false;

        if (d.y < 0) {
          reverse = true;
          d.y = -d.y;
        }

        var qt = d.y / f - Math.floor(d.y / f);
        var frame_progression = this.target.tf_space_path_nsegments * qt;
        var target_frames = Math.floor(frame_progression);
        this.curr_remainder[a_idx] += frame_progression - target_frames;

        if (Math.round(this.curr_remainder[a_idx]) == 1) {
          this.curr_remainder[a_idx] -= 1;
          target_frames += 1;
        }

        var stop_state_idx = this.curr_state[a_idx] + target_frames;
        if (reverse) stop_state_idx = this.curr_state[a_idx] - target_frames; // TO DO... timing factor?

        if (stop_state_idx >= 0 && this.curr_state[a_idx] != stop_state_idx) {
          if (a_idx == 0) {// console.log("playback transform", a.name, d.y.toFixed(4), this.curr_state[a_idx], stop_state_idx, "reverse?", reverse);
          }

          this.target.play_helper({
            "state_idx": this.curr_state[a_idx],
            "stop_state_idx": stop_state_idx,
            "a": a,
            "a_idx": a_idx,
            "v_idx": v_idx,
            "reverse": reverse
          });
          this.curr_state[a_idx] = stop_state_idx;
        }
      }
    }
  }, {
    key: "remove_playback_point",
    value: function remove_playback_point(playback_pt) {
      var idx = -1;

      for (var i = 0; i < this.transformation_functions_to_trigger.length; i++) {
        var trigger = this.transformation_functions_to_trigger[i];
        if (trigger == playback_pt) idx = i;
      }

      if (idx > -1) this.transformation_functions_to_trigger.splice(idx, 1);
    }
  }, {
    key: "use_playback_points_to_trigger_transformation",
    value: function use_playback_points_to_trigger_transformation(opt) {
      var tf = opt.tf; // transformation function

      var condition = opt.condition; // Trigger condition

      var q = opt.q; // Optional

      var trigger = {
        "tf": tf,
        "condition": condition,
        "Q": q
      };

      if (!this.transformation_functions_to_trigger) {
        this.transformation_functions_to_trigger = [];
      }

      this.transformation_functions_to_trigger.push(trigger);
      console.log(this.transformation_functions_to_trigger);
      this.check_playback_points = true;
    }
  }, {
    key: "trigger_end",
    value: function trigger_end(a, a_idx, v_idx) {
      for (var x in this.transformation_functions_to_trigger) {
        var tf = this.transformation_functions_to_trigger[x];

        if (tf.condition == "end") {
          if (tf.tf != "remove") {
            if (this.target == tf.tf.target) {
              tf.tf.trigger_function_for_target_idx(a, a_idx);
            } else {
              tf.tf.transform();
            }
          } else a.remove();
        }
      }
    }
  }, {
    key: "trigger_new_instance",
    value: function trigger_new_instance(a, a_idx, n_target) {
      for (var x in this.transformation_functions_to_trigger) {
        var tf = this.transformation_functions_to_trigger[x];
        if (tf.condition == "new instance") console.log("trigger function for new instance", a_idx);

        if (!n_target) {
          n_target = Math.round(this.tf_my2 - 1); // TO DO: Update to support interpolation (calculate per a_idx)
        }

        var idx = this.n_clones[a_idx] - 1;
        var total = n_target;

        if (this.mapping == this.DUPLICATE) {
          idx = Math.floor(Math.random() * n_target);
        }

        console.log("using n_target", n_target, "at", idx);
        tf.tf.trigger_function_for_target_idx(a, idx, n_target);
      }
    }
  }, {
    key: "trigger_playback_points",
    value: function trigger_playback_points(a_idx, a, d, f, state_idx) {
      // Get condition information based on net change in x, y, v
      // F(x)
      var x_prev = this.dx_total[a_idx];
      var x_next = x_prev + d.x / f;
      this.dx_total[a_idx] = x_next; // F(y)

      var y_prev = this.dy_total[a_idx];
      var y_next = y_prev + d.y / f;
      this.dy_total[a_idx] = y_next; // F(x, y)

      var v_prev = this.v_total[a_idx];
      var v_next = v_prev + d.v / f;
      this.v_total[a_idx] += d.v / f; // Check conditions for change in direction

      var x_direction_change = false;
      var y_direction_change = false;
      var slope_change = false;
      var dir_x = 0;
      var dir_y = 0; // Initialize conditions at the start of playback

      if (state_idx == 0 && this.loop_count[a_idx] == 1) {
        if (d.x / f > 0) dir_x = 1;
        if (d.x / f < 0) dir_x = -1;
        this.dx_direction[a_idx] = dir_x;
        if (d.y / f > 0) dir_y = 1;
        if (d.y / f < 0) dir_y = -1;
        this.dy_direction[a_idx] = dir_y; // Slope

        this.slope[a_idx] = d.y / d.x;
      } else {
        // Check for and indicate change in x direction
        dir_x = this.dx_direction[a_idx];

        if (this.dx_direction[a_idx] == -1) {
          // Moving down
          if (d.x / f == 0) dir_x = 0; // To zero

          if (d.x / f > 0) dir_x = 1; // To up
        }

        if (this.dx_direction[a_idx] == 0) {
          // At zero
          if (d.x / f < 0) dir_x = -1; // To down

          if (d.x / f > 0) dir_x = 1; // To up
        }

        if (this.dx_direction[a_idx] == 1) {
          // Moving up
          if (d.x / f < 0) dir_x = -1; // To down

          if (d.x / f == 0) dir_x = 0; // To zero
        }

        if (this.dx_direction[a_idx] != dir_x) {
          this.dx_direction[a_idx] = dir_x;
          x_direction_change = true;
        } // Check for and indicate change in y direction


        dir_y = this.dy_direction[a_idx];

        if (this.dy_direction[a_idx] == -1) {
          // Moving down
          if (d.y / f == 0) dir_y = 0; // To zero

          if (d.y / f > 0) dir_y = 1; // To up
        }

        if (this.dy_direction[a_idx] == 0) {
          // At zero
          if (d.y / f < 0) dir_y = -1; // To down

          if (d.y / f > 0) dir_y = 1; // To up
        }

        if (this.dy_direction[a_idx] == 1) {
          // Moving up
          if (d.y / f < 0) dir_y = -1; // To down

          if (d.y / f == 0) dir_y = 0; // To zero
        }

        if (this.dy_direction[a_idx] != dir_y) {
          this.dy_direction[a_idx] = dir_y;
          y_direction_change = true;
        } // Check for slope change


        var m = d.y / d.x;
        var m_diff = m - this.slope[a_idx];
        var m_eps = .025;

        if (m_diff > m_eps || m_diff < -m_eps) {
          this.slope[a_idx] = m; // console.log(m_diff, this.prev_slope_change[a_idx]);

          if (Date.now() - this.prev_slope_change[a_idx] > 50) slope_change = true;
          this.prev_slope_change[a_idx] = Date.now();
        }
      }

      for (var x in this.transformation_functions_to_trigger) {
        var tf = this.transformation_functions_to_trigger[x];
        var trigger_tf = false;

        if (tf.Q) {
          if (tf.condition == "f(x,y) == Q" && v_prev < tf.Q && tf.Q < v_next) trigger_tf = true;
          if (tf.condition == "f(x) == Q" && x_prev < tf.Q && tf.Q < x_next) trigger_tf = true;
          if (tf.condition == "f(y) == Q" && y_prev < tf.Q && tf.Q < y_next) trigger_tf = true;
        } else {
          if (tf.condition == "x direction change" && x_direction_change) trigger_tf = true;
          if (tf.condition == "y direction change" && y_direction_change) trigger_tf = true;
          if (tf.condition == "x or y direction change" && (x_direction_change || y_direction_change)) trigger_tf = true;
          if (tf.condition == "x and y direction change" && x_direction_change && y_direction_change) trigger_tf = true;
          if (tf.condition == "slope change" && slope_change) trigger_tf = true;
        }

        if (trigger_tf) {
          if (tf.tf == "remove") a.remove();else tf.tf.trigger_function_for_target_idx(a, a_idx);
        }
      }
    }
  }, {
    key: "get_vertex_value_update_at",
    value: function get_vertex_value_update_at(a, v_idx, v, a_smooth) {
      if (this.mapping == this.RELATIVE_POSITION) {
        var p = a_smooth.getNearestPoint(a.poly.segments[v_idx].point);
        var o = a_smooth.getOffsetOf(p);
        var n = a_smooth.getNormalAt(o);
        var t = a_smooth.getTangentAt(o);
        var nx = v.y * n.x + v.x * t.x;
        var ny = v.y * n.y + v.x * t.y;
        var p_update = new Point(nx, ny); // let npath = new Path({
        // 	segments: [p, p.add(n.multiply(20))],
        // 	strokeColor: "red",
        // 	strokeWidth: 1
        // });
        // npath.visible = false;
        //
        // let tpath = new Path({
        // 	segments: [p, p.add(t.multiply(20))],
        // 	strokeColor: "green",
        // 	strokeWidth: 1
        // });
        // tpath.visible = false;
        //
        // let perturb_path = new Path({
        // 	segments: [p, p.add(p_update)],
        // 	strokeColor: "black",
        // 	strokeWidth: 1
        // });
        // perturb_path.visible = false;

        return p_update;
      }
    }
  }, {
    key: "update_vertex_value_to",
    value: function update_vertex_value_to(a, v_idx, update) {
      if (this.mapping == this.RELATIVE_POSITION) {
        a.poly.segments[v_idx].point = a.poly.segments[v_idx].point.add(update);
      }
    }
  }, {
    key: "set_vertex_value_to",
    value: function set_vertex_value_to(a, v_idx, v, a_copy) {
      var b = a.poly.clone();
      b.smooth();
      b.strokeColor = "pink";
      var p = b.getNearestPoint(a.poly.segments[v_idx].point);
      var o = b.getOffsetOf(p);
      var n = b.getNormalAt(o);
      var t = b.getTangentAt(o);
      b.visible = false;
      var npath = new Path({
        segments: [p, p.add(n.multiply(20))],
        strokeColor: "red",
        strokeWidth: 1
      });
      npath.visible = false;
      var tpath = new Path({
        segments: [p, p.add(t.multiply(20))],
        strokeColor: "green",
        strokeWidth: 1
      });
      tpath.visible = false; // v.y = 0
      // v.y * n + v.x * t

      var nx = v.y * n.x + v.x * t.x;
      var ny = v.y * n.y + v.x * t.y;
      var p1 = new Point(nx, ny);
      var perturb_path = new Path({
        segments: [p, p.add(p1.multiply(1))],
        strokeColor: "black",
        strokeWidth: 1
      }); // perturb_path.visible = false;

      a_copy.segments[v_idx].point = p.add(p1); // a.poly.segments[v_idx].point = p.add(p1);

      if (this.mapping == this.RELATIVE_POSITION) {// let p = a.poly.segments[v_idx].point;
        // let o = a.poly.getOffsetOf(p);
        // let n = a.poly.getNormalAt(o);
        //
        // let p2 = p.add(n.multiply(20));
        // console.log(p, p2);
        // let npath = new Path({
        // 	segments: [p, p.add(n.multiply(20))],
        // 	strokeColor: "red",
        // 	strokeWidth: 2
        // });
        // console.log(npath);
        //
        // let t = a.poly.getTangentAt(o);
        //
        // // We want to apply the transformation in the basis defined by
        // // the normal and the tangent at the vertex point
        // let nx = n.x*v.x + t.x*v.y;
        // let ny = n.y*v.x + t.y*v.y;
        //
        // if (v_idx == 1) {
        // 	let c = new Path.Circle(p,2);
        // 	c.fillColor = "pink";
        //
        // 	let s = p.add(new Point(nx, ny));
        // 	let cs = new Path.Circle(p, 2);
        // 	cs.fillColor = "orange";
        //
        // 	console.log(n, t);
        // }
        // a.poly.segments[v_idx].point = p.subtract(new Point(nx, ny));
      }
    }
  }, {
    key: "set_artwork_value_to",
    value: function set_artwork_value_to(a, sv) {
      if (this.mapping == this.MOTION_PATH || this.mapping == this.POSITION) a.poly.position = new Point(sv.x, sv.y);
      if (this.mapping == this.NUMBER_OF_SIDES) a.set_number_of_sides(Math.round(sv.y));
      if (this.mapping == this.STATIC_SCALE) a.set_scaling(sv.y);
      if (this.mapping == this.SCALE) a.poly.scale(sv.y, sv.y);

      if (this.mapping == this.HUE || this.mapping == this.FILL_HUE) {
        var saturation;
        var brightness;

        if (this.mapping == this.FILL_HUE && a.poly.fillColor) {
          // a.poly.fillColor.alpha = 1;
          saturation = a.poly.fillColor.saturation;
          if (saturation == 0) saturation = 1;
          brightness = a.poly.fillColor.brightness;

          if (this.tf_space_absolute) {
            a.poly.fillColor.hue = Math.round(sv.y);
          } else {
            a.poly.fillColor.hue += Math.round(sv.y);
          }

          a.poly.fillColor.saturation = saturation;
          a.poly.fillColor.brightness = brightness;
        }

        if (this.mapping == this.HUE && a.poly.strokeColor) {
          saturation = a.poly.strokeColor.saturation;
          if (saturation == 0) saturation = 1;
          brightness = a.poly.strokeColor.brightness;

          if (this.tf_space_absolute) {
            a.poly.strokeColor.hue = Math.round(sv.y);
          } else {
            a.poly.strokeColor.hue += Math.round(sv.y);
          }

          a.poly.strokeColor.saturation = saturation;
          a.poly.strokeColor.brightness = brightness;
        }
      }
    } // Assump a_target is always a shape

  }, {
    key: "get_transform_artwork_at_state",
    value: function get_transform_artwork_at_state(state_idx, a_idx, nxt_i, n_target) {
      var i = state_idx;
      if (nxt_i == null) nxt_i = state_idx + 1;
      var d;
      var dx;
      var dy;
      var delta;
      var seg_change_value;

      if (this.input.is_shape) {
        d = this.get_delta_from_state(i, nxt_i);
        seg_change_value = this.get_change_in_segment_at_state(i, nxt_i);
        dx = d.x;
        dy = d.y;
        d = Math.sqrt(d.x * d.x + d.y * d.y);
      }

      if (this.input.is_collection) {
        if (this.mapping_behavior == "interpolate" || this.mapping_behavior == "random") {
          d = [];
          var x = [];
          var y = [];
          seg_change_value = [];

          for (var in_idx = 0; in_idx < this.n_input; in_idx++) {
            d[in_idx] = this.get_delta_from_state(i, nxt_i, in_idx);
            seg_change_value[in_idx] = this.get_change_in_segment_at_state(i, nxt_i, in_idx);
          }

          x = d.map(function (m) {
            return m.x;
          });
          y = d.map(function (m) {
            return m.y;
          });
          d = d.map(function (m) {
            return Math.sqrt(m.x * m.x + m.y * m.y);
          });
          var target_idx = a_idx;
          var divisor = this.input.shapes.length - 1;
          if (n_target > 1) divisor = n_target - 1;

          if (this.mapping_behavior == "random") {
            target_idx = this.random_indices[a_idx];

            if (this.mapping == this.PLAYBACK) {
              target_idx = this.target.random_indices[a_idx];
              divisor = this.target.n_target - 1;
            }
          }

          target_idx *= (this.n_input - 1) / divisor; // if (a_idx == 0) console.log(target_idx);

          dx = _utils.AMES_Utils.interpolate_fast(x, target_idx);
          dy = _utils.AMES_Utils.interpolate_fast(y, target_idx);
          d = _utils.AMES_Utils.interpolate_fast(d, target_idx);
          seg_change_value = _utils.AMES_Utils.interpolate_fast(seg_change_value, target_idx);
        }

        if (this.mapping_behavior == "alternate") {
          var _in_idx = a_idx % this.n_input;

          d = this.get_delta_from_state(i, nxt_i, _in_idx);
          seg_change_value = this.get_change_in_segment_at_state(i, nxt_i, _in_idx);
          dx = d.x;
          dy = d.y;
        }
      }

      var change_segment = false;
      if (seg_change_value > 0.5) change_segment = true;
      delta = {
        "x": dx,
        "y": dy,
        "v": d,
        "change_segment": change_segment
      };
      var duration = 1000 / ames.fps;

      if (this.tf_space_speed == this.SPEED_CONSTANT) {
        duration = duration;
      }

      if (this.tf_space_speed == this.SPEED_LINEAR) {
        duration *= d;
      }

      ;

      if (this.tf_space_speed == this.SPEED_XAXIS) {
        duration *= Math.abs(dx);
      }

      ;

      if (this.tf_space_speed == this.SPEED_YAXIS) {
        duration *= Math.abs(dy);
      }

      ;

      if (this.tf_space_speed == this.SPEED_MAP) {} // TBD


      if (duration == 0) duration = .001; // if (a_idx == 0) {
      // 	if (!this.debug_sum) this.debug_sum = 0;
      // 	this.debug_sum += delta.y;
      // 	if (!this.tracker_dot) this.tracker_dot = utils.make_dot(new Point(150, 150), 'pink', 2);
      // 	if (!this.og_dot) this.og_dot = utils.make_dot(new Point(150, 150), 'pink', 2);
      // 	// if (state_idx == 0) this.tracker_dot.position = new Point(150, 150);
      // 	this.tracker_dot.position.add(new Point(delta.x, delta.y));
      // }

      return [delta, duration];
    }
  }, {
    key: "get_delta_from_state",
    value: function get_delta_from_state(i, nxt_i, in_idx) {
      var in_artwork;
      if (this.input.is_artwork) in_artwork = this.input.poly;
      if (this.input.is_collection) in_artwork = this.input.shapes[in_idx].poly;
      var l = in_artwork.length;
      var prev_s = this.get_artwork_value_at_offset(in_artwork, i * l / this.tf_space_path_nsegments);
      var nxt_s = this.get_artwork_value_at_offset(in_artwork, nxt_i * l / this.tf_space_path_nsegments);
      return nxt_s.subtract(prev_s);
    }
  }, {
    key: "get_change_in_segment_at_state",
    value: function get_change_in_segment_at_state(i, nxt_i, in_idx) {
      var in_artwork;
      if (this.input.is_artwork) in_artwork = this.input.poly;
      if (this.input.is_collection) in_artwork = this.input.shapes[in_idx].poly;
      var l = in_artwork.length;
      var prev_loc = in_artwork.getLocationAt(i * l / this.tf_space_path_nsegments);
      var nxt_loc = in_artwork.getLocationAt(nxt_i * l / this.tf_space_path_nsegments);

      if (prev_loc && nxt_loc && prev_loc.curve != nxt_loc.curve) {
        return 1;
      }

      return 0;
    }
  }, {
    key: "get_artwork_value_at_offset",
    value: function get_artwork_value_at_offset(artwork, off) {
      if (off > artwork.length) off = artwork.length;
      var p = artwork.getPointAt(off);
      var t = this.tf_space_map_x_y(p.x, p.y);
      p.x = t.x;
      p.y = t.y;
      return p;
    }
  }, {
    key: "get_artwork_value_at_intersection",
    value: function get_artwork_value_at_intersection(artwork, axis_idx, axis_mapping) {
      var eps = 0.5;
      var p1;
      var p2;

      if (this.tf_mx == axis_mapping) {
        // Horizontal
        p1 = this.tf_space_reverse_map_x_y(axis_idx, this.tf_my1);
        if (axis_idx == 0) p1.x += eps;
        if (axis_idx == this.tf_mx2) p1.x -= eps;
        var ymax = this.tf_sy2;
        if (this.tf_s_yflip) ymax = this.tf_sy1;
        p2 = new Point(p1.x, ymax);
      }

      if (this.tf_my == axis_mapping) {
        // Vertical
        p1 = this.tf_space_reverse_map_x_y(this.tf_mx1, axis_idx);
        if (axis_idx == 0) p1.y += this.tf_s_yflip ? -eps : eps;
        if (axis_idx == this.tf_my2) p1.y -= this.tf_s_yflip ? eps : -eps;
        p2 = new Point(this.tf_sx2, p1.y);
      }

      var line = new Path.Line(p1, p2);
      var intersects = artwork.getIntersections(line);
      line.visible = false; // line.strokeWidth = 1; line.strokeColor = "lightblue"; line.dashArray = [3, 5];
      // let p3 = new Point(this.tf_sx1, intersects[0].point.y);
      // let p4 = new Point(this.tf_sx2, intersects[0].point.y);
      // let line_v = new Path.Line(p3, p4);
      // line_v.visible = false;
      // line_v.strokeWidth = 1; line_v.strokeColor = "lightblue"; line_v.dashArray = [3, 5];

      console.log(intersects[0], p1, p2);
      var t = this.tf_space_map_x_y(intersects[0].point.x, intersects[0].point.y); // let t_label = new PointText({
      // 	point: [p3.x - 5*utils.ICON_OFFSET, p3.y],
      // 	content: t.y.toFixed(2),
      // 	fillColor: utils.INACTIVE_S_COLOR,
      // 	fontFamily: utils.FONT,
      // 	fontSize: 8,
      // });

      return t;
    }
  }, {
    key: "get_value_at_target_index_for_axis_mapping",
    value: function get_value_at_target_index_for_axis_mapping(artwork_idx, axis_idx, axis_mapping, n_target) {
      return this.get_value_at_target_index_for_path_offset_or_axis_mapping(artwork_idx, null, axis_idx, axis_mapping, n_target);
    }
  }, {
    key: "get_value_at_target_index_for_path_offset",
    value: function get_value_at_target_index_for_path_offset(artwork_idx, offset, n_target) {
      return this.get_value_at_target_index_for_path_offset_or_axis_mapping(artwork_idx, offset, null, null, n_target);
    }
  }, {
    key: "get_value_at_target_index_for_path_offset_or_axis_mapping",
    value: function get_value_at_target_index_for_path_offset_or_axis_mapping(a_idx, offset, axis_idx, axis_mapping, n_target) {
      var p;
      var x;
      var y;

      if (this.input.is_shape) {
        if (axis_mapping) {
          var target_idx = a_idx;

          if (this.mapping_behavior == "random") {
            target_idx = Math.random() * (n_target - 1);
          }

          p = this.get_artwork_value_at_intersection(this.input.poly, target_idx, axis_mapping);
        } else {
          if (offset == "end") offset = this.input.poly.length;

          if (offset == null) {
            var _target_idx = a_idx;

            if (this.mapping_behavior == "random") {
              _target_idx = Math.random() * (n_target - 1);
            }

            offset = (_target_idx + 0.5) * this.input.poly.length / this.n_target;
          }

          p = this.get_artwork_value_at_offset(this.input.poly, offset);
        }

        x = p.x;
        y = p.y;
        p = Math.sqrt(x * x + y * y);
      }

      if (this.input.is_collection) {
        if (this.mapping_behavior == "interpolate" || this.mapping_behavior == "random") {
          p = [];

          for (var in_idx = 0; in_idx < this.n_input; in_idx++) {
            var in_artwork = this.input.shapes[in_idx].poly;

            if (axis_mapping) {
              var _target_idx3 = a_idx;

              if (this.mapping_behavior == "random") {
                _target_idx3 = Math.random() * (n_target - 1);
              }

              console.log(_target_idx3);
              p[in_idx] = this.get_artwork_value_at_intersection(in_artwork, _target_idx3, axis_mapping);
            } else {
              if (offset == null) {
                var _target_idx4 = a_idx;

                if (this.mapping_behavior == "random") {
                  _target_idx4 = Math.random() * (n_target - 1);
                }

                offset = (_target_idx4 + 0.5) * in_artwork.length / this.n_target;
              }

              if (offset == "end") offset = in_artwork.length;
              p[in_idx] = this.get_artwork_value_at_offset(in_artwork, offset);
            }
          }

          x = p.map(function (p) {
            return p.x;
          });
          y = p.map(function (p) {
            return p.y;
          });
          p = p.map(function (p) {
            return Math.sqrt(p.x * p.x + p.y * p.y);
          });
          var _target_idx2 = a_idx;
          var divisor = this.input.shapes.length - 1;
          if (this.target.is_collection) divisor = n_target - 1;

          if (this.mapping_behavior == "random") {
            _target_idx2 = this.random_indices[a_idx];

            if (this.mapping == this.PLAYBACK) {
              _target_idx2 = this.target.random_indices[a_idx];
              divisor = this.target.n_target - 1;
            }
          }

          _target_idx2 *= (this.input.shapes.length - 1) / divisor;
          x = _utils.AMES_Utils.interpolate_fast(x, _target_idx2);
          y = _utils.AMES_Utils.interpolate_fast(y, _target_idx2);
          p = _utils.AMES_Utils.interpolate_fast(p, _target_idx2);
        }

        if (this.mapping_behavior == "alternate") {
          var _in_idx2 = a_idx % this.n_input;

          var _in_artwork = this.input.shapes[_in_idx2].poly;

          if (axis_mapping) {
            p = this.get_artwork_value_at_intersection(_in_artwork, axis_idx, axis_mapping);
          } else {
            if (offset == null) offset = (a_idx + 0.5) * _in_artwork.length / this.n_target;
            if (offset == "end") offset = _in_artwork.length;
            p = this.get_artwork_value_at_offset(_in_artwork, offset);
          }

          x = p.x;
          y = p.y;
        }
      }

      return {
        "x": x,
        "y": y,
        "v": p
      };
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var x in this.tf_s) {
        this.tf_s[x].remove();
      }

      if (this.input) this.input.remove_transformation(this);
      this.input = null;
      this.target = null;
      ames.update_layers({
        "remove": true,
        "box": ames.obj_boxes_dict[this.name]
      });
    }
  }]);

  return AMES_Transformation;
}();

exports.AMES_Transformation = AMES_Transformation;

_defineProperty(AMES_Transformation, "count", 1);

var Transformation_Space = function Transformation_Space() {
  _classCallCheck(this, Transformation_Space);
};

exports.Transformation_Space = Transformation_Space;
},{"./editors.js":7,"./utils.js":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Utils = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// ---------------------------------------------------------------------------
// utils.js
// Author: Sonia Hashim
//
// Description: AMES utilities
// ---------------------------------------------------------------------------
var AMES_Utils = /*#__PURE__*/function () {
  function AMES_Utils() {
    _classCallCheck(this, AMES_Utils);
  }

  _createClass(AMES_Utils, null, [{
    key: "get_e_point",
    value: // General ui format elements
    // Layer box ui elements
    // Editor properties
    function get_e_point(e) {
      return view.viewToProject(DomEvent.getOffset(e, ames.canvas));
    }
  }, {
    key: "lengthsq",
    value: function lengthsq(p1, p2) {
      var x1 = p1.x;
      var x2 = p2.x;
      var y1 = p1.y;
      var y2 = p2.y;
      return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }
  }, {
    key: "is_active",
    value: function is_active(b) {
      var btn = this.get_button(b);
      if (btn) return btn.style.backgroundColor == this.ACTIVE_COLOR;
    }
  }, {
    key: "deactivate",
    value: function deactivate(b) {
      var btn = this.get_button(b);
      if (btn) btn.style.backgroundColor = null;
    }
  }, {
    key: "activate",
    value: function activate(b) {
      var btn = this.get_button(b);
      console.log(btn);
      if (btn) btn.style.backgroundColor = this.ACTIVE_COLOR;
    }
  }, {
    key: "style_label",
    value: function style_label(label) {
      label.fontSize = this.FONT_SIZE;
      label.fillColor = 'lightgray';
      label.fontFamily = this.FONT;
    } // get_buttons(b)
    // Returns the button given the value of the button b if it's defined in a btn list

  }, {
    key: "get_button",
    value: function get_button(b) {
      for (var i = 0; i < this.btns.length; i++) {
        var btn_list = this.btns[i];

        if (btn_list.hasOwnProperty(b)) {
          return document.getElementById(btn_list[b]);
        }
      }

      return null;
    }
  }, {
    key: "cb_canvas_crosshair",
    value: function cb_canvas_crosshair(e) {
      ames.canvas.style.cursor = 'crosshair';
    }
  }, {
    key: "make_dot",
    value: function make_dot(p, color, radius) {
      if (!radius) radius = 2.5;
      var d = new Path.Circle(p, radius);
      if (!color) color = this.SHAPE_PATH_COLOR;
      d.fillColor = color;
      return d;
    }
  }, {
    key: "make_square_dot",
    value: function make_square_dot(p, color) {
      var d = new Path.Rectangle(p, new Size(3, 3));
      d.position = p;
      if (!color) color = this.SHAPE_PATH_COLOR;
      d.fillColor = 'white';
      d.strokeColor = color;
      return d;
    }
  }, {
    key: "make_line",
    value: function make_line(p1, p2) {
      var p = new Path.Line(p1, p2);
      p.strokeColor = this.SHAPE_PATH_COLOR;
      return p;
    }
  }, {
    key: "make_rect",
    value: function make_rect(r, color) {
      if (!color) color = this.SHAPE_HIGHLIGHT_COLOR;
      var p = new Path.Rectangle(r);
      p.strokeColor = color;
      p.strokeWidth = 0.5;
      p.sendToBack();
      return p;
    } // interpolate: Lagrange interpolation over polynomial given by y = f(x),
    // where data = [[x,y], [x,y], ...] and idx is the relative idx of the
    // desired queried result
    // ref: https://www.geeksforgeeks.org/lagranges-interpolation/

  }, {
    key: "interpolate",
    value: function interpolate(data, idx) {
      var n = data.length;
      var X = 0;
      var Y = 1;
      var r = 0;
      if (n == 1) r = data[0][Y]; // console.log(data[1][1]);

      for (var i = 0; i < n; i++) {
        var t = data[i][Y];
        var x_i = data[i][X];

        for (var j = 0; j < n; j++) {
          if (j != i) t = t * (idx - data[j][X]) / (x_i - data[j][X]);
        }

        r += t;
      }

      return r;
    } // interpolate: Lagrange interpolation over polynomial given by y = f(x),
    // where data = [y0, y1, ... yn] and idx is the relative idx of the
    // desired queried result or an array of indices [i0, i1, ... in]
    // ref: https://www.geeksforgeeks.org/lagranges-interpolation/

  }, {
    key: "interpolate_fast",
    value: function interpolate_fast(data, idx) {
      var n = data.length;
      var m = null;
      if (Array.isArray(idx)) m = idx.length;
      var r = 0;
      if (n == 1) r = data[0];
      var v = 0;

      if (m) {
        r = [];
        if (n == 1) v = data[0];

        for (var k = 0; k < m; k++) {
          r.push(v);
        }
      }

      var t;

      for (var i = 0; i < n; i++) {
        if (!m) {
          t = data[i];
        }

        if (m) {
          t = [];

          for (var _k = 0; _k < m; _k++) {
            t[_k] = data[i];
          }
        }

        for (var j = 0; j < n; j++) {
          if (j != i) {
            if (!m) {
              t = t * (idx - j) / (i - j);
            }

            if (m) {
              for (var _k2 = 0; _k2 < m; _k2++) {
                t[_k2] = t[_k2] * (idx[_k2] - j) / (i - j);
              }
            }
          }
        }

        if (!m) r += t;

        if (m) {
          for (var _k3 = 0; _k3 < m; _k3++) {
            r[_k3] += t[_k3];
          }
        }
      }

      return r;
    }
  }]);

  return AMES_Utils;
}();

exports.AMES_Utils = AMES_Utils;

_defineProperty(AMES_Utils, "ACTIVE_COLOR", '#800020');

_defineProperty(AMES_Utils, "INACTIVE_COLOR", 'white');

_defineProperty(AMES_Utils, "INACTIVE_DARK_COLOR", 'whitesmoke');

_defineProperty(AMES_Utils, "INACTIVE_S_COLOR", '#838383');

_defineProperty(AMES_Utils, "ACTIVE_S_COLOR", 'black');

_defineProperty(AMES_Utils, "SHAPE_PATH_COLOR", 'dodgerblue');

_defineProperty(AMES_Utils, "SHAPE_HIGHLIGHT_COLOR", 'aqua');

_defineProperty(AMES_Utils, "LIST_HIGHLIGHT_COLOR", 'chartreuse');

_defineProperty(AMES_Utils, "C_REFERENCE_HIGHLIGHT", 'orange');

_defineProperty(AMES_Utils, "C_RELATIVE_COLOR", 'mediumorchid');

_defineProperty(AMES_Utils, "LAYER_HEIGHT", 25);

_defineProperty(AMES_Utils, "ICON_OFFSET", 4);

_defineProperty(AMES_Utils, "FONT", 'Times');

_defineProperty(AMES_Utils, "FONT_SIZE", 10);

_defineProperty(AMES_Utils, "SCROLLBAR_WIDTH", 5);

_defineProperty(AMES_Utils, "L_CONTROLS", ["Shapes", "Lists", "Animations"]);

_defineProperty(AMES_Utils, "L_IDX_BOX", 0);

_defineProperty(AMES_Utils, "L_IDX_NAME", 1);

_defineProperty(AMES_Utils, "L_IDX_TRASH", 2);

_defineProperty(AMES_Utils, "L_IDX_EYE", 3);

_defineProperty(AMES_Utils, "L_IDX_EYE_SLASH", 4);

_defineProperty(AMES_Utils, "L_IDX_ICONS", [2, 3, 4]);

_defineProperty(AMES_Utils, "L_EXPAND_IDX", 2);

_defineProperty(AMES_Utils, "L_CONTRACT_IDX", 3);

_defineProperty(AMES_Utils, "SIDEBAR_WIDTH", 300);

_defineProperty(AMES_Utils, "SIDEBAR_HEIGHT", 550);

_defineProperty(AMES_Utils, "OFFSET", 4);

_defineProperty(AMES_Utils, "UX_SHOW_IDX", 4);

_defineProperty(AMES_Utils, "UX_HIDE_IDX", 3);

_defineProperty(AMES_Utils, "VIS_PROPS", ["position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "path"]);

_defineProperty(AMES_Utils, "SUB_PROPS", {
  "position": ["x", "y"],
  "scale": ["x", "y"],
  "rotation": ["t"],
  "fillColor": ["h", "s", "v", "a"],
  "strokeWidth": ["w"],
  "strokeColor": ["h", "s", "v", "a"],
  "path": [],
  "nsides": []
});

_defineProperty(AMES_Utils, "shape_btns", {
  'Square': 'btn-shape-square',
  'Circle': 'btn-shape-circle',
  'Path': 'btn-shape-path',
  'List': 'btn-list',
  'Duplicator': 'btn-duplicator',
  'Collection': 'btn-collection',
  'Animation': 'btn-animation'
});

_defineProperty(AMES_Utils, "btns", [AMES_Utils.shape_btns]);
},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Viewfoil = void 0;

var _utils = require("./utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AMES_Viewfoil = function AMES_Viewfoil() {
  _classCallCheck(this, AMES_Viewfoil);

  _defineProperty(this, "parent", void 0);

  _defineProperty(this, "z_distance", void 0);

  _defineProperty(this, "visible", void 0);

  _defineProperty(this, "artwork", void 0);

  _defineProperty(this, "linked_artwork", void 0);

  _defineProperty(this, "context", void 0);
};

exports.AMES_Viewfoil = AMES_Viewfoil;
},{"./utils.js":11}],13:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}]},{},[2]);
