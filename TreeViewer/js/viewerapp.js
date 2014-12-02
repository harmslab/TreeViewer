var ViewerApp = function(){
    // Main function for the tree viewer
    $('#main_page').append($('<div>').attr('id', 'tree_viewer'));
    
    this.selector = $('#tree_viewer')[0];
    this.data = null;
    
    this.tree_viewer = new TreeViewer(this.selector, this.data);
    this.tree_map = new TreeMap(this.tree_viewer);
    this.viewer_options = new ViewerOptions(this.selector, this.tree_viewer);

};