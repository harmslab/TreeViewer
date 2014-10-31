var Options = function(selector, tree_viewer) {
    
    // List of options
    this.tree_viewer = tree_viewer;
    this.id = "#options"
    this.render = "Dynamic";
    this.rooted = true;
    this.clades = true;
    
    // Create modal
    this.modal = new Modal("options");
    $(selector).append(this.modal.window);
    $(selector).append(this.modal.toggle_button);
    
    // Name the modal window
    $("#options_title").text("Tree Viewer Options")
    // Name the modal button
    $("#options_toggle").text("Custom Rendering")
        
    // Add rendering option
    this.modal.dropdown("options", "Render Type",["Dynamic","Static"])
    
    var that = this;
    
    // Hold option value in modal window when changed
    $("#options_dropdown").on("hidden.bs.dropdown", function(){
        that.val = event.target.text;
    });
    
    $("#options_apply").on("click", function(){
        that.representation(that.val);
        console.log(that.tree_viewer.svg );  
    });
};

Options.prototype.representation = function(value){
    // Represent the tree dynamically or statically
    if (value == "Dynamic") {
        this.tree_viewer.dynamic_tree(this.tree_viewer.data);
    } else {
        this.tree_viewer.static_tree(this.tree_viewer.data);
    }
    
}