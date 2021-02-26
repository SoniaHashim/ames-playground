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

    _defineProperty(this, "shapes", []);
  }

  _createClass(AMES, [{
    key: "make_circle",
    value: function make_circle(opt) {
      var _this = this;

      var b = "Circle";
      opt = opt || {}; // If the button is active, deactivate it

      if (_utils.AMES_Utils.is_active(b) || opt.deactivate) {
        console.log('makeSphere - deactivate');

        _utils.AMES_Utils.deactivate(b); // Reset cursor


        ames.canvas.style.cursor = null;
        ames.canvas.onclick = null;
      } else {
        console.log('makeSphere - activate');

        _utils.AMES_Utils.activate(b);

        ames.canvas.style.cursor = 'crosshair';
        var c = new _shapes.AMES_Circle(); // Callback to make circle on click

        var cb_make_circle = function cb_make_circle(e) {
          if (c.poly && !c.is_made) {
            c.set_pos(_utils.AMES_Utils.get_e_point(e));
            c.poly.visible = true;

            _this.shapes.push(c); // reset c


            c = new _shapes.AMES_Circle();
          }
        };

        ames.canvas.onclick = cb_make_circle;
      }
    }
  }, {
    key: "make_path",
    value: function make_path(opt) {
      var b = 'Path';
      opt = opt || {};

      if (_utils.AMES_Utils.is_active(b) || opt.deactivate) {
        console.log('make_path - deactivate'); // Reset cursor

        ames.canvas.style.cursor = null;
        ames.canvas.onclick = null;
      } else {
        console.log('make_path - deactivate');
        ames.canvas.style.cursor = 'crosshair'; // let x = new AMES_Path();

        var cb_make_path = function cb_make_path(e) {
          // reset on double click
          console.log(e.detail);
        };

        ames.canvas.onclick = cb_make_path;
      }
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