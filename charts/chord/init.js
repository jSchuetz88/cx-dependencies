d3.json("./charts/chord/data.json").then(function(dataset) {
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
  
    // refenced standards
    jQuery("#cx-id-view").text(selectedCXId);
    jQuery("#cx-id-references").html("<p style='font-weight: bold;'>Standard mentions the following documents:</p><ul></ul>");
  
    // console.log(master_data[''+selectedCXId+''][0]);
    for (var cx of master_data[''+selectedCXId+''][0]){
      jQuery("#cx-id-references ul").append("<li data-cx='"+cx+"'>"+cx+"</li>");
    }
    jQuery("li[data-cx='CX-0004']").css("color", "red").append(" <b>Reference outdated!!!</b>");
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