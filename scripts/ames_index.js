// ---------------------------------------------------------------------------
// ames_index.js
// Author: Sonia Hashim
//
// Description: Main execution space for ames on DOM load, attaches UX handler
// to global scope. Global scope includes paper object
// ---------------------------------------------------------------------------


console.log("Growth mindset & learning opportunities")
paper.install(window);
import {AMES} from './ames/ames.js'

window.AMES = AMES;

// AMES set-up phase 1 before DOM is ready
AMES.change_mode('ELEMENT');
AMES.change_edit_mode('SHAPE');

// Execute main function once DOM is ready
window.onload = function() {
	console.log("here");
	// Get a reference to the canvas object and set up canvas as animation space
	var canvas = document.getElementById('env-animation');
	// AMES set-up phase 2 after DOM is ready
	window.ames.canvas = canvas;
	window.ames.canvas_cx = canvas.width/2;
	window.ames.canvas_cy = canvas.height/2;
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	// Create a Paper.js Path to draw a line into it:
	var path = new Path();
	// Give the stroke a color
	path.strokeColor = 'black';
	var start = new Point(100, 100);
	// Move to start and draw a line from there
	path.moveTo(start);
	// Note that the plus operator on Point objects does not work
	// in JavaScript. Instead, we need to call the add() function:
	path.lineTo(start.add([ 200, -50 ]));
	// Draw the view now:
	window.testpath = path;
	view.draw();
}
