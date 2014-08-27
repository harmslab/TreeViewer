// Copyright (c) Harms Lab
// University of Oregon

data = {"name": "Level 1",
             "children": [
              {
               "name": "Level 2",
               "children": [
                {
                 "name": "Level 3,a",
                 "children": [
                  {"name": "Level 4,a", "size": 3938},
                  {"name": "Level 4,b", "size": 3812},
                  {"name": "Level 4,c", "size": 743}
                 ]
                },
                {
                 "name": "Level 3,b",
                 "children": [
                  {"name": "Level 4,d", "size": 3534},
                  {"name": "Level 4,e", "size": 5731}
                 ]
                }
               ]
              }
             ]
            };
            
data2 = {"name": "Level 1",
             "children": [
              {
               "name": "Level 2",
               "children": [
                {
                 "name": "Level 3,a"
                },
                {
                 "name": "Level 3,b",
                 "children": [
                  {
                   "name": "Level 4,d", "size": 3534,
                   "children": [
                    {"name": "Level 4,a", "size": 3938},
                    {"name": "Level 4,b", "size": 3812},
                    {"name": "Level 4,c", "size": 743}
                   ]
                  },
                  {"name": "Level 4,e", "size": 5731}
                 ]
                }
               ]
              }
             ]
            };

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
        console.log("no data")
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


TreeViewer.prototype.init_tree = function(root) {
    // Initializes a d3 tree. 
    this.nodes = this.cluster.nodes(root),
    this.links = this.cluster.links(this.nodes);


    this.link = this.svg.selectAll(".link")
                    .data(this.links)
                    .enter().append("path")
                        .attr("class", "link")
                        .attr("d", this.diagonal);


    this.node = this.svg.selectAll(".node")
                    .data(this.nodes)
                    .enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    //this.node.append("circle")
      //  .attr("r", 4.5);

    this.node.append("text")
                .attr("dx", function(d) { return d.children ? -8 : 8; })
                .attr("dy", 3)
                .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                .text(function(d) { return d.name; });
};


TreeViewer.prototype.update_tree = function(root) {
  
  
    this.nodes = this.cluster.nodes(root),
    this.links = this.cluster.links(this.nodes);
      
    this.link2 = this.svg.selectAll(".link")
                .data(this.links1, function(d) { return d; });
                
    this.node2 = this.svg.selectAll(".node")
                .data(this.nodes1, function(d) { return d; });
                    
    this.node.append("circle")
        .attr("r", 4.5);
        
    this.links_enter = this.link.enter()
                        .append("path")
                        .attr("class", "link")
                        .attr("d", this.diagonal);
                        
    this.nodes_enter = this.node.enter()
                            .append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    
    this.links_update = this.link.transition()
                            .duration(2000);
    this.nodes_update = this.node.transition()
                            .duration(2000);
    
    
    this.links_exit = this.link.exit().transition()
                        .duration(2000).remove();
                        
    this.links_exit = this.node.exit().transition()
                        .duration(2000).remove();
    /*
    this.link.enter()
        .append("path")
            .attr("class", "link")
            .attr("d", this.diagonal)
            .transition().duration(2000);

    this.node.enter()
        .append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .transition().duration(750);
                    
            
    this.node.append("circle")
      .transition().duration(750)
      .attr("r", 9);

    this.node.append("text")
      .attr("dx", function(d) { return d.children ? -8 : 8; })
      .attr("dy", 3)
      .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
      .text(function(d) { return d.name; });
      
    this.link.exit().transition();
    this.node.exit().transition();
      
      //node.exit();
      //link.exit();
    */
};

var tree_viewer = new TreeViewer(".zach", null);


tree_viewer.init_tree(data);
tree_viewer.update_tree(data2);