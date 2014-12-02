var ViewerOptions = function(selector, tree_viewer) {
    
    this.selector = selector
    this.selector_id = $(this.selector).attr("id")
    this.element_id = "viewer_options";
    
    this.modal = new Modal(this.element_id);
    this.modal.add_modal_title("Tree Viewer Options");
    
    this.modal.append_to_element("#"+this.selector_id)
    
    // Element for loading data
    this.loader = new LoaderWidget(this.element_id);
    
};

ViewerOptions.prototype.representation = function(value){
    // Represent the tree dynamically or statically
    if (value == "Dynamic") {
        this.tree_viewer.dynamic_tree(this.tree_viewer.data);
    } else {
        this.tree_viewer.static_tree(this.tree_viewer.data);
    }
    
};