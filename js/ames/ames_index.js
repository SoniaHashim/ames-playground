// ---------------------------------------------------------------------------
// ames_index.js
// Author: Sonia Hashim
//
// Description: Main execution space for ames on DOM load, attaches UX handler
// to global scope. Global scope includes paper object
// ---------------------------------------------------------------------------


console.log("Growth mindset & learning opportunities")
paper.install(window);
window.ames;
import {AMES} from './ames.js'
// Set up before DOM is ready
window.ames = new AMES();

// Execute main function once DOM is ready
window.onload = function() {
	ames.init();
	var colorwheel = document.getElementById('colorwheel');
	ames.test(); 
	// ames.test();
	// let colorbox =  document.querySelector('colorbox');
	// let colorPicker = new window.iro.ColorPicker('#colorbox', {
	// 	width: 100,
	// });
	// colorPicker.display = 'absolute';
	// console.log(colorPicker);

}
