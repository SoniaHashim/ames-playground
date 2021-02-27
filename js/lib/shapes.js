"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AMES_PATH = exports.AMES_Circle = exports.AMES_Shape = void 0;

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


var AMES_Shape = /*#__PURE__*/function () {
  function AMES_Shape() {
    _classCallCheck(this, AMES_Shape);

    _defineProperty(this, "name", "Shape");

    _defineProperty(this, "visible", false);

    _defineProperty(this, "is_made", false);

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

  _createClass(AMES_Shape, [{
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
    }
  }]);

  return AMES_Shape;
}(); // Class: Circle
// ---------------------------------------------------------------------------
// Description: Implementation of a circle


exports.AMES_Shape = AMES_Shape;

var AMES_Circle = /*#__PURE__*/function (_AMES_Shape) {
  _inherits(AMES_Circle, _AMES_Shape);

  var _super = _createSuper(AMES_Circle);

  function AMES_Circle() {
    var _this;

    _classCallCheck(this, AMES_Circle);

    _this = _super.call(this); // TODO change to object constructor

    _defineProperty(_assertThisInitialized(_this), "name", "Circle");

    _this.poly = new Shape.Circle({
      center: [_this.pos.x, _this.pos.y],
      radius: 50,
      fillColor: 'pink',
      visible: false
    });
    _this.visual_prop_box = new _propertybox.PropertyBox(_assertThisInitialized(_this), _this.visual_props); // On double click launch properties editor

    _this.latest_tap;

    _this.poly.on('click', function (e) {
      console.log("tap on ", _this.name);
      var now = new Date().getTime();

      if (_this.latest_tap) {
        var time_elapsed = now - _this.latest_tap; // Double tap

        if (time_elapsed < 600 && time_elapsed > 0) {
          console.log("double tap on ", _this.name); // In Shape mode, open shape editor

          if (ames.edit_mode = 'SHAPE' && !_this.visual_prop_box.visible) {
            _this.visual_prop_box.show();
          }
        }
      }

      _this.latest_tap = new Date().getTime();
    });

    return _this;
  } // make_shape
  // Description: Creates a new shape


  _createClass(AMES_Circle, [{
    key: "make_shape",
    value: function make_shape() {
      var _this2 = this;

      console.log('makeShape');

      if (this.poly && !this.poly.visible) {
        // Show crosshair cursor
        ames.canvas.addEventListener('mouseover', cb_canvas_crosshair); // On 1st click, set the center of the circle

        var cb_make_shape_on_click = function cb_make_shape_on_click(e) {
          _this2.set_pos(_utils.AMES_Utils.get_e_point(e));

          _this2.poly.visible = true;
          _this2.is_made = true; // Fire a is made signal to reset
          // Remove crosshair cursor

          ames.canvas.style.cursor = 'default';
          ames.canvas.removeEventListener('mouseover', cb_canvas_crosshair); // Remove make circle listener

          ames.canvas.removeEventListener('click', cb_make_shape_on_click);
        };

        ames.canvas.addEventListener('click', cb_make_shape_on_click);
      }
    }
  }]);

  return AMES_Circle;
}(AMES_Shape); // Class: Path
// ---------------------------------------------------------------------------
// Description: Implementation of a path


exports.AMES_Circle = AMES_Circle;

var AMES_PATH = /*#__PURE__*/function (_AMES_Shape2) {
  _inherits(AMES_PATH, _AMES_Shape2);

  var _super2 = _createSuper(AMES_PATH);

  function AMES_PATH() {
    var _this3;

    _classCallCheck(this, AMES_PATH);

    _this3 = _super2.call(this);

    _defineProperty(_assertThisInitialized(_this3), "name", "Path");

    return _this3;
  }

  _createClass(AMES_PATH, [{
    key: "make_shape",
    value: function make_shape() {
      console.log("override");
    }
  }]);

  return AMES_PATH;
}(AMES_Shape);

exports.AMES_PATH = AMES_PATH;