// Copyright (c) Harms Lab
// University of Oregon

// Authors: Zach Sailer

var TreeViewer = function (selector, data) {
    
    var that = this;
    this.selector = selector
    this.data = data
    this.width = 400;
    this.height = 700;
    this.cluster = d3.layout.cluster()
                                .size([this.height, this.width-200]);
                                
    this.diagonal = d3.svg.diagonal()
        .projection(function(d) { 
            return [d.y, d.x]; });

    this.line = d3.svg.line()
    this.svg = d3.select(this.selector).append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g")
            .attr("transform", "translate(40,0)");
        

    if (data == null) {
    } else {
        this.data = data
    };
    
};


TreeViewer.prototype.clade = function() {
    // Build a clade
    var clade = new Object();
    
    clade.area = 5000;//node.size
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


TreeViewer.prototype.attach_clade = function(selector) {
    clade = this.clade();
    selector.append("polygon").attr("points", clade.points);
    
};


TreeViewer.prototype.create_links = function(nodes) {
    // use D3 cluster links to create path links and give them unique IDs
    this.links = this.cluster.links(nodes);
    for (i = 0; i < this.links.length; i++) {
        this.links[i].id = this.links[i].source.name+", "+this.links[i].target.name;
    };
    return this.links
};

TreeViewer.prototype.init_tree = function(root) {
    // Initializes a d3 tree. 
    this.nodes = this.cluster.nodes(root),
    this.links = this.create_links(this.nodes);
    
        
    this.link = this.svg.selectAll(".link")
                    .data(this.links, function(d) { return d.id; })
                    .enter().append("path")
                        .attr("class", "link")
                        .attr("d", this.diagonal);


    this.node = this.svg.selectAll(".node")
                    .data(this.nodes, function(d) { return d.name; })
                    .enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    this.node.append("circle")
        .attr("r", 4.5);

    this.node.append("text")
                .attr("dx", function(d) { return d.children ? -8 : 8; })
                .attr("dy", 3)
                .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                .text(function(d) { return d.name; });
};


TreeViewer.prototype.update_tree = function(root) {
  
    console.log(this.nodes)
    this.nodes = this.cluster.nodes(root),
    this.links = this.create_links(this.nodes);
      
    this.link = this.svg.selectAll(".link")
                .data(this.links, function(d) { return d.id; });
                
    this.node = this.svg.selectAll(".node")
                .data(this.nodes, function(d) { return d.name; });
        
        
    this.links_update = this.link.transition()
                            .duration(2000)
                            //.append("path")
                                .attr("class", "link")
                                .attr("d", this.diagonal);
                                
    this.nodes_update = this.node.transition()
                            .duration(2000)
                            //.append("g")
                                .attr("class", "node")
                                .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                               
    
    this.links_exit = this.link.exit().transition().remove();
                        //.duration(2000).remove();
                        
    this.links_exit = this.node.exit().transition().remove();
                        //.duration(2000).remove();


    this.links_enter = this.link.enter()
                        .append("path")
                        .attr("class", "link")
                        .attr("d", this.diagonal);


    this.nodes_enter = this.node.enter()
                            .append("g")
                            //.transition().duration(2000)
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
};

var tree_viewer = new TreeViewer(".zach", null);

var test = new Data();
tree_viewer.init_tree(test.data);
tree_viewer.update_tree(test.data2);
tree_viewer.update_tree(test.data3);