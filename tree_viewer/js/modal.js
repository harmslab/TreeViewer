var Modal = function() {

    var modal_name = null;
    var modal_id = "test_modal";
    
    // Build Modal header
    var close_button = $("<button></button>")
                .addClass("close")
                .attr("data-dismiss", "modal")
                .append(
                    $("<span>&times;</span>")
                        .attr("aria-hidden", "true"),
                    $("<span>Close</span>")
                        .addClass("sr-only")
                ),
        modal_title = $("<h4>"+modal_name+"</h4>")
                .addClass("model-title");
        
    var modal_header = $("<div></div>")
                .addClass("modal-header")
                .append(close_button, modal_title);
                
    
    // Build modal body
    var modal_body = $("<div></div>")
                .addClass("modal-body");
    
    // Build modal footer
    var modal_footer = $("<div></div>")
                .addClass("modal-footer")
                .append(
                    $("<button>Apply</button>")
                        .addClass("btn btn-default")
                        .attr("data-dismiss","modal")
                );
    
    var modal_content = $("<div></div>")
                .addClass("modal-content")
                .append(modal_header, modal_body, modal_footer);
                
    var modal_dialog = $("<div></div>")
                .addClass("modal-dialog")
                .append(modal_content);
    
    // Build generic modal structure
    var modal_window = $("<div></div>")
                .addClass("modal fade")
                .attr("id", modal_id)   
                .attr("role", "dialog")
                .attr("aria-hidden", "true")
                .append(modal_dialog);
    
    this.modal_id = modal_name;    
    this.modal_window = modal_window;
                
};