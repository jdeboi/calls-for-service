const types = {};
types.none = 0;

function sumType(d) {
  if (d.TypeText) {
    if (d.TypeText in types) {
      types[d.TypeText]++;
    }
    else types[d.TypeText] = 1;
  }
  else {
    types.none++;
  }
}

function displayCallsPerType() {
  // var data = Object.entries(types);
  var data = Object.keys(types).map(function (key) {

    // Using Number() to convert key to number type
    // Using obj[key] to retrieve key value
    return {key:key, value:types[key]};
  });

  console.log("DATA", data[1]);
  var width = 800;
  var height = Math.min(width, 500);

  var color = d3.scaleOrdinal()
  .domain(data.map(d => d.key))
  .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  var arc = d3.arc()
  .innerRadius(0)
  .outerRadius(Math.min(width, height) / 2 - 1)

  var arcLabel = function() {
    const radius = Math.min(width, height) / 2 * 0.8;
    return d3.arc().innerRadius(radius).outerRadius(radius);
  }

  var pie = d3.pie()
  .sort(null)
  .value(d => d.value)

  const arcs = pie(data);

  const svg = d3.select("#pieChart").append("svg");

  svg
  .attr("viewBox", [-width / 2, -height / 2, width, height]);

  svg.append("g")
  .attr("stroke", "white")
  .selectAll("path")
  .data(arcs)
  .join("path")
  .attr("fill", d => color(d.data.key))
  .attr("d", arc)

  .append("title")
  .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

  svg.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 12)
  .attr("text-anchor", "middle")
  .selectAll("text")
  .data(arcs)
  .join("text")
  .attr("transform", d => `translate(${arcLabel().centroid(d)})`)

  .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
  .attr("y", "-0.4em")
  .attr("font-weight", "bold")
  .text(d => d.data.key))

  .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
  .attr("x", 0)
  .attr("y", "1.6em")
  .attr("font-weight", "bold")
  .text(d => {
    let dang = d.endAngle-d.startAngle;
    return Math.floor(dang/Math.PI*180/360*1000)/10+"%";
  }))

  .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
  .attr("x", 0)
  .attr("y", "0.7em")
  .attr("fill-opacity", 0.7)
  .text(d => d.data.value.toLocaleString()));

}
