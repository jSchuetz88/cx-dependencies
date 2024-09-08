

// Scale for the bubble size
d3.json("./_data/r24.08/test.json", function (error, hierarchicalData) {

    // Some constants controlling the graph appearance
const PADDING_BUBBLE = 15 // distance between edge end and bubble
const PADDING_LABEL = 30 // distance between edge end and engineer name
const BUBBLE_SIZE_MIN = 4
const BUBBLE_SIZE_MAX = 20

var diameter = 940,
    radius = diameter / 2,
    innerRadius = radius - 170; // between center and edge end

// The 'cluster' function takes 1 argument as input. It also has methods (??) like cluster.separation(), cluster.size() and cluster.nodeSize()
var cluster = d3.cluster()
    .size([360, innerRadius]);

var line = d3.radialLine()
    .curve(d3.curveBundle.beta(0.85))
    .radius(function (d) { return d.y; })
    .angle(function (d) { return d.x / 180 * Math.PI; });

var svg = d3.select("#my_dataviz")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

var link = svg.append("g").selectAll(".link"),
    label = svg.append("g").selectAll(".label"),
    bubble = svg.append("g").selectAll(".bubble");

// Add a scale for bubble size
var bubbleSizeScale = d3.scaleLinear()
    .domain([0, 100])
    .range([BUBBLE_SIZE_MIN, BUBBLE_SIZE_MAX]);

    // If wanna see your data
    // console.log(hierarchicalData)

    // Reformat the data
    var root = packageHierarchy(hierarchicalData)
        //debugger;
        .sum(function (d) { console.log(d); return d.size; });
    // console.log(root)

    // Build an object that gives feature of each leaves
    cluster(root);
    leaves = root.leaves()

    // Leaves is an array of Objects. 1 item = one leaf. Provides x and y for leaf position in the svg. Also gives details about its parent.
    link = link
        .data(packageImports(leaves))
        .enter().append("path")
        .each(function (d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class", "link")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "black")

    label = label
        .data(leaves)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", "0.31em")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + PADDING_LABEL) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
        .attr("text-anchor", function (d) { return d.x < 180 ? "start" : "end"; })
        .text(function (d) { return d.data.key; });

    bubble = bubble
        .data(leaves)
        .enter().append("circle")
        .attr("class", "bubble")
        .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + PADDING_BUBBLE) + ",0)" })
        .attr('r', d => bubbleSizeScale(d.value))
        .attr('stroke', 'black')
        .attr('fill', '#69a3b2')
        .style('opacity', .2)

})

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
    var map = {};

    function find(name, data) {
        var node = map[name], i;
        if (!node) {
            node = map[name] = data || { name: name, children: [] };
            if (name.length) {
                node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
            }
        }
        return node;
    }

    classes.forEach(function (d) {
        find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
    var map = {},
        imports = [];

    // Compute a map from name to node.
    nodes.forEach(function (d) {
        console.log(d);
        map[d.data.name] = d;
    });

    // For each import, construct a link from the source to target node.
    nodes.forEach(function (d) {
        if (d.data.imports) d.data.imports.forEach(function (i) {
            imports.push(map[d.data.name].path(map[i]));
        });
    });

    return imports;
}