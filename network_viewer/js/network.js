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
            .attr("transform", "translate(0,0)");
    
    this.graph_force = d3.layout.force()
        .charge(-100)
        .linkDistance(100)
        .size([this.width-10, this.height-10]);
        
    this.cluster_force = d3.layout.force()
        .charge(-60)
        .linkDistance(400)
        .size([this.width-10, this.height-10]);
            
};


Network.prototype.build_network = function(graph) {
    // Builds a D3 network from graph data (in JSON form).
    var graph_force = this.graph_force;
    
    graph_force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
    
    var graph_link = this.svg.selectAll(".graph_link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "graph_link")
        .style("stroke_width", 10);         // Change width later
   
        
    var graph_node = this.svg.selectAll(".graph_node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "graph_node")
        .attr("r", 10)
        .attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;})
        .style("fill", "#000")
        .call(graph_force.drag);    
    
    
    graph_force.on("tick", function () {
        
        graph_node   
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
            
        graph_link 
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        
    });
    
    this.graph_force = graph_force;
    this.graph_link = graph_link;
    this.graph_node = graph_node;
};

Network.prototype.build_cluster = function(cluster) {
    
    var cluster_force = this.cluster_force
    
    cluster_force.nodes(cluster.nodes)
        .links(cluster.links)
        .start();

    var cluster_link = this.svg
        .selectAll(".cluster_link")
        .data(cluster.links)
        .enter().append("path")
        .attr("class", "cluster_link");         
    
        
    var cluster_node = this.svg.selectAll(".cluster_node")
        .data(cluster.nodes)
        .enter().append("circle")
        .attr("class", "cluster_node")
        .attr("r", function (d) {
            return d.value*300;
        })
        .style("fill", "#000")
        .call(cluster_force.drag);

    var cluster_foci = {0:{},1:{}, 2:{}, 3:{}, 4:{}, 5:{}};
    
    
    cluster_force.on("tick", function () {
        cluster_link 
        .attr("d", function (d) {
            d['source']["radius"] = d.ssize*300;
            d['target']["radius"] = d.tsize*300;
            // Chord function is a custom made chord similar to D3's chord
            // (Only without the necessity of Arc's)
            return chord(d);
        })
        
        cluster_node   
            .attr("cx", function(d) { 
                cluster_foci[d.index]["x"] = d.x;
                return d.x; })
            .attr("cy", function(d) { 
                cluster_foci[d.index]["y"] = d.y;
                return d.y; });
    });
    
    this.cluster_force = cluster_force;
    this.cluster_link = cluster_link;
    this.cluster_node = cluster_node;
    this.cluster_foci = cluster_foci;
};


Network.prototype.cluster_network = function(membership, graph, cluster){
    // Builds a D3 network from graph data (in JSON form).
    
    var cluster_foci = {};
    
    for (var key in membership) {
        if (!(membership[key] in cluster_foci)) {
            cluster_foci[membership[key]] = {"value":0}
        }
        cluster_foci[membership[key]]["value"] += 1;
    }

    var cluster_force = this.cluster_force;
    
    cluster_force
        .nodes(cluster.nodes)
        .links(cluster.links)
        .start()
        
        
    var graph_force = this.graph_force;

    graph_force
        .nodes(graph.nodes)

        
    var cluster_link = this.svg
        .selectAll(".cluster_link")
        .data(cluster.links)
        .enter().append("path")
        .attr("class", "cluster_link");         


    var cluster_node = this.svg.selectAll(".cluster_node")
        .data(cluster.nodes)
        .enter().append("circle")
        .attr("class", "cluster_node")
        .attr("r", function (d) { 
            var total_area = 2 * cluster_foci[d.index]["value"] * 10 * 10;
            var radius = Math.sqrt(total_area);
            return radius;})
        .call(cluster_force.drag);    


    var graph_node = this.svg.selectAll(".graph_node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "graph_node")
        .attr("r", 10)
        .attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;})
        .style("fill", "#000")
        .call(graph_force.drag);
    
    
    function graph_tick(e) {

      // Push different nodes in different directions for clustering.
      var k = 1.3 * e.alpha;
      
      graph.nodes.forEach(function(o, i) {
        var member = membership[i]
        o.y += (cluster_foci[member].y - o.y)*k;
        o.x += (cluster_foci[member].x - o.x)*k;
      });
    
      graph_node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
      
    };

    
    cluster_force.on("tick", function (d) {
        
        cluster_link 
            .attr("d", function (d) {
                d['source']["radius"] = (Math.pow(d.ssize,3)*300);
                d['target']["radius"] = (Math.pow(d.tsize,3)*300);
                // Chord function is a custom made chord similar to D3's chord
                // (Only without the necessity of Arc's)
                return chord(d);
            })
        
        cluster_node   
            .attr("cx", function(d) { 
                cluster_foci[d.index]["x"] = d.x;
                return d.x; })
                
            .attr("cy", function(d) { 
                cluster_foci[d.index]["y"] = d.y;
                return d.y; });
        
        graph_force
            .on("tick", graph_tick)
            .start();
    });
    
    
    this.graph_node = graph_node;
    
    this.cluster_link = cluster_link;
    this.cluster_node = cluster_node;
    this.cluster_foci = cluster_foci;
    
    this.graph_force = graph_force;
    this.cluster_force = cluster.force;
    
};