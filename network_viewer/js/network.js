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
    .linkDistance(300)
    .size([this.width-10, this.height-10]);
            
};


Network.prototype.build_network = function(graph) {
    // Builds a D3 network from graph data (in JSON form).
    
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
        .style("fill", "#000")
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

Network.prototype.build_cluster = function(graph) {
    
    this.force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();
    
    
    
    var chord = function (d, i) {
        
        var angle = Math.atan((d.target.py-d.source.py)/(d.target.px-d.source.px));
       
        var s = subgroup(d.source, angle),
            t = subgroup(d.target, angle);
            
            if (s.r >= t.r) {
                var mid = s.mid;
            } else {
                var mid = t.mid;
            };
        
            return "M" + s.p0
            + curve(mid, s.center, t.center, s.p0, t.p0)
            + arc(-angle, t.r, t.p1)
            + curve(mid, t.center, s.center, t.p1, s.p1)
            + arc(angle, s.r, s.p0) 
            + "Z";
    };
    
    var subgroup = function (f, angle) {

        return {
          r: f.radius,
          center: [f.px, f.py],
          mid: [(f.radius/2)*Math.cos(angle - Math.PI/2), (f.radius/2)*Math.sin(angle - Math.PI/2)],
          p0: [f.px + f.radius*Math.cos(angle - Math.PI/2), f.py + f.radius*Math.sin(angle - Math.PI/2)],
          p1: [f.px + f.radius*Math.cos(angle + Math.PI/2), f.py + f.radius*Math.sin(angle + Math.PI/2)]
        };
    };
    
    var arc = function (a, r, p) {
        return "A" + r + "," + r + " " + a + " 0,1 " + p;
    };

    var curve = function(mid, center0, center1, p0, p1) {
        var mid = [center0[0] + (center1[0] - center0[0])/2,
                    center0[1] + (center1[1] - center0[1])/2];
        return "Q " + mid + " " + p1;
    };
    
    
    var link = this.svg
        .selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .style("fill", "#111");         // Change width later
    
    var node = this.svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .style("fill", "#000")
        .call(this.force.drag);
    
        
    this.force.on("tick", function () {
        link 
        .attr("d", function (d) {
            d['source']["radius"] = 5
            d['target']["radius"] = 10
            return chord(d);
        })
        
        node   
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
    
    this.link = link;
    this.node = node;
};
