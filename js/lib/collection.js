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
        return a.pos.x - b.pos.x;
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
      this.editor = new _editors.AMES_List_Editor(this);
      var bounds = this.editor.box.bounds;
      var w = bounds.width / 2 + _utils.AMES_Utils.ICON_OFFSET * 3 + 12.5;
      var x = ames.toolbar.get_position().x + w;
      var h = ames.canvas_view.size.height - 2 * _utils.AMES_Utils.ICON_OFFSET - bounds.height / 2;
      this.editor.box.position = new Point(x, h);
    }
  }, {
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
      var original_shape = this.original[0]; // if (!this.bottom) this.bottom = original_shape;

      if (this.is_duplicator) {
        // TO DO: insertion order bug. Having trouble changing relative ordering of shapes. 
        var shape = original_shape.clone();
        this.shapes.push(shape);
        ames.hide_editors(this);
        this.editor.show(true);
        this.show(true);
      }
    }
  }, {
    key: "set_count",
    value: function set_count(n) {
      // Count has to be greater than or equal to 1
      if (n < 1) return;

      if (this.shapes.length == 1) {
        var og = this.shapes[0]; // this.shapes = [];

        for (var i = 1; i < n; i++) {
          var a = Object.create(og);
          a.poly = null;
          a.poly = og.poly.clone();
          a.poly.style = og.poly.style;
          var c = i * 10;
          a.poly.position = new Point(og.poly.position.x + c, og.poly.position.y + c);
          this.shapes.push(a);
          this.show(true);
        }

        console.log("setting count");
      } else {// Increase copies using first and last
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
    value: function add_to_collection(s) {
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
      // this.show_editor(bool);
      this.update_show_box();

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