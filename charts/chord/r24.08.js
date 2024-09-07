jQuery(document ).ready(function() {
  new dbLoader().init('./_data/db.json', function(stdset){
    CX.Standards.Manager.init(stdset);

    new dbLoader().init('./_data/r24.08/standards.json', function(depset){
      CX.Standards.Manager.addDependencies(depset);
    });		
  });
});

var groupToCategory = [];

CX.Standards.Manager.onReady(function(){

  // Dimensionen Generieren -> Zuordnung von Index zu Standard-Id.
  var dim_titles = [];
  var x = 0;

  for (var cxId of Object.keys(CX.getAllStandards('onlyValid'))){
      dim_titles.push(cxId);
      groupToCategory[x] = CX.getStandard(cxId).getCategory();
      x++;
  }

  var dm = [];
  var x = 0;
  var z = 0;
  for (var i of Object.keys(CX.getAllStandards('onlyValid'))){
      z = 0;
      dm[x] = [];

      for (var j of Object.keys(CX.getAllStandards('onlyValid'))){
          if(CX.getStandard(i).getDependencies().getStandards().includes(j)){
            // console.log(x+" ; "+z+" => "+j);
            dm[x][z] = 1; // debug: output j
          }else{
            dm[x][z] = 0;
          }
          z++;
      }
      x++;
  }

  genChord(dim_titles, dm);

});

function genChord(labels, matrix){
      // create the svg area
      var parentSelector = '#my_dataviz';
      var cssid = 'my_dataviz';
      var cssclass = 'my_dataviz';
      // var colors = ['#b3cb2c', '#FFA600'];
      var colors = ['#646363'];
      var getWidth = function () { return 962 };
      var getHeight = function () { return 962 };
      var svg = d3.select(parentSelector)
        .attr('class', cssclass)
        .attr('id', cssid);
      var outerRadius = Math.min(getWidth(), getHeight()) * 0.5 - 72;
      var innerRadius = outerRadius - 4;
      var colorsMap = d3.scaleOrdinal().range(colors);
      var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
      var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
      var ribbon = d3.ribbon()
        .radius(innerRadius)
      var g = svg.append('g')
        .attr('transform', 'translate(' + (getWidth() / 2) + ',' + (getHeight() / 2) + ')')
        .datum(chord(matrix))
      var groups = g.append('g')
        .attr('class', 'groups')
      var group = groups.selectAll('g')
        .data(function (chords) { return chords.groups })
        .enter()
        .append('g')
        .attr('class', 'group')

      var arcSvg = group.append('path')
        .attr("class", function(d, i) { return "arc group-" + d.index; })
        .attr('d', arc)
        .style('fill', function (d) { return colorsMap(d.index) })
        .style('stroke', function (d) { return colorsMap(d.index) });

      group.append('text')
          //  .attr("dy", "0.35em");
          .attr("dy", function(d) { return (d.startAngle > Math.PI ? ((matrix[d.index].reduce((a, b) => a + b, 0)+1)*(-1.25)) : (matrix[d.index].reduce((a, b) => a + b, 0))*(2.25))+"px"; })
          .attr("transform", function(d) {
              return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (innerRadius + 40) + ") "
                  + (d.startAngle > Math.PI ? "rotate(180)" : "");
              })
          .attr("class", function(d, i) { return "group-label group-" + d.index; })
          .attr('text-anchor', 'middle')
          // .attr("onmouseover", function(d, i) { return "hilight_focused("+d.index+");"; })
          .attr("onclick", function(d, i) { return "hilight_selected("+d.index+");"; })
          .attr("data-cx", function (d) { return labels[d.index]})
          .text(function (d) { return labels[d.index]});
      
      var ribbons = g.append('g')
        .attr('class', 'ribbons')
        .selectAll('path')
        .datum(chord(matrix))
        .data(function (d) { return d })
        .enter()
        .append('path')
        .attr('d', ribbon)
        .attr("class", function(d, i) { return "group-" + d.source.index; })
        .attr("data-cx-source", function (d) { return labels[d.source.index]})
        .attr("data-cx-target", function (d) { return labels[d.target.index]})
        .style('fill', function (d) { return colorsMap(d.target.index) })
        .style('stroke', function (d) { return colorsMap(d.target.index) });

  // ::::::
  // Compute the chord layout
  var chords = chord(matrix);

  // Calculate the start and end angles for each category
  var categoryAngles = {};
  chords.groups.forEach((d, i) => {
    var category = groupToCategory[d.index];
    if (!categoryAngles[category]) {
      categoryAngles[category] = {startAngle: d.startAngle, endAngle: d.endAngle};
    } else {
      categoryAngles[category].endAngle = d.endAngle;
    }
  });
  
  // Add the second level of outer arcs
  var secondArc = d3.arc()
      .innerRadius(outerRadius+4)
      .outerRadius(outerRadius+12);
  
  var categoryGroup = svg.append("g")
    .attr('transform', 'translate(' + (getWidth() / 2) + ',' + ((getHeight() / 2)) + ')')
    .selectAll("g")
    .data(Object.entries(categoryAngles))
    .enter().append("g");
  
  categoryGroup.append("path")
      .style("fill", "none")
      .style("stroke", "#FFA600")
      .attr('class', 'outerarc')

      .attr("d", d => secondArc(d[1]));

      categoryGroup.append('text')
          .attr('dy', '0.35em')
          .attr("transform", function(d) {
              return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (innerRadius + 64) + ") "
                  + (d.startAngle > Math.PI ? "rotate(180)" : "");
              })
          // .attr("onmouseover", function(d, i) { return "hilight_focused("+d.index+");"; })
          // .text(function (d) { return "AAA"});

  };

function hilight_selected(selected) {
  var selectedCXId = jQuery('.group-'+selected).text();
  test(selectedCXId);

  dehilight();
  window.location.href = "#"+selectedCXId;

  d3.select("#my_dataviz").selectAll("g.ribbons path[data-cx-target='"+selectedCXId+"']")
  .classed("focused", true)
  .raise();
  
  d3.select("#my_dataviz").selectAll("g.ribbons path[data-cx-source='"+selectedCXId+"']")
      .classed("selected", true)
      .raise();


  d3.select("#my_dataviz").selectAll("g.groups text.group-"+selected)
      .classed("selected", true);

  // -> add standard references
  // refenced standards
  jQuery("#cx-id-view").text(selectedCXId + " - "+CX.getStandard(selectedCXId).getName());
  jQuery("#cx-id-references").html("<p style='font-weight: bold;'>Standard mentions the following documents:</p><ul class='ref_cx'></ul>");
  // console.log(release_data[''+selectedCXId+''][0]);

  // List all references standards
  for (var cxId of CX.getStandard(selectedCXId).getDependencies().getStandards()){
    jQuery("#cx-id-references ul.ref_cx").append("<li data-cx='"+cxId+"'>"
        +cxId+" - "+CX.getStandard(cxId).getName()
        +(CX.getStandard(cxId).getURL() ? " (<a href=\""+CX.getStandard(cxId).getURL()+"\">open</a>)" : "")
    +"</li>");
  }

  // hilight all outdated standards
  for (var cxId of Object.keys(CX.getAllStandards())){
    if(CX.getStandard(cxId).isDeprecated()){
      jQuery("li[data-cx='"+cxId+"']").css("color", "red").append(" (Deprecated)");
    }
  }

  // List all referenced semantic models
  jQuery("#cx-id-references").append("<p style='font-weight: bold;'>Semantic models mentioned:</p><ul class='ref_sem'></ul>");
  // console.log(release_data[''+selectedCXId+''][0]);
  for (var sem of CX.getStandard(selectedCXId).getDependencies().getSemantics()){
    jQuery("#cx-id-references ul.ref_sem").append("<li data-sem='"+sem+"'>"+sem+"</li>");
  }
  jQuery("#cx-id-references ul.ref_sem li:contains(bamm)").css("color", "red");
}

function hilight_focused(selected) {


  d3.select("#my_dataviz").selectAll("g.ribbons path")
    .classed("focused", false)
    .classed("fade", true);
      
  d3.select("#my_dataviz").selectAll("g.ribbons path")
    .filter( d => d.source.index == selected)
    .classed("focused", true)
    .classed("fade", false);
}

function dehilight() {
  d3.select("#my_dataviz").selectAll("g.ribbons path")
    .classed("selected", false)
    .classed("focused", false);

  d3.select("#my_dataviz").selectAll("g.groups text")
    .classed("selected", false)
    .classed("focused", false);
}