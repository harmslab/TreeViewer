// Copyright (c) Harms Lab
// University of Oregon
// Tree Map Class
// Authors: Zach Sailer

var TreeMap = function (tree_viewer) { 
    this.scale = .3;
    this.zoom_behavior = null;
    
    this.tree_viewer = tree_viewer
    this.height = this.tree_viewer.height;
    this.width = this.tree_viewer.width;
    this.map_window("#tree_viewer");
    this.generate_map();
    
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
        .css("position", "absolute")
        .css("top", "50px")
        .css("right", "50px")
        .width((W+20).toString()+"px")
        .height((H+20).toString()+"px")
        .draggable();
    
    $(parent).append(map_panel);
    this.map_panel = map_panel;
    this.height = H;
    this.width = W;
};

TreeMap.prototype.clone_tree = function(){

    var scale = this.scale;
    
    this.map_svg = $("#tree_svg").clone()
        .attr("id", "clone")   
        .attr("height", this.height)
        .attr("width", this.width);
            
    this.map_svg.children().children()
        .attr("id", "map_of_tree")
        .attr("transform", "scale("+scale.toString()+")");
    
    this.map_body = $("<div></div>")
        .addClass("panel-body")
        .append(this.map_svg)
    
    this.map_panel.append(this.map_body);

};

TreeMap.prototype.zoom_box = function() {
    
    var box_scale = this.scale;
    var zoom_behavior = this.tree_viewer.zoom;
    
    var zoom_box = d3.select("#clone")
        .append("g")
    
    var rectangle = zoom_box.append("rect")
        .attr("height", this.height)
        .attr("width", this.width)
        .attr("class", "zoom_box")
        .style("fill", "black")

    zoom_behavior.on("zoom.box", draw_box);
    
    this.tree_viewer.svg.call(zoom_behavior)
        
    function draw_box() {
        var scale = 1/d3.event.scale;
        var one = -box_scale*scale*d3.event.translate[0];
        var two = -box_scale*scale*d3.event.translate[1];
        zoom_box.attr("transform","translate(" + [one,two] + ") scale(" + scale + ")")
    };
    
    this.zoom_behavior = zoom_behavior;
};

TreeMap.prototype.generate_map = function() {
    
    var that = this;
    that.clone_tree();
    that.zoom_box()
    
    this.tree_viewer.force.on("start", restart_map);
    this.tree_viewer.force.on("end", restart_map);
    
    // Update map of any chances to the tree.
    function restart_map() {
        $("#map_window").empty();
        that.clone_tree();
        that.zoom_box();
    };
};