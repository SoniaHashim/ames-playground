console.log("I'm KING OF THE WORLD!")

var draw = SVG().addTo('#canvas').size(400, 400)
// var rect = draw.rect(100, 100).attr({ fill: '#f06' })

let makeSquare = () => draw.rect(100,100).attr({fill: '#f06'}).draggable()
