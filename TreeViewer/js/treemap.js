var TreeMap = function (tree_viewer) { 
    this.scale = .4;
    this.zoom_behavior = null;
    
    this.tree_viewer = tree_viewer
    this.height = this.tree_viewer.height;
    this.width = this.tree_viewer.width;
    this.generate_map();
    this.map_window("#tree_viewer");
    this.zoom_box()
    
};

TreeMap.prototype.map_window = function(parent){
    
    var width = this.tree_viewer.width;
    var height = this.tree_viewer.height;
    var ratio = width/height;
    var diagonal = Math.sqrt(Math.pow(height,2) + Math.pow(width,2));
    var H = Math.sqrt(Math.pow(this.scale*diagonal,2)/(1+Math.pow(ratio,2)));
    var W = H*ratio;
    
    var map_panel = $("<div></div>")
                    .addClass("panel panel-default")
                    .attr("id", "map_window")
                    .width((W+20).toString()+"px")
                    .height((H+20).toString()+"px")
                    .draggable();
    
    map_panel.append(this.map_body);
    $(parent).append(map_panel);
    this.map_panel = map_panel;
    this.height = H;
    this.width = W;
    this.map_svg.attr("height", H);
    this.map_svg.attr("width", W);
};

TreeMap.prototype.generate_map = function(){

    var scale = this.scale;
    
    var map_svg = $("#zachary").clone()
            .attr("id", "clone");
            
    map_svg.children().children()
            .attr("id", "map_of_tree")
            .attr("transform", "scale("+scale.toString()+")");
    
    var map_body = $("<div></div>")
            .addClass("panel-body")
            .append(map_svg)
    
    this.map_svg = map_svg;
    this.map_body = map_body;
};

TreeMap.prototype.zoom_box = function() {
    var zoom_behavior = this.tree_viewer.zoom;
    
    var zoom_box = d3.select("#clone")
        .append("g")
        .attr("id","zoom_box")
    
    var rectangle = zoom_box.append("rect")
            .attr("height", this.height)
            .attr("width", this.width)
            .attr("class", "zoom_box")
            .style("fill", "black")

    zoom_behavior.on("zoom.box", draw_box);
    
    this.tree_viewer.svg.call(zoom_behavior)
        
    function draw_box() {
        var scale = 1/d3.event.scale;
        var one = -.4*scale*d3.event.translate[0];
        var two = -.4*scale*d3.event.translate[1];
        zoom_box.attr("transform","translate(" + [one,two] + ") scale(" + scale + ")")
    };
    
    this.zoom_behavior = zoom_behavior;
};