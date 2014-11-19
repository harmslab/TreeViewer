// Copyright (c) Harms Lab
// University of Oregon
// Tree Map Class
// Authors: Zach Sailer

var TreeMap = function (tree_viewer) { 
    this.scale = .3;
    this.zoom_behavior = null;
    
    this.tree_viewer = tree_viewer
    //this.height = this.tree_viewer.height;
    //this.width = this.tree_viewer.width;
    this.map_window("#tree_viewer");
    this.generate_map();
    
};

TreeMap.prototype.map_window = function(parent){
    /*
    Generate tree window as panel that hovers above webpage
    */
    var map_panel = $("<div></div>")
        .addClass("panel panel-default")
        .attr("id", "map_window")
        .css("position", "absolute")
        .css("top", "50px")
        .css("right", "50px")
        .draggable();
    
    $(parent).append(map_panel);
    this.map_panel = map_panel;
};

TreeMap.prototype.clone_tree = function(){
    /*
    Create a clone of tree svg
    */
    
    // Determine size of the map window from scale value of tree_viewer
    var scale = this.scale;
    var width = this.tree_viewer.width;
    var height = this.tree_viewer.height;
    var ratio = width/height;
    var diagonal = Math.sqrt(Math.pow(height,2) + Math.pow(width,2));
    var H = Math.sqrt(Math.pow(this.scale*diagonal,2)/(1+Math.pow(ratio,2)));
    var W = H*ratio;
    this.height = H;
    this.width = W;

    this.map_svg = $("#tree_svg").clone()
        .attr("id", "tree_svg_clone")   
        .attr("height", this.height)
        .attr("width", this.width);
            
    this.map_svg.children().children()
        .attr("id", "map_of_tree")
        .attr("transform", "scale("+scale.toString()+")");
    
    this.map_body = $("<div></div>")
        .addClass("panel-body")
        .addClass("map-panel")
        .width((W+20).toString()+"px")
        .height((H+20).toString()+"px")
        .append(this.map_svg)
        
    this.map_header = $("<div></div>")
        .addClass("panel-heading text-center")
        .addClass("map-panel")
        .append($("<h4>TreeViewer Map</h4>"))
            
    this.map_panel.append(this.map_header,this.map_body);

};

TreeMap.prototype.create_zoom_box = function() {
    /*
    Creates box indicating the portion of the tree being viewed.
    */
    var box_scale = this.scale;
    var zoom_behavior = this.tree_viewer.zoom;
    
    var zoom_box = d3.select("#tree_svg_clone")
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
    
    this.zoom_box = zoom_box;
    this.zoom_behavior = zoom_behavior;
};

TreeMap.prototype.generate_map = function() {
    /*
    Update map to any changes in the trees force representation
    */ 
    var that = this;
    that.clone_tree();
    that.create_zoom_box()
    that.click_map();
    
    this.tree_viewer.force.on("start", restart_map);
    this.tree_viewer.force.on("end", restart_map);
    
    // Update map of any chances to the tree.
    function restart_map() {
        $("#map_window").empty();
        that.clone_tree();
        that.create_zoom_box();
        that.click_map();
    };
};

TreeMap.prototype.click_map = function() {
    /*
    Moves current view of tree to spot clicked on map
    */
    var that = this;
    var d3_svg = d3.select("#tree_svg_clone")
        .on("click", move_window);
        
    function move_window() {
        var coordinates = d3.mouse(this);
        var scale = that.tree_viewer.zoom_scale;
        // Translate the maps zoom window to correct location
        var x = coordinates[0]-(that.width/2)/scale;
        var y = coordinates[1]-(that.height/2)/scale
        that.zoom_box.transition().duration(700)
            .attr("transform","translate(" + [x,y] + ") scale(" + 1/scale + ")");
        
        // Translate tree to correct position
        var x = (-1*coordinates[0]/that.scale)*scale+that.tree_viewer.width/2;
        var y = (-1*coordinates[1]/that.scale)*scale+that.tree_viewer.height/2;
        var translate = [x,y];
        that.tree_viewer.zoom_window.transition().duration(700)
            .attr("transform", "translate(" + translate + ") scale(" + scale + ")");
        that.tree_viewer.zoom.scale(scale);
        that.tree_viewer.zoom.translate(translate);
        
    };
    this.tree_viewer = that.tree_viewer;
};