var main = function () {
    //
    $('#app_container').append('<div>').attr('id', 'tree_viewer');
    
    this.selector = $('#tree_viewer');
    this.data = null;
    
    this.newick_parser = Newick;
    this.loader = new LoaderWidget(this.selector[0]);
    this.treeviewer = new TreeViewer(this.selector[0]);
    this.options = new Options(this.selector[0], this.treeviewer, this.data);
    
    //this.modal = new Modal("options");
    
    $(this.loader.load_button).on("click", this, function ( event ) {
        var that = event.data
        that.data = that.loader.on_click(that.loader)
        that.options.data = that.data
     });
     // Custom options modal
     //this.selector.append(this.modal.modal_window);
     //this.modal.dropdown("test", "Press me!",["test1","test2","test3"])
     
     //this.modal_toggle = this.modal.toggle_button;
     //this.selector.append(this.modal_toggle);
     
};

$(document).ready(main);
