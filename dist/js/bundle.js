(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES = void 0;

var _utils = require("./utils.js");

var _shapes = require("./shapes.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Globals for ames
window.ames = {};
ames.mode;
ames.edit_mode;
ames.canvas;
ames.canvas_cx;
ames.canvas_cy;
var shapes = [];

var AMES = /*#__PURE__*/function () {
  function AMES() {
    _classCallCheck(this, AMES);
  }

  _createClass(AMES, null, [{
    key: "make_sphere",
    value: // changeEditMode(ux_mode)
    // ------------------------------------------------------------------------
    // Description: Toggles mode from ELEMENT / LIST using UX buttons.
    // changeMode(ux_mode)
    // ------------------------------------------------------------------------
    // Description: Toggles mode from SHAPE / CONSTRAINT / ANIMATION using UX buttons.
    function make_sphere(s) {
      console.log('makeSphere');
      var c = new _shapes.Circle();
      c.make_shape();
    }
  }]);

  return AMES;
}();

exports.AMES = AMES;

_defineProperty(AMES, "change_edit_mode", function (ux_mode) {
  console.log("changeEditMode:" + ux_mode);

  if (ux_mode != ames.edit_mode) {
    // Make previous mode button clickable
    if (ames.edit_mode) {
      // Remove ux active color indicator
      document.getElementById(_utils.AMES_Utils.mode_btns[ames.edit_mode]).style.backgroundColor = null;
    } // Change mode


    ames.edit_mode = ux_mode; // Toggle new mode button color to active

    document.getElementById(_utils.AMES_Utils.mode_btns[ames.edit_mode]).style.backgroundColor = _utils.AMES_Utils.ACTIVE_COLOR;

    switch (ames.edit_mode) {
      case 'SHAPE':
        break;

      case 'CONSTRAINT':
        break;

      case 'ANIMATE':
        break;

      default:
        break;
    }
  }
});

_defineProperty(AMES, "change_mode", function (ux_mode) {
  console.log("changeMode:" + ux_mode);

  if (ux_mode != ames.mode) {
    // Make previous mode button clickable
    if (ames.mode) {
      // Remove ux active color indicator
      document.getElementById(_utils.AMES_Utils.mode_btns[ames.mode]).style.backgroundColor = null;
    } // Change mode


    ames.mode = ux_mode; // Toggle new mode button color to active

    document.getElementById(_utils.AMES_Utils.mode_btns[ames.mode]).style.backgroundColor = _utils.AMES_Utils.ACTIVE_COLOR;

    switch (ames.mode) {
      case 'ELEMENT':
        break;

      case 'LIST':
        break;

      default:
        break;
    }
  }
});
},{"./shapes.js":4,"./utils.js":5}],2:[function(require,module,exports){
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
window.AMES = _ames.AMES; // AMES set-up phase 1 before DOM is ready

_ames.AMES.change_mode('ELEMENT');

_ames.AMES.change_edit_mode('SHAPE'); // Execute main function once DOM is ready


window.onload = function () {
  console.log("here"); // Get a reference to the canvas object and set up canvas as animation space

  var canvas = document.getElementById('env-animation'); // AMES set-up phase 2 after DOM is ready

  window.ames.canvas = canvas;
  window.ames.canvas_cx = canvas.width / 2;
  window.ames.canvas_cy = canvas.height / 2; // Create an empty project and a view for the canvas:

  paper.setup(canvas); // Create a Paper.js Path to draw a line into it:

  var path = new Path(); // Give the stroke a color

  path.strokeColor = 'black';
  var start = new Point(100, 100); // Move to start and draw a line from there

  path.moveTo(start); // Note that the plus operator on Point objects does not work
  // in JavaScript. Instead, we need to call the add() function:

  path.lineTo(start.add([200, -50])); // Draw the view now:

  window.testpath = path;
  view.draw();
};
},{"./ames.js":1}],3:[function(require,module,exports){
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
      }); // this.box.text(p).attr({x: 5, y: i*this.offset/2})

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

      var drag_event = e.event.type.indexOf('mouse') != -1 ? "mousedrag" : "touchmove";
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
        console.log("dragEvent");

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
      this.offset = parent_bbox.width / 2; // Set property box position

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
},{"./utils.js":5}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = exports.Shape = void 0;

var _utils = require("./utils.js");

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

var cb_canvas_crosshair = function cb_canvas_crosshair(e) {
  ames.canvas.style.cursor = 'crosshair';
}; // Class: Shape
// ----------------------------------------------------------------------------
// Description: Basic shape representation with visual & temporal properties


var Shape = /*#__PURE__*/function () {
  function Shape() {
    _classCallCheck(this, Shape);

    _defineProperty(this, "name", "Shape");

    _defineProperty(this, "visible", false);

    _defineProperty(this, "pos", {
      x: ames.canvas_cy,
      y: ames.canvas_cy
    });

    _defineProperty(this, "scale", {
      x: 1,
      y: 1
    });

    _defineProperty(this, "visual_props", {
      'Position': this.pos,
      'Scale': this.scale
    });

    _defineProperty(this, "length", 2000);

    _defineProperty(this, "temporal_properties", {
      'Length': this.length
    });

    _defineProperty(this, "poly", void 0);
  }

  _createClass(Shape, [{
    key: "set_pos",
    value: // update_pos(delta)
    // Description: Updates the position of the shape
    function set_pos(p) {
      this.pos.x = p.x;
      this.pos.y = p.y;
      if (this.poly) this.poly.position = new Point(this.pos.x, this.pos.y);
    } // update_scale(f)
    // Description: Updates the scale of the shape by the given amount

  }, {
    key: "set_scale",
    value: function set_scale(f) {
      this.scale.x = f * this.scale.x;
      this.scale.y = f * this.scale.y;
      if (this.poly) this.poly.scale(f, f);
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
        if (this.poly.strokeBounds) return this.poly.strokeBounds;else return this.poly.bounds;
      }

      return;
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
    } // make_shape
    // Description: Creates a new shape

  }, {
    key: "make_shape",
    value: function make_shape() {
      var _this = this;

      console.log('makeShape');

      if (this.poly && !this.poly.visible) {
        // Show crosshair cursor
        ames.canvas.addEventListener('mouseover', cb_canvas_crosshair); // On 1st click, set the center of the circle

        var cb_make_circle_on_click = function cb_make_circle_on_click(e) {
          _this.set_pos(_utils.AMES_Utils.get_e_point(e));

          _this.poly.visible = true; // Remove crosshair cursor

          ames.canvas.style.cursor = 'default';
          ames.canvas.removeEventListener('mouseover', cb_canvas_crosshair); // Remove make circle listener

          ames.canvas.removeEventListener('click', cb_make_circle_on_click);
        };

        ames.canvas.addEventListener('click', cb_make_circle_on_click);
      }
    }
  }]);

  return Shape;
}(); // Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle


exports.Shape = Shape;

var Circle = /*#__PURE__*/function (_Shape) {
  _inherits(Circle, _Shape);

  var _super = _createSuper(Circle);

  // // Draw the shape
  // draw_shape() {
  // 	// Visual properties
  // 	this.poly.position = new Point(this.pos.x, this.pos.y);
  // 	// Make visible
  // 	this.poly.visible = true;
  // }
  // is_inside(p)
  // Description: checks if p is within the radius of the circle
  // TODO implement
  function Circle() {
    var _this2;

    _classCallCheck(this, Circle);

    _this2 = _super.call(this); // TODO change to object constructor

    _defineProperty(_assertThisInitialized(_this2), "name", "Circle");

    _this2.poly = new Path.Circle({
      center: [_this2.pos.x, _this2.pos.y],
      radius: 50,
      fillColor: 'pink',
      visible: false
    });
    _this2.poly.fillColor = 'pink';
    _this2.poly.visible = false;
    _this2.visual_prop_box = new _propertybox.PropertyBox(_assertThisInitialized(_this2), _this2.visual_props); // On double click launch properties editor

    _this2.poly.on('doubleclick', function (e) {
      console.log("double click on ", _this2.name); // Open shape editor

      if (ames.edit_mode = 'SHAPE' && !_this2.visual_prop_box.visible) {
        _this2.visual_prop_box.show();
      }
    });

    return _this2;
  }

  return Circle;
}(Shape);

exports.Circle = Circle;
},{"./propertybox.js":3,"./utils.js":5}],5:[function(require,module,exports){
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
    value: function get_e_point(e) {
      // console.log('utils.get_e_point', e);
      // let p = view.viewToProject(DomEvent.getOffset(e, ames.canvas));
      // console.log('utils.get_e_point', p);
      return view.viewToProject(DomEvent.getOffset(e, ames.canvas));
    }
  }, {
    key: "lengthsq",
    value: function lengthsq(x1, y1, x2, y2) {
      return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }
  }]);

  return AMES_Utils;
}();

exports.AMES_Utils = AMES_Utils;

_defineProperty(AMES_Utils, "ACTIVE_COLOR", 'lavender');

_defineProperty(AMES_Utils, "INACTIVE_COLOR", 'black');

_defineProperty(AMES_Utils, "mode_btns", {
  'SHAPE': 'btn-mode-shape',
  'CONSTRAINT': 'btn-mode-constraint',
  'ANIMATE': 'btn-mode-animate',
  'ELEMENT': 'btn-mode-element',
  'LIST': 'btn-mode-list'
});
},{}]},{},[2]);
