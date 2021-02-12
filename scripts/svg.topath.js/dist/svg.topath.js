/*!
* @svgdotjs/svg.topath.js - An extension for svg.js to convert shapes to paths
* @version 2.0.3
* https://github.com/svgdotjs/svg.topath.js
*
* @copyright Wout Fierens
* @license MIT
*
* BUILT: Thu Apr 25 2019 07:15:51 GMT+0200 (GMT+02:00)
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

  svg_js.extend(svg_js.Shape, {
    // Convert element to path
    toPath: function toPath() {
      var replace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var d;

      switch (this.type) {
        case 'rect':
          {
            var _this$attr = this.attr(['width', 'height', 'rx', 'ry', 'x', 'y']),
                w = _this$attr.width,
                h = _this$attr.height,
                rx = _this$attr.rx,
                ry = _this$attr.ry,
                x = _this$attr.x,
                y = _this$attr.y; // normalise radius values, just like the original does it (or should do)


            if (rx < 0) rx = 0;
            if (ry < 0) ry = 0;
            rx = rx || ry;
            ry = ry || rx;
            if (rx > w / 2) rx = w / 2;
            if (ry > h / 2) ry = h / 2;

            if (rx && ry) {
              // if there are round corners
              d = [['M', rx + x, y], ['h', w - 2 * rx], ['a', rx, ry, 0, 0, 1, rx, ry], ['v', h - 2 * ry], ['a', rx, ry, 0, 0, 1, -rx, ry], ['h', -w + 2 * rx], ['a', rx, ry, 0, 0, 1, -rx, -ry], ['v', -h + 2 * ry], ['a', rx, ry, 0, 0, 1, rx, -ry], ['z']];
            } else {
              // no round corners, no need to draw arcs
              d = [['M', x, y], ['h', w], ['v', h], ['h', -w], ['v', -h], ['z']];
            }

            break;
          }

        case 'circle':
        case 'ellipse':
          {
            var _rx = this.rx();

            var _ry = this.ry();

            var _this$attr2 = this.attr(['cx', 'cy']),
                cx = _this$attr2.cx,
                cy = _this$attr2.cy;

            d = [['M', cx - _rx, cy], ['A', _rx, _ry, 0, 0, 0, cx + _rx, cy], ['A', _rx, _ry, 0, 0, 0, cx - _rx, cy], ['z']];
            break;
          }

        case 'polygon':
        case 'polyline':
        case 'line':
          d = this.array().map(function (arr) {
            return ['L'].concat(arr);
          });
          d[0][0] = 'M';

          if (this.type === 'polygon') {
            d.push('Z');
          }

          break;

        case 'path':
          d = this.array();
          break;

        default:
          throw new Error('SVG toPath got unsupported type ' + this.type, this);
      }

      var path = new svg_js.Path().plot(d).attr(normaliseAttributes(this.attr()));

      if (replace) {
        this.replace(path);
      }

      return path;
    }
  });

}(SVG));
//# sourceMappingURL=svg.topath.js.map
