var	parseDate = d3.timeParse("%m/%d/%Y %I:%M:%S %p");


d3.csv("data/2020.csv")
.then(function(data) {

  data.forEach(function(d) {
    sumMonth(d);
    sumType(d);
  });

  console.log("TYPES", types);
  // console.log(data[0]);
  displayCallsPerMonth();
  // console.log("SVG3");
  displayCallsPerType();
})
.then(() => {
  d3.selectAll(".loading").attr("class", "loading hidden");
})
.catch(function(error){
  console.log("ERROR", error);
})
