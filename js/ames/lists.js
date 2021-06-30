// ----------------------------------------------------------------------------
// lists.js
// Author: Sonia Hashim
//
// Description: AMES list data structure and list editor
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'
import {AMES_Constraint as constraint} from './constraints.js'
import {AMES_Shape} from './shapes.js'

export class AMES_List extends AMES_Shape {
	name = "List";
	count = 1;
	group;
	bbox;

	constructor(shape) {
		this.group = new Group();
		this.poly = shape.poly;
		this.group.addChild(this.poly);
	}
}
