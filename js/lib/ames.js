"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES = void 0;

var _utils = require("./utils.js");

var _shapes = require("./shapes.js");

var _editors = require("./editors.js");

var _constraints = require("./constraints.js");

var _lists = require("./lists.js");

var _animations = require("./animations.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Globals for ames
// ames.canvas_cx;
// ames.canvas_cy;
// ames.animations;
var AMES = /*#__PURE__*/function () {
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

    _defineProperty(this, "layers", {});
  }

  _createClass(AMES, [{
    key: "init",
    value: // controls
    // Views & controls
    // Scrubber
    // State & Timing
    // time in system
    // time between elapsed frames
    // in seconds
    // State
    // Testing
    // UX
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
      this.tools['Animation'] = this.init_animation_tool();
      this.tools['Animation_Link'] = this.init_animation_link_tool(); // Activate canvas

      this.canvas_view._project.activate(); // Set up sidebar


      this.idx_boxes = new Array();
      this.setup_layers(); // Import icons

      this.create_toolbar();
      this.create_sidebar();
      this.import_icons();
    }
  }, {
    key: "create_toolbar",
    value: function create_toolbar() {
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

      toolbar.activate_btn = function (btn_name) {};

      toolbar.deactivate_btn = function (btn_name) {};

      toolbar.create_btn = function (btn_name, i_name, cb) {
        var btn = new Group();
        var btn_i = ames.icons[i_name].clone();
        var p = ames.toolbar.get_position();
        btn_i.position = new Point(p.x, p.y - 25 * ames.toolbar.n_btns);
        btn_i.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
        btn_i.scaling = 1.25;
        btn_i.visible = true;
        var btn_position = btn_i.position;
        var btn_r = new Path.Rectangle(ames.canvas_view.center, new Size(25, 25));
        btn_r.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
        btn_r.position = btn_i.position;
        btn_r.strokeWidth = 1;
        btn_r.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
        btn.addChildren([btn_r, btn_i]);
        btn.position = btn_i.position;
        console.log(btn.position);

        btn.onClick = function (e) {
          cb();
        };

        ames.toolbar.n_btns += 1;
        ames.toolbar.btns[btn_name] = btn;
        console.log('Toolbar Buttons', ames.toolbar.n_btns, ames.toolbar.children);
        toolbar.position = toolbar.get_position();
        ames.ux.push(btn);
      };

      toolbar.create_tool_btn = function (btn_name, i_name) {
        var tool_cb = function tool_cb() {
          ames.switch_tool({
            b: btn_name
          });
        };

        console.log(ames.toolbar);
        ames.toolbar.create_btn(btn_name, i_name, tool_cb);
      };

      toolbar.position = toolbar.get_position();
      ames.toolbar = toolbar;
    }
  }, {
    key: "create_sidebar",
    value: function create_sidebar() {
      var _this = this;

      var sidebar = new Group();
      this.create_color_picker();
      var w = _utils.AMES_Utils.SIDEBAR_WIDTH;
      console.log("SIDEBAR_WIDTH", w);
      var h = _utils.AMES_Utils.SIDEBAR_HEIGHT;
      var r = new Path.Rectangle(ames.canvas_view.center, new Size(w, h));
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
      var ames_box = new Path.Rectangle(r.position, new Size(w, 3 * ames_text.bounds.height));
      ames_box.position = ames_text.position;
      ames_box.fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      ames_box.strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR; // Add ux show / hide carets

      sidebar.add_caret = function (i_name) {
        var button = ames.icons[i_name].clone();
        var caret_position = new Point(ames_text.position.x - ames_text.bounds.width / 2 - 4 * _utils.AMES_Utils.ICON_OFFSET, ames_text.position.y);
        button.position = caret_position;
        button.scaling = 0.75;
        button.strokeColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR; // Show

        if (i_name == "caret-right") {
          button.visible = false;

          button.onClick = function (e) {
            _this.show_ux(true);

            button.visible = false;
            sidebar.children[_utils.AMES_Utils.UX_HIDE_IDX].visible = true;
          };

          sidebar.insertChild(_utils.AMES_Utils.UX_SHOW_IDX, button);
        } // Hide


        if (i_name == "caret-down") {
          button.visible = true;

          button.onClick = function (e) {
            _this.show_ux(false);

            button.visible = false;
            sidebar.children[_utils.AMES_Utils.UX_SHOW_IDX].visible = true;
            console.log("make visible...", sidebar.children[_utils.AMES_Utils.UX_SHOW_IDX]);
          };

          sidebar.insertChild(_utils.AMES_Utils.UX_HIDE_IDX, button);
        }
      };

      sidebar.addChildren([r, ames_box, ames_text]);
      var layers_panel = new Group();
      sidebar.addChild(layers_panel);

      var get_position = function get_position() {
        var cw = ames.canvas_view.size.width / 2 - .5 * _utils.AMES_Utils.ICON_OFFSET;
        var ch = -ames.canvas_view.size.height / 2 + 2 * _utils.AMES_Utils.ICON_OFFSET;
        var csize = new Point(-sidebar.bounds.width / 2, sidebar.bounds.height / 2);
        return ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
      };

      sidebar.position = get_position();
      sidebar.visible = true;
      this.sidebar = sidebar;
    }
  }, {
    key: "show_ux",
    value: function show_ux(bool) {
      console.log("Toggle show_ux", bool);

      for (var idx in this.ux) {
        this.ux[idx].visible = bool;
      }
    } // import_icon: imports *.svg from local dir ../svg/

  }, {
    key: "import_icons",
    value: function import_icons() {
      var icons = ["eye", "eye-slash", "trash", "caret-down", "caret-right", "position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "close", "link", "link-remove", "path", "play", "axes", "brush", "pause", "rewind", "loop", "arrow", "dotted-circle", "dotted-square", "vector-pen"];

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
      });
    } // icon_caret: use caret to expand & contract layers controls

  }, {
    key: "icon_caret",
    value: function icon_caret(i_name) {
      var _this2 = this;

      ames.sidebar.add_caret(i_name); // CHANGE - Delete everything below this line

      var by = _utils.AMES_Utils.LAYER_HEIGHT;

      var _loop = function _loop(idx) {
        var n = _utils.AMES_Utils.L_CONTROLS[idx];
        var box = ames.obj_boxes[n];

        var caret = _this2.icons[i_name].clone();

        var caret_w = caret.bounds.width;
        caret.scaling = 0.65;
        var box_y = box.position.y;
        var caret_p = new Point(caret_w / 2 + _utils.AMES_Utils.ICON_OFFSET, box_y + 1);
        caret.position = caret_p;
        var expand_idx = _utils.AMES_Utils.L_EXPAND_IDX;
        var collapse_idx = _utils.AMES_Utils.L_CONTRACT_IDX;

        if (i_name == 'caret-right') {
          box.insertChild(expand_idx, caret);
          caret.visible = true;

          caret.onClick = function (e) {
            _this2.expand_layers(n, true);

            caret.visible = false;
            box.children[collapse_idx].visible = true;
          };
        }

        if (i_name == 'caret-down') {
          box.insertChild(collapse_idx, caret);
          caret.visible = false;

          caret.onClick = function (e) {
            _this2.expand_layers(n, false);

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
        colorwheel.scaling = 0.2;
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
        var r = new Path.Rectangle(colorpicker.position, new Size(r_dim, r_dim));
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

          var dot = _utils.AMES_Utils.make_dot(new Point(dot_start, y + 2 * _utils.AMES_Utils.ICON_OFFSET));

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
        var lightness_label = lightness[2]; // Color wheel radius is 73

        var radius = 73;
        var gwheel = new Path.Circle({
          center: [cwheel.position.x, cwheel.position.y],
          radius: 73,
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
          if (!c) c = _utils.AMES_Utils.INACTIVE_COLOR; // update swatch

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
      var _this3 = this;

      this.is_playing = false; // Pause animations

      var _loop2 = function _loop2(k) {
        var a = _this3.animations[k];
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
    key: "loop",
    value: function loop() {
      this.is_looping = !this.is_looping;
    }
  }, {
    key: "get_time_from_scrubber",
    value: function get_time_from_scrubber() {
      var sc_x = this.scrubber.position.x;
      var t = (sc_x - this.min_sc) / (this.max_sc - this.min_sc);
      return t;
    }
  }, {
    key: "update_scrubber_to_time",
    value: function update_scrubber_to_time() {
      var sc_x = this.time * (this.max_sc - this.min_sc) + this.min_sc;
      return sc_x;
    }
  }, {
    key: "set_time",
    value: function set_time(t) {
      this.time = t;
      this.adjust_t_delta;
    }
  }, {
    key: "get_duration",
    value: function get_duration(x) {
      return 1000;
    }
  }, {
    key: "test",
    value: function test() {
      var obj_a = new _shapes.AMES_Circle();
      obj_a.set_pos(new Point(200, 200));
      obj_a.poly.visible = true;
      obj_a.poly.radius = 25;
      obj_a.to_path();
      this.add_shape(obj_a);
      var artwork_duplicator = new _lists.AMES_List([obj_a], {
        "is_para_style_list": false,
        "is_duplicator": true
      });
      this.add_list(artwork_duplicator);

      for (var i = 0; i < 2; i++) {
        artwork_duplicator.add_item();
      }

      var obj_b = new _shapes.AMES_Square();
      obj_b.set_pos(new Point(400, 400));
      obj_b.poly.visible = true;
      obj_b.poly.size = new Size(100, 100);
      obj_b.to_path();
      this.add_shape(obj_b);
      var obj_c = new _shapes.AMES_Circle();
      obj_c.set_pos(new Point(550, 450));
      obj_c.poly.visible = true;
      obj_c.poly.radius = 50;
      obj_c.to_path();
      this.add_shape(obj_c);
      var transformation_list = new _lists.AMES_List([obj_b, obj_c], {
        "is_para_style_list": false
      });
      this.add_list(transformation_list);
      var animation = new _animations.AMES_Animation();
      this.add_animation(animation);
      animation.set_geometry_field('artwork', artwork_duplicator);
      animation.set_geometry_field('transformation', transformation_list);
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

      x.editor = new _editors.AMES_List_Editor(x);
      this.add_obj(x, _utils.AMES_Utils.L_CONTROLS[1]);
      x.show(true);
      this.lists[x.name] = x;
    }
  }, {
    key: "add_animation",
    value: function add_animation(x) {
      this.n_aobjs += 1;
      x.editor = new _editors.AMES_Animation_Editor(x);
      this.add_obj(x, _utils.AMES_Utils.L_CONTROLS[2]);
      this.aobjs[x.name] = x;
    }
  }, {
    key: "hide_editors",
    value: function hide_editors(obj) {
      obj = obj || {};

      for (var i in this.objs) {
        if (this.objs[i].name != obj.name) {
          if (!(obj.is_shape && this.objs[i].is_list && this.objs[i].has_shape(obj))) {
            this.objs[i].editor.show(false);

            this.objs[i]._clear_cb_helpers();
          }
        }
      } // ames.colorpicker.visible = false;


      if (obj.active_prop == 'strokeColor' || obj.active_prop == 'fillColor') ames.colorpicker.visible = true;
    }
  }, {
    key: "add_obj",
    value: function add_obj(x, t_obj) {
      var _this4 = this;

      // Hide all open editors
      this.hide_editors(x);
      var n = x.name;
      var box_idx;

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[0]) {
        box_idx = this.l_shape_idx;
        this.l_shape_idx += 1;
      }

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[1]) {
        // this.n_lists += 1;
        // let n_list = this.n_lists - 1;
        // n = "List " + n_list + " (" + x.get_name() + ") ";
        box_idx = this.l_shape_idx + this.l_list_idx;
        this.l_list_idx += 1;
      }

      if (t_obj == _utils.AMES_Utils.L_CONTROLS[2]) {
        box_idx = this.l_shape_idx + this.l_list_idx + this.l_aobj_idx;
        this.l_aobj_idx += 1;
      } // Add obj


      this.objs[n] = x; // Create obj box in layers view
      // Activate layers project

      var w = 250; // Create a new layers ui box

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
        point: [2 * _utils.AMES_Utils.ICON_OFFSET, by / 2 + _utils.AMES_Utils.FONT_SIZE / 2],
        content: n,
        fillColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
        fontFamily: _utils.AMES_Utils.FONT,
        fontSize: _utils.AMES_Utils.FONT_SIZE
      }); // Remove icon

      var trash = ames.icons['trash'].clone();
      var trash_w = trash.bounds.width;
      trash.visible = true;
      trash.position = new Point(w - trash_w / 2 - _utils.AMES_Utils.ICON_OFFSET, by / 2); // Visibility icons

      var eye = ames.icons['eye'].clone();
      var eye_slash = ames.icons['eye-slash'].clone();
      var eye_w = eye.bounds.width;
      eye.visible = true;
      eye_slash.visible = false;
      var eye_pos = new Point(w - trash_w - eye_w / 2 - 2 * _utils.AMES_Utils.ICON_OFFSET, by / 2);
      eye.position = eye_pos;
      eye_slash.position = eye_pos; // Add children to box

      box.addChild(rect);
      box.addChild(n_text);
      box.addChild(trash);
      box.addChild(eye);
      box.addChild(eye_slash); // Set active box to false

      box.is_active_box = true; // Add box to ames controls

      this.idx_boxes.splice(box_idx, 0, n);
      this.obj_boxes[n] = box;
      if (t_obj == _utils.AMES_Utils.L_CONTROLS[2]) console.log("adding animation box?", box_idx, box); // Insert box & update the locations of the other boxes

      var ny = box_idx * by + by / 2 + box_idx * .5;
      box.position = new Point(w / 2, ny);
      var n_boxes = this.idx_boxes.length;

      for (var i = box_idx + 1; i < n_boxes; i++) {
        var b_name = this.idx_boxes[i];
        this.obj_boxes[b_name].position.y += by + .5;
      } // Click on layers obj box selects the object


      box.onClick = function (e) {
        // if the point is not a click on the children return .
        for (var idx in box.children) {
          if (idx != 0 && box.children[idx].bounds.contains(e.point)) return;
        }

        if (box.is_active_box) {
          // deactivate object
          _this4.deactivate_obj(n);

          delete _this4.active_objs[n];
        } else {
          // activate object
          _this4.activate_obj(n);

          _this4.active_objs[n] = x;
        }

        box.is_active_box = !box.is_active_box;
      }; // Remove object on clicking the trash can


      trash.onClick = function (e) {
        // Box has to be active to delete an object
        if (box.is_active_box) {
          _this4.remove_obj(n, t_obj);
        }
      }; // Toggle visibility on clicking the eye


      eye.onClick = function (e) {
        // Box has to be active to toggle visibility
        if (!box.is_active_box) return;
        eye.visible = false;
        eye_slash.visible = true;
        x.show(false); // Remove from active objs until visible

        delete _this4.active_objs[x.name];
      };

      eye_slash.onClick = function (e) {
        // Box has to be active to toggle visibility
        if (!box.is_active_box) return;
        eye_slash.visible = false;
        eye.visible = true;
        x.show(true); // Add back to active objs
        // Remove from active objects

        _this4.active_objs[x.name] = x;
      }; // start objects as active


      this.activate_obj(n);
      this.active_objs[n] = x;
    } // active_obj: Activates layers box and enables object selection

  }, {
    key: "activate_obj",
    value: function activate_obj(n) {
      var x = this.objs[n];
      x.make_interactive(true);
      x.show_editor(true); // Activate layers box

      var box = this.obj_boxes[n];
      box.children[_utils.AMES_Utils.L_IDX_BOX].fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
      box.children[_utils.AMES_Utils.L_IDX_BOX].strokeColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
      box.children[_utils.AMES_Utils.L_IDX_NAME].fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;

      for (var idx in _utils.AMES_Utils.L_IDX_ICONS) {
        box.children[_utils.AMES_Utils.L_IDX_ICONS[idx]].fillColor = _utils.AMES_Utils.ACTIVE_S_COLOR;
      }
    } // deactivate_obj: Deactivates layers box and disables object selection

  }, {
    key: "deactivate_obj",
    value: function deactivate_obj(n) {
      var x = this.objs[n];
      x.make_interactive(false);
      x.show_editor(false); // Deactivate layers box

      var box = this.obj_boxes[n];
      box.children[_utils.AMES_Utils.L_IDX_BOX].fillColor = _utils.AMES_Utils.INACTIVE_DARK_COLOR;
      box.children[_utils.AMES_Utils.L_IDX_BOX].strokeColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      box.children[_utils.AMES_Utils.L_IDX_NAME].fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;

      for (var idx in _utils.AMES_Utils.L_IDX_ICONS) {
        box.children[_utils.AMES_Utils.L_IDX_ICONS[idx]].fillColor = _utils.AMES_Utils.INACTIVE_S_COLOR;
      }
    }
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

      for (var _i2 = idx; _i2 < this.idx_boxes.length; _i2++) {
        var m = this.idx_boxes[_i2];
        var m_box = this.obj_boxes[m];
        var ny = _i2 * by + by / 2 + _i2 * .5;
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
        if (!_this5.on_canvas(e)) return;
        x = new _shapes.AMES_Square();

        if (x.poly) {
          x.set_pos(e.point);
          x.poly.visible = true;
        }

        square_tool.onMouseDrag = cb_scale_circle;
      };

      var cb_scale_circle = function cb_scale_circle(e) {
        if (!x) return;
        var s = e.point.getDistance(x.poly.position) + 2;
        x.poly.size = new Size(s, s);
      };

      var cb_finish_square = function cb_finish_square(e) {
        if (!x) return;
        square_tool.onMouseDrag = null;
        x.to_path();
        x.poly.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;

        _this5.add_shape(x);

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
        if (!_this6.on_canvas(e)) return;
        c = new _shapes.AMES_Circle();

        if (c.poly) {
          c.set_pos(e.point);
          c.poly.visible = true;
        }

        circle_tool.onMouseDrag = cb_scale_circle;
      };

      var cb_scale_circle = function cb_scale_circle(e) {
        if (!c) return;
        c.poly.radius = e.point.getDistance(c.poly.position) + 2;
      };

      var cb_finish_circle = function cb_finish_circle(e) {
        if (!c) return;
        circle_tool.onMouseDrag = null;
        c.to_path();
        c.poly.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;

        _this6.add_shape(c);

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
        console.log('make seg controls?', s);
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
        if (!_this7.on_canvas(e)) return;
        x = new _shapes.AMES_Path();
        path_tool.onMouseDown = cb_add_point;
        path_tool.onMouseDrag = cb_adjust_handle;
        cb_add_point(e);
      };

      var thresh = 144; // within 12px
      // Add point to line

      var cb_add_point = function cb_add_point(e) {
        // If point is close enough to previous point or first point
        // finish path and reset tool
        if (x.poly.segments.length >= 2) {
          // Make closed path and reset
          if (_utils.AMES_Utils.lengthsq(x.poly.firstSegment.point, e.point) < thresh) {
            console.log("closed path");
            x.poly.closed = true;

            _this7.add_shape(x);

            path_tool.clean_tool();
            return;
          } // Make open-ended path


          if (_utils.AMES_Utils.lengthsq(x.poly.lastSegment.point, e.point) < thresh) {
            console.log("open path");

            _this7.add_shape(x);

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
        console.log("start list");
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

        for (var i in _this8.active_objs) {
          var s = _this8.active_objs[i];

          if (s.is_shape) {
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
        console.log("make list");
        var shapes = [];

        for (var k in selected_shapes) {
          shapes.push(selected_shapes[k]);
        }

        if (shapes.length != 0) {
          var list = new _lists.AMES_List(shapes, opt);

          _this8.add_list(list);
        } // clean tool shapes


        for (var i in select_helpers) {
          var s = select_helpers[i];
          s.remove();
        }

        lbox.remove();
        s_dot.remove();
        e_dot.remove();
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
    } // init_duplicator_tool: creates a duplicator using underlying active shapes

  }, {
    key: "init_duplicator_tool",
    value: function init_duplicator_tool() {
      var _this9 = this;

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
        console.log("start list");
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

        for (var i in _this9.active_objs) {
          var s = _this9.active_objs[i];

          if (s.is_shape) {
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
        console.log("make list");
        var shapes = [];

        for (var k in selected_shapes) {
          shapes.push(selected_shapes[k]);
        }

        if (shapes.length != 0) {
          var list = new _lists.AMES_Duplicator(shapes);

          _this9.add_list(list);
        } // clean tool shapes


        for (var i in select_helpers) {
          var s = select_helpers[i];
          s.remove();
        }

        lbox.remove();
        s_dot.remove();
        e_dot.remove();
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
    }
  }, {
    key: "init_constraint_tool",
    value: function init_constraint_tool() {
      var _this10 = this;

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
        if (!_this10.on_canvas(e)) return;

        if (!_this10.active_objs[_this10.c_relative.name]) {
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
        if (!_this10.active_objs[_this10.c_relative.name]) {
          clean_constraint_tool();
          return;
        }

        if (!line) {
          clean_constraint_tool();
          return;
        }

        point_in_box = false; // If end point is the bounding box of an active object

        for (var k in _this10.active_objs) {
          // Snap the endpoint to the closest bounding box corner
          var obj = _this10.active_objs[k];

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
      var _this11 = this;

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
        clean_animation_link_tool();
        console.log("starting animation link connection?");
        if (!_this11.on_canvas(e)) return;
        console.log("...on canvas"); // console.log("The relative is " + ames.c_relative.name);

        line_start = _this11.active_linking_animation.editor.geometry_field_info[_this11.animation_active_field].link.position;
        line = new Path.Line(line_start, e.point);
        console.log("animation link line_start and line", line_start, line);
        line.strokeWidth = 1;
        line.dashArray = [3, 1];
        line.strokeColor = _utils.AMES_Utils.ACTIVE_COLOR;
        curr_obj = null;
        c_reference_box = null;
        point_in_box = false;
      };

      var cb_select_obj = function cb_select_obj(e) {
        if (!_this11.active_objs[_this11.active_linking_animation.name]) {
          clean_animation_link_tool();
          return;
        }

        if (!line) {
          clean_animation_link_tool();
          return;
        }

        point_in_box = false; // If end point is the bounding box of an active object

        for (var k in _this11.active_objs) {
          // Snap the endpoint to the closest bounding box corner
          var obj = _this11.active_objs[k];

          if (obj.is_geometry) {
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

      var cb_enable_animation_link = function cb_enable_animation_link(e) {
        // Set animation geometry field as specified
        var geometry_field_info = ames.active_linking_animation.editor.geometry_field_info[ames.animation_active_field];
        var link = geometry_field_info.link;
        var link_remove = geometry_field_info.link_remove;

        if (curr_obj) {
          var rel = ames.active_linking_animation;
          ames.active_linking_animation.set_geometry_field(ames.animation_active_field, curr_obj);
          ames.active_linking_animation.editor.geometry_field_info[ames.animation_active_field].label.content = curr_obj.name;
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
      var _this12 = this;

      var animation_tool = new Tool();

      var create_animation_box = function create_animation_box() {// Create empty animation object
      };

      var cb_make_animation = function cb_make_animation(e) {
        if (_this12.on_canvas(e)) {
          // Create box and show animation editor
          var a = new _animations.AMES_Animation();

          _this12.add_animation(a);
        }
      };

      var cb_deactivate_tool = function cb_deactivate_tool(e) {
        _this12.switch_tool({
          b: "Animation",
          deactivate: true
        });
      };

      animation_tool.onMouseDown = cb_make_animation;
      animation_tool.onMouseUp = cb_deactivate_tool;
      return animation_tool;
    } // on_canvas: determines if event fired is on the animation canvas

  }, {
    key: "on_canvas",
    value: function on_canvas(e) {
      var a = e.event.clientX;
      var b = e.event.clientY - 40;
      var p = new Point(a, b);
      return this.canvas_view.bounds.contains(p);
    }
  }]);

  return AMES;
}();

exports.AMES = AMES;