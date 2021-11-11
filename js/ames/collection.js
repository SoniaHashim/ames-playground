// ----------------------------------------------------------------------------
// collection.js
// Author: Sonia Hashim
//
// Description: Implementation of the Collection primitive in AMES
//	- A collection is an indexed collection of one or more artwork objects
// 	- The properties across the objects in a collection may be used to define
//    procedural relationships across the collection
//  - Collections can be instantiated on any number of artwork objects
//  - The intialization of a collection controls it's iterative behavior...
//       1) If the collection is initalized on a group of objects edits propagate
//			uniformly across the group (the baseline is determined by original state)
//       2) If the collection is initialized on a single object the first and
//			last copy exert control over a linear transformation across members
//  - The number of duplicated copies in the collection control its instancing
//	  behavior...
//		1) Upon intialization of a collection or if there is a single copy
//		   of the original artwork used to create the collection, the objects
//		   are linearly distributed
//		2) Otherwise the first and last elements of the collection can be used
//		   to control the sytlistics and geometric properties of the other
//		   elements in a collection
// ----------------------------------------------------------------------------

import {AMES_Utils as utils} from './utils.js'

export class Collection {
	group;
	n_items = 0;
}
