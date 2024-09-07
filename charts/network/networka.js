


function run(graph) {

    



	var margin = {top: 20, right: 90, bottom: 30, left: 90},
  width = 650,
  height = 650;

var svg = d3.select("#testssss")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom);


var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d) { return d.id; }))
  //.force("charge", d3.forceManyBody().strength(-200))
  .force('charge', d3.forceManyBody()
    .strength(-2000)
    .theta(0.8)
    .distanceMax(150)
  )
// 		.force('collide', d3.forceCollide()
//       .radius(d => 40)
//       .iterations(2)
//     )
  .force("center", d3.forceCenter(width / 2, height / 2));

// graph.links.forEach(function(d){
//     d.source = d.source_id;    
//     d.target = d.target_id;
// });           

var link = svg.append("g")
              .style("stroke", "#aaa")
              .selectAll("line")
              .data(graph.links)
              .enter().append("line");

var node = svg.append("g")
          .attr("class", "nodes")
.selectAll("circle")
          .data(graph.nodes)
.enter().append("circle")
        .attr("r", 2)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

var label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(graph.nodes)
    .enter().append("text")
      .attr("class", "label")
      .text(function(d) { return d.title; });

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
       .attr("r", 16)
       .style("fill", "#efefef")
       .style("stroke", "#424242")
       .style("stroke-width", "1px")
       .attr("cx", function (d) { return d.x+5; })
       .attr("cy", function(d) { return d.y-3; });
  
  label
      .attr("x", function(d) { return d.x; })
          .attr("y", function (d) { return d.y; })
          .style("font-size", "10px").style("fill", "#333");
}
}




function dragstarted(d) {
if (!d3.event.active) simulation.alphaTarget(0.3).restart()
d.fx = d.x
d.fy = d.y
//  simulation.fix(d);
}

function dragged(d) {
d.fx = d3.event.x
d.fy = d3.event.y
//  simulation.fix(d, d3.event.x, d3.event.y);
}

function dragended(d) {
d.fx = d3.event.x
d.fy = d3.event.y
if (!d3.event.active) simulation.alphaTarget(0);
//simulation.unfix(d);
}


function test(selectedId){
  jQuery("#testssss").html("");

  let graph = {};
  graph.nodes = new Array();
  graph.links = new Array();
  let i = 0;
  let j = 0;

  for (var cxId of Object.keys(CX.getAllStandards('onlyValid'))){
    graph.nodes[i] = {"id": cxId, "group": 1, "title": cxId};

    for (var dependencyId of CX.getStandard(cxId).getDependencies().getStandards()){
      if(!CX.getStandard(dependencyId).isDeprecated()){
        graph.links[j] = {"source": cxId, "target": dependencyId, "value": 4};
        j++;
      }
    }
    i++;
  }

  console.log(graph);

  run(graph);
}