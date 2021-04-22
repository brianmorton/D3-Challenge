var svgWidth = 960;
var svgHeight = 500;

//margin info
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
  };

//calculate final border with margin padding
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import csv
d3.csv("assets/data/data.csv").then(function(incomingData) {
  incomingData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
      });

  //scales functions
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(incomingData, d => d.poverty))
    .range([0, width])
  
  var yLinearScale = d3.scaleLinear()
    .domain([0,d3.max(incomingData, d => d.healthcare)])
    .range([height, 0])

//add axes
  var xaxis = d3.axisBottom(xLinearScale);
  var yaxis = d3.axisLeft(yLinearScale);

  chartGroup.append("g").attr("transform", `translate(0, ${height})`)
  .call(xaxis);
  chartGroup.append("g")
  .call(yaxis);

//scatter plot circles
chartGroup.selectAll("circle")
.data(incomingData)
.enter()
.append("circle")
.attr("cx", d=>xLinearScale(d.poverty))
.attr("cy", d=>yLinearScale(d.healthcare))
.attr("r", "10")
.attr("stroke-width", "1")
.attr("fill", "blue")
.attr("opacity", 0.5);

//add axes text
chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + margin.top +15})`)
  .attr("class", "axisText")
  .text("Poverty");

chartGroup.append("text")
  .attr("y", 0 - ((margin.left / 2)))
  .attr("x", 0 - (height / 2))
  .attr("transform", "rotate(-90)")
  .attr("class", "axisText")
  .text("Healthcare");

//add state initials
chartGroup.append("g")
  .selectAll('text')
  .data(incomingData)
  .enter()
  .append("text")
  .text(d=>d.abbr)
  .attr("x",d=>xLinearScale(d.poverty))
  .attr("y",d=>yLinearScale(d.healthcare))
})