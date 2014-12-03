/* 
    Copyright (c) Harms Lab
    University of Oregon
    TreeViewer Interactive Edition
    Authors:    Zach Sailer
                Jaclyn Smith

    ViewerApp class contains all features to the TreeViewer Application. 
    Any featured added to the user experience is first called in this object.
*/

var ViewerApp = function(){
    // Main function for the tree viewer
    $('#main_page').append($('<div>').attr('id', 'tree_viewer'));
    
    this.selector = $('#tree_viewer')[0];
    
    this.tree_viewer = new TreeViewer(this.selector);
    this.tree_map = new TreeMap(this.tree_viewer);
};