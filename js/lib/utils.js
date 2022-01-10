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

_defineProperty(AMES_Utils, "SIDEBAR_HEIGHT", 500);

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