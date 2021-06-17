// ----------------------------------------------------------------------------
// lists.js
// Author: Sonia Hashim
//
// Description: AMES list data structure and list editor
// ----------------------------------------------------------------------------
import {AMES_Utils as utils} from './utils.js'
import {AMES_Shape, AMES_Square, AMES_Circle, AMES_Path} from './shapes.js'


export class AMES_Shape_Editor {
	box;
	obj;
	selected_subprops;
	subprops;

	constructor(obj) {
		console.log(obj);
		let props = utils.VIS_PROPS;

		let box = new Group();

		// background rectangle
		let e_width = 150;
		let e_height = 125;
		let rect = new Shape.Rectangle({
			point: [0, 0],
			size: [e_width, e_height],
			fillColor: utils.INACTIVE_DARK_COLOR,
			strokeWidth: 1,
			strokeColor: utils.INACTIVE_S_COLOR,
		});
		box.addChild(rect);

		// Add obj name
		let by = utils.LAYER_HEIGHT;
		let n_text = new PointText({
			point: [2*utils.ICON_OFFSET, by/2 + utils.FONT_SIZE/2],
			content: obj.name,
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		box.addChild(n_text);
		// Close icon
		let close_button = ames.icons["close"].clone();
		close_button.scaling = 0.75;
		let close_w = close_button.bounds.width;
		close_button.position = new Point(e_width - utils.ICON_OFFSET - close_w/2, by/2 - close_w/2);
		close_button.visible = true;
		close_button.onClick = (e) => {
			this.open(false);
		}
		box.addChild(close_button);

		// create sub-property box
		let subprop_text = new PointText({
			point: [2.25*utils.ICON_OFFSET, by*2.75],
			content: 'all',
			fillColor: utils.INACTIVE_S_COLOR,
			fontFamily: utils.FONT,
			fontSize: utils.FONT_SIZE
		});
		let subprop_h = subprop_text.bounds.height;
		let subprop_box = new Shape.Rectangle({
			point: [subprop_text.point.x - .5*utils.ICON_OFFSET, subprop_text.point.y - subprop_h + utils.ICON_OFFSET/2],
			size: [Math.max(subprop_text.bounds.width, subprop_h)+utils.ICON_OFFSET, subprop_h+utils.ICON_OFFSET],
			strokeWidth: 1,
			strokeColor: utils.INACTIVE_S_COLOR
		});
		let subline_start = subprop_box.bounds.bottomLeft;
		console.log(subline_start);
		let subline_end = subline_start.add(new Point(e_width-2*subline_start.x,0))
		let subprop_line = new Path.Line(subline_start, subline_end);
		subprop_line.strokeColor = utils.INACTIVE_S_COLOR;
		subprop_line.strokeWidth = 1;
		box.addChild(subprop_text);
		box.addChild(subprop_box);
		box.addChild(subprop_line);

		// Create property buttons
		let properties = utils.VIS_PROPS;
		for (let idx in properties) {
			let p = properties[idx];
			let button = ames.icons[p].clone();
			let b_w = button.bounds.width;
			button.position = new Point(2*utils.ICON_OFFSET + idx*(utils.ICON_OFFSET + b_w) + b_w/2, by*1.75);
			button.visible = true;

			// create subproperty boxes
			let subprops = utils.SUB_PROPS[p];

			button.onClick = (e) => {
				this.selected_subprops = {};
				obj.manipulate(p);

				// open appropriate subproperty boxes
				// hide other subproperty boxes
			}
			box.addChild(button);
		}
		obj.editor = this;
		this.box = box;
		this.obj = obj;
		this.set_editor_pos();
		// this.box.visible = false;

		// Make box draggable

	}

	// open: if true show editor; otherwise close
	open(bool) {
		this.box.visible = bool;
		// TO DO shut down any open buttons
	}

	set_editor_pos() {
		let b = this.obj.poly.bounds;
		b.strokeColor = 'green';
		b.strokeWidth = 2;
		b.visible - true;
		console.log(b);
		let c = ames.canvas_view.bounds.center;
		let pos = this.obj.poly.position;
		let x = b.width/2 + this.box.bounds.width/2 + 3*utils.ICON_OFFSET;

		// Adjust horizontal posiiton
		let d_left = b.leftCenter.getDistance(c, true);
		let d_right = b.rightCenter.getDistance(c, true);
		if (d_left < d_right) {
			x *= -1;
		}

		// Adjust position;
		this.box.position = this.obj.poly.position.add(new Point(x, 20));
	}
}



export class AMES_List_Editor {

	constructor() {

	}
}

class AMES_Property_Button {
	name;
	button;

	constructor(shape, name) {
		this.name = name;
		button = ames.icons[name].clone();

		button.onClick = (e) => {
			this.manipulate(shape)
		}
	}

	manipulate() {
		// void button
	}
}
