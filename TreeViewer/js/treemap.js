var TreeMap = function (tree_viewer) { 
    this.scale = .4;
    
    this.tree_viewer = tree_viewer
    this.generate_map();
    this.map_window("#tree_viewer");
    
};

TreeMap.prototype.map_window = function(parent){
    
    var width = this.tree_viewer.width;
    var height = this.tree_viewer.height+50;
    var ratio = width/height;
    var diagonal = Math.sqrt(Math.pow(height,2) + Math.pow(width,2));
    var H = Math.sqrt(Math.pow(this.scale*diagonal,2)/(1+Math.pow(ratio,2)));
    var W = H*ratio;
    
    var map_panel = $("<div></div>")
                    .addClass("panel panel-default")
                    .attr("id", "map_window")
                    .width(W.toString()+"px")
                    .height((H+10).toString()+"px")
                    .draggable();
    
    map_panel.append(this.map_body);
    $(parent).append(map_panel);
    this.map_panel = map_panel;
};

TreeMap.prototype.generate_map = function(){

    var scale = this.scale;
    
    var map_svg = $("#zachary").clone().attr("id", "clone");
    
    map_svg.children().children()
            .attr("id", "map_of_tree")
            .attr("transform", "scale("+scale.toString()+")");
    
    var map_body = $("<div></div>")
            .addClass("panel-body")
            .append(map_svg)
    
    this.map_svg = map_svg;
    this.map_body = map_body;
};