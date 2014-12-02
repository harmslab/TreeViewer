var main = function () {
    // Launch ViewerApp
    this.viewer_app = new ViewerApp();
    
    this.viewer_app.viewer_options.modal.show_modal();
};

$(document).ready(main);
