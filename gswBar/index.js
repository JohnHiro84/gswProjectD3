var data = [
	{
	  player: "Stephen Curry",
	  points: 25,
		team: "gsw"
	},
	{
	  player: "Draymond Green",
	  points: 16,
		team: "gsw"
	},
	{
	  player: "Andre Iguodala",
	  points: 25,
		team: "gsw"
	},
	{
		player: "Harrison Barnes",
		points: 9,
		team: "gsw"
	},
	{
		player: "Klay Thompson",
		points: 5,
		team: "gsw"
	},
	{
		player: "Shaun Livingston",
		points: 10,
		team: "gsw"
	},
	{
		player: "Leandro Barbosa",
		points: 5,
		team: "gsw"
	},
	{
		player: "Festus Ezeli",
		points: 10,
		team: "gsw"
	},
	{
		player: "Andrew Bogut",
		points: 4,
		team: "gsw"
	},
	{
		player: "Lebron James",
		points: 44,
		team: "cavs"
	},
	{
		player: "Kyrie Irving",
		points: 23,
		team: "cavs"
	},
	{
		player: "Tomofey Mozgov",
		points: 16,
		team: "cavs"
	},
	{
		player: "Iman Shumpert",
		points: 6,
		team: "cavs"
	},
	{
		player: "Tristan Thompson",
		points: 2,
		team: "cavs"
	},
	{
		player: "J.R. Smith",
		points: 9,
		team: "cavs"
	}

]



var scale = d3.scale.linear()
  .domain([0, 55])
  .range([0, 800])

d3.select(".chart")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")
		.attr('class',function(d) { return (d.team) })
    .style("width", function(d) { return scale(d.points + 6) + 'px' })
    .text(function(d) { return d.player + "-" + d.points; });
