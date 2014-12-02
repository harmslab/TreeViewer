// Loads data from newick file

var LoaderWidget = function() {
    
    var that = this;
    this.newick = Newick;
    this.width = parseInt($(this.selector).css("width"));
    
    this.data_form = $("<textarea></textarea>")
        .addClass("form-control")
        .attr("id", "loader-data")
        .attr("rows", 4)
    
    this.load_button = $("<button></button>")
        .addClass("btn btn-primary")
        .attr("id", "load-button")
        .css("float", "left")
        .text("Load")
    
    this.loader_body = $("<div></div>")
        .addClass("panel-body")
        .attr("id", "loader-body")
        .append(this.data_form)
        .append(this.load_button);
        
    // Build widget window
    this.loader_window = $("<div></div>")
        .addClass("panel panel-default")
        .attr("id", "loader-widget")
        .attr('width', this.width)
        .append("<div class='panel-heading'>")
        .append(this.loader_body)
        .draggable();    
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
    // example newick for testing
    if (!text) {
        text = "(PITX1_Anole:0.24185,(((PITX2_Anole:0.06605,((PITX2_Human:0.0284,(PITX2_Chicken:0.0306,PITX2_Turtle:0.0306):0.0284):0.0421,(PITX2_Turkey:0.035,PITX2_Duck:0.035):0.0421):0.06605):0.0834,(PITX1_Turtle:0.0911,(PITX1_Chicken:0.0933,PITX1_Human:0.0933):0.0911):0.0834):0.1002,(PITX1_Duck:0.12535,PITX1_Turkey:0.12535):0.1002):0.24185)";
        $("#loader-data").attr("placeholder", text);
    }
    return that.toJSON(text);
};

