var Modal = function(id) {
    /**
    * Generic Modal for pop up menus.
    * Parameters:
    * ----------
    * id: string
    *   html element `id` to give the modal
    **/
    
    this.id = id;
    this.items = [];

    
    // Build Modal header
    this.close_button = $("<button></button>")
                .addClass("close")
                .attr("data-dismiss", "modal")
                .append(
                    $("<span>&times;</span>")
                        .attr("aria-hidden", "true"),
                    $("<span>Close</span>")
                        .addClass("sr-only")
                );
    this.title = $("<h3></h3>")
                .addClass("modal-title")
                .attr("id", this.id+"_title");
        
    this.header = $("<div></div>")
                .addClass("modal-header")
                .append(this.close_button, this.title);
                
    
    // Build modal body
    this.body = $("<div></div>")
                .addClass("modal-body")
                .attr("id",this.id+"_body");
    
    // Build modal footer
    this.footer = $("<div></div>")
                .addClass("modal-footer")
                .attr("id", this.id+"_footer");

    
    this.content = $("<div></div>")
                .addClass("modal-content")
                .attr("id", this.id+"_content")
                .append(this.header, this.body, this.footer);
                    
    this.dialog = $("<div></div>")
                .addClass("modal-dialog")
                .attr("id",this.id+"_dialog")
                .append(this.content);
                    
    // Build generic modal structure
    this.window = $("<div></div>")
                .addClass("modal fade")
                .attr("id", this.id+"_window")   
                .attr("role", "dialog")
                .attr("aria-hidden", "true")
                .append(this.dialog);
                
};

Modal.prototype.append_to_element = function(element){
    /**
    * Append modal to element
    **/
    $(element).append(this.window);
};

Modal.prototype.add_modal_title = function(title){
    /**
    * Add a title to the modal window
    **/
    this.title.text(title);
};

Modal.prototype.show_modal = function(){
    /**
    * Make modal unhidden
    **/
    this.window.modal("show");
};

Modal.prototype.hide_model = function(){
    /**
    * Hide the modal 
    **/
    this.window.modal("hide");
};

Modal.prototype.add_footer_button = function(text){
    /**
    * Add footer button for closing modal. Useful for applying
    * features included in modal
    **/
    var footer_button = $("<button>"+text+"</button>")
        .addClass("btn btn-default")
        .attr("data-dismiss","modal")
        .attr("id", this.id+"_" + text);
    
    this.footer.append(footer_button);
    
    return footer_button;
};

Modal.prototype.create_modal_toggle = function(text){
    /**
    * Initiates the modal window to appear
    *
    * Parameters:
    * ----------
    * text: str
    *   text that will appear on window
    **/
    this.modal_toggle_button = $("<button></button>")
                .addClass("btn btn-default btn-lg")
                .attr("data-toggle", "modal")
                .attr("data-target", "#"+this.id+"_window")
                .attr("id", this.id+"_toggle")
                .text(text);
                
    return this.modal_toggle_button;
};

Modal.prototype.add_to_grid = function(element){
    /**
    * Adds a dropdown menu to the modal
    *
    * Parameters:
    * ----------
    * id: str
    *   html element `id` for the dropdown
    * title: str
    *   text to display on dropdown button
    * option: array of strings
    *   text for each option in the dropdwon
    **/
    row = parseInt((this.items.length)/3);
    col = (this.items.length)%3;
    if (col == 0) {
        var new_row = $("<div></div>")
                    .addClass("row row-" + String(row))
                    .addClass("container-fluid")
                    .css("padding-bottom", "10px");
        $("#"+this.id+"_body").append(new_row);
    };
    
    element.addClass("col-md-4");
            
    $(".row-"+String(row)).append(element);
    this.items.push(element);
};

Modal.prototype.add_element = function(element){
    /**
    * Add element to modal
    **/
    $("#"+this.id+"_body").append(element);
};

Modal.prototype.add_dropdown_menu = function (id, title, options) {
    /**
    * Adds a dropdown menu to the modal
    *
    * Parameters:
    * ----------
    * id: str
    *   html element `id` for the dropdown
    * title: str
    *   text to display on dropdown button
    * option: array of strings
    *   text for each option in the dropdwon
    **/
    
    var button = $("<button>"+title+"</button>")
                .addClass("btn btn-default dropdown-toggle")
                .attr("type", "button")
                .attr("data-toggle","dropdown")
                .attr("id", id+"_button")
                .append($("<span>")
                    .addClass("caret")
                );
                
    
    var option_list = $("<ul></ul>")
                .addClass("dropdown-menu")
                .attr("role", "menu")
                .attr("aria-labelledby", id+"_button");
    
    var menu = $("<div></div>")
                .addClass("dropdown")
                .addClass("container")
                .attr("id", id+"_dropdown")
     
    for (i=0; i<options.length; i++) {
        var list_text = $("<a>"+options[i]+"</a>")
            .attr("id", options[i]+"")
            .attr("role","menuitem")
            .attr("tabindex", "-1");

        
        var list_item = $("<li></li>")
            .attr("role", "presentation")
            .append(list_text)            
            .click(options[i], function(event){
                button.val(event.data);
            });
        
        option_list.append(list_item);
    };
    
    
    menu.append(button, option_list);
           
    this.add_to_grid(menu);
    return button
};

Modal.prototype.add_toggle_button = function(id, text) {
    /**
    * Adds a toggle button to the modal, can be used as a switch
    *
    * Parameters:
    * ----------
    * id: str
    *   html element `id` for the dropdown
    * title: str
    *   text to display on toggle button
    **/
    var button = $("<button></button>")
                .addClass("btn btn-default")
                .attr("id", id)
                .attr("data-toggle", "button")
                .attr("type", "button")
                .text(text)
                .val("true")
    
    // Set button value to reflect toggle state
    button.click(button, function(event){
        var button = event.data;
        if (button.val() == "true"){
            button.val("false");
        } else
            button.val("true");
    });
    
    var button_container = $("<div></div>")
                .addClass("container")
                .append(button);
                
    this.add_to_grid(button_container);
    
    return button
};

Modal.prototype.add_sub_panel = function(id, title) {
    /**
    * Adds a subpanel to the modal
    *
    * Parameters:
    * ----------
    * id: str
    *   html element `id` for the subpanel
    * title: str
    *   text to display on header of the subpanel
    **/
                
    var panel_header = $("<div></div>")
                .addClass("panel-heading")
                .attr("id", id+"-header")
                .text(title);
                
    var panel_body = $("<div></div>")
                .addClass("panel-body")
                .attr("id", id+"-body");
                
    var panel = $("<div></div>")
                .addClass("panel panel-primary")
                .attr("id", id)
                .append(panel_header, panel_body);
                
    $("#"+this.id+"_body").append(panel);    
};

