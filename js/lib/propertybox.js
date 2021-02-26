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