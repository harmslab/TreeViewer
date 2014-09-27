// Copyright (c) Harms Lab
// University of Oregon
// TreeViewer Interactive Edition
// Authors: Zach Sailer
//          Jaclyn Smith

var TreeViewer = function (selector) {
    // version 2 of the phylogenetic tree viewer - interactive
    // creates the basic structure for a viewer below load box
    var that = this;
    this.selector = selector;
    this.width = parseInt($(this.selector).css("width"));
    this.height = 700;
    this.charge = -300;
    this.link_distance = 60;
    this.gravity = .1

    this.cluster = d3.layout.cluster()
        .size([this.height, this.width-200]);

    this.force = d3.layout.force()
        .charge(this.charge)
        .linkDistance(this.link_distance)
        .gravity(this.gravity)
        .size([this.height, this.width-200]);

    // create SVG canvas for vizualization 
    this.svg = d3.select(this.selector).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
        .attr("transform", "translate(0,-150)");

}

TreeViewer.prototype.create_links = function(nodes) {
    // use D3 cluster links to create path links and give them unique IDs
    this.links = this.cluster.links(nodes);
    for (i = 0; i < this.links.length; i++) {
        this.links[i].id = this.links[i].source.name+", "+this.links[i].target.name;
    };
    return this.links
};

TreeViewer.prototype.init_tree = function(root) {
    
    // root contains data
    
    var nodes = this.cluster.nodes(root);
    var links = this.create_links(nodes);

    this.force
        .nodes(nodes)
        .links(links)
        .start();

    var link = this.svg.selectAll(".link")
        .data(this.force.links())
        .enter().append("path")
        .attr("class", function(d) { return "link " + d.type; });

    var node = this.svg.selectAll(".node")
        .data(this.force.nodes())
        .enter().append("circle")
        .attr("r", 6)
        .call(this.force.drag);

    var text = this.svg.append("g").selectAll("text")
        .data(this.force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) { 
          if (d.name.substring(0,5) == "split") {
          } else {
              return d.name;
          }
      });

    this.force.on("tick", function(){

        link.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
        });

        node.attr("transform", function(d){
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function(d){
            return "translate(" + d.x + "," + d.y + ")";
        });

    });

    this.nodes = nodes;
    this.links = links;
    this.link = link;
    this.node = node;
    this.text = text;

}

// unused functions to use

TreeViewer.prototype.create_clade = function(node) {
    // Build a polygon triangle that represents a clade
    var clade = new Object();
    
    clade.area = node.size;//node.size
    clade.x = 0;//node.x;
    clade.y = 0;//node.y;
    clade.width = 100;
    clade.height = clade.area/(clade.width);
    clade.v1 = String([clade.x,clade.y]);
    clade.v2 = String([clade.x+clade.width, clade.y + clade.height/2]);
    clade.v3 = String([clade.x+clade.width, clade.y - clade.height/2]);
    clade.points = clade.v1 + " " + clade.v2 + " " + clade.v3
    
    return clade;
};

TreeViewer.prototype.node_representation = function(node_selector) {
    // Node representations
    
    // Dots represent nodes
    node_selector.append("circle")
        .attr("r", 3.5);
    
    // If the node has a size associated with it, a clade will appear
    node_selector.append("polygon").attr("points", function(d) {
        if ('size' in d) {
            
            var area = d.size;//node.size
            var width = 50;
            var height = area/(width);
            var v1 = "0,0";
            var v2 = String([width, height/2]);
            var v3 = String([width, -height/2]);
            var points = v1 + " " + v2 + " " + v3;
            return points;
        } else {
            return "0,0 0,0 0,0";
        };
    });
};

