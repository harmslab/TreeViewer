/*

General network graph of nodes and edges.

*/

var Network = function (selector) {
    
    this.selector = selector;
    this.width = parseInt($(this.selector).css("width"));
    this.height = 700; 
    
    // Create an svg canvas for D3 plot
    this.svg = d3.select(this.selector).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
            .attr("transform", "translate(40,0)");
    
    this.force = d3.layout.force()
    .charge(-60)
    .linkDistance(100)
    .size([this.width-10, this.height-10]);
            
};


Network.prototype.build_network = function(graph) {
    // Builds a D3 network from graph data (in JSON form).
    //
    
    this.force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
        
    var link = this.svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke_width", 10);         // Change width later
        
    var node = this.svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", "#111")
        .call(this.force.drag);
    
    this.force.on("tick", function () {
        
        link 
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
            
        node   
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    this.link = link;
    this.node = node;
};