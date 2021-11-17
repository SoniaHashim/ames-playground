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

	// Wait on load
	function sleep (time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	sleep(500).then(() => {
		console.log("Testing???")
		ames.test();
	})
}
