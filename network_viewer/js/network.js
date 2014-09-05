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
    .charge(-1)
    .linkDistance(20)
    .size([this.width, this.height]);
            
};


Network.prototype.build_network = function(graph) {
    // Builds a D3 network from graph data (in JSON form).
    //
    
    this.force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
        
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke_width", 5); // Change width later
        
    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circles")
        attr("class", "link")
        .style("fill", "black");
        
        
};