const Gtk = imports.gi.Gtk;

function ImageViewer() {
  this._init();
}
ImageViewer.prototype = {
  _init: function() {
    this.window = new Gtk.Window({title: 'Image Viewer Window'});
    this.window.show();
  }
};

Gtk.init(null, null);

let i = new ImageViewer();

Gtk.main();
