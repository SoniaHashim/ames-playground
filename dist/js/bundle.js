(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
    // Iniitalize AMES app properties after window loads
    function init() {
      // Get references to canvas objects
      var canvas = document.getElementById('animation-canvas'); // let controls = document.getElementById('control-canvas');

      var layers = document.getElementById('layers-canvas'); // Store animation canvas properties

      window.ames.canvas = canvas;
      window.ames.canvas_cx = canvas.width / 2;
      window.ames.canvas_cy = canvas.height / 2;
      window.ames.animations = {}; // // Set up project & view for controls - DELETE OLD CODE w/ SCRUBBER
      // paper.setup(controls);
      // this.init_controls(controls);
      // Set up project & view for layers

      paper.setup(layers);
      this.init_layers(); // Set up project & view for animation canvas

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
      this.tools['Animation_Link'] = this.init_animation_link_tool(); // Import any necessary icons

      this.idx_boxes = new Array();
      this.setup_layers();
      this.import_icons(); // Layers: create empty array for shapes
    } // import_icon: imports *.svg from local dir ../svg/

  }, {
    key: "import_icons",
    value: function import_icons() {
      var icons = ["eye", "eye-slash", "trash", "caret-down", "caret-right", "position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "close", "link", "link-remove", "path", "play", "axes", "brush", "pause", "rewind", "loop", "arrow"];

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

        if (n == 'caret-down' || n == 'caret-right') {
          ames.icon_caret(n);
        }

        if (n == 'close') {
          ames.create_color_picker();
        }
      });
    } // icon_caret: use caret to expand & contract layers controls

  }, {
    key: "icon_caret",
    value: function icon_caret(i_name) {
      var _this = this;

      var by = _utils.AMES_Utils.LAYER_HEIGHT;

      var _loop = function _loop(idx) {
        var n = _utils.AMES_Utils.L_CONTROLS[idx];
        var box = ames.obj_boxes[n];

        var caret = _this.icons[i_name].clone();

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
            _this.expand_layers(n, true);

            caret.visible = false;
            box.children[collapse_idx].visible = true;
          };
        }

        if (i_name == 'caret-down') {
          box.insertChild(collapse_idx, caret);
          caret.visible = false;

          caret.onClick = function (e) {
            _this.expand_layers(n, false);

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
      // Activate layers project
      this.layers_view._project.activate(); // Add control boxes for shapes, lists, animations


      var controls = _utils.AMES_Utils.L_CONTROLS;
      var w = this.layers_view.size.width;

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
      } // Activate canvas


      this.canvas_view._project.activate();
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
      var colorwheel = new Raster('colorwheel');
      colorwheel.on('load', function () {
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

        var close_button = ames.icons["close"].clone();
        close_button.scaling = 0.75;
        var close_w = close_button.bounds.width;
        var bbox_w = colorpicker.bounds.width / 2;
        var bbox_h = colorpicker.bounds.height / 2;
        var by = _utils.AMES_Utils.LAYER_HEIGHT;
        close_button.position = colorpicker.position.add(bbox_w + _utils.AMES_Utils.ICON_OFFSET, -bbox_h - 2 * _utils.AMES_Utils.ICON_OFFSET);
        close_button.visible = true;

        close_button.onClick = function (e) {
          colorpicker.visible = false;
        };

        colorpicker.addChild(close_button);
        var bbox = new Path.Rectangle({
          point: [colorpicker.position.x - bbox_w, colorpicker.position.y - bbox_h - 12],
          size: [colorpicker.bounds.width, colorpicker.bounds.height + 5 * _utils.AMES_Utils.ICON_OFFSET],
          strokeColor: _utils.AMES_Utils.INACTIVE_S_COLOR,
          fillColor: 'white',
          opacity: 0.5
        });
        colorpicker.insertChild(0, bbox);
        bbox.sendToBack();

        colorpicker.get_position = function (e) {
          var cw = ames.canvas_view.size.width / 2 - 2 * _utils.AMES_Utils.ICON_OFFSET;
          var ch = -ames.canvas_view.size.height / 2 + 2 * _utils.AMES_Utils.ICON_OFFSET;
          var csize = new Point(-colorpicker.bounds.width / 2, colorpicker.bounds.height / 2);
          return ames.canvas_view.center.add(new Point(cw, ch)).add(csize);
        }; // Make colorpicker draggable


        var dragging = false;
        var drag_offset = 0;

        colorpicker.onMouseDown = function (e) {
          var n_children = colorpicker.children.length;

          for (var idx = 1; idx < n_children; idx++) {
            var c = colorpicker.children[idx];

            if (c.contains(e.point)) {
              dragging = false;
              return;
            }
          }

          drag_offset = e.point.subtract(colorpicker.position);
          dragging = true;
        };

        colorpicker.onMouseDrag = function (e) {
          if (dragging) colorpicker.position = e.point.subtract(drag_offset);
        };

        colorpicker.onMouseUp = function (e) {
          if (dragging) dragging = false;
        }; // utils.make_dot(ames.canvas_view.center);


        colorpicker.position = colorpicker.get_position();
        ames.colorpicker = colorpicker;
        ames.colorpicker.visible = false;
      });
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
      var _this2 = this;

      this.is_playing = false; // Pause animations

      var _loop2 = function _loop2(k) {
        var a = _this2.animations[k];
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
      }

      ames.colorpicker.visible = false;
      if (obj.active_prop == 'strokeColor' || obj.active_prop == 'fillColor') ames.colorpicker.visible = true;
    }
  }, {
    key: "add_obj",
    value: function add_obj(x, t_obj) {
      var _this3 = this;

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

      this.layers_view._project.activate();

      var w = this.layers_view.size.width;
      var h = this.layers_view.size.height; // Create a new layers ui box

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
          _this3.deactivate_obj(n);

          delete _this3.active_objs[n];
        } else {
          // activate object
          _this3.activate_obj(n);

          _this3.active_objs[n] = x;
        }

        box.is_active_box = !box.is_active_box;
      }; // Remove object on clicking the trash can


      trash.onClick = function (e) {
        // Box has to be active to delete an object
        if (box.is_active_box) {
          _this3.remove_obj(n, t_obj);
        }
      }; // Toggle visibility on clicking the eye


      eye.onClick = function (e) {
        // Box has to be active to toggle visibility
        if (!box.is_active_box) return;
        eye.visible = false;
        eye_slash.visible = true;
        x.show(false); // Remove from active objs until visible

        delete _this3.active_objs[x.name];
      };

      eye_slash.onClick = function (e) {
        // Box has to be active to toggle visibility
        if (!box.is_active_box) return;
        eye_slash.visible = false;
        eye.visible = true;
        x.show(true); // Add back to active objs
        // Remove from active objects

        _this3.active_objs[x.name] = x;
      }; // Re-activate main project


      this.canvas_view._project.activate(); // start objects as active


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

      if (_utils.AMES_Utils.is_active(b) || opt.deactivate) {
        if (b == 'Path') {
          console.log("here");
          this.tools[b].clean_tool(true);
        }

        _utils.AMES_Utils.deactivate(b);

        ames.canvas.style.cursor = null;
        this.active_shape_btn = null;
        this.tools['inactive_tool'].activate();
      } else {
        // Disable active shape button
        if (this.active_shape_btn) {
          this.switch_tool({
            'b': this.active_shape_btn,
            'deactivate': true
          });
        }

        ames.canvas.style.cursor = 'crosshair';
        this.active_shape_btn = b;

        _utils.AMES_Utils.activate(b);

        var tool = this.tools[b];
        tool.activate();
      }
    } // init_square_tool: creates tool to draw squares / rectangles

  }, {
    key: "init_square_tool",
    value: function init_square_tool() {
      var _this4 = this;

      var square_tool = new Tool();
      var x; // Adjust the scale of the circle
      // Set center point of circle and scale to desired radius

      var cb_start_square = function cb_start_square(e) {
        if (!_this4.on_canvas(e)) return;
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

        _this4.add_shape(x);

        x = null;
      };

      square_tool.onMouseDown = cb_start_square;
      square_tool.onMouseUp = cb_finish_square;
      return square_tool;
    } // init_circle_tool: creates tool to draw circles / ellipses

  }, {
    key: "init_circle_tool",
    value: function init_circle_tool() {
      var _this5 = this;

      var circle_tool = new Tool();
      var c; // Adjust the scale of the circle
      // Set center point of circle and scale to desired radius

      var cb_start_circle = function cb_start_circle(e) {
        if (!_this5.on_canvas(e)) return;
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

        _this5.add_shape(c);

        c = null;
      };

      circle_tool.onMouseDown = cb_start_circle;
      circle_tool.onMouseUp = cb_finish_circle;
      return circle_tool;
    } // init_path_tool: creates tool to draw paths

  }, {
    key: "init_path_tool",
    value: function init_path_tool() {
      var _this6 = this;

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
        if (!_this6.on_canvas(e)) return;
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

            _this6.add_shape(x);

            path_tool.clean_tool();
            return;
          } // Make open-ended path


          if (_utils.AMES_Utils.lengthsq(x.poly.lastSegment.point, e.point) < thresh) {
            console.log("open path");

            _this6.add_shape(x);

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
      var _this7 = this;

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

        for (var i in _this7.active_objs) {
          var s = _this7.active_objs[i];

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

          _this7.add_list(list);
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
      var _this8 = this;

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
          var list = new _lists.AMES_Duplicator(shapes);

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
    }
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
        clean_animation_link_tool();
        console.log("starting animation link connection?");
        if (!_this10.on_canvas(e)) return;
        console.log("...on canvas"); // console.log("The relative is " + ames.c_relative.name);

        line_start = _this10.active_linking_animation.editor.geometry_field_info[_this10.animation_active_field].link.position;
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
        if (!_this10.active_objs[_this10.active_linking_animation.name]) {
          clean_animation_link_tool();
          return;
        }

        if (!line) {
          clean_animation_link_tool();
          return;
        }

        point_in_box = false; // If end point is the bounding box of an active object

        for (var k in _this10.active_objs) {
          // Snap the endpoint to the closest bounding box corner
          var obj = _this10.active_objs[k];

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
      var _this11 = this;

      var animation_tool = new Tool();

      var create_animation_box = function create_animation_box() {// Create empty animation object
      };

      var cb_make_animation = function cb_make_animation(e) {
        if (_this11.on_canvas(e)) {
          // Create box and show animation editor
          var a = new _animations.AMES_Animation();

          _this11.add_animation(a);
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
},{"./animations.js":3,"./constraints.js":4,"./editors.js":5,"./lists.js":6,"./shapes.js":8,"./utils.js":9}],2:[function(require,module,exports){
"use strict";

var _ames = require("./ames.js");

// ---------------------------------------------------------------------------
// ames_index.js
// Author: Sonia Hashim
//
// Description: Main execution space for ames on DOM load, attaches UX handler
// to global scope. Global scope includes paper object
// ---------------------------------------------------------------------------
console.log("Growth mindset & learning opportunities");
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
    ames.test();
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

    _defineProperty(this, "transformation_is_proprtional", true);

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
},{"./utils.js":9}],4:[function(require,module,exports){
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
},{"./utils.js":9}],5:[function(require,module,exports){
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
},{"./lists.js":6,"./shapes.js":8,"./utils.js":9}],6:[function(require,module,exports){
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
      console.log("duplicator: ", this.shapes);
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
},{"./constraints.js":4,"./shapes.js":8,"./utils.js":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyBox = void 0;

var _utils = require("./utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PropertyBox = /*#__PURE__*/function () {
  function PropertyBox(shape, properties) {
    var _this = this;

    _classCallCheck(this, PropertyBox);

    _defineProperty(this, "pos", {
      x: 0,
      y: 0
    });

    _defineProperty(this, "box", void 0);

    _defineProperty(this, "offset", void 0);

    _defineProperty(this, "close_text", void 0);

    _defineProperty(this, "rect", void 0);

    _defineProperty(this, "dragBox", false);

    _defineProperty(this, "props_text", {});

    _defineProperty(this, "active_prop", null);

    _defineProperty(this, "elisteners", {});

    _defineProperty(this, "cb_handlers", {});

    _defineProperty(this, "property_callbacks", {
      'Position': this.callback_position,
      'Scale': this.callback_scale
    });

    // parent shape
    this.parent = shape; // new group

    this.box = new Group({
      visible: false
    });
    this.update_position(); // containing box

    this.rect = new Shape.Rectangle({
      point: [this.pos.x, this.pos.y],
      size: [100, 120],
      strokeColor: 'black',
      radius: 2,
      opacity: 0.50,
      fillColor: 'darkgray'
    });
    this.box.addChild(this.rect); // set up text objects for each property

    var i = 0;

    for (var p in properties) {
      if (!p in this.property_callbacks) break;
      var p_text = new PointText({
        point: [this.pos.x + 5, this.pos.y + 17.5 + i * 17.5],
        content: p,
        fillColor: _utils.AMES_Utils.INACTIVE_COLOR,
        fontSize: '.75rem'
      });
      this.props_text[p] = p_text;
      this.box.addChild(p_text);
      i = i + 1;
    } // add callbacks to each property


    var _loop = function _loop(_p) {
      if (!_p in _this.property_callbacks) {
        console.log("property callback not implemented for", _p);
        return "break";
      }

      var p_text = _this.props_text[_p]; // Property click handler to toggle activate / deactivate properties

      var toggle_property = function toggle_property(e) {
        // Activate if not currently activate
        if (_this.active_prop != _p) {
          // Deactivate previous active property
          if (_this.active_prop) {
            _this.property_callbacks[_this.active_prop](e, _this.parent, _this.elisteners, {
              'activate': false
            }); // ux feedback: show inactive color to indicate property is deactivated


            _this.props_text[_this.active_prop].fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
          } // Activate new property & set new active property


          _this.active_prop = _p;
          console.log('active_prop: ', _this.active_prop);

          _this.property_callbacks[_this.active_prop](e, _this.parent, _this.elisteners, {
            'activate': true
          }); // ux feedback: persist active color to indicate active property being edited


          p_text.fillColor = _utils.AMES_Utils.ACTIVE_COLOR;
        } else {
          // Deactive this property & set active property to null
          _this.property_callbacks[_this.active_prop](e, _this.parent, _this.elisteners, {
            'activate': false
          });

          _this.active_prop = null; // ux feedback: show inactive color and reset to inactive color

          p_text.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        }
      };

      p_text.on('click', toggle_property); // ux feedback: change to active color to indicate clickable

      p_text.on('mouseenter', function (e) {
        p_text.fillColor = _utils.AMES_Utils.ACTIVE_COLOR;
      });
      p_text.on('mouseleave', function (e) {
        // ux feedback: if the current property is not active show the object is not about to be clicked
        if (_this.active_prop != _p) p_text.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
      });
    };

    for (var _p in properties) {
      var _ret = _loop(_p);

      if (_ret === "break") break;
    } //
    // Closing indicator


    this.close_text = new PointText({
      point: [this.pos.x + 87.5, this.pos.y + 17.5],
      content: 'x',
      fillColor: _utils.AMES_Utils.INACTIVE_COLOR,
      fontSize: '.75rem'
    });
    this.box.addChild(this.close_text);
    this.close_text.on('click', function (e) {
      _this.box.visible = false; // Deactivate previous active property

      if (_this.active_prop) {
        _this.property_callbacks[_this.active_prop](e, _this.parent, _this.elisteners, {
          'activate': false
        }); // ux feedback: show inactive color to indicate property is deactivated


        _this.props_text[_this.active_prop].fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
        _this.active_prop = null;
      }
    });
    this.close_text.on('mouseenter', function (e) {
      _this.close_text.fillColor = _utils.AMES_Utils.ACTIVE_COLOR;
    });
    this.close_text.on('mouseleave', function (e) {
      _this.close_text.fillColor = _utils.AMES_Utils.INACTIVE_COLOR;
    }); // Add draggablity to box

    this.rect.on("mousedown", function (e) {
      _this.rect_offset = _this.rect.position.subtract(e.point);
    });
    this.rect.on("mousedrag", function (e) {
      _this.box.position = e.point.add(_this.rect_offset);
    });
  }

  _createClass(PropertyBox, [{
    key: "callback_position",
    value: // Display variables
    // Control variables
    // Store handlers for callbacks to remove as needed
    // callback_position(e, shape, cb_handlers, opt)
    // Description: Callback to manipulate position property
    function callback_position(e, shape, cb_handlers, opt) {
      console.log("callback_position: ", shape.name);
      var offset;

      var cb_position_follow = function cb_position_follow(e) {
        shape.set_pos(e.point.add(offset));
      };

      var cb_position_get_offset = function cb_position_get_offset(e) {
        var pos = new Point(shape.pos.x, shape.pos.y);
        var click_pos = e.point;
        offset = pos.subtract(click_pos);
      };

      var drag_event = "mousedrag";
      var trigger_event = e.event.type.indexOf('mouse') != -1 ? "mousedown" : "touchstart";

      if (opt.activate) {
        shape.poly.on("mousedown", cb_position_get_offset);
        cb_handlers['cb_position_get_offset'] = cb_position_get_offset;
        shape.poly.on(drag_event, cb_position_follow);
        cb_handlers['cb_position_follow'] = cb_position_follow;
      } else {
        // Remove listeners
        if (cb_handlers.hasOwnProperty('cb_position_follow')) {
          shape.poly.off(drag_event, cb_handlers['cb_position_follow']);
          delete cb_handlers['cb_position_follow'];
        }

        if (cb_handlers.hasOwnProperty('cb_position_get_offset')) {
          shape.poly.off("mousedown", cb_handlers['cb_position_get_offset']);
          delete cb_handlers['cb_position_get_offset'];
        }
      }
    } // callback_scale(e, shape, cb_handlers, opt)
    // Description: Callback to manipulate scale property

  }, {
    key: "callback_scale",
    value: function callback_scale(e, shape, cb_handlers, opt) {
      console.log("callback_scale: ", shape.name);
      var cx = shape.pos.x;
      var cy = shape.pos.y;
      var line; // If the line exists remove it

      if (cb_handlers.scale_line) {
        cb_handlers.scale_line.remove();
        delete cb_handlers['scale_line'];
      } else {
        line = new Path.Line({
          from: [cx, cy],
          to: [cx + 5, cy + 5],
          strokeColor: _utils.AMES_Utils.INACTIVE_COLOR,
          opacity: 0.5,
          visible: false
        });
        cb_handlers.scale_line = line;
      }

      var activated = false;
      var scaling = false;
      var base_lengthsq;
      var endp;
      var pf = 1; // previous scale factor
      // On first click, start scaling & show line

      var cb_scale_click = function cb_scale_click(e) {
        endp = _utils.AMES_Utils.get_e_point(e); // Activate on first click

        if (!activated) {
          // Only if the click is inside the shape
          if (shape.contains(endp)) {
            activated = true;
            line.segments[0].point = new Point(cx, cy);
            line.segments[1].point = endp;
            line.visible = true;
            console.log(line);
          }
        } else {
          // On second click start scaling
          if (!scaling) {
            scaling = true;
            base_lengthsq = _utils.AMES_Utils.lengthsq(cx, cy, endp.x, endp.y);
          } else {
            // On the third click reset
            line.visible = false;
            activated = false;
            scaling = false;
            pf = 1;
          }
        }
      }; // Update line & transform shape if shape has been clicked


      var cb_scale_update = function cb_scale_update(e) {
        if (activated) {
          endp = _utils.AMES_Utils.get_e_point(e);
          line.segments[0].point = new Point(cx, cy);
          line.segments[1].point = endp;

          if (scaling) {
            var f = _utils.AMES_Utils.lengthsq(cx, cy, endp.x, endp.y) / base_lengthsq;
            shape.set_scale(1 / pf * f);
            pf = f;
          }
        }
      };

      var move_event = e.event.type.indexOf('mouse') != -1 ? "mousemove" : "touchmove";
      var trigger_event = e.event.type.indexOf('mouse') != -1 ? "mousedown" : "touchstart"; // Activate by clicking on shape

      if (opt.activate) {
        // Add event listener for clicks
        ames.canvas.addEventListener(trigger_event, cb_scale_click);
        cb_handlers['cb_scale_click'] = cb_scale_click; // Add event listener to scale line

        ames.canvas.addEventListener(move_event, cb_scale_update);
        cb_handlers['cb_scale_update'] = cb_scale_update;
        console.log(cb_handlers);
      } else {
        // Deactivate by removing event listeners
        if (cb_handlers.hasOwnProperty('cb_scale_click')) {
          ames.canvas.removeEventListener(trigger_event, cb_handlers['cb_scale_click']);
          delete cb_handlers['cb_scale_click'];
        }

        if (cb_handlers.hasOwnProperty('cb_scale_update')) {
          ames.canvas.removeEventListener(move_event, cb_handlers['cb_scale_update']);
          delete cb_handlers['cb_scale_update'];
        }

        console.log(cb_handlers);
      }
    }
  }, {
    key: "update_position",
    value: function update_position() {
      // Use parent bounding box to displace property box away from center
      var parent_bbox = this.parent.get_bbox();
      this.offset = parent_bbox.width / 4; // Set property box position

      this.pos.x = this.parent.pos.x + 2.25 * this.offset;
      this.pos.y = this.parent.pos.y - .25 * this.offset;
      this.box.position = new Point(this.pos.x, this.pos.y);
    }
  }, {
    key: "show",
    value: function show() {
      this.update_position();
      this.box.visible = true;
    }
  }]);

  return PropertyBox;
}();

exports.PropertyBox = PropertyBox;
},{"./utils.js":9}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_Path = exports.AMES_Circle = exports.AMES_Square = exports.AMES_Shape = void 0;

var _utils = require("./utils.js");

var _constraints = require("./constraints.js");

var _propertybox = require("./propertybox.js");

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
        var p = ames.colorpicker.get_position();
        ames.colorpicker.position = p;
        ames.colorpicker.visible = true;
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
    _this3.visual_prop_box = new _propertybox.PropertyBox(_assertThisInitialized(_this3), _this3.visual_props); // // On double click launch properties editor
    // this.latest_tap;
    // this.poly.on('click', e => {
    // 	console.log("tap on ", this.name);
    // 	let now = new Date().getTime();
    // 	if (this.latest_tap) {
    // 		let time_elapsed = now - this.latest_tap;
    // 		// Double tap
    // 		if (time_elapsed < 600 && time_elapsed > 0) {
    // 			console.log("double tap on ", this.name);
    // 			// In Shape mode, open shape editor
    // 			if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
    // 				this.visual_prop_box.show();
    // 			}
    // 		}
    // 	}
    // 	this.latest_tap = new Date().getTime();
    // });

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
    _this4.visual_prop_box = new _propertybox.PropertyBox(_assertThisInitialized(_this4), _this4.visual_props); // // On double click launch properties editor
    // this.latest_tap;
    // this.poly.on('click', e => {
    // 	console.log("tap on ", this.name);
    // 	let now = new Date().getTime();
    // 	if (this.latest_tap) {
    // 		let time_elapsed = now - this.latest_tap;
    // 		// Double tap
    // 		if (time_elapsed < 600 && time_elapsed > 0) {
    // 			console.log("double tap on ", this.name);
    // 			// In Shape mode, open shape editor
    // 			if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
    // 				this.visual_prop_box.show();
    // 			}
    // 		}
    // 	}
    // 	this.latest_tap = new Date().getTime();
    // });

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
    _this5.visual_prop_box = new _propertybox.PropertyBox(_assertThisInitialized(_this5), _this5.visual_props);
    return _this5;
  }

  _createClass(AMES_Path, [{
    key: "update_bbox",
    value: function update_bbox() {
      this.bbox = new Path.Rectangle(this.poly.strokeBounds);
      this.bbox.visible = true;
      this.bbox.sendToBack();
      this.bbox.fillColor = "lavender";
      this.bbox.opacity = 0; // // On double click launch properties editor
      // this.latest_tap;
      // this.bbox.on('click', e => {
      // 	let nearpoint = this.poly.getNearestPoint(e.point);
      // 	if (nearpoint.getDistance(e.point, true) > 50 ) return;
      // 	let now = new Date().getTime();
      // 	if (this.latest_tap) {
      // 		let time_elapsed = now - this.latest_tap;
      // 		// Double tap
      // 		if (time_elapsed < 600 && time_elapsed > 0) {
      // 			console.log("double tap on ", this.name);
      // 			// In Shape mode, open shape editor
      // 			if (ames.edit_mode = 'SHAPE' && !this.visual_prop_box.visible) {
      // 				this.visual_prop_box.show();
      // 			}
      // 		}
      // 	}
      // 	this.latest_tap = new Date().getTime();
      // });
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
},{"./constraints.js":4,"./propertybox.js":7,"./utils.js":9}],9:[function(require,module,exports){
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
    value: function make_dot(p, color) {
      var d = new Path.Circle(p, 2.5);
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
    }
  }]);

  return AMES_Utils;
}();

exports.AMES_Utils = AMES_Utils;

_defineProperty(AMES_Utils, "ACTIVE_COLOR", 'lavender');

_defineProperty(AMES_Utils, "INACTIVE_COLOR", 'white');

_defineProperty(AMES_Utils, "INACTIVE_DARK_COLOR", 'whitesmoke');

_defineProperty(AMES_Utils, "INACTIVE_S_COLOR", 'darkgray');

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

_defineProperty(AMES_Utils, "L_CONTROLS", ["Shapes", "Lists", "Animations"]);

_defineProperty(AMES_Utils, "L_IDX_BOX", 0);

_defineProperty(AMES_Utils, "L_IDX_NAME", 1);

_defineProperty(AMES_Utils, "L_IDX_TRASH", 2);

_defineProperty(AMES_Utils, "L_IDX_EYE", 3);

_defineProperty(AMES_Utils, "L_IDX_EYE_SLASH", 4);

_defineProperty(AMES_Utils, "L_IDX_ICONS", [2, 3, 4]);

_defineProperty(AMES_Utils, "L_EXPAND_IDX", 2);

_defineProperty(AMES_Utils, "L_CONTRACT_IDX", 3);

_defineProperty(AMES_Utils, "VIS_PROPS", ["position", "scale", "rotation", "fillColor", "strokeWidth", "strokeColor", "path"]);

_defineProperty(AMES_Utils, "SUB_PROPS", {
  "position": ["x", "y"],
  "scale": ["x", "y"],
  "rotation": ["t"],
  "fillColor": ["h", "s", "v", "a"],
  "strokeWidth": ["w"],
  "strokeColor": ["h", "s", "v", "a"],
  "path": []
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
},{}]},{},[2]);
