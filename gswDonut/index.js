// define data
var dataset = [
    { name: 'Steph Curry', average: 26, percent: 24.64 },
    { name: 'Andre Iguodala', average: 16.3, percent: 16.3 },
    { name: 'Klay Thompson', average: 15.8, percent: 14.97 },
    { name: 'Draymond Green', average: 13, percent: 12.3 },
    { name: 'Harrison Barnes', average: 8.8, percent: 8.34 },
    { name: 'David Lee', average: 5.5, percent: 5.21 },
    { name: 'Leandro Barbosa', average: 5.2, percent: 4.92 },
    { name: 'Shaun Livingston', average: 5, percent: 4.73 },
    { name: 'Festus Ezeli', average: 4.4, percent: 4.17 },
    { name: 'Marreese Speights', average: 3, percent: 2.84 },
    { name: 'Andrew Bogut', average: 2.5, percent: 2.369 }

];
//
// var dataset = [
//     {label: "Venue", count: 16107},
//     {label: "Photographer", count: 2783},
//     {label: "Wedding/Event Planner", count: 2037},
//     {label: "Reception Band", count: 4156},
//     {label: "Reception DJ", count: 1245},
//     {label: "Florist/Decor", count: 2534},
//     {label: "Videographer", count: 1995},
//     {label: "Wedding Dress", count: 1564},
//     {label: "Groom's Attire", count: 280},
//     {label: "Wedding Cake", count: 582},
//     {label: "Ceremony Site", count: 2197},
//     {label: "Ceremony Musicians", count: 755},
//     {label: "Invitations", count: 2534},
//     {label: "Transportation", count: 1995},
//     {label: "Favors", count: 1564},
//     {label: "Rehearsal Dinner", count: 280},
//     {label: "Engagement Ring", count: 582},
//     {label: "Officiant", count: 2197}
//   ];

// chart dimensions
var width = 800;
var height = 800;

// a circle chart needs a radius
var radius = Math.min(width, height) / 2;
var donutWidth = 100; // size of donut hole. not needed if doing pie chart

// legend dimensions
var legendRectSize = 25; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

// define color scale
var color = d3.scaleOrdinal(d3.schemeCategory20b);
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

// calculate new total
var total = d3.sum(dataset, d => d.average);

// define new total section
var newTotal = d3.select('.new-total-holder')
  .append('span')
  .attr('class', 'newTotal').text(total);

var svg = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('svg') // append an svg element to the element we've selected
  .attr('width', width) // set the width of the svg element we just added
  .attr('height', height) // set the height of the svg element we just added
  .append('g') // append 'g' element to the svg element
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3.arc()
  .innerRadius(radius - donutWidth) // radius - donutWidth = size of donut hole. use 0 for pie chart
  .outerRadius(radius); // size of overall chart

var pie = d3.pie() // start and end angles of the segments
  .value(function(d) { return d.average; }) // how to extract the numerical data from each entry in our dataset
  .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

//**********************
//        TOOLTIP
//**********************

var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('div') // append a div element to the element we've selected
  .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above
  .attr('class', 'name'); // add class 'name' on the selection
tooltip.append('div') // add divs to the tooltip defined above
  .attr('class', 'average'); // add class 'average' on the selection
tooltip.append('div') // add divs to the tooltip defined above
  .attr('class', 'percent'); // add class 'percent' on the selection

// Confused? see below:

// <div id="chart">
//   <div class="tooltip">
//     <div class="name">
//     </div>
//     <div class="average">
//     </div>
//     <div class="percent">
//     </div>
//   </div>
// </div>

dataset.forEach(function(d) {
  d.average = +d.average; // calculate average as we iterate through the data
  d.enabled = true; // add enabled property to track which entries are checked
});

// creating the chart
var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
  .data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
  .enter() //creates placeholder nodes for each of the values
  .append('path') // replace placeholders with path elements
  .attr('d', arc) // define d attribute with arc function above
  .attr('fill', function(d) { return color(d.data.name); }) // use color scale to define fill of each name in dataset
  .each(function(d) { this._current - d; }); // creates a smooth animation for each track

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div
 var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset
  return (d.enabled) ? d.average : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase
  }));
 var percent = Math.round(1000 * d.data.average / total) / 10; // calculate percent
 tooltip.select('.name').html(d.data.name); // set current name
 tooltip.select('.average').html(d.data.average + "pts/game (average)"); // set current average
 tooltip.select('.percent').html(percent + '%'); // set percent calculated above
 tooltip.style('display', 'block'); // set display
});

path.on('mouseout', function() { // when mouse leaves div
  tooltip.style('display', 'none'); // hide tooltip for that element
 });

path.on('mousemove', function(d) { // when mouse moves
  tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
    .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });

// define legend
var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
  .data(color.domain()) // refers to an array of names from our dataset
  .enter() // creates placeholder
  .append('g') // replace placeholders with g elements
  .attr('class', 'legend') // each g is given a legend class
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing
    var offset =  height * color.domain().length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements
    var horz = -2 * legendRectSize; // the legend is shifted to the left to make room for the text
    var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'
      return 'translate(' + horz + ',' + vert + ')'; //return translation
   });

// adding colored squares to legend
legend.append('rect') // append rectangle squares to legend
  .attr('width', legendRectSize) // width of rect size is defined above
  .attr('height', legendRectSize) // height of rect size is defined above
  .style('fill', color) // each fill is passed a color
  .style('stroke', color) // each stroke is passed a color
  // .on('click', function(name) {
  //   var rect = d3.select(this); // this refers to the colored squared just clicked
  //   var enabled = true; // set enabled true to default
  //   var totalEnabled = d3.sum(dataset.map(function(d) { // can't disable all options
  //     return (d.enabled) ? 1 : 0; // return 1 for each enabled entry. and summing it up
  //   }));
  //   if (rect.attr('class') === 'disabled') { // if class is disabled
  //     rect.attr('class', ''); // remove class disabled
  //   } else { // else
  //     if (totalEnabled < 2) return; // if less than two names are flagged, exit
  //     rect.attr('class', 'disabled'); // otherwise flag the square disabled
  //     enabled = false; // set enabled to false
  //   }
  //
  //   pie.value(function(d) {
  //     if (d.name === name) d.enabled = enabled; // if entry name matches legend name
  //       return (d.enabled) ? d.average : 0; // update enabled property and return average or 0 based on the entry's status
  //   });
  //
  //   path = path.data(pie(dataset)); // update pie with new data
  //
  //   path.transition() // transition of redrawn pie
  //     .duration(750) //
  //     .attrTween('d', function(d) { // 'd' specifies the d attribute that we'll be animating
  //       var interpolate = d3.interpolate(this._current, d); // this = current path element
  //       this._current = interpolate(0); // interpolate between current value and the new value of 'd'
  //       return function(t) {
  //         return arc(interpolate(t));
  //       };
  //     });
  //
  //   // calculate new total
  //   var newTotalCalc = d3.sum(dataset.filter(function(d) { return d.enabled;}), d => d.average)
  //  // console.log(newTotalCalc);
  //
  //   // append newTotalCalc to newTotal which is defined above
  //   newTotal.text(newTotalCalc);
  // });

// adding text to legend
legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; }); // return name
