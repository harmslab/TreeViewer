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