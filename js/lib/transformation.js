"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transformation_Space = exports.Transformation_Function = void 0;

var _utils = require("./utils.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Transformation_Function = /*#__PURE__*/function () {
  // artwork or collection of artwork impacted
  // artwork or collection driving the transformation
  // transformation function (e.g. translation or scale vs index)
  // coord space used to interpret the input artwork
  // the location of the artwork
  // opt
  // pointers to the cues that trigger this transformation
  // projection of transformation space onto the target artwork
  // points that are cues that trigger other transformations
  function Transformation_Function(opt) {
    _classCallCheck(this, Transformation_Function);

    _defineProperty(this, "target_artwork", void 0);

    _defineProperty(this, "input_artwork", void 0);

    _defineProperty(this, "property_mapping", void 0);

    _defineProperty(this, "transformation_space", void 0);

    _defineProperty(this, "page", void 0);

    _defineProperty(this, "playback_triggers", void 0);

    _defineProperty(this, "transformed_space", void 0);

    _defineProperty(this, "playback_cues", void 0);

    opt = opt || {};
    if (opt.input) this.set_input_artwork(opt.input);
    if (opt.target) this.set_target_artwork(opt.target);
    if (opt.mapping) this.set_property_mapping(opt.mapping);
  } // set_input_artwork
  // ------------------------------------------------------------------------
  // Modifies the input artwork, setting or unsetting it accordingly
  //
  // @param: input - artwork or collection that represents transformation
  // or null


  _createClass(Transformation_Function, [{
    key: "set_input_artwork",
    value: function set_input_artwork(input) {} // set_target_artwork
    // ------------------------------------------------------------------------
    // Modifies the target artwork that the transformation affects
    //
    // @param: target - target artwork or collection to be impacted
    // or null

  }, {
    key: "set_target_artwork",
    value: function set_target_artwork(target) {} // set_property_mapping
    // ------------------------------------------------------------------------
    //
    // @param: mapping - defines the mapping function used to interpret the
    // transformation
    //

  }, {
    key: "set_property_mapping",
    value: function set_property_mapping(mapping) {} // play
    // ------------------------------------------------------------------------
    // @description: If the transformation function represents an animation,
    // this plays the animation
    //
    // Note: the playback point also triggers this function

  }, {
    key: "play",
    value: function play() {}
  }]);

  return Transformation_Function;
}();

exports.Transformation_Function = Transformation_Function;

var Transformation_Space = function Transformation_Space() {
  _classCallCheck(this, Transformation_Space);
};

exports.Transformation_Space = Transformation_Space;