// Loads data from newick file

LoaderWidget = function(selector){
    this.selector = selector
    
    // Build widget window
    this.loader_window = $("<div>").addClass("panel panel-default")
                                    .attr("id", "loader-widget")
                                    .append("<div class='panel-heading'>")
                                    .append("<div class='panel-body' id='loader-body'>");
    
    this.selector.append(this.loader_window);                               
    
    // Build the form
    $("#loader-body")
        .append(
                $("<textarea>").addClass("form-control")
                    .attr("id", "loader-data")
                    .attr("rows", 4)
        )
        .append(
                $("<button>").addClass("btn btn-primary").text("Load")
        ); 
            
    
};

LoaderWidget.prototype.toJSON = function(){
    
};


var loader = new LoaderWidget($(".main_feature"));