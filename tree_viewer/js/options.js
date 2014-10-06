var Options = function(selector, tree_viewer, data) {
    
    // List of options
    this.data = data
    this.tree_viewer = tree_viewer;
    this.id = "#options"
    this.render = "Dynamic";
    this.rooted = true;
    this.clades = true;
    this.tree_viewer = tree_viewer
    
    // Create modal
    this.modal = new Modal("options");
    $(selector).append(this.modal.window);
    $(selector).append(this.modal.toggle_button);
    
    
    $("#options_title").text("Tree Viewer Options")
    $("#options_toggle").text("Custom Rendering")
    
    this.modal.items = [];
    
    // Add rendering option
    //this.modal.item[0] = "render"
    this.modal.dropdown("options", "Render Type",["Dynamic","Static"])
    
    var that = this;
    
    $("#options_dropdown").on("hidden.bs.dropdown", function(){
        that.val = event.target.text;
     });
    
     $("#options_apply").on("click", function(){
         if (that.val == "Dynamic") {
             that.tree_viewer.dynamic_tree(that.data);
         } else {
             that.tree_viewer.static_tree(that.data);
         }
     });
};

Options.prototype.render = function(option){
    
    
}