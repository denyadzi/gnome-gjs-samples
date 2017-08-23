const Template = imports.gi.Template;
const Gio = imports.gi.Gio;

let file = Gio.File.new_for_path("base.html");
let tmpl = new Template.Template();
tmpl.parse_file(file, null);

let scope = new Template.Scope();
let title = scope.get('title');

title.assign_string('Прыходзьма да нас');

let stream = Gio.UnixOutputStream.new(0, false);
let expanded = tmpl.expand_string(scope);

stream.write(expanded, null);
