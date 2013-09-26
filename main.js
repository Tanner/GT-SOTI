var width = $("#d3").width();
var height = $("#d3").height();

console.log(width, height);

// Set up the SVG
var svg = d3.select("#d3").append("svg")
  .attr("width", width)
  .attr("height", height);

// Load the JSON
d3.json("data/08_28_2013_Bud_Peterson.json", function(error, json) {
});