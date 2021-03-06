/* 
    Copyright (c) Harms Lab
    University of Oregon
    TreeViewer Interactive Edition
    Authors:    Zach Sailer
                Jaclyn Smith
    
    LoaderWidget object builds a panel for loading Newick strings into JSON
    for rendering D3.

*/

var LoaderWidget = function() {
    
    this.newick = Newick;
    this.width = parseInt($(this.selector).css("width"));
    this.data;
    
    this.data_form = $("<textarea></textarea>")
        .addClass("form-control")
        .attr("id", "loader-data")
        .attr("rows", 4)
    
    this.load_button = $("<button></button>")
        .addClass("btn btn-primary")
        .attr("id", "load-button")
        .css("float", "left")
        .text("Load")
    
    this.loader_header = $("<div></div>")
        .addClass("panel-heading")
        .text("Load Newick data for rendering in TreeViewer:")
    
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
        .append(this.loader_header)
        .append(this.loader_body)
        .draggable();
    
    var that = this;
    this.load_button.click(that,that.grab_data);
        
};

LoaderWidget.prototype.toJSON = function(newick) {
    // Convert newick string to JSON for loading into D3
    this.data = Newick.parse(newick);
};

LoaderWidget.prototype.grab_data = function(loaderwidget) {
    // Handle click from loader widget
    var that = loaderwidget.data;
    var text = $("#loader-data").val();
    // example newick for testing
    if (!text) {
        text = "(PITX1_Anole:0.24185,(((PITX2_Anole:0.06605,((PITX2_Human:0.0284,(PITX2_Chicken:0.0306,PITX2_Turtle:0.0306):0.0284):0.0421,(PITX2_Turkey:0.035,PITX2_Duck:0.035):0.0421):0.06605):0.0834,(PITX1_Turtle:0.0911,(PITX1_Chicken:0.0933,PITX1_Human:0.0933):0.0911):0.0834):0.1002,(PITX1_Duck:0.12535,PITX1_Turkey:0.12535):0.1002):0.24185)";
        that.data_form.attr("placeholder", text);
    }
    that.toJSON(text);    
};

