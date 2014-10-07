var main = function () {
    // Main function for the tree viewer
    $('#app_container').append('<div>').attr('id', 'tree_viewer');
    
    this.selector = $('#tree_viewer');
    this.data = null;
    
    this.newick_parser = Newick;
    this.loader = new LoaderWidget(this.selector[0]);
    this.tree_viewer = new TreeViewer(this.selector[0], this.data);
    this.options = new Options(this.selector[0], this.tree_viewer);
        
    $(this.loader.load_button).on("click", this, function ( event ) {
        var that = event.data
        that.data = that.loader.on_click(that.loader)
        that.tree_viewer.data = that.data;
     });
};

$(document).ready(main);
