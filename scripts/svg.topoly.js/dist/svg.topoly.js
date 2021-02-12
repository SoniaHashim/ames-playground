/*!
* @svgdotjs/svg.topoly.js - An extension for svg.js to convert shapes to polygons
* @version 1.0.3
* https://github.com/svgdotjs/svg.topoly.js
*
* @copyright Wout Fierens
* @license MIT
*
* BUILT: Thu Apr 25 2019 07:08:45 GMT+0200 (GMT+02:00)
*/;
(function (svg_js) {
  'use strict';

  var normaliseAttributes = function normaliseAttributes(attr) {
    for (var a in attr) {
      if (!/fill|stroke|opacity|transform/.test(a)) {
        delete attr[a];
      }
    }

    return attr;
  };

  var getParserPath = function getParserPath(pathArray) {
    var path = svg_js.parser().path;
    path.setAttribute('d', pathArray.toString());
    return path;
  };

  var pathLength = function pathLength(pathArray) {
    return getParserPath(pathArray).getTotalLength();
  };

  svg_js.extend(svg_js.PathArray, {
    // Convert path to poly
    toPoly: function toPoly() {
      var sample = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1%';
      var points = [];
      var length = 0;
      var x = 0;
      var y = 0; // parse sample value

      sample = new svg_js.Number(sample); // get total length

      var total = pathLength(this);
      var distance; // calculate sample distance

      if (sample.unit === '%') {
        // sample distance in %
        distance = total * sample.value;
      } else if (sample.unit === 'px') {
        // fixed sample distance in px
        distance = sample.value;
      } else {
        // specific number of samples
        distance = total / sample.value;
      } // prepare arrays


      var segmentsQueue = this.slice(); // prepare helpers functions

      var addPoint = function addPoint(px, py) {
        // get last point
        var lastPoint = points[points.length - 1]; // when the last point doesn't equal the current point add the current point

        if (!lastPoint || px !== lastPoint[0] || py !== lastPoint[1]) {
          points.push([px, py]);
          x = px;
          y = py;
        }
      };

      var addSegmentPoint = function addSegmentPoint(segment) {
        // don't bother processing path ends
        if (segment[0] === 'Z') return; // map segment to x and y

        switch (segment[0]) {
          case 'M':
          case 'L':
          case 'T':
            x = segment[1];
            y = segment[2];
            break;

          case 'H':
            x = segment[1];
            break;

          case 'V':
            y = segment[1];
            break;

          case 'C':
            x = segment[5];
            y = segment[6];
            break;

          case 'S':
          case 'Q':
            x = segment[3];
            y = segment[4];
            break;

          case 'A':
            x = segment[6];
            y = segment[7];
            break;
        } // add point


        addPoint(x, y);
      };

      var lastSegment;
      var segmentIndex = 0;
      var subPath = this.slice(0, segmentIndex + 1);
      var subPathLength = pathLength(subPath); // sample through path

      while (length < total) {
        // get segment index
        while (subPathLength < length) {
          ++segmentIndex;
          subPath = this.slice(0, segmentIndex + 1);
          subPathLength = pathLength(subPath);
        } // get segment


        var segment = this[segmentIndex]; // new segment?

        if (segment !== lastSegment) {
          // add the segment we just left
          if (lastSegment !== undefined) {
            addSegmentPoint(lastSegment);
          } // add all segments which we just skipped


          while (segmentsQueue.length && segmentsQueue[0] !== segment) {
            addSegmentPoint(segmentsQueue.shift());
          }

          lastSegment = segment;
        } // add points in between when curving


        switch (segment[0]) {
          case 'C':
          case 'T':
          case 'S':
          case 'Q':
          case 'A':
            var point = getParserPath(this).getPointAtLength(length);
            addPoint(point.x, point.y);
            break;
        } // increment by sample value


        length += distance;
      }

      var i = 0;
      var il = segmentsQueue.length; // add remaining segments we didn't pass while sampling

      for (; i < il; ++i) {
        addSegmentPoint(segmentsQueue[i]);
      } // send out as point array


      return new svg_js.PointArray(points);
    }
  });
  svg_js.extend(svg_js.Path, {
    // Convert path to poly
    toPoly: function toPoly() {
      var sample = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1%';
      var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      // define type
      var Poly = /z\s*$/i.test(this.attr('d')) ? svg_js.Polygon : svg_js.Polyline;
      var pointArray = this.array().toPoly(sample); // create poly

      var poly = new Poly().plot(pointArray).attr(normaliseAttributes(this.attr())); // insert poly

      if (replace) {
        this.replace(poly);
      }

      return poly;
    }
  });

}(SVG));
//# sourceMappingURL=svg.topoly.js.map
