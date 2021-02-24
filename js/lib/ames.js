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