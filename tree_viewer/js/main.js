var main = function () {
    //
    $('#app_container').append('<div>').attr('id', 'tree_viewer');
    
    this.selector = $('#tree_viewer');
    this.data = null;
    
    this.newick_parser = Newick;
    this.loader = new LoaderWidget(this.selector[0]);
    this.treeviewer = new TreeViewer(this.selector[0]);
    
    
    $(this.loader.load_button).on("click", this, function ( event ) {
        var that = event.data
        that.data = that.loader.on_click(that.loader)
        that.treeviewer.update_tree(that.data)
     });
};

$(document).ready(main);
