var margin = {top: 10, right: 10, bottom: 100, left: 40};
var margin2 = {top: 560, right: 10, bottom: 20, left: 40};

var w = 1024;
var h = 640;

var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

// Set up the SVG
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

// Prepare our two drawing areas
var area = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the JSON
console.log("Loading the JSON...");

d3.json("data/08_28_2013_Bud_Peterson.json", function(error, json) {
  console.log("Loaded the JSON.");
});