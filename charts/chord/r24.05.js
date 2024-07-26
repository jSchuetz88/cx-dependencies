var master_data;

d3.json("./_data/R24.05.json").then(function(dataset) {
  master_data = dataset;
  // Dimensionen Generieren -> Zuordnung von Index zu Standard-Id.
  var dim_titles = [];
  for (var i of Object.keys(dataset)){
      dim_titles.push(i);
  }

  var dm = [];
  var x = 0;
  var z = 0;
  for (var i of Object.keys(dataset)){
      z = 0;
      dm[x] = [];

      console.log(i+" => "+ dataset[i][0]);
        for (var j of Object.keys(dataset)){
          if(dataset[i][0].includes(j)){
            console.log(x+" ; "+z+" => "+j);
            dm[x][z] = 1; // debug: output j
          }else{
            dm[x][z] = 0;
          }

          z++;
      }

      x++;
  }

  console.log(dm);

  test(dim_titles, dm);
});

function test(labels, matrix){
      // create the svg area
      var parentSelector = '#my_dataviz';
      var cssid = 'my_dataviz';
      var cssclass = 'my_dataviz';
      // var colors = ['#b3cb2c', '#FFA600'];
      var colors = ['#646363'];
      var getWidth = function () { return 958 };
      var getHeight = function () { return 968 };
      var svg = d3.select(parentSelector)
        .attr('class', cssclass)
        .attr('id', cssid);
      var outerRadius = Math.min(getWidth(), getHeight()) * 0.5 - 56;
      var innerRadius = outerRadius - 30;
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
        .attr('transform', 'translate(' + getWidth() / 2 + ',' + getHeight() / 2 + ')')
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
          .attr('dy', '0.35em')
          .attr("transform", function(d) {
              return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (innerRadius + 64) + ") "
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


        var outdated = ['CX-0004', 'CX-0085', 'CX-0086', 'CX-0072', 'CX-0073', 'CX-0087', 'CX-0056', 'CX-0057', 'CX-0058',
        'CX-0051', 'CX-0016', 'CX-0017', 'CX-0019', 'CX-0020', 'CX-0021', 'CX-0042', 'CX-0043', 'CX-0023', 'CX-0022', 'CX-0060', 
        'CX-0036', 'CX-0037', 'CX-0038', 'CX-0039', 'CX-0040', 'CX-0041', 'CX-0091', 'CX-0092', 'CX-0147', 'CX-0148', 'CX-0107', 'CX-0109',
        'CX-0111', 'CX-0033', 'CX-0035', 'CX-0088', 'CX-0057', 'CX-0090', 'CX-0089', 'CX-0026', 'CX-0028', 'CX-0134', 'CX-0063'];
    
      for (var i of outdated){
        jQuery("text[data-cx='"+i+"']").attr("stroke", "red").attr("fill", "red");
      }
  };

function hilight_selected(selected) {
  var selectedCXId = jQuery('.group-'+selected).text();

  dehilight();

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
  jQuery("#cx-id-view").text(selectedCXId);
  jQuery("#cx-id-references").html("<p style='font-weight: bold;'>Standard mentions the following documents:</p><ul class='ref_cx'></ul>");
  // console.log(master_data[''+selectedCXId+''][0]);
  for (var cx of master_data[''+selectedCXId+''][0]){
    jQuery("#cx-id-references ul.ref_cx").append("<li data-cx='"+cx+"'>"+cx+"</li>");
  }

  // hilight outdated standards
  jQuery("li[data-cx='CX-0004']").css("color", "red").append(" <b>Reference outdated since R24.03 (embodied by the TC4M)</b>");
  jQuery("li[data-cx='CX-0085']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0118 and CX-0122)</b>");
  jQuery("li[data-cx='CX-0086']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0118 and CX-0122)</b>");
  jQuery("li[data-cx='CX-0072']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0133 - Online Control and Simulation)</b>");
  jQuery("li[data-cx='CX-0073']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0133 - Online Control and Simulation)</b>");
  jQuery("li[data-cx='CX-0087']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0133 - Online Control and Simulation)</b>");
  jQuery("li[data-cx='CX-0056']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0059 - Use Case Behavioral Twin Endurance Predictor Service)</b>");
  jQuery("li[data-cx='CX-0057']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0059 - Use Case Behavioral Twin Endurance Predictor Service)</b>");
  jQuery("li[data-cx='CX-0058']").css("color", "red").append(" <b>Reference outdated since R24.03 (merged by CX-0059 - Use Case Behavioral Twin Endurance Predictor Service)</b>");

  jQuery("li[data-cx='CX-0051']").css("color", "red").append(" <b>Reference outdated!!!</b>");
  jQuery("li[data-cx='CX-0016']").css("color", "red").append(" <b>Reference outdated since R24.05 (merged by CX-0149 Verified Company identity)</b>");
  jQuery("li[data-cx='CX-0017']").css("color", "red").append(" <b>Reference outdated since R24.05 (merged by CX-0149 Verified Company identity)</b>");
  jQuery("li[data-cx='CX-0019']").css("color", "red").append(" <b>Reference outdated since R24.05 (merged by CX-0127 Industry Core Part Instance)</b>");
  jQuery("li[data-cx='CX-0020']").css("color", "red").append(" <b>Reference outdated since R24.05 (merged by CX-0127 Industry Core Part Instance)</b>");
  jQuery("li[data-cx='CX-0021']").css("color", "red").append(" <b>Reference outdated since R24.05 (merged by CX-0127 Industry Core Part Instance)</b>");
  jQuery("li[data-cx='CX-0042']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0126 Industry Core Part Type)</b>");
  jQuery("li[data-cx='CX-0043']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0126 Industry Core Part Type)</b>");
  jQuery("li[data-cx='CX-0023']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0022']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0060']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0036']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0037']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0038']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0039']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0040']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0041']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0091']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0092']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0147']").css("color", "red").append(" <b>Reference outdated since R24.05 Merged by CX-0125 Traceability Use Case()</b>");
  jQuery("li[data-cx='CX-0148']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0107']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0109']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0111']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged by CX-0125 Traceability Use Case)</b>");
  jQuery("li[data-cx='CX-0033']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0117 Use Case Circular Economy - Secondary Marketplace)</b>");
  jQuery("li[data-cx='CX-0035']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0117 Use Case Circular Economy - Secondary Marketplace)</b>");
  jQuery("li[data-cx='CX-0088']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0143 Use Case Circular Economy Digital Product Pass)</b>");
  jQuery("li[data-cx='CX-0057']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0143 Use Case Circular Economy Digital Product Pass)</b>");
  jQuery("li[data-cx='CX-0090']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0143 Use Case Circular Economy Digital Product Pass)</b>");
  jQuery("li[data-cx='CX-0089']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0143 Use Case Circular Economy Digital Product Pass)</b>");
  jQuery("li[data-cx='CX-0026']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0136 Use Case PCF)</b>");
  jQuery("li[data-cx='CX-0028']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0136 Use Case PCF)</b>");
  jQuery("li[data-cx='CX-0134']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0136 Use Case PCF)</b>");
  jQuery("li[data-cx='CX-0063']").css("color", "red").append(" <b>Reference outdated since R24.05 (Merged into CX-0136 Use Case PCF)</b>");


  // -> add semantic references
  // refenced standards
  jQuery("#cx-id-references").append("<p style='font-weight: bold;'>Semantic models mentioned:</p><ul class='ref_sem'></ul>");
  // console.log(master_data[''+selectedCXId+''][0]);
  for (var sem of master_data[''+selectedCXId+''][1]){
    jQuery("#cx-id-references ul.ref_sem").append("<li data-sem='"+sem+"'>"+sem+"</li>");
  }
  jQuery("#cx-id-references ul.ref_sem li:contains(bamm)").css("color", "red");
}

function hilight_focused(selected) {
  // alert(".group-"+selected);
  d3.select("#my_dataviz").selectAll("g.ribbons path")
      .classed("focused", false)
      
  d3.select("#my_dataviz").selectAll("g.ribbons path")
      .filter( d => d.source.index == selected)
      .classed("focused", true);
}

function dehilight() {
  d3.select("#my_dataviz").selectAll("g.ribbons path")
      .classed("selected", false)
      .classed("focused", false);

  d3.select("#my_dataviz").selectAll("g.groups text")
      .classed("selected", false)
      .classed("focused", false);
}