// Loads data from newick file

var LoaderWidget = function(selector, newick) {
    
    var that = this;
    this.selector = selector;
    this.newick = newick;
    this.width = parseInt($(this.selector).css("width"));
    
    // Build widget window
    this.loader_window = $("<div>").addClass("panel panel-default")
                            .attr("id", "loader-widget")
                            .attr('width', this.width)
                            .append("<div class='panel-heading'>")
                            .append("<div class='panel-body' id='loader-body'>");
    
    $(this.selector).append(this.loader_window);                               
    
    // Build the form
    $("#loader-body")
        .append(
                $("<textarea>").addClass("form-control")
                    .attr("id", "loader-data")
                    .attr("rows", 4)
        )
        .append(
                $("<button>").addClass("btn btn-primary")
                    .attr("id", "load-button")
                    .text("Load")
        );         
    
    this.load_button = "#load-button";
    this.load_form = "loader-data";
};

LoaderWidget.prototype.toJSON = function(newick) {
    // Convert newick string to JSON for loading into D3
    var tree = Newick.parse(newick);
    return tree;
    
};

LoaderWidget.prototype.on_click = function(loaderwidget) {
    // Handle click from loader widget
    var that = loaderwidget;
    var text = $("#loader-data").val();
    return that.toJSON(text);
};


//var loader = new LoaderWidget($(".main_feature"), this.Newick);