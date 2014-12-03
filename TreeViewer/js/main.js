/* 
    Copyright (c) Harms Lab
    University of Oregon
    TreeViewer Interactive Edition
    Authors:    Zach Sailer
                Jaclyn Smith

    The main object contains all elements/objects present in the webservice. 
*/

var main = function () {    
    // Launch ViewerApp
    this.viewer_app = new ViewerApp();
    this.viewer_options = new ViewerOptions(this.viewer_app);
    
    // Initial load of the page shows modal
    this.viewer_options.modal.show_modal();
    
    // Build header
    var toggle_button = $("<small></small>")
        .append(this.viewer_options.toggle_button());
    
    $(".header-bar").append(toggle_button)  
};

// Begin App
$(document).ready(main);
