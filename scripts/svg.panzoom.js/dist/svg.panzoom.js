/*!
* @svgdotjs/svg.panzoom.js - A plugin for svg.js that enables panzoom for viewport elements
* @version 2.1.1
* https://github.com/svgdotjs/svg.panzoom.js#readme
*
* @copyright undefined
* @license MIT
*
* BUILT: Fri Apr 24 2020 21:18:11 GMT+1000 (Ostaustralische Normalzeit)
*/;
(function (svg_js) {
  'use strict';

  var normalizeEvent = function normalizeEvent(ev) {
    return ev.touches || [{
      clientX: ev.clientX,
      clientY: ev.clientY
    }];
  };

  svg_js.extend(svg_js.Svg, {
    panZoom: function panZoom(options) {
      var _options,
          _options$zoomFactor,
          _options$zoomMin,
          _options$zoomMax,
          _options$wheelZoom,
          _options$pinchZoom,
          _options$panning,
          _options$panButton,
          _options$oneFingerPan,
          _options$margins,
          _options$wheelZoomDel,
          _options$wheelZoomDel2,
          _this = this;

      this.off('.panZoom'); // when called with false, disable panZoom

      if (options === false) return this;
      options = (_options = options) != null ? _options : {};
      var zoomFactor = (_options$zoomFactor = options.zoomFactor) != null ? _options$zoomFactor : 2;
      var zoomMin = (_options$zoomMin = options.zoomMin) != null ? _options$zoomMin : Number.MIN_VALUE;
      var zoomMax = (_options$zoomMax = options.zoomMax) != null ? _options$zoomMax : Number.MAX_VALUE;
      var doWheelZoom = (_options$wheelZoom = options.wheelZoom) != null ? _options$wheelZoom : true;
      var doPinchZoom = (_options$pinchZoom = options.pinchZoom) != null ? _options$pinchZoom : true;
      var doPanning = (_options$panning = options.panning) != null ? _options$panning : true;
      var panButton = (_options$panButton = options.panButton) != null ? _options$panButton : 0;
      var oneFingerPan = (_options$oneFingerPan = options.oneFingerPan) != null ? _options$oneFingerPan : false;
      var margins = (_options$margins = options.margins) != null ? _options$margins : false;
      var wheelZoomDeltaModeLinePixels = (_options$wheelZoomDel = options.wheelZoomDeltaModeLinePixels) != null ? _options$wheelZoomDel : 17;
      var wheelZoomDeltaModeScreenPixels = (_options$wheelZoomDel2 = options.wheelZoomDeltaModeScreenPixels) != null ? _options$wheelZoomDel2 : 53;
      var lastP;
      var lastTouches;
      var zoomInProgress = false;

      var restrictToMargins = function restrictToMargins(box) {
        if (!margins) return box;
        var top = margins.top,
            left = margins.left,
            bottom = margins.bottom,
            right = margins.right;
        var zoom = _this.width() / box.width;

        var _this$attr = _this.attr(['width', 'height']),
            width = _this$attr.width,
            height = _this$attr.height;

        var leftLimit = width - left / zoom;
        var rightLimit = (right - width) / zoom;
        var topLimit = height - top / zoom;
        var bottomLimit = (bottom - height) / zoom;
        box.x = Math.min(leftLimit, Math.max(rightLimit, box.x));
        box.y = Math.min(topLimit, Math.max(bottomLimit, box.y));
        return box;
      };

      var wheelZoom = function wheelZoom(ev) {
        ev.preventDefault(); // When wheeling on a mouse,
        // - chrome by default uses deltaY = 53, deltaMode = 0 (pixel)
        // - firefox by default uses deltaY = 3, deltaMode = 1 (line)
        // - chrome and firefox on windows after configuring "One screen at a time"
        //   use deltaY = 1, deltaMode = 2 (screen)
        //
        // Note that when when wheeling on a touchpad, deltaY depends on how fast
        // you swipe, but the deltaMode is still different between the browsers.
        //
        // Normalize everything so that zooming speed is approximately the same in all cases

        var normalizedPixelDeltaY;

        switch (ev.deltaMode) {
          case 1:
            normalizedPixelDeltaY = ev.deltaY * wheelZoomDeltaModeLinePixels;
            break;

          case 2:
            normalizedPixelDeltaY = ev.deltaY * wheelZoomDeltaModeScreenPixels;
            break;

          default:
            // 0 (already pixels) or new mode (avoid crashing)
            normalizedPixelDeltaY = ev.deltaY;
            break;
        }

        var lvl = Math.pow(1 + zoomFactor, -1 * normalizedPixelDeltaY / 100) * this.zoom();
        var p = this.point(ev.clientX, ev.clientY);

        if (lvl > zoomMax) {
          lvl = zoomMax;
        }

        if (lvl < zoomMin) {
          lvl = zoomMin;
        }

        if (this.dispatch('zoom', {
          level: lvl,
          focus: p
        }).defaultPrevented) {
          return this;
        }

        this.zoom(lvl, p);

        if (margins) {
          var box = restrictToMargins(this.viewbox());
          this.viewbox(box);
        }
      };

      var pinchZoomStart = function pinchZoomStart(ev) {
        lastTouches = normalizeEvent(ev); // Start panning in case only one touch is found

        if (lastTouches.length < 2) {
          if (doPanning && oneFingerPan) {
            panStart.call(this, ev);
          }

          return;
        } // Stop panning for more than one touch


        if (doPanning && oneFingerPan) {
          panStop.call(this, ev);
        } // We call it so late, so the user is still able to scroll / reload the page via gesture
        // In case oneFingerPan is not active


        ev.preventDefault();

        if (this.dispatch('pinchZoomStart', {
          event: ev
        }).defaultPrevented) {
          return;
        }

        this.off('touchstart.panZoom', pinchZoomStart);
        zoomInProgress = true;
        svg_js.on(document, 'touchmove.panZoom', pinchZoom, this, {
          passive: false
        });
        svg_js.on(document, 'touchend.panZoom', pinchZoomStop, this, {
          passive: false
        });
      };

      var pinchZoomStop = function pinchZoomStop(ev) {
        ev.preventDefault();
        var currentTouches = normalizeEvent(ev);

        if (currentTouches.length > 1) {
          return;
        }

        zoomInProgress = false;
        this.dispatch('pinchZoomEnd', {
          event: ev
        });
        svg_js.off(document, 'touchmove.panZoom', pinchZoom);
        svg_js.off(document, 'touchend.panZoom', pinchZoomStop);
        this.on('touchstart.panZoom', pinchZoomStart);

        if (currentTouches.length && doPanning && oneFingerPan) {
          panStart.call(this, ev);
        }
      };

      var pinchZoom = function pinchZoom(ev) {
        ev.preventDefault();
        var currentTouches = normalizeEvent(ev);
        var zoom = this.zoom(); // Distance Formula

        var lastDelta = Math.sqrt(Math.pow(lastTouches[0].clientX - lastTouches[1].clientX, 2) + Math.pow(lastTouches[0].clientY - lastTouches[1].clientY, 2));
        var currentDelta = Math.sqrt(Math.pow(currentTouches[0].clientX - currentTouches[1].clientX, 2) + Math.pow(currentTouches[0].clientY - currentTouches[1].clientY, 2));
        var zoomAmount = lastDelta / currentDelta;

        if (zoom < zoomMin && zoomAmount > 1 || zoom > zoomMax && zoomAmount < 1) {
          zoomAmount = 1;
        }

        var currentFocus = {
          x: currentTouches[0].clientX + 0.5 * (currentTouches[1].clientX - currentTouches[0].clientX),
          y: currentTouches[0].clientY + 0.5 * (currentTouches[1].clientY - currentTouches[0].clientY)
        };
        var lastFocus = {
          x: lastTouches[0].clientX + 0.5 * (lastTouches[1].clientX - lastTouches[0].clientX),
          y: lastTouches[0].clientY + 0.5 * (lastTouches[1].clientY - lastTouches[0].clientY)
        };
        var p = this.point(currentFocus.x, currentFocus.y);
        var focusP = this.point(2 * currentFocus.x - lastFocus.x, 2 * currentFocus.y - lastFocus.y);
        var box = new svg_js.Box(this.viewbox()).transform(new svg_js.Matrix().translate(-focusP.x, -focusP.y).scale(zoomAmount, 0, 0).translate(p.x, p.y));
        restrictToMargins(box);
        this.viewbox(box);
        lastTouches = currentTouches;
        this.dispatch('zoom', {
          box: box,
          focus: focusP
        });
      };

      var panStart = function panStart(ev) {
        var isMouse = ev.type.indexOf('mouse') > -1; // In case panStart is called with touch, ev.button is undefined

        if (isMouse && ev.button !== panButton && ev.which !== panButton + 1) {
          return;
        }

        ev.preventDefault();
        this.off('mousedown.panZoom', panStart);
        lastTouches = normalizeEvent(ev);
        if (zoomInProgress) return;
        this.dispatch('panStart', {
          event: ev
        });
        lastP = {
          x: lastTouches[0].clientX,
          y: lastTouches[0].clientY
        };
        svg_js.on(document, 'touchmove.panZoom mousemove.panZoom', panning, this, {
          passive: false
        });
        svg_js.on(document, 'touchend.panZoom mouseup.panZoom', panStop, this, {
          passive: false
        });
      };

      var panStop = function panStop(ev) {
        ev.preventDefault();
        svg_js.off(document, 'touchmove.panZoom mousemove.panZoom', panning);
        svg_js.off(document, 'touchend.panZoom mouseup.panZoom', panStop);
        this.on('mousedown.panZoom', panStart);
        this.dispatch('panEnd', {
          event: ev
        });
      };

      var panning = function panning(ev) {
        ev.preventDefault();
        var currentTouches = normalizeEvent(ev);
        var currentP = {
          x: currentTouches[0].clientX,
          y: currentTouches[0].clientY
        };
        var p1 = this.point(currentP.x, currentP.y);
        var p2 = this.point(lastP.x, lastP.y);
        var deltaP = [p2.x - p1.x, p2.y - p1.y];

        if (!deltaP[0] && !deltaP[1]) {
          return;
        }

        var box = new svg_js.Box(this.viewbox()).transform(new svg_js.Matrix().translate(deltaP[0], deltaP[1]));
        lastP = currentP;
        restrictToMargins(box);

        if (this.dispatch('panning', {
          box: box,
          event: ev
        }).defaultPrevented) {
          return;
        }

        this.viewbox(box);
      };

      if (doWheelZoom) {
        this.on('wheel.panZoom', wheelZoom, this, {
          passive: false
        });
      }

      if (doPinchZoom) {
        this.on('touchstart.panZoom', pinchZoomStart, this, {
          passive: false
        });
      }

      if (doPanning) {
        this.on('mousedown.panZoom', panStart, this, {
          passive: false
        });
      }

      return this;
    }
  });

}(SVG));
//# sourceMappingURL=svg.panzoom.js.map
