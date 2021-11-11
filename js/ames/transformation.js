// ----------------------------------------------------------------------------
// transformation.js
// Author: Sonia Hashim
//
// Description: Implementation of the Transformation Function primitive in AMES
//	- A mapping function that defines how input artwork drives the spatial,
//    stylistic or geometric transformation of a specific property of
//    target artwork across time or space. Inputs and targets can be single
//	  artworks or collections.
//
//  - i.e. The transformation can specify...
// 		(1) The way iterative duplication is controlled for a specific property
//		(2) The transformation of a property across time (position, scale, etc)
//
// - Significant evaluation points can be selected on a transformation
//   such that when the transformation fulfills that state a constraint is
//   satisfied that can be used to trigger another transformation
//
// - The input artwork can consist of a collection where each artwork in the
//   collection is interpreted according the function defining the transformation
//
// - Likewise, the target artwork itself can be a collection
//
// - Supported transformations / property mappings include...
//   	motion paths
//		rotation
//		scale
//		position
//		color: hue
//		color: saturation
//		color: brightness
//		color: alpha
//		instantiation / duplication count
//		number of sides
//		transformation speed
//
//	- The Transformation Space is a representation of the mapping that determines
//	  how input artwork to a Transformation Function is interpreted
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'

export class Transformation_Function {
	target_artwork; 		// artwork or collection of artwork impacted
	input_artwork;			// artwork or collection driving the transformation
	property_mapping;		// transformation function (e.g. translation or scale vs index)
	transformation_space;   // coord space used to interpret the input artwork
	page;					// the location of the artwork

	// opt
	playback_triggers;		// pointers to the cues that trigger this transformation
	transformed_space;		// projection of transformation space onto the target artwork
	playback_cues;			// points that are cues that trigger other transformations

	constructor(opt) {
		opt = opt || {};
		if (opt.input) this.set_input_artwork(opt.input);
		if (opt.target) this.set_target_artwork(opt.target);
		if (opt.mapping) this.set_property_mapping(opt.mapping);

	}

	// set_input_artwork
	// ------------------------------------------------------------------------
	// Modifies the input artwork, setting or unsetting it accordingly
	//
	// @param: input - artwork or collection that represents transformation
	// or null
	set_input_artwork(input) {

	}

	// set_target_artwork
	// ------------------------------------------------------------------------
	// Modifies the target artwork that the transformation affects
	//
	// @param: target - target artwork or collection to be impacted
	// or null
	set_target_artwork(target) {

	}

	// set_property_mapping
	// ------------------------------------------------------------------------
	//
    // @param: mapping - defines the mapping function used to interpret the
	// transformation
	//
	set_property_mapping(mapping) {

	}

	// play
	// ------------------------------------------------------------------------
	// @description: If the transformation function represents an animation,
	// this plays the animation
	//
	// Note: the playback point also triggers this function
	play() {

	}
}

export class Transformation_Space {

}
