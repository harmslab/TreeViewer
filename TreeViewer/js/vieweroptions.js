/* 
    Copyright (c) Harms Lab
    University of Oregon
    TreeViewer Interactive Edition
    Authors:    Zach Sailer

    ViewerOptions class builds a modal for the TreeViewer that handles
    all user customization options. Anythings that deals with changing the
    representation of the tree is held here.
*/

var ViewerOptions = function(viewerapp) {
    // Initialize object
    this.viewerapp = viewerapp;
    this.selector = this.viewerapp.selector;
    this.selector_id = $(this.selector).attr("id")
    this.element_id = "viewer_options";
    this.tree_viewer = this.viewerapp.tree_viewer;
    this.options_button = null;
    
    // Build modal for tree customization
    this.modal = new Modal(this.element_id);
    this.modal.add_modal_title("TreeViewer Customization");
    this.modal.append_to_element("#"+this.selector_id)
    this.apply_button = this.modal.add_footer_button("Apply");
    
    // Add loader widget to the options modal
    this.loader = new LoaderWidget();
    this.modal.add_element(this.loader.loader_window);
    
    // Add Representation Option
    this.render_type = null;
    this.render_id = "representation"
    this.render_button = this.modal.dropdown_menu(this.render_id, 
        "Rendering Type", ["Dynamic", "Static"]);
    
    // Grab and apply options when 'Apply' button is clicked.
    var that = this;
    var grab_settings = this.grab_settings;
    this.apply_button.click(that, grab_settings);
};

ViewerOptions.prototype.grab_settings = function(vieweroptions) { 
    /**
    * Grab settings from all elements on options modal.
    **/
    
    // Grab the data from loader widget
    var that = vieweroptions.data;
    var tree_viewer = that.tree_viewer;
    that.tree_viewer.data = that.loader.data;
    
    // Grab tree representation type
    that.render_type = that.render_button.val()
    that.render_as(that.render_type);
};

ViewerOptions.prototype.toggle_button = function() {
    /**
    * Add a button to webpage for toggling the options modal.
    **/
    
    this.options_button = this.modal.create_modal_toggle()
    
    var gear_icon = $("<span></span>")
        .addClass("glyphicon glyphicon-cog");
    
    this.options_button
        .css("float", "right")
        .append(gear_icon);
    
    return this.options_button;
};


ViewerOptions.prototype.render_as = function(value) {
    // Represent the tree dynamically or statically
    if (value == "Dynamic") {
        this.tree_viewer.dynamic_tree(this.tree_viewer.data);
    } else {
        this.tree_viewer.static_tree(this.tree_viewer.data);
    }
    
};