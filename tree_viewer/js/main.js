var main = function () {
    //
    $('#app_container').append('<div>').attr('id', 'tree_viewer');
    
    this.selector = $('#tree_viewer');
    this.data = null;
    
    this.newick_parser = Newick;
    this.loader = new LoaderWidget(this.selector[0]);
    this.treeviewer = new TreeViewer(this.selector[0]);
    this.modal = new Modal();
    
    
    $(this.loader.load_button).on("click", this, function ( event ) {
        var that = event.data
        that.data = that.loader.on_click(that.loader)
        //that.treeviewer.static_tree(that.data)
        that.treeviewer.dynamic_tree(that.data)
     });
     
     this.selector.append(this.modal.modal_window);
     
     this.selector.append($("<button class='btn btn-primary btn-lg' data-toggle='modal' data-target='#test_modal'>Launch demo modal</button>"));
};

$(document).ready(main);
