var wMap = 1400;
var hMap = 700;
var hexPoints = [];
var projection = d3.geoMercator().translate([wMap/2, hMap/2]).scale(100000).center([-89.9015,30.0211]);
var svgMap = d3.select("#map").append("svg");

svgMap.attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#c9e8fd")
.attr("viewBox", "0 0 " + wMap + " " + hMap)
.classed("svg-content", true);

// var g = svgMap.append("g");

var zoom = d3.zoom()
.scaleExtent([1, 8])
.on('zoom', function() {
  var selections = svgMap.selectAll('.neighborhood');
  // console.log(svgMap, selections)
  if (selections) selections.attr('transform', d3.event.transform);
});

var zoom = d3.zoom()
.scaleExtent([1, 8])
.on('zoom', zoomed);

function zoomed({transform}, d) {
    var neighborhoods = svgMap.select(".neighborhoods");//.selectAll('path');
    neighborhoods.attr('transform', transform);

    var hexbins = svgMap.select(".hexbins"); //.selectAll('path');
    hexbins.attr('transform', transform);
}

svgMap.call(zoom);

function addMap() {

  var path = d3.geoPath().projection(projection);

  // load data
  var nola = d3.json("../data/nola.geojson");

  Promise.all([nola]).then(function(values){
    // draw map
    svgMap
    .append("g")
    .attr("class","neighborhoods")
    .selectAll("path")
    .data(values[0].features)
    .enter()
    .append("path")
    .attr("class","neighborhood")
    .attr("d", path)
    .attr("fill", "#f0e4dd")
    .attr("stroke", "#777")
    .attr("stroke-width", 0.7)
    .attr("stroke-linejoin", "round")

  });
}

function addHexBin() {


  var hexbin = d3.hexbin().extent([[0, 0], [wMap, hMap]]).radius(10)
  var bins = hexbin(hexPoints);
  // var color = d3.scaleSequential(d3.extent(data, d => d.value), d3.interpolateSpectral)
  var radius = d3.scaleSqrt([0, d3.max(bins, d => d.length)], [0, hexbin.radius() * Math.SQRT2]);


  svgMap
  .append("g")
  .attr("class","hexbins")
  .selectAll("path")
  .data(bins)
  .join("path")
  .attr("transform", d => `translate(${d.x},${d.y})`)
  .attr("d", d => hexbin.hexagon(radius(d.length)))
  .attr("fill", "red")
  .attr("stroke", "black")

}


function setPoint(d) {
  const loc = d.Location;
  const lonStart = loc.indexOf("(")+1;
  const lonEnd = lonStart+ loc.substring(lonStart, loc.length).indexOf(" ");
  const lon = +loc.substring(lonStart, lonEnd);
  const latStart = lonEnd+1;
  const latEnd = loc.indexOf(")");
  const lat = +loc.substring(latStart, latEnd);
  const p = projection([lon, lat]);
  hexPoints.push(p);
};
