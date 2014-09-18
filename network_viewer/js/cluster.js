var Clustering = function(svg, membership, network, clusters) {
    
    this.svg = svg;
    this.charge = -60;
    this.link_distance = 400;
    this.width = this.svg.attr("width");
    this.height = this.svg.attr("height");
    this.clusters = clusters;
    this.network = network;
    this.system = network.system;
    this.cluster_scale = 300;
    this.membership = membership;
    this.transition_time = 2000;
    this.highlight = true;

    this.cluster_force = d3.layout.force()
        .charge(-60)
        .linkDistance(400)
        .size([this.width-10, this.height-10]);

    // Create cluster foci info
    this.cluster_foci = {};
    for (var key in membership) {
        if (!(membership[key] in this.cluster_foci)) {
            this.cluster_foci[membership[key]] = {"value":0}
        }
        this.cluster_foci[membership[key]]["value"] += 1;
    }
    
    // Attach nodes and links to cluster force
    this.cluster_force.nodes(clusters.nodes)
        .links(clusters.links).start();
    
    
        //Highlight cluster in network if mouse hovers node.
    if (this.highlight == true) {
        var that = this;
        that.un_highlight_cluster();
        $(".graph_node").mouseover(function(d){
            var node = $(this).attr("id");
            var cluster_number = that.membership[node]
            that.highlight_cluster(cluster_number);
        });
        $(".graph_node").mouseout(function(d){
            that.un_highlight_cluster();
        });
    };
    
};



Clustering.prototype.build_clusters = function() {
    
    var clusters = this.clusters;
    var cluster_force = this.cluster_force;
    var cluster_foci = this.cluster_foci;
    
    var cluster_link = this.svg.selectAll(".cluster_link")
        .data(clusters.links)
        .enter().insert("path", ".graph_node")
        .attr("class", "cluster_link")
        .attr("d", function (d) {
            d['source']["radius"] = d.ssize*Math.sqrt(2 * cluster_foci[d.source.name]["value"] * 10 * 10);
            d['target']["radius"] = d.tsize*Math.sqrt(2 * cluster_foci[d.target.name]["value"] * 10 * 10);
            // Chord function is a custom made chord similar to D3's chord
            // (Only without the necessity of Arc's)
            return chord(d);
        });         
    
    
    var cluster_node = this.svg.selectAll(".cluster_node")
        .data(clusters.nodes)
        .enter().insert("circle", ".graph_node")
        .attr("class", "cluster_node")
        .attr("r", function (d) {
            var total_area = 2 * cluster_foci[d.name]["value"] * 10 * 10;
            var radius = Math.sqrt(2 * cluster_foci[d.name]["value"] * 10 * 10);
            return radius;
        })
        .attr("cx", function(d) { 
            cluster_foci[d.index]["x"] = d.x;
            return d.x; })
        .attr("cy", function(d) { 
            cluster_foci[d.index]["y"] = d.y;
            return d.y; })
        .call(cluster_force.drag);    

    
    cluster_force.on("tick", function () {
        cluster_link 
        .attr("d", function (d) {
            d['source']["radius"] = d.ssize*Math.sqrt(2 * cluster_foci[d.source.name]["value"] * 10 * 10);
            d['target']["radius"] = d.tsize*Math.sqrt(2 * cluster_foci[d.target.name]["value"] * 10 * 10);
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


Clustering.prototype.cluster_network = function(){
    // Builds a D3 network from graph data (in JSON form)   
    
    this.build_clusters();
    this.cluster_force.stop();
    this.network.graph_force.links({}).start().stop();    
        
    var that = this;
    var system = this.system;
    var graph_force = this.network.graph_force;
    var graph_node = this.network.graph_node;
    var graph_link = this.network.graph_link;
    
    var clusters = this.clusters;
    var cluster_node = this.cluster_node;
    var cluster_link = this.cluster_link;
    var cluster_force = this.cluster_force;
    var cluster_foci = this.cluster_foci;
    var membership = this.membership;
    
    this.highlight_clusters();
    
    this.cluster_link
        .style("opacity", 0)
    
    
    graph_link
        .data({})
        .exit().transition()
        .delay(this.transition_time)
        .style("opacity", 0)
        .remove();
    
    graph_node
        .transition()
        .delay(this.transition_time)
        .duration(this.transition_time)
        .attr("cx", function(d){
            // Move node towards a random spot around cluster center
            var member = membership[d.index];
            return cluster_foci[member].x + Math.pow(-1,parseInt(10*Math.random())) * Math.random() * 50;
        })
        .attr("cy", function(d){
            // Move node towards a random spot around cluster center
            var member = membership[d.index];
            return cluster_foci[member].y + Math.pow(-1,parseInt(10*Math.random())) * Math.random() * 50;
        });
    
    cluster_link
        .transition()
        .delay(this.transition_time)
        .duration(this.transition_time)
        .style("opacity", .5);
            
        
    function graph_tick(e) {
        // Push different nodes in different directions for clustering.
        var k = .4 * e.alpha;

        system.nodes.forEach(function(o, i) {
            var member = membership[i]
                o.y += (cluster_foci[member].y - o.y)*k;
                o.x += (cluster_foci[member].x - o.x)*k;
        });

        graph_node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    };

    function attach_nodes() {
        
        cluster_force.on("tick", function (d) {
        
            cluster_link 
            .attr("d", function (d) {
                d['source']["radius"] = d.ssize*Math.sqrt(2 * cluster_foci[d.source.name]["value"] * 10 * 10);
                d['target']["radius"] = d.tsize*Math.sqrt(2 * cluster_foci[d.target.name]["value"] * 10 * 10);
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
        
        })
        .start();
    };
    
    // Wait for clusters to form before releasing
    setTimeout(attach_nodes,this.transition_time*2);
    
    this.graph_node = graph_node;
    this.graph_link = graph_link;
    
    this.cluster_link = cluster_link;
    this.cluster_node = cluster_node;
    this.cluster_foci = cluster_foci;
    
    this.graph_force = graph_force;
    this.cluster_force = cluster_force;
    
};


Clustering.prototype.highlight_cluster = function(cluster_number){
    
    var network = this.network;
    var system = this.system;
    var membership = this.membership;
    
    var graph_node = this.network.graph_node;
    var graph_link = this.network.graph_link;
    
    
    graph_link
        .style("stroke", function(d) {
            var member0 = membership[d.target.name];
            var member1 = membership[d.source.name]
            if (member0 == cluster_number && member1 == cluster_number) {
                return "#000";
            } else {
                return "#999";
            }
        })
        .style("opacity", function(d) {
            var member0 = membership[d.target.name];
            var member1 = membership[d.source.name]
            if (member0 == cluster_number && member1 == cluster_number) {
                return 1;
            } else {
                return .4;
            }
        })
        .style("stroke-width", function(d){         
            var member0 = membership[d.target.name];
            var member1 = membership[d.source.name]
            if (member0 == cluster_number && member1 == cluster_number) {
                return 4;
            } else {
                return 2;
            }
        })
    
    
    graph_node
        .style("fill", function(d) {
            var member = membership[d.name];
            if (member == cluster_number) {
                return "#ff0000";
            } else {
                return "#000";
            }
        })
        .style("opacity", function(d) {
            var member = membership[d.name];
            if (member == cluster_number) {
                return 1;
            } else {
                return .4;
            }
        })


    this.network.graph_link = graph_link;
    this.network.graph_node = graph_node;
};


Clustering.prototype.un_highlight_cluster = function(cluster_number){
    
    var network = this.network;
    var system = this.system;
    var membership = this.membership;
    
    var graph_node = this.network.graph_node;
    var graph_link = this.network.graph_link;
    
    
    graph_link
        .style("stroke", "#999")
        .style("opacity", .4)
        .style("stroke-width", 2);
    
    graph_node
        .style("fill", "#000")
        .style("opacity", .4);

    this.network.graph_link = graph_link;
    this.network.graph_node = graph_node;
};



Clustering.prototype.highlight_clusters = function(){
    
    var network = this.network;
    var system = this.system;
    var membership = this.membership;
    
    var graph_node = this.network.graph_node;
    var graph_link = this.network.graph_link;
    
    var colors = ["#ff0000", '#00ff00', '#0000ff', '#ffff00', '#ff6600', '#6600cc']
    
    graph_link
        .style("stroke-width", 1);
        
    graph_node
        .transition()
        .duration(this.transition_time)
        .style("fill", function(d) {
            var member = membership[d.name];
            return colors[member];
        })

    this.network.graph_link = graph_link;
    this.network.graph_node = graph_node;


};