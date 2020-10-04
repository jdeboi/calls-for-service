
var margin = {top: 20, right: 20, bottom: 70, left: 70},
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

// Parse the date / time
//"01/01/2020 06:53:08 AM"
var	parseDate = d3.time.format("%m/%d/%Y %I:%M:%S %p").parse;
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(12)
.tickFormat((d) => d+1);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10);

var svg = d3.select("#barChart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
"translate(" + margin.left + "," + margin.top + ")");

const months = new Array(12).fill(0);
d3.csv("data/2020.csv", function(error, data) {

  // summing up data per month
  data.forEach(function(d) {
    if (d.TimeCreate) {
      d.date = parseDate(d.TimeCreate);
      months[d.date.getMonth()]++;
    }
    else {
      d.date = new Date();
    }
  });
  console.log(months);

  // setting up x & y scale
  x.domain([0, 11]);
  y.domain([0, d3.max(months, function(mon) { return mon; })]);

  // x axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-90)" );

  // text label for the x axis
  svg.append("text")
  .attr("transform",
  "translate(" + (width/2) + " ," +
  (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Month (2020)");

  // y bars
  svg.selectAll("bar")
  .data(months)
  .enter().append("rect")
  .style("fill", "steelblue")
  .attr("x", function(mon, i) { return x(i); })
  .attr("width", 30)
  .attr("y", function(mon) { return y(mon); })
  .attr("height", function(mon) { return height - y(mon); });

  // y axis
  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)

  // text label for the y axis
  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Reports");

});

function testing(data) {
  // first doc
  console.log(data[0]);
  console.log(parseDate(data[0].TimeCreate).getMonth());

  // select data
  for (let i = 0; i < 100; i++) {
    const d = data[i];
    if (d.TimeCreate) {
      d.date = parseDate(d.TimeCreate);
      let m = d.date.getMonth();
      months[m]++;
    }
  }
}
