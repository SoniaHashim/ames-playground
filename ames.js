console.log("I'm KING OF THE WORLD!")

var draw = SVG().addTo('#canvas').size(1000, 1000)
// var rect = draw.rect(100, 100).attr({ fill: '#f06' })

let makeSquare = () => {
	var r = draw.rect(100,100).attr({fill: '#f06'})
	r.animate(2000, 1000, 'now').attr({ fill: '#fe3' })
	r.draggable()
}
