"use strict";

var _ames = require("./ames.js");

// ---------------------------------------------------------------------------
// ames_index.js
// Author: Sonia Hashim
//
// Description: Main execution space for ames on DOM load, attaches UX handler
// to global scope. Global scope includes paper object
// ---------------------------------------------------------------------------
console.log("Growth mindset & learning opportunities: I believe in this project and I believe in myself.");
paper.install(window);
window.ames;
// Set up before DOM is ready
window.ames = new _ames.AMES(); // Execute main function once DOM is ready

window.onload = function () {
  ames.init();
  var colorwheel = document.getElementById('colorwheel'); // Wait on load

  function sleep(time) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, time);
    });
  }

  sleep(500).then(function () {
    ames.test(); // let example = "starfield";
    // ames.example(example);
  });
};