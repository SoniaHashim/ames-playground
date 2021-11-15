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