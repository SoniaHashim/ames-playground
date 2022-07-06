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