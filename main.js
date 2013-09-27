var margin = {top: 30, right: 10, bottom: 10, left: 10};

var width = $("#d3").width() - margin.left - margin.right;
var height = $("#d3").height() - margin.top - margin.bottom;

// Set up the SVG
var svg = d3.select("#d3").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var context = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the JSON
d3.json("data/08_28_2013_Bud_Peterson.json", function(error, json) {
  drawAddresses(context, [json], width, height);
});

$("input").bind("keyup", function(e) {
  var phrase = $(this).val();

  $("span#phrase").text(phrase);

  d3.selectAll(".word").classed("selected", function(d, i) {
    return d["word"] == phrase;
  });
});

function drawAddresses(svg, json, width, height) {
  var year = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

  var president = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

  var yearAxis = d3.svg.axis()
    .scale(year)
    .orient("top");

  var presidentAxis = d3.svg.axis()
    .scale(president)
    .orient("top");

  year.domain(json.map(function(d) { return d["metadata"]["date"]["year"]; }));
  president.domain(json.map(function(d) { return d["metadata"]["last name"]; }));

  svg.append("g")
    .attr("class", "year axis")
    .call(yearAxis);

  svg.append("g")
    .attr("class", "president axis")
    .attr("transform", "translate(0, 20)")
    .call(presidentAxis);

  // Draw words now
  json.forEach(function(addressData) {
    var lines = []

    for (var i = 0; i < addressData["metadata"]["line word counts"].length; i++) {
      lines[i] = i;
    }

    var y = d3.scale.ordinal()
      .rangeRoundBands([20, height], 0.5)
      .domain(lines);

    var wordCount = addressData["metadata"]["word count"];
    var lineWordCounts = addressData["metadata"]["line word counts"];

    var locations = addressData["locations"];
    var words = [];

    var word_height = height / lineWordCounts.length;

    for (var word in locations) {
      var wordInstances = locations[word];
      for (var i in wordInstances) {
        var wordInstance = wordInstances[i];

        var word_width = year.rangeBand() / lineWordCounts[wordInstance["line"]];

        var obj = {
          "word": word,
          "x": wordInstance["word"] * word_width,
          "y": y(wordInstance["line"]),
          "width": word_width
        }

        words.push(obj);
      }

      addressData["words"] = words;
    }

    var address = svg.selectAll("g.address")
      .data(json)
      .enter()
      .append("g")
      .attr("class", "address")
      .attr("transform", function(d) {
        return "translate(" + year(d["metadata"]["date"]["year"]) + ", 25)";
      });

    address.selectAll("rect")
      .data(function(d) { return d["words"]; })
      .enter()
      .append("rect")
      .attr("class", function(d) { return "word-" + d["word"] + " word"; })
      .attr("x", function(d) { return d["x"]; })
      .attr("y", function(d) { return d["y"]; })
      .attr("width", function(d) { return d["width"]; })
      .attr("height", y.rangeBand())
      .on("mouseover", function(d) {
        d3.selectAll(".word-" + d["word"] + ".word").classed("selected", true);
      })
      .on("mouseout", function(d) {
        d3.selectAll(".word-" + d["word"] + ".word").classed("selected", false);
      });
  });
}