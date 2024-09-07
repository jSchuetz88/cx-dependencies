var current_cxId = null;

var controls_network = {
  setting_l2de : false,
  setting_ingoing : false,
  setting_outgoing : true,

  toggle_l2dep : function(element){
    this.setting_l2de = !this.setting_l2de;

    jQuery(element).toggleClass('active');
    if(current_cxId) test(current_cxId);
  },

  toggle_ingoing : function(element){
    this.setting_ingoing = !this.setting_ingoing;

    jQuery(element).toggleClass('active');
    if(current_cxId) test(current_cxId);
  },

  toggle_outgoing : function(element){
    this.setting_outgoing = !this.setting_outgoing;

    jQuery(element).toggleClass('active');
    if(current_cxId) test(current_cxId);
  }
};

function test(selectedId){
  current_cxId = selectedId
  jQuery('#testssss').html("");

  let links = new Array();
  let j = 0;

  // Load outgoing references, if selected
  if(controls_network.setting_outgoing){
    for (var dependencyId of CX.getStandard(selectedId).getDependencies().getStandards()){
      // Consider reference only if not deprecated
      if(!CX.getStandard(dependencyId).isDeprecated()){
        links[j] = {"source": selectedId, "target": dependencyId, "value": 1, "type" : "outgoing", sNode: "main", tNode: "outgoing"};

        // Load second level references only, if selected
        if(controls_network.setting_l2de){
          for (var dependencyIdL2 of CX.getStandard(dependencyId).getDependencies().getStandards()){
            j++;
            links[j] = {"source": dependencyId, "target": dependencyIdL2, "value": 2, "type" : "outgoing_l2", sNode: "outgoing_l2", tNode: "outgoing_l3"};
          }
        }
      }else{
        // mark deprecated references
        links[j] = {"source": selectedId, "target": dependencyId, "value": 1, "type" : "outgoing_deprecated", sNode: "main", tNode: "outgoing_deprecated"};
      }
      j++;
    }
  }

  // Load ingoing dependencies, if selected
  if(controls_network.setting_ingoing){
    for (var cxId of Object.keys(CX.getAllStandards('onlyValid'))){
      if(CX.getStandard(cxId).getDependencies().getStandards().includes(selectedId)){
        links[j] = {"source": cxId, "target": selectedId, "value": 2, "type" : "ingoing", sNode: "ingoing", tNode: "main"};

        j++;
      }
/*
      if(!CX.getStandard(dependencyId).isDeprecated()){
        j++;
      }
        */
    }
  }

  // load main node, if nothing is selected
  if(links.length < 1){
    links[j] = {"source": selectedId, "target": selectedId, "value": 1, "type" : "ghost", sNode: "main", tNode: "ghost"};
  }

  // console.log(links);

  var nodes = {};
  
  // Compute the distinct nodes from the links.
  links.forEach(function(link) {
    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, node: link.sNode});
    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, node: link.tNode});
  });
  
  var width = 640,
  height = 410;

var simulation = d3.forceSimulation(Object.values(nodes))
  .force("link", d3.forceLink(links).distance(82))
  .force("charge", d3.forceManyBody().strength(-240))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", tick);

var svg = d3.select("#testssss")
  .attr("width", width)
  .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
  .data(["main", "outgoing", "outgoing_l2", "outgoing_l3", "ingoing", "outgoing_deprecated"])
.enter().append("marker")
  .attr("id", function(d) { return d; })
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 20)
  .attr("refY", -1.5)
  .attr("markerWidth", 8)
  .attr("markerHeight", 8)
  .attr("orient", "auto")
.append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "black")
  .attr("stroke", "black");

var path = svg.append("g").selectAll("path")
  .data(links)
.enter().append("path")
  .attr("class", function(d) { return "link " + d.type; })
  .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
  .attr("stroke", "black");

var circle = svg.append("g").selectAll("circle")
  .data(Object.values(nodes))
.enter().append("circle")
  .attr("class", function(d) { return "" + d.node; })
  .attr("r", function(d) { return scaleCircle(d.node); })
  .attr("data-cxId", function(d) { return d.name; })
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

var text = svg.append("g").selectAll("text")
  .data(Object.values(nodes))
.enter().append("text")
.attr("class", function(d) { return "" + d.node; })
.attr("x",  function(d) { return positionLabelX(d.node); })
.attr("y", function(d) { return positionLabelY(d.node); })
  .text(function(d) { return d.name; });

function scaleCircle(node) {
  return node.indexOf('main') !== -1 ? 12 : 12;
}

function positionLabelY(node) {
  return node.indexOf('main') !== -1 ? 34 : 28;
}

function positionLabelX(node) {
  return node.indexOf('main') !== -1 ? -26 : -24;
}

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);

  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}